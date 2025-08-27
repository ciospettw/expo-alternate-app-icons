import ExpoModulesCore
import UIKit

public class ExpoAlternateAppIconsModule: Module {
  private var supportsAlternateIcons: Bool {
    return UIApplication.shared.supportsAlternateIcons
  }

  public func definition() -> ModuleDefinition {
    Name("ExpoAlternateAppIcons")

    Constants({
      return [
        "supportsAlternateIcons": self.supportsAlternateIcons
      ]
    })

    AsyncFunction("setAlternateAppIconWithoutAlert") { (icon: String?, promise: Promise) in
      self.setAppIconWithoutAlert(icon, promise: promise)
    }

    Function("getAppIconName") { () -> String? in
      return UIApplication.shared.alternateIconName
    }
  }

  private func setAppIconWithoutAlert(_ iconName: String?, promise: Promise) {
    Task { @MainActor in
      guard UIApplication.shared.responds(to: #selector(getter: UIApplication.supportsAlternateIcons)),
            UIApplication.shared.supportsAlternateIcons else {
        promise.reject(Exceptions.MissingCapability("Alternate icons are not supported on this device."))
        return
      }

      typealias SetAlternateIconName = @convention(c) (NSObject, Selector, NSString?, @escaping (NSError?) -> Void) -> Void
      let selectorString = "_setAlternateIconName:completionHandler:"
      let selector = NSSelectorFromString(selectorString)

      if let method = UIApplication.shared.method(for: selector) {
        let impl = unsafeBitCast(method, to: SetAlternateIconName.self)
        impl(UIApplication.shared, selector, iconName as NSString?) { error in
          if let error = error {
            promise.reject(error)
          } else {
            promise.resolve(iconName)
          }
        }
      } else {
        promise.reject(Exceptions.MissingCapability("Unable to find private selector \(selectorString)"))
      }
    }
  }
}
