"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withAdaptiveIconsGenerator = withAdaptiveIconsGenerator;
const config_plugins_1 = require("@expo/config-plugins");
const generateAdaptiveIcon_1 = require("./generateAdaptiveIcon");
const StringUtils_1 = require("./StringUtils");
const { Colors } = config_plugins_1.AndroidConfig;
function withAdaptiveIconsGenerator(config, alternateIcons) {
    for (const alternateIcon of alternateIcons) {
        withAndroidAdaptiveIconColors(config, alternateIcon);
    }
    return (0, config_plugins_1.withDangerousMod)(config, [
        'android',
        async (config) => {
            for (const alternateIcon of alternateIcons) {
                const { android: adaptiveIcon, name } = alternateIcon;
                if (!adaptiveIcon)
                    break;
                const { foregroundImage, backgroundColor } = adaptiveIcon;
                if (!foregroundImage)
                    break;
                const projectRoot = config.modRequest.projectRoot;
                await (0, generateAdaptiveIcon_1.generateAdaptiveIcon)(name, projectRoot, adaptiveIcon);
            }
            return config;
        },
    ]);
}
const withAndroidAdaptiveIconColors = (config, alternateIcon) => {
    return (0, config_plugins_1.withAndroidColors)(config, (config) => {
        config.modResults = Colors.assignColorValue(config.modResults, {
            value: alternateIcon.android?.backgroundColor ?? '#FFFFFF',
            name: `iconBackground${(0, StringUtils_1.toPascalCase)(alternateIcon.name)}`,
        });
        return config;
    });
};
