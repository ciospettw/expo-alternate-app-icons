import { iOSVariantsIcon } from './types';
export declare function generateUniversalIcon(name: string, projectRoot: string, src: string, options: {
    width: number;
    height: number;
}): Promise<void>;
export declare function generateUniversalVariantsIcon(name: string, projectRoot: string, sources: iOSVariantsIcon, options: {
    width: number;
    height: number;
}): Promise<void>;
