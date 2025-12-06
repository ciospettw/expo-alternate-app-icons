"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUniversalIcon = generateUniversalIcon;
exports.generateUniversalVariantsIcon = generateUniversalVariantsIcon;
const config_plugins_1 = require("expo/config-plugins");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const writeContentsJson_1 = require("./writeContentsJson");
const jimp_1 = require("@expo/image-utils/build/jimp");
async function generateUniversalIcon(name, projectRoot, src, options) {
    const iosProjectPath = (0, path_1.join)(projectRoot, 'ios', config_plugins_1.IOSConfig.XcodeUtils.getProjectName(projectRoot));
    const { base: filename } = (0, path_1.parse)(src);
    const appIconSetPath = (0, path_1.join)(iosProjectPath, `Images.xcassets/${name}.appiconset`);
    const appIconPath = (0, path_1.join)(appIconSetPath, filename);
    const iconPath = (0, path_1.join)(projectRoot, src);
    const source = await (0, jimp_1.jimpAsync)({
        input: iconPath,
        originalInput: iconPath,
    }, [
        {
            operation: 'resize',
            fit: 'cover',
            width: options.width,
            height: options.height,
        },
    ]);
    try {
        await (0, promises_1.mkdir)(appIconSetPath, { recursive: true });
        await (0, promises_1.writeFile)(appIconPath, source);
        await (0, writeContentsJson_1.writeContentsJson)(filename, appIconSetPath, options.width, options.height);
    }
    catch (error) {
        console.log(error);
    }
}
async function generateUniversalVariantsIcon(name, projectRoot, sources, options) {
    const iosProjectPath = (0, path_1.join)(projectRoot, 'ios', config_plugins_1.IOSConfig.XcodeUtils.getProjectName(projectRoot));
    const appIconSetPath = (0, path_1.join)(iosProjectPath, `Images.xcassets/${name}.appiconset`);
    const filenames = {};
    for (const key in sources) {
        const variant = key;
        let { base: filename } = (0, path_1.parse)(sources[variant]);
        filename = filename.replace('.', `-${variant}.`);
        filenames[variant] = filename;
        const appIconPath = (0, path_1.join)(appIconSetPath, filename);
        const iconPath = (0, path_1.join)(projectRoot, sources[variant]);
        const source = await (0, jimp_1.jimpAsync)({
            input: iconPath,
            originalInput: iconPath,
        }, [
            {
                operation: 'resize',
                fit: 'cover',
                width: options.width,
                height: options.height,
            },
        ]);
        try {
            await (0, promises_1.mkdir)(appIconSetPath, { recursive: true });
            await (0, promises_1.writeFile)(appIconPath, source);
        }
        catch (error) {
            console.log(error);
        }
    }
    try {
        await (0, writeContentsJson_1.writeVariantsContentsJson)(filenames, appIconSetPath, options.width, options.height);
    }
    catch (error) {
        console.log(error);
    }
}
