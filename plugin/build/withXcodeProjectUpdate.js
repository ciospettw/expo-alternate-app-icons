"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withXcodeProjectUpdate = withXcodeProjectUpdate;
const config_plugins_1 = require("expo/config-plugins");
const ALTERNATE_APP_ICONS_NAMES_PROPERTY = 'ASSETCATALOG_COMPILER_ALTERNATE_APPICON_NAMES';
function withXcodeProjectUpdate(config, alternateAppIconNames) {
    config = (0, config_plugins_1.withXcodeProject)(config, (config) => {
        config.modResults.updateBuildProperty(ALTERNATE_APP_ICONS_NAMES_PROPERTY, alternateAppIconNames);
        return config;
    });
    return config;
}
