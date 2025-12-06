"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isIosVariantsIcon = void 0;
const isIosVariantsIcon = (iconPath) => typeof iconPath === 'object' &&
    iconPath != null &&
    'dark' in iconPath &&
    'light' in iconPath &&
    'tinted' in iconPath &&
    typeof iconPath.dark === 'string' &&
    typeof iconPath.light === 'string' &&
    typeof iconPath.tinted === 'string';
exports.isIosVariantsIcon = isIosVariantsIcon;
