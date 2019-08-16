"use strict";

StartTest(function (t) {
  t.chain({
    waitForSelector: '.b-gantt-task'
  }, {
    click: '.b-add-task'
  }, {
    waitFor: 1000
  });
});