"use strict";

StartTest(function (t) {
  //All locales are preloaded via alsoPreload in tests/index.js
  var localeNames = Object.keys(window.bryntum.locales);

  function applyLocale(t, name) {
    t.diag("Applying locale ".concat(name));
    return LocaleManager.locale = window.bryntum.locales[name];
  }

  var editor;
  t.beforeEach(function () {
    editor && !editor.isDestroyed && editor.destroy();
    editor = new TaskEditor({
      appendTo: document.body
    });
  });
  t.it('Should localize TaskEditor', function (t) {
    localeNames.forEach(function (name) {
      t.describe("".concat(name, " locale is ok"), function (t) {
        var locale = applyLocale(t, name);
        var tabs = document.querySelectorAll('.b-gantt-taskeditor .b-tabpanel-tab');
        t.contentLike(tabs[0], locale.GeneralTab.General, 'General tab localization is ok');
        t.contentLike(tabs[1], locale.DependencyTab.Successors, 'Successors tab localization is ok');
        t.contentLike(tabs[2], locale.DependencyTab.Predecessors, 'Predecessors tab localization is ok');
        t.contentLike(tabs[3], locale.ResourcesTab.Resources, 'Resources tab localization is ok');
        t.contentLike(tabs[4], locale.AdvancedTab.Advanced, 'Advanced tab localization is ok');
        t.contentLike(tabs[5], locale.NotesTab.Notes, 'Notes tab localization is ok');
        t.is(document.querySelector('.b-gantt-taskeditor .b-header-title').textContent, locale.TaskEditor.Information, 'Information currentLocale is ok');
        t.is(editor.widgetMap.saveButton.element.textContent, locale.TaskEditor.Save, 'Save button currentLocale is ok');
        t.is(editor.widgetMap.cancelButton.element.textContent, locale.TaskEditor.Cancel, 'Cancel button currentLocale is ok');
      });
    });
  }); // TODO: enable this back when https://app.assembla.com/spaces/bryntum/tickets/8034 is fixed

  t.todo('Should localize TaskEditor width', function (t) {
    localeNames.forEach(function (name) {
      t.describe("".concat(name, " locale is ok"), function (t) {
        var locale = applyLocale(t, name);
        var eventEditorWidth = locale.TaskEditor.editorWidth;

        if (/em/.test(eventEditorWidth)) {
          var size = parseInt(eventEditorWidth),
              fontSize = parseInt(window.getComputedStyle(editor.element).fontSize),
              expectedWidth = size * fontSize;
          t.is(editor.width, expectedWidth, 'Width is properly localized');
        }
      });
    });
  });
});