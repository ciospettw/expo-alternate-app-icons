"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = withAlternateAppIcons;
const withAlternateAppIconsGenerator_1 = require("./withAlternateAppIconsGenerator");
const withAndroidManifestUpdate_1 = require("./withAndroidManifestUpdate");
const withXcodeProjectUpdate_1 = require("./withXcodeProjectUpdate");
const withAdaptiveIconsGenerator_1 = require("./withAdaptiveIconsGenerator");
const path_1 = require("path");
const generateTypeIconsFIle_1 = require("./generateTypeIconsFIle");
const isPathArray = (alternateIcons) => alternateIcons.some((icon) => typeof icon === 'string');
function withAlternateAppIcons(config, props = []) {
    if (!props.length) {
        return config;
    }
    let alternateIcons;
    if (isPathArray(props)) {
        alternateIcons = props.map(mapToAlternateIcon);
    }
    else {
        alternateIcons = props;
    }
    const iconNames = alternateIcons.map((icon) => icon.name);
    (0, generateTypeIconsFIle_1.generateTypeIconsFile)(iconNames);
    config = (0, withAlternateAppIconsGenerator_1.withAlternateAppIconsGenerator)(config, alternateIcons);
    config = (0, withXcodeProjectUpdate_1.withXcodeProjectUpdate)(config, iconNames);
    config = (0, withAdaptiveIconsGenerator_1.withAdaptiveIconsGenerator)(config, alternateIcons);
    config = (0, withAndroidManifestUpdate_1.withAndroidManifestUpdate)(config, iconNames);
    return config;
}
function mapToAlternateIcon(path) {
    const { name } = (0, path_1.parse)(path);
    return {
        name,
        ios: path,
        android: {
            foregroundImage: path,
        },
    };
}
