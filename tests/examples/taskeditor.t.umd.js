"use strict";

StartTest(function (t) {
  var gantt = bryntum.query('gantt'),
      task = gantt.taskStore.getById(15);
  t.chain({
    dblclick: function dblclick() {
      return gantt.getElementFromTaskRecord(task);
    }
  }, {
    click: '.b-colorfield .b-icon-picker'
  }, {
    click: '.b-color-picker-item[data-id=red]'
  }, {
    click: '.b-button:contains(Save)'
  }, {
    waitFor: function waitFor() {
      var element = gantt.getElementFromTaskRecord(task);
      return window.getComputedStyle(element).backgroundColor === 'rgb(255, 0, 0)';
    }
  }, function () {
    t.pass('Color changed');
  });
});