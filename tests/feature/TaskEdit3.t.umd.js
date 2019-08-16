"use strict";

StartTest(function (t) {
  var gantt;
  t.beforeEach(function () {
    return gantt && gantt.destroy();
  });
  t.it('#8225 Exception when opening task editor right during new task name inputing with STM autorecording on', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      features: {
        taskTooltip: false
      }
    });
    var task;
    var stm = gantt.project.getStm();
    stm.disabled = false;
    stm.autoRecord = true;
    t.chain(function (next) {
      task = gantt.addTaskBelow(gantt.taskStore.last).then(function (t) {
        task = t;
        next();
      });
    }, function (next) {
      gantt.startEditing({
        field: 'name',
        record: task
      });
      next();
    }, {
      type: 'zzzz'
    }, function (next) {
      t.livesOk(function () {
        gantt.editTask(task);
      }, 'Editor loaded just created task w/o exception');
    });
  });
});