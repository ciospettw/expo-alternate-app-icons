import { AlternateIcon } from './types';
type DPIString = 'mdpi' | 'hdpi' | 'xhdpi' | 'xxhdpi' | 'xxxhdpi';
type dpiMap = Record<DPIString, {
    folderName: string;
    scale: number;
}>;
export declare const ANDROID_RES_PATH = "android/app/src/main/res/";
export declare const dpiValues: dpiMap;
export declare function generateAdaptiveIcon(name: string, projectRoot: string, adaptiveIcon: Exclude<AlternateIcon['android'], undefined>): Promise<void>;
export declare const createAdaptiveIconXmlString: (name: string, backgroundImage?: string, monochromeImage?: string) => string;
export {};
