"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

// Specify an array of paths which should be ignored for a locale
var ignoreList = {
  Common: ['DateHelper.unitNames', 'DateHelper.unitAbbreviations', 'DateHelper.parsers', 'PresetManager', 'TaskEditor.editorWidth', 'TaskEdit', 'TaskEditor.editorWidth', 'GeneralTab.labelWidth', 'AdvancedTab.labelWidth', 'TaskEditor.editorWidth', 'DateField.datePickerFormat', 'TimeField.timePickerFormat', 'TimeField.timePicker24Hour'],
  Ru: [],
  Nl: [],
  SvSE: ['DateHelper.shortQuarter', 'DateHelper.ordinalSuffix', 'SchedulingModePicker.Normal'],
  De: ['Column', // used in the "localization" demo
  'Shared', // used in the "localization" demo
  'Grid.moveColumnLeft', 'Grid.moveColumnRight', 'Tree.noTreeColumn', 'ResourceInfoColumn', 'DateHelper.shortWeek', 'DateHelper.shortQuarter', 'SchedulingModePicker.Normal', 'EventModeColumn.Auto']
}; // Specify an array of phrases which are the same to En locale and do not require translation

var universalTranslationList = {
  Ru: ['ID', '%'],
  Nl: ['Filter', 'Week', 'Start', 'WBS', 'Resource', 'Resources', 'Type', 'Mode', 'Auto', 'ID', '%'],
  SvSE: ['Filter', 'Week', 'Start', 'SS', 'Start-to-Start', 'General', 'Information', 'ID', '%'],
  De: ['Name', 'Filter', 'Start', 'Resource', 'ID', '%', 'WBS']
}; // **IMPORTANT** The test is copied from the common/grid
// If you feel like to change something in it, please go to Grid and change it there, then copy it here

StartTest('All locales should have corresponding to English locale translations', function (t) {
  // returns regexp like /Class1\.name1|Class1\.name2|Class2\.name1|Class2\.name2/ or null
  var getIgnoreRe = function getIgnoreRe(name) {
    var escaped = (ignoreList[name] || []).concat(ignoreList.Common || []).map(function (item) {
      return StringHelper.escapeRegExp(item);
    });
    return escaped.length > 0 && new RegExp(escaped.join('|')) || null;
  }; // returns regexp like /^(phrase1|phrase2)$/i or null


  function getUniversalTranslationRe(name) {
    var escaped = universalTranslationList[name] && universalTranslationList[name].map(function (item) {
      return StringHelper.escapeRegExp(item);
    });
    return escaped && new RegExp('^(' + escaped.join('|') + ')$', 'i') || null;
  }

  function assertMissingTranslations(t, original, asserted, ignoreRe, universalRe, msg) {
    var path = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : '';
    var errors = 0;

    for (var localeKey in original) {
      if (!original.hasOwnProperty(localeKey)) continue;
      var currentPath = path ? "".concat(path, ".").concat(localeKey) : localeKey; // if path should not be ignored

      if (!ignoreRe || !currentPath.match(ignoreRe)) {
        // localization is found
        if (localeKey in asserted && _typeof(asserted[localeKey]) === _typeof(original[localeKey])) {
          // If value type is an object go inside
          if (_typeof(original[localeKey]) === 'object') {
            errors += assertMissingTranslations(t, original[localeKey], asserted[localeKey], ignoreRe, universalRe, msg, currentPath);
          } // values are the same then probably it's a copy-paste from asserted locale
          else if (original[localeKey] === asserted[localeKey] && (!universalRe || typeof asserted[localeKey] === 'string' && !asserted[localeKey].match(universalRe))) {
              t.fail("".concat(currentPath, " ").concat(msg));
              errors++;
            }
        } // localization not found
        else {
            t.fail("".concat(currentPath, " is not localized."));
            errors++;
          }
      }
    }

    return errors;
  }

  function assertRedundantTranslations(t, master, asserted, ignoreRe, msg) {
    var path = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : '';
    var errors = 0;

    for (var localeKey in asserted) {
      if (!asserted.hasOwnProperty(localeKey)) continue;
      var currentPath = path ? "".concat(path, ".").concat(localeKey) : localeKey;

      if (!ignoreRe || !currentPath.match(ignoreRe)) {
        // if not found in master
        if (!(localeKey in master) || _typeof(master[localeKey]) !== _typeof(asserted[localeKey])) {
          t.fail("".concat(currentPath, " ").concat(msg, "."));
          errors++;
        } else if (_typeof(asserted[localeKey]) === 'object') {
          errors += assertRedundantTranslations(t, master[localeKey], asserted[localeKey], ignoreRe, msg, currentPath);
        }
      }
    }

    return errors;
  } // Locales to assert are set in "index.js" file in Localization test group in "alsoPreloads"


  var locales = window.bryntum.locales,
      original = locales.En; // skip En locale during iterations

  delete locales.En;

  var _arr = Object.keys(locales);

  var _loop = function _loop() {
    var name = _arr[_i];
    var asserted = locales[name];
    t.it("Check ".concat(asserted.localeDesc, " (").concat(name, ") locale"), function (t) {
      t.ok(asserted.localeName, 'Asserted locale name is specified');
      t.ok(asserted.localeDesc, 'Asserted locale description is specified');
      var ignoreRe = getIgnoreRe(asserted.localeName),
          universalTranslationRe = getUniversalTranslationRe(asserted.localeName);
      var errors = assertMissingTranslations(t, original, asserted, ignoreRe, universalTranslationRe, "in ".concat(asserted.localeName, " locale matches ").concat(original.localeName, " locale."));
      errors += assertRedundantTranslations(t, original, asserted, ignoreRe, "in ".concat(asserted.localeName, " locale looks redundant."));
      if (!errors) t.pass("".concat(asserted.localeName, " locale has no errors"));
    });
  };

  for (var _i = 0; _i < _arr.length; _i++) {
    _loop();
  }
});