import ExpoModulesCore

public class ExpoAlternateAppIconsModule: Module {
    private var supportsAlternateIcons = UIApplication.shared.supportsAlternateIcons;

    public func definition() -> ModuleDefinition {
        Name("ExpoAlternateAppIcons")

        Constants({
          return [
            "supportsAlternateIcons": self.supportsAlternateIcons
          ]
        })

        AsyncFunction("setAlternateAppIcon", setAlternateAppIcon)
        Function("getAppIconName", getAppIconName)
    }

    private func getAppIconName() -> String? {
        return UIApplication.shared.alternateIconName;
    }

    private func setAlternateAppIcon(icon: String?, promise: Promise) -> Void {
        Task { @MainActor in
            do {
                self.setAppIconWithoutAlert(icon)   // ✅ tolto "try"
                promise.resolve(icon);
            } catch {
                promise.reject(error);
            }
        }
    }

    private func setAppIconWithoutAlert(_ iconName: String?) {
    if UIApplication.shared.responds(to: #selector(getter: UIApplication.supportsAlternateIcons)) && UIApplication.shared.supportsAlternateIcons {
      typealias setAlternateIconName = @convention(c) (NSObject, Selector, NSString?, @escaping (NSError) -> ()) -> ()
      
      let selectorString = "_setAlternateIconName:completionHandler:"
      
      let selector = NSSelectorFromString(selectorString)
      let imp = UIApplication.shared.method(for: selector)
      let method = unsafeBitCast(imp, to: setAlternateIconName.self)
      method(UIApplication.shared, selector, iconName as NSString?, { _ in })
    }
  }
}
