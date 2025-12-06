"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withAndroidManifestUpdate = withAndroidManifestUpdate;
const config_plugins_1 = require("@expo/config-plugins");
const StringUtils_1 = require("./StringUtils");
const { getMainApplicationOrThrow } = config_plugins_1.AndroidConfig.Manifest;
const { default: renderIntentFilters, getIntentFilters } = config_plugins_1.AndroidConfig.IntentFilters;
function withAndroidManifestUpdate(config, alternateIconNames) {
    const intentFilters = getIntentFilters(config);
    config = (0, config_plugins_1.withAndroidManifest)(config, (config) => {
        const mainApplication = getMainApplicationOrThrow(config.modResults);
        for (const name of alternateIconNames) {
            addActivityAliasToMainApplication(mainApplication, name, intentFilters);
        }
        return config;
    });
    return config;
}
function addActivityAliasToMainApplication(mainApplication, iconName, intentFilters) {
    const activityAlias = {
        $: {
            'android:name': `.MainActivity${(0, StringUtils_1.toPascalCase)(iconName)}`,
            'android:enabled': 'false',
            'android:exported': 'true',
            'android:icon': `@mipmap/ic_launcher_${(0, StringUtils_1.toSnakeCase)(iconName)}`,
            'android:targetActivity': '.MainActivity',
        },
        'intent-filter': [
            {
                action: [{ $: { 'android:name': 'android.intent.action.MAIN' } }],
                category: [{ $: { 'android:name': 'android.intent.category.LAUNCHER' } }],
            },
            ...renderIntentFilters(intentFilters ?? []),
        ],
    };
    if (mainApplication['activity-alias']) {
        const currentIndex = mainApplication['activity-alias'].findIndex((e) => e.$['android:name'] === activityAlias.$['android:name']);
        if (currentIndex >= 0) {
            mainApplication['activity-alias'][currentIndex] = activityAlias;
        }
        else {
            mainApplication['activity-alias'].push(activityAlias);
        }
    }
    else {
        mainApplication['activity-alias'] = [activityAlias];
    }
    return mainApplication;
}
