"use strict";

StartTest(function (t) {
  var gantt;
  t.beforeEach(function () {
    return gantt && gantt.destroy();
  });
  t.it('Should be able to tab through all cells while editing', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      columns: Object.values(AllColumns).map(function (ColumnClass) {
        return {
          type: ColumnClass.type
        };
      })
    });
    t.chain({
      dblClick: '.b-grid-cell:nth-child(2)'
    }, {
      type: '[TAB]'.repeat(gantt.columns.count * 3)
    }, // All cells in three rows (+ some extra since some are not editable)
    function () {
      t.pass('Tabbed through without exception');
    });
  });
  t.it('Should be able to tab through all cells for new record', function (t) {
    gantt = t.getGantt({
      tasks: [{}],
      appendTo: document.body,
      columns: Object.values(AllColumns).map(function (ColumnClass) {
        return {
          type: ColumnClass.type
        };
      })
    });
    t.chain({
      dblClick: ".b-grid-cell:nth-child(2)"
    }, {
      type: '[TAB]'.repeat(gantt.columns.count * 2)
    }, // All cells in three rows (+ some extra since some are not editable)
    function () {
      t.pass('Tabbed through without exception');
    });
  });
  t.it('Should validate dependencies', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      columns: [{
        type: 'name',
        width: 200
      }, {
        type: 'predecessor',
        width: 100
      }, {
        type: 'successor',
        width: 100
      }],
      startDate: '2019-05-20',
      endDate: '2019-05-26',
      tasks: [{
        id: 1,
        cls: 'task1',
        name: 'Task 1',
        startDate: '2019-05-20',
        duration: 1
      }, {
        id: 2,
        cls: 'task2',
        name: 'Task 2',
        startDate: '2019-05-20',
        duration: 1,
        expanded: true,
        children: [{
          id: 21,
          cls: 'task21',
          name: 'Task 21',
          startDate: '2019-05-20',
          duration: 1
        }, {
          id: 22,
          cls: 'task22',
          name: 'Task 22',
          startDate: '2019-05-21',
          duration: 1
        }]
      }, {
        id: 3,
        cls: 'task3',
        name: 'Task 3',
        startDate: '2019-05-20',
        duration: 1
      }],
      dependencies: [{
        id: 1,
        fromEvent: 1,
        toEvent: 21
      }, {
        id: 2,
        fromEvent: 21,
        toEvent: 22
      }]
    });
    t.chain({
      waitForPropagate: gantt
    }, // Type invalid predecessor ID
    {
      dblclick: '.task1 [data-column=predecessors]'
    }, function (next) {
      t.waitForEvent(gantt, 'cancelcelleditasync', next);
      t.type(null, '2[ENTER]');
    }, {
      waitForSelector: '.b-toast'
    }, function (next) {
      t.selectorCountIs('.b-toast', 1, 'Only 1 toast appears');
      next();
    }, {
      waitForSelectorNotFound: '.b-toast'
    }, function (next) {
      var task = gantt.taskStore.getById(1);
      t.is(task.predecessors.length, 0, 'No predecessors added');
      next();
    }, // Pick predecessor from dropdown
    {
      click: '.task1 [data-column=predecessors]'
    }, {
      type: '[DOWN]'
    }, {
      dblclick: '.b-list-item.task3 .b-to'
    }, function (next) {
      t.waitForEvent(gantt, 'finishcelleditasync', next);
      t.type(null, '[TAB]');
    }, function (next) {
      var task = gantt.taskStore.getById(1);
      t.is(task.predecessors.length, 1, 'Predecessor added');
      t.is(task.predecessors[0].fromEvent, gantt.taskStore.getById(3), 'Predecessor is ok');
      t.is(document.querySelector('.task1 [data-column=predecessors]').textContent, '3', 'Cell content is ok');
      next();
    }, // Pick from dropdown again
    {
      click: '.task1 [data-column=predecessors]'
    }, {
      type: '[DOWN]'
    }, {
      click: '.b-list-item.task3 .b-to'
    }, function (next) {
      t.waitForEvent(gantt, 'finishcelleditasync', next);
      t.type(null, '[TAB]');
    }, function (next) {
      var task = gantt.taskStore.getById(1);
      t.is(task.predecessors.length, 1, 'Predecessor added');
      t.is(task.predecessors[0].fromEvent, gantt.taskStore.getById(3), 'Predecessor is ok');
      t.is(document.querySelector('.task1 [data-column=predecessors]').textContent, '3FF', 'Cell content is ok');
      next();
    });
  });
});