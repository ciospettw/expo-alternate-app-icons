import ExpoModulesCore
import UIKit

public class ExpoAlternateAppIconsModule: Module {
    private var supportsAlternateIcons = UIApplication.shared.supportsAlternateIcons

    public func definition() -> ModuleDefinition {
        Name("ExpoAlternateAppIcons")

        Constants({
            return [
                "supportsAlternateIcons": self.supportsAlternateIcons
            ]
        })

        // Espongo solo questa
        AsyncFunction("setAppIconWithoutAlert") { (icon: String?, promise: Promise) in
            self.setAppIconWithoutAlert(icon)
            promise.resolve(icon)
        }

        Function("getAppIconName", getAppIconName)
    }

    private func getAppIconName() -> String? {
        return UIApplication.shared.alternateIconName
    }

    // Unica implementazione usata
    private func setAppIconWithoutAlert(_ iconName: String?) {
        if UIApplication.shared.responds(to: #selector(getter: UIApplication.supportsAlternateIcons)) &&
           UIApplication.shared.supportsAlternateIcons {
            typealias SetAlternateIconName = @convention(c) (NSObject, Selector, NSString?, @escaping (NSError) -> ()) -> ()

            let selectorString = "_setAlternateIconName:completionHandler:"
            let selector = NSSelectorFromString(selectorString)
            let imp = UIApplication.shared.method(for: selector)
            let method = unsafeBitCast(imp, to: SetAlternateIconName.self)
            method(UIApplication.shared, selector, iconName as NSString?, { _ in })
        }
    }
}
