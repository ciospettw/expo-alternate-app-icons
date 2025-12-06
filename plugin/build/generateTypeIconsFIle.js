"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTypeIconsFile = generateTypeIconsFile;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
/**
 * Generates a TypeScript file containing the `AlternateAppIcons` type.
 * @param iconNames Array of icon names to include in the type definition.
 */
function generateTypeIconsFile(iconNames) {
    // Path to the file to be generated
    const typeFilePath = path_1.default.resolve(__dirname, '../../src', 'AlternateAppIconsType.ts');
    // Content of the TypeScript file
    const typeFileContent = `
/**
 * Auto-generated file. Do not edit manually.
 */
export type AlternateAppIcons = ${iconNames.map((name) => `'${name}'`).join(' | ')};
`;
    // Ensure the directory exists
    fs_1.default.mkdirSync(path_1.default.dirname(typeFilePath), { recursive: true });
    // Write the file with the generated content
    fs_1.default.writeFileSync(typeFilePath, typeFileContent.trim());
}
