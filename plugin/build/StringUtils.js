"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toSnakeCase = exports.toPascalCase = void 0;
const toPascalCase = (text) => text
    .replace(/[\s\-_]+/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/\w+/g, (word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .replace(/\s+/g, '');
exports.toPascalCase = toPascalCase;
const toSnakeCase = (text) => text
    .replace(/([A-Z])/g, '_$1')
    .replace(/[\s\-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase();
exports.toSnakeCase = toSnakeCase;
