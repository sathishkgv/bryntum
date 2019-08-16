import { * as BryntumClasses } from '../../build/gantt.module.js?433978';

// NOTE:
// 1. This test is required to be run against "module" bundle only!
// 2. Fixing imports is ignored in scripts/fix_tests.js

const
    {
        StringHelper
    }  = BryntumClasses,
    En = window.bryntum.locales.En;

// Specify an array of class names which should be ignored for a search in the code base
const ignoreClassList = {
    En : [
        'localeName',
        'localeDesc',
        'PresetManager',
        'ExcelExporter',
        'GanttCommon'
    ]
};

// Specify an array of localization keys which should be ignored for a search in the code text
const ignoreLocalizationList = {
    En : {
        DateHelper : [
            // used from localization directly
            'shortWeek',
            'shortQuarter',
            'week'
        ],
        Tree : [
            'noTreeColumn' // only exists in development mode
        ],
        Field : [
            'minimumValueViolation', // used as variable this.L(error)
            'maximumValueViolation', // used as variable this.L(error)
            'fieldRequired',         // used as variable this.L(error)
            'validateFilter'
        ],
        DateField : [
            'invalidDate' // used as variable this.L(error)
        ],
        DependencyEdit : [
            'StartToStart',
            'StartToEnd',
            'EndToStart',
            'EndToEnd'
        ],
        TimeField : [
            'invalidTime' // used as variable this.L(error)
        ],
        Gantt : [
            'Edit event',
            'Add',
            'New Task',
            'Task above',
            'Task below',
            'Delete task',
            'Milestone',
            'Sub-task',
            'Successor',
            'Predecessor'
        ],
        Scheduler : [
            'Add event',
            'Delete event',
            'Unassign event'
        ]
    }
};

// **IMPORTANT** The test is copied from the common/grid
// If you feel like to change something in it, please go to Grid and change it there, then copy it here
StartTest('All translations should be used in the code base', t => {
    const isClassIgnored = (name, className) =>
        ignoreClassList &&
        ignoreClassList[name] &&
        ignoreClassList[name].indexOf(className) !== -1;

    const isLocalizationInClassIgnored = (name, className, localeKey) =>
        ignoreLocalizationList &&
        ignoreLocalizationList[name] &&
        ignoreLocalizationList[name][className] &&
        ignoreLocalizationList[name][className].indexOf(localeKey) !== -1;

    const isUsed = (key, classFn) => {
        let text          = typeof classFn === 'function' && classFn.toString() || '',
            escapedKey    = StringHelper.escapeRegExp(key),
            fnCallPattern = `\\.L\\([^)]*?["']${escapedKey}["']`, // .L('key'
            stringPattern = `["']L\\{${escapedKey}\\}["']`, // 'L{key}'
            patterns      = [fnCallPattern, stringPattern],
            localizableProperties;

        // Column instances localize 'text' config by default
        if (BryntumClasses.Column.isPrototypeOf(classFn)) {
            patterns.push(`text\\s+?:\\s+?['"]${escapedKey}['"]`);
        }

        if ((localizableProperties = (classFn.defaultConfig || {}).localizableProperties)) {
            localizableProperties.forEach(prop => {
                patterns.push(`${prop}\\s+?:\\s+?['"]${escapedKey}['"]`);
            });
        }

        let re = new RegExp(patterns.join('|'), 'g');

        return re.test(text);
    };

    // To look through mixins
    // TODO it would be nice to have a flag which indicates whether class is a mixin
    // because if translation is found in parent class it has to be moved to parent locale key in locale file
    const isUsedInPrototypeChain = (key, classFn) => {
        while (classFn) {
            if (isUsed(key, classFn)) {
                return classFn.$name || classFn.name || true;
            }

            classFn = Object.getPrototypeOf(classFn);
        }

        return false;
    };

    const assertLocale = (t, locale) => {
        const name = locale.localeName,
            desc = locale.localeDesc;

        t.ok(name, 'Locale name is specified');
        t.ok(desc, 'Locale description is specified');

        let errors = 0;

        for (let className in locale) {
            if (!locale.hasOwnProperty(className)) continue;

            if (className in BryntumClasses && typeof BryntumClasses[className] === 'function') {
                // t.pass(`${className} is found in the code base`);

                for (let localeKey in locale[className]) {
                    if (!locale[className].hasOwnProperty(localeKey)) continue;

                    const foundInClass = isUsedInPrototypeChain(localeKey, BryntumClasses[className]);

                    if (foundInClass) {
                        // t.pass(`"${localeKey}" is used in ${foundInClass} class`);
                    }
                    else if (!isClassIgnored(name, className) && !isLocalizationInClassIgnored(name, className, localeKey)) {
                        t.fail(`"${localeKey}" is not used in ${className} class.
                        If it's specified intentionally please add the locale key as an exception to ignoreLocalizationList.`);
                        errors++;
                    }
                    else {
                        // t.pass(`"${localeKey}" usage in ${className} class is ignored`);
                    }
                }
            }
            else if (!isClassIgnored(name, className)) {
                t.fail(`${className} is not found in the code base.
                If it's specified intentionally please add the class name as an exception to ignoreClassList.`);
                errors++;
            }
            else {
                // t.pass(`${className} is ignored`);
            }
        }

        if (errors) {
            t.fail(`${errors} error(s) found in ${desc} locale`);
        }
        else {
            t.pass(`${desc} locale has no unused translations`);
        }
    };

    t.it('Check English locale has no unused translations', t => assertLocale(t, En));
});
