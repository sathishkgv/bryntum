"use strict";

// NOTE:
// 1. This test is required to be run against "module" bundle only!
// 2. Fixing imports is ignored in scripts/fix_tests.js
var _BryntumClasses = BryntumClasses,
    StringHelper = _BryntumClasses.StringHelper,
    En = window.bryntum.locales.En; // Specify an array of class names which should be ignored for a search in the code base

var ignoreClassList = {
  En: ['localeName', 'localeDesc', 'PresetManager', 'ExcelExporter', 'GanttCommon']
}; // Specify an array of localization keys which should be ignored for a search in the code text

var ignoreLocalizationList = {
  En: {
    DateHelper: [// used from localization directly
    'shortWeek', 'shortQuarter', 'week'],
    Tree: ['noTreeColumn' // only exists in development mode
    ],
    Field: ['minimumValueViolation', // used as variable this.L(error)
    'maximumValueViolation', // used as variable this.L(error)
    'fieldRequired', // used as variable this.L(error)
    'validateFilter'],
    DateField: ['invalidDate' // used as variable this.L(error)
    ],
    DependencyEdit: ['StartToStart', 'StartToEnd', 'EndToStart', 'EndToEnd'],
    TimeField: ['invalidTime' // used as variable this.L(error)
    ],
    Gantt: ['Edit event', 'Add', 'New Task', 'Task above', 'Task below', 'Delete task', 'Milestone', 'Sub-task', 'Successor', 'Predecessor'],
    Scheduler: ['Add event', 'Delete event', 'Unassign event']
  }
}; // **IMPORTANT** The test is copied from the common/grid
// If you feel like to change something in it, please go to Grid and change it there, then copy it here

StartTest('All translations should be used in the code base', function (t) {
  var isClassIgnored = function isClassIgnored(name, className) {
    return ignoreClassList && ignoreClassList[name] && ignoreClassList[name].indexOf(className) !== -1;
  };

  var isLocalizationInClassIgnored = function isLocalizationInClassIgnored(name, className, localeKey) {
    return ignoreLocalizationList && ignoreLocalizationList[name] && ignoreLocalizationList[name][className] && ignoreLocalizationList[name][className].indexOf(localeKey) !== -1;
  };

  var isUsed = function isUsed(key, classFn) {
    var text = typeof classFn === 'function' && classFn.toString() || '',
        escapedKey = StringHelper.escapeRegExp(key),
        fnCallPattern = "\\.L\\([^)]*?[\"']".concat(escapedKey, "[\"']"),
        // .L('key'
    stringPattern = "[\"']L\\{".concat(escapedKey, "\\}[\"']"),
        // 'L{key}'
    patterns = [fnCallPattern, stringPattern],
        localizableProperties; // Column instances localize 'text' config by default

    if (BryntumClasses.Column.isPrototypeOf(classFn)) {
      patterns.push("text\\s+?:\\s+?['\"]".concat(escapedKey, "['\"]"));
    }

    if (localizableProperties = (classFn.defaultConfig || {}).localizableProperties) {
      localizableProperties.forEach(function (prop) {
        patterns.push("".concat(prop, "\\s+?:\\s+?['\"]").concat(escapedKey, "['\"]"));
      });
    }

    var re = new RegExp(patterns.join('|'), 'g');
    return re.test(text);
  }; // To look through mixins
  // TODO it would be nice to have a flag which indicates whether class is a mixin
  // because if translation is found in parent class it has to be moved to parent locale key in locale file


  var isUsedInPrototypeChain = function isUsedInPrototypeChain(key, classFn) {
    while (classFn) {
      if (isUsed(key, classFn)) {
        return classFn.$name || classFn.name || true;
      }

      classFn = Object.getPrototypeOf(classFn);
    }

    return false;
  };

  var assertLocale = function assertLocale(t, locale) {
    var name = locale.localeName,
        desc = locale.localeDesc;
    t.ok(name, 'Locale name is specified');
    t.ok(desc, 'Locale description is specified');
    var errors = 0;

    for (var className in locale) {
      if (!locale.hasOwnProperty(className)) continue;

      if (className in BryntumClasses && typeof BryntumClasses[className] === 'function') {
        // t.pass(`${className} is found in the code base`);
        for (var localeKey in locale[className]) {
          if (!locale[className].hasOwnProperty(localeKey)) continue;
          var foundInClass = isUsedInPrototypeChain(localeKey, BryntumClasses[className]);

          if (foundInClass) {// t.pass(`"${localeKey}" is used in ${foundInClass} class`);
          } else if (!isClassIgnored(name, className) && !isLocalizationInClassIgnored(name, className, localeKey)) {
            t.fail("\"".concat(localeKey, "\" is not used in ").concat(className, " class.\n                        If it's specified intentionally please add the locale key as an exception to ignoreLocalizationList."));
            errors++;
          } else {// t.pass(`"${localeKey}" usage in ${className} class is ignored`);
          }
        }
      } else if (!isClassIgnored(name, className)) {
        t.fail("".concat(className, " is not found in the code base.\n                If it's specified intentionally please add the class name as an exception to ignoreClassList."));
        errors++;
      } else {// t.pass(`${className} is ignored`);
      }
    }

    if (errors) {
      t.fail("".concat(errors, " error(s) found in ").concat(desc, " locale"));
    } else {
      t.pass("".concat(desc, " locale has no unused translations"));
    }
  };

  t.it('Check English locale has no unused translations', function (t) {
    return assertLocale(t, En);
  });
});