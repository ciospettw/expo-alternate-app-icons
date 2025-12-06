"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withAlternateAppIconsGenerator = withAlternateAppIconsGenerator;
const config_plugins_1 = require("expo/config-plugins");
const generateUniversalIcon_1 = require("./generateUniversalIcon");
const types_1 = require("./types");
function withAlternateAppIconsGenerator(config, alternateIcons) {
    return (0, config_plugins_1.withDangerousMod)(config, [
        'ios',
        async (config) => {
            for await (const alternateIcon of alternateIcons) {
                const { ios: iconPath, name } = alternateIcon;
                if (!iconPath)
                    break;
                const projectRoot = config.modRequest.projectRoot;
                if (typeof iconPath === 'string') {
                    await (0, generateUniversalIcon_1.generateUniversalIcon)(name, projectRoot, iconPath, {
                        width: 1024,
                        height: 1024,
                    });
                }
                else if ((0, types_1.isIosVariantsIcon)(iconPath)) {
                    await (0, generateUniversalIcon_1.generateUniversalVariantsIcon)(name, projectRoot, iconPath, {
                        width: 1024,
                        height: 1024,
                    });
                }
                else {
                    throw new Error(`Invalid alternate icon configuration for "${alternateIcon.name}". Ensure the iconPath is either a string for a single icon or an object containing "dark", "light", and "tinted" variants.`);
                }
            }
            return config;
        },
    ]);
}
