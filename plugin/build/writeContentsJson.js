"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeContentsJson = writeContentsJson;
exports.writeVariantsContentsJson = writeVariantsContentsJson;
const promises_1 = require("fs/promises");
const path_1 = require("path");
async function writeContentsJson(filename, assetPath, width, height) {
    const path = (0, path_1.join)(assetPath, 'Contents.json');
    const payload = JSON.stringify({
        images: [
            {
                filename,
                idiom: 'universal',
                platform: 'ios',
                size: `${width}x${height}`,
            },
        ],
        info: {
            author: 'expo',
            version: 1,
        },
    }, null, 2);
    await (0, promises_1.writeFile)(path, payload, 'utf-8');
}
async function writeVariantsContentsJson(filenames, assetPath, width, height) {
    const path = (0, path_1.join)(assetPath, 'Contents.json');
    const payload = JSON.stringify({
        images: Object.entries(filenames).map(([type, name]) => ({
            filename: name,
            idiom: 'universal',
            platform: 'ios',
            size: `${width}x${height}`,
            appearances: type !== 'light'
                ? [
                    {
                        appearance: 'luminosity',
                        value: type,
                    },
                ]
                : undefined,
        })),
        info: {
            author: 'expo',
            version: 1,
        },
    }, null, 2);
    await (0, promises_1.writeFile)(path, payload, 'utf-8');
}
