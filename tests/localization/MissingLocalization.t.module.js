import { StringHelper } from '../../build/gantt.module.js?433978';

// Specify an array of paths which should be ignored for a locale
const ignoreList = {
    Common : [
        'DateHelper.unitNames',
        'DateHelper.unitAbbreviations',
        'DateHelper.parsers',
        'PresetManager',
        'TaskEditor.editorWidth',
        'TaskEdit',
        'TaskEditor.editorWidth',
        'GeneralTab.labelWidth',
        'AdvancedTab.labelWidth',
        'TaskEditor.editorWidth',
        'DateField.datePickerFormat',
        'TimeField.timePickerFormat',
        'TimeField.timePicker24Hour'
    ],
    Ru   : [],
    Nl   : [],
    SvSE : [
        'DateHelper.shortQuarter',
        'DateHelper.ordinalSuffix',
        'SchedulingModePicker.Normal'
    ],
    De : [
        'Column', // used in the "localization" demo
        'Shared', // used in the "localization" demo
        'Grid.moveColumnLeft',
        'Grid.moveColumnRight',
        'Tree.noTreeColumn',
        'ResourceInfoColumn',
        'DateHelper.shortWeek',
        'DateHelper.shortQuarter',
        'SchedulingModePicker.Normal',
        'EventModeColumn.Auto'
    ]
};

// Specify an array of phrases which are the same to En locale and do not require translation
const universalTranslationList = {
    Ru : [
        'ID',
        '%'
    ],
    Nl : [
        'Filter',
        'Week',
        'Start',
        'WBS',
        'Resource',
        'Resources',
        'Type',
        'Mode',
        'Auto',
        'ID',
        '%'
    ],
    SvSE : [
        'Filter',
        'Week',
        'Start',
        'SS',
        'Start-to-Start',
        'General',
        'Information',
        'ID',
        '%'
    ],
    De : [
        'Name',
        'Filter',
        'Start',
        'Resource',
        'ID',
        '%',
        'WBS'
    ]
};

// **IMPORTANT** The test is copied from the common/grid
// If you feel like to change something in it, please go to Grid and change it there, then copy it here
StartTest('All locales should have corresponding to English locale translations', t => {

    // returns regexp like /Class1\.name1|Class1\.name2|Class2\.name1|Class2\.name2/ or null
    const getIgnoreRe = name => {
        const escaped = (ignoreList[name] || []).concat(ignoreList.Common || []).map(item => StringHelper.escapeRegExp(item));
        return (escaped.length > 0) && new RegExp(escaped.join('|')) || null;
    };

    // returns regexp like /^(phrase1|phrase2)$/i or null
    function getUniversalTranslationRe(name) {
        const escaped = universalTranslationList[name] &&
            universalTranslationList[name].map(item => StringHelper.escapeRegExp(item));
        return escaped && new RegExp('^(' + escaped.join('|') + ')$', 'i') || null;
    }

    function assertMissingTranslations(t, original, asserted, ignoreRe, universalRe, msg, path = '') {
        let errors = 0;

        for (let localeKey in original) {
            if (!original.hasOwnProperty(localeKey)) continue;

            const currentPath = path ? `${path}.${localeKey}` : localeKey;
            // if path should not be ignored
            if (!ignoreRe || !currentPath.match(ignoreRe)) {
                // localization is found
                if (localeKey in asserted && typeof asserted[localeKey] === typeof original[localeKey]) {
                    // If value type is an object go inside
                    if (typeof original[localeKey] === 'object') {
                        errors += assertMissingTranslations(t, original[localeKey], asserted[localeKey], ignoreRe, universalRe, msg, currentPath);
                    }
                    // values are the same then probably it's a copy-paste from asserted locale
                    else if (original[localeKey] === asserted[localeKey] && (!universalRe || (typeof asserted[localeKey] === 'string' && !asserted[localeKey].match(universalRe)))) {
                        t.fail(`${currentPath} ${msg}`);
                        errors++;
                    }
                }
                // localization not found
                else {
                    t.fail(`${currentPath} is not localized.`);
                    errors++;
                }
            }
        }

        return errors;
    }

    function assertRedundantTranslations(t, master, asserted, ignoreRe, msg, path = '') {
        let errors = 0;

        for (let localeKey in asserted) {
            if (!asserted.hasOwnProperty(localeKey)) continue;

            const currentPath = path ? `${path}.${localeKey}` : localeKey;

            if (!ignoreRe || !currentPath.match(ignoreRe)) {
                // if not found in master
                if (!(localeKey in master) || (typeof master[localeKey] !== typeof asserted[localeKey])) {
                    t.fail(`${currentPath} ${msg}.`);
                    errors++;
                }
                else if (typeof asserted[localeKey] === 'object') {
                    errors += assertRedundantTranslations(t, master[localeKey], asserted[localeKey], ignoreRe, msg, currentPath);
                }
            }
        }

        return errors;
    }

    // Locales to assert are set in "index.js?433978" file in Localization test group in "alsoPreloads"
    const
        locales = window.bryntum.locales,
        original = locales.En;
    // skip En locale during iterations
    delete locales.En;
    for (const name of Object.keys(locales)) {
        const asserted = locales[name];

        t.it(`Check ${asserted.localeDesc} (${name}) locale`, t => {

            t.ok(asserted.localeName, 'Asserted locale name is specified');
            t.ok(asserted.localeDesc, 'Asserted locale description is specified');

            const
                ignoreRe               = getIgnoreRe(asserted.localeName),
                universalTranslationRe = getUniversalTranslationRe(asserted.localeName);

            let errors = assertMissingTranslations(t, original, asserted, ignoreRe, universalTranslationRe, `in ${asserted.localeName} locale matches ${original.localeName} locale.`);

            errors += assertRedundantTranslations(t, original, asserted, ignoreRe, `in ${asserted.localeName} locale looks redundant.`);

            if (!errors) t.pass(`${asserted.localeName} locale has no errors`);
        });
    }
});
