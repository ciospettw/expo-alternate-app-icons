import { type AlternateAppIcons } from './AlternateAppIconsType';
export { type AlternateAppIcons } from './AlternateAppIconsType';
/**
 * A boolean value indicating whether the current device supports alternate app icons.
 *
 * @type {boolean}
 *
 * @example
 * // Check if the device supports alternate app icons.
 * if (supportsAlternateIcons) {
 *   console.log('Alternate app icons are supported on this device.');
 * } else {
 *   console.log('Alternate app icons are not supported on this device.');
 * }
 */
export declare const supportsAlternateIcons: boolean;
/**
 * Sets the alternate app icon for the application.
 *
 * @param {string | null} name - The name of the alternate app icon to set. Pass `null` to reset to the default icon.
 * @returns {Promise<string | null>} A Promise that resolves to a icon name.
 * @throws {Error} Throws an error if there is an issue with setting the alternate app icon.
 *
 * @example
 * // Set an alternate app icon named 'icon2'.
 * const result = await setAlternateAppIcon('icon2');
 *
 * // Reset to the default app icon.
 * const resetResult = await setAlternateAppIcon(null);
 */
export declare function setAlternateAppIcon(name: AlternateAppIcons | null): Promise<string | null>;
/**
 * Retrieves the name of the currently active app icon.
 *
 * @returns {string | null} The name of the currently active app icon.
 *
 * @example
 * // Get the name of the currently active app icon.
 * const iconName = getAppIconName();
 * console.log(`The active app icon is: ${iconName}`);
 */
export declare function getAppIconName(): AlternateAppIcons | null;
/**
 * Resets the app icon to the default one.
 *
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if there is an issue with setting the alternate app icon.
 */
export declare function resetAppIcon(): Promise<void>;
//# sourceMappingURL=index.d.ts.map