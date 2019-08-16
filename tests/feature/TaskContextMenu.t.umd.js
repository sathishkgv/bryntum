"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

StartTest(function (t) {
  var gantt;
  Object.assign(window, {
    Gantt: Gantt
  });
  t.beforeEach(function () {
    return gantt && gantt.destroy();
  });
  t.it('Basic context menu works', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      features: {
        taskTooltip: false,
        taskContextMenu: {
          items: {
            moveLeft: {
              text: 'Move left',
              icon: 'b-fa b-fa-fw b-fa-arrow-left',
              cls: 'b-separator b-move-left',
              onItem: function onItem(_ref) {
                var taskRecord = _ref.taskRecord;
                taskRecord.setStartDate(DateHelper.add(taskRecord.startDate, -1, 'day'));
              }
            },
            moveRight: {
              text: 'Move right',
              icon: 'b-fa b-fa-fw b-fa-arrow-right',
              cls: 'b-move-right',
              onItem: function onItem(_ref2) {
                var taskRecord = _ref2.taskRecord;
                taskRecord.setStartDate(DateHelper.add(taskRecord.startDate, 1, 'day'));
              }
            }
          }
        }
      }
    });
    var targetTask = gantt.taskStore.getById(11);
    t.firesOk({
      observable: gantt,
      events: {
        taskcontextmenubeforeshow: 6,
        taskcontextmenushow: 5,
        taskcontextmenuitem: 5
      }
    });
    gantt.on({
      taskcontextmenubeforeshow: function taskcontextmenubeforeshow() {
        return false;
      },
      once: true
    });
    var listeners = {
      taskcontextmenubeforeshow: function taskcontextmenubeforeshow(_ref3) {
        var source = _ref3.source,
            items = _ref3.items,
            taskRecord = _ref3.taskRecord;
        t.describe('Assert taskcontextmenubeforeshow event', function (t) {
          t.is(source, gantt, 'Source is ok');
          t.is(ObjectHelper.getTruthyKeys(items).length, 5, '5 menu items');
          t.is(taskRecord, taskRecord, 'Target task is ok');
        });
      },
      taskcontextmenushow: function taskcontextmenushow(_ref4) {
        var source = _ref4.source,
            taskRecord = _ref4.taskRecord,
            taskElement = _ref4.taskElement;
        t.describe('Assert taskcontextmenushow event', function (t) {
          t.is(source, gantt, 'Source is ok');
          t.is(taskRecord, targetTask, 'Target task is ok');
          t.is(taskElement, gantt.getElementFromTaskRecord(targetTask).parentElement, 'Element is ok');
        });
      },
      taskcontextmenuitem: function taskcontextmenuitem(_ref5) {
        var source = _ref5.source,
            item = _ref5.item,
            taskRecord = _ref5.taskRecord;
        t.describe('Assert taskcontextmenuitem event', function (t) {
          t.is(source, gantt, 'Source is ok');
          t.is(item.text, 'Move right', 'Item is ok');
          t.is(taskRecord, targetTask, 'Target task is ok');
        });
      },
      once: true
    };
    var task;
    t.chain({
      contextmenu: '.b-gantt-task.id11',
      desc: 'First menu is cancelled'
    }, function (next) {
      gantt.on(listeners);
      next();
    }, {
      contextmenu: '.b-gantt-task.id11',
      desc: 'Move one day right'
    }, {
      click: '.b-move-right'
    }, {
      waitForPropagate: gantt
    }, function (next) {
      t.is(targetTask.startDate, new Date(2017, 0, 17), 'Start date moved');
      next();
    }, {
      contextmenu: '.b-gantt-task.id11',
      desc: 'Move one day left'
    }, {
      click: '.b-move-left'
    }, {
      waitForPropagate: gantt
    }, function (next) {
      t.is(targetTask.startDate, new Date(2017, 0, 16), 'Start date moved');
      next();
    }, {
      contextmenu: '.b-gantt-task.id11'
    }, {
      moveMouseTo: '.b-icon-add',
      offset: [130, 0]
    }, {
      click: '.b-icon-up',
      desc: 'Add task above'
    }, function (next) {
      task = gantt.taskStore.changes.added[0];
      task.cls = 'task1';
      next();
    }, {
      contextmenu: '.b-gantt-task.task1'
    }, {
      moveMouseTo: '.b-icon-add',
      offset: [130, 0]
    }, {
      click: '.b-icon-down'
    }, function (next) {
      var _gantt$taskStore$chan = _slicedToArray(gantt.taskStore.changes.added, 2),
          task1 = _gantt$taskStore$chan[0],
          task2 = _gantt$taskStore$chan[1];

      t.is(task1.startDate, targetTask.startDate, 'New task 1 start date is ok');
      t.is(task2.startDate, targetTask.startDate, 'New task 2 start date is ok');
      next();
    }, {
      contextmenu: '.b-gantt-task.task1'
    }, {
      click: '.b-icon-edit'
    }, {
      waitForSelector: '.b-contains-focus input'
    }, {
      type: 'foo[ENTER]'
    }, function (next) {
      t.is(task.name, 'New task 1foo', 'Task name is ok');
      next();
    });
  });
  t.it('Should be possible to trigger menu using API', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      features: {
        taskTooltip: false,
        taskContextMenu: true
      }
    });

    var menu = gantt.features.taskContextMenu,
        getTask = function getTask(id) {
      return gantt.taskStore.getById(id);
    };

    gantt.collapse(getTask(23));
    t.chain({
      waitForSelector: '.b-gantt-task'
    }, function (next) {
      var task = getTask(12);
      menu.showContextMenuFor(task);
      t.selectorCountIs('.b-menu-item', 0, 'Menu was not opened');
      task = getTask(231);
      menu.showContextMenuFor(task);
      t.selectorCountIs('.b-menu-item', 0, 'Menu was not opened');
      task = getTask(21);
      t.waitForEvent(gantt, 'taskcontextmenushow', next);
      menu.showContextMenuFor(task);
    }, function (next) {
      t.selectorCountIs('.b-menu', 1, 'Task context menu appears');
      var taskBox = gantt.getElementFromTaskRecord(getTask(21)).getBoundingClientRect(),
          menuBox = document.querySelector('.b-menu').getBoundingClientRect();
      t.ok(taskBox.left < menuBox.left && taskBox.right > menuBox.left, 'Menu is aligned horizontally');
      t.ok(taskBox.top < menuBox.top && taskBox.bottom > menuBox.top, 'Menu is aligned vertically');
      next();
    });
  });
});