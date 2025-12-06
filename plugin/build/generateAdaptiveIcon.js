"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdaptiveIconXmlString = exports.dpiValues = exports.ANDROID_RES_PATH = void 0;
exports.generateAdaptiveIcon = generateAdaptiveIcon;
const image_utils_1 = require("@expo/image-utils");
const path_1 = __importDefault(require("path"));
const StringUtils_1 = require("./StringUtils");
const promises_1 = require("fs/promises");
const BASELINE_PIXEL_SIZE = 108;
exports.ANDROID_RES_PATH = 'android/app/src/main/res/';
const MIPMAP_ANYDPI_V26 = 'mipmap-anydpi-v26';
exports.dpiValues = {
    mdpi: { folderName: 'mipmap-mdpi', scale: 1 },
    hdpi: { folderName: 'mipmap-hdpi', scale: 1.5 },
    xhdpi: { folderName: 'mipmap-xhdpi', scale: 2 },
    xxhdpi: { folderName: 'mipmap-xxhdpi', scale: 3 },
    xxxhdpi: { folderName: 'mipmap-xxxhdpi', scale: 4 },
};
async function generateAdaptiveIcon(name, projectRoot, adaptiveIcon) {
    const { foregroundImage, backgroundImage, backgroundColor, monochromeImage } = adaptiveIcon;
    if (!foregroundImage)
        return;
    const snake_case_name = (0, StringUtils_1.toSnakeCase)(name);
    const isAdaptive = Boolean(backgroundImage || backgroundColor);
    // generate legacy icons
    await generateMultiLayerImageAsync(projectRoot, {
        icon: foregroundImage,
        backgroundImage,
        backgroundColor,
        outputImageFileName: `ic_launcher_${snake_case_name}.png`,
        imageCacheFolder: `android-standard-square-${snake_case_name}`,
        backgroundImageCacheFolder: `android-standard-square-background-${snake_case_name}`,
    });
    if (!isAdaptive) {
        return;
    }
    if (monochromeImage) {
        await generateMonochromeImageAsync(projectRoot, {
            icon: monochromeImage,
            imageCacheFolder: `android-adaptive-monochrome-${snake_case_name}`,
            outputImageFileName: `ic_launcher_monochrome_${snake_case_name}.png`,
        });
    }
    // generate adaptive icons
    await generateMultiLayerImageAsync(projectRoot, {
        backgroundColor: 'transparent',
        backgroundImage: backgroundImage,
        backgroundImageCacheFolder: `android-adaptive-background-${snake_case_name}`,
        outputImageFileName: `ic_launcher_foreground_${snake_case_name}.png`,
        icon: foregroundImage,
        imageCacheFolder: `android-adaptive-foreground-${snake_case_name}`,
        backgroundImageFileName: `ic_launcher_background_${snake_case_name}.png`,
    });
    // create ic_launcher.xml
    const icLauncherXmlString = (0, exports.createAdaptiveIconXmlString)(name, backgroundImage, monochromeImage);
    await createAdaptiveIconXmlFiles(name, projectRoot, icLauncherXmlString);
}
async function generateMultiLayerImageAsync(projectRoot, { icon, backgroundColor, backgroundImage, imageCacheFolder, backgroundImageCacheFolder, borderRadiusRatio, outputImageFileName, backgroundImageFileName, }) {
    await iterateDpiValues(projectRoot, async ({ dpiFolder, scale }) => {
        let iconLayer = await generateIconAsync(projectRoot, {
            cacheType: imageCacheFolder,
            src: icon,
            scale,
            // backgroundImage overrides backgroundColor
            backgroundColor: backgroundImage ? 'transparent' : (backgroundColor ?? 'transparent'),
            borderRadiusRatio,
        });
        if (backgroundImage) {
            const backgroundLayer = await generateIconAsync(projectRoot, {
                cacheType: backgroundImageCacheFolder,
                src: backgroundImage,
                scale,
                backgroundColor: 'transparent',
                borderRadiusRatio,
            });
            if (backgroundImageFileName) {
                await (0, promises_1.writeFile)(path_1.default.resolve(dpiFolder, backgroundImageFileName), backgroundLayer);
            }
            else {
                iconLayer = await (0, image_utils_1.compositeImagesAsync)({
                    foreground: iconLayer,
                    background: backgroundLayer,
                });
            }
        }
        else if (backgroundImageFileName) {
            // Remove any instances of ic_launcher_background.png that are there from previous icons
            await deleteIconNamedAsync(projectRoot, backgroundImageFileName);
        }
        await (0, promises_1.mkdir)(dpiFolder, { recursive: true });
        await (0, promises_1.writeFile)(path_1.default.resolve(dpiFolder, outputImageFileName), iconLayer);
    });
}
async function generateMonochromeImageAsync(projectRoot, { icon, imageCacheFolder, outputImageFileName, }) {
    await iterateDpiValues(projectRoot, async ({ dpiFolder, scale }) => {
        const monochromeIcon = await generateIconAsync(projectRoot, {
            cacheType: imageCacheFolder,
            src: icon,
            scale,
            backgroundColor: 'transparent',
        });
        await (0, promises_1.mkdir)(dpiFolder, { recursive: true });
        await (0, promises_1.writeFile)(path_1.default.resolve(dpiFolder, outputImageFileName), monochromeIcon);
    });
}
async function deleteIconNamedAsync(projectRoot, name) {
    return iterateDpiValues(projectRoot, ({ dpiFolder }) => {
        return (0, promises_1.rm)(path_1.default.resolve(dpiFolder, name), { force: true });
    });
}
function iterateDpiValues(projectRoot, callback) {
    return Promise.all(Object.values(exports.dpiValues).map((value) => callback({
        dpiFolder: path_1.default.resolve(projectRoot, exports.ANDROID_RES_PATH, value.folderName),
        ...value,
    })));
}
async function generateIconAsync(projectRoot, { cacheType, src, scale, backgroundColor, borderRadiusRatio, }) {
    const iconSizePx = BASELINE_PIXEL_SIZE * scale;
    return (await (0, image_utils_1.generateImageAsync)({ projectRoot, cacheType }, {
        src,
        width: iconSizePx,
        height: iconSizePx,
        resizeMode: 'cover',
        backgroundColor,
        borderRadius: borderRadiusRatio ? iconSizePx * borderRadiusRatio : undefined,
    })).source;
}
const createAdaptiveIconXmlString = (name, backgroundImage, monochromeImage) => {
    const snake_case_name = (0, StringUtils_1.toSnakeCase)(name);
    const PascalCaseName = (0, StringUtils_1.toPascalCase)(name);
    const background = backgroundImage
        ? `@mipmap/ic_launcher_background_${snake_case_name}`
        : `@color/iconBackground${PascalCaseName}`;
    const iconElements = [
        `<background android:drawable="${background}"/>`,
        `<foreground android:drawable="@mipmap/ic_launcher_foreground_${snake_case_name}"/>`,
    ];
    if (monochromeImage) {
        iconElements.push(`<monochrome android:drawable="@mipmap/ic_launcher_monochrome_${snake_case_name}"/>`);
    }
    return `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    ${iconElements.join('\n    ')}
</adaptive-icon>`;
};
exports.createAdaptiveIconXmlString = createAdaptiveIconXmlString;
async function createAdaptiveIconXmlFiles(name, projectRoot, icLauncherXmlString) {
    const anyDpiV26Directory = path_1.default.resolve(projectRoot, exports.ANDROID_RES_PATH, MIPMAP_ANYDPI_V26);
    await (0, promises_1.mkdir)(anyDpiV26Directory, { recursive: true });
    const launcherPath = path_1.default.resolve(anyDpiV26Directory, `ic_launcher_${(0, StringUtils_1.toSnakeCase)(name)}.xml`);
    await (0, promises_1.writeFile)(launcherPath, icLauncherXmlString);
}
