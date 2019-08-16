"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

StartTest(function (t) {
  var gantt;
  t.beforeEach(function () {
    return gantt && gantt.destroy();
  });
  t.it('#8231 TaskEditor cancel should not lead to just added record removal', function (t) {
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
    }, function (next) {
      gantt.editTask(task);
      next();
    }, {
      waitForSelector: '.b-popup.b-taskeditor'
    }, {
      click: '.b-button:contains(Cancel)'
    }, {
      waitForPropagate: gantt
    }, function (next) {
      // Task.id here to avoid #8238
      t.ok(gantt.taskStore.includes(task.id), 'The task is in the store after the Task Editor Cancel');
    });
  }); // https://app.assembla.com/spaces/bryntum/tickets/8276-crash-if-invoking-task-editor-for-unscheduled-task/details#

  t.it('should support editing an unscheduled task',
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(t) {
      var added;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              gantt = t.getGantt({
                appendTo: document.body
              });
              added = gantt.taskStore.rootNode.appendChild({
                name: 'New task'
              }); // run propagation to calculate new task fields

              _context.next = 4;
              return gantt.project.propagate();

            case 4:
              gantt.editTask(added);
              t.chain({
                waitForSelector: '.b-gantt-taskeditor'
              });

            case 6:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
  t.it('Should support configuring extra widgets for each tab', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      features: {
        taskEdit: {
          editorConfig: {
            height: '40em',
            extraItems: {
              generaltab: [{
                type: 'button',
                text: 'general'
              }],
              successorstab: [{
                type: 'button',
                text: 'successors'
              }],
              predecessorstab: [{
                type: 'button',
                text: 'predecessors'
              }],
              resourcestab: [{
                type: 'button',
                text: 'resources'
              }],
              advancedtab: [{
                type: 'button',
                text: 'advanced'
              }],
              notestab: [{
                type: 'button',
                text: 'notes'
              }]
            }
          }
        }
      }
    });
    var steps = [];
    ['general', 'successors', 'predecessors', 'resources', 'advanced', 'notes'].forEach(function (text, i) {
      steps.push({
        click: ".b-tabpanel-tab:nth-child(".concat(i + 1, ")")
      }, {
        waitForSelector: ".b-".concat(text, "tab .b-button:contains(").concat(text, ")")
      });
    });
    t.chain({
      waitForPropagate: gantt
    },
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2() {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              gantt.editTask(gantt.taskStore.getById(11));

            case 1:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    })), steps);
  }); // https://app.assembla.com/spaces/bryntum/tickets/8785

  t.it('Should support configuring listeners', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      features: {
        taskEdit: {
          editorConfig: {
            listeners: {
              beforeClose: function beforeClose() {}
            }
          }
        }
      }
    });
    var editor = gantt.features.taskEdit.getEditor();
    t.ok(editor.listeners.cancel, 'Cancel listener is present');
    t.ok(editor.listeners.delete, 'Delete listener is present');
    t.ok(editor.listeners.save, 'Save listener is present');
    t.ok(editor.listeners.requestPropagation, 'RequestPropagation listener is present');
    t.ok(editor.listeners.beforeClose, 'BeforeClose listener is present');
  });
  t.it('Should not allow to set end before start date', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      project: t.getProject({
        calendar: 'general'
      })
    });
    var task = gantt.taskStore.getById(234);
    t.chain({
      dblclick: '.b-gantt-task.id234'
    }, {
      click: '.b-end-date .b-icon-angle-left'
    }, {
      waitFor: function waitFor() {
        return task.endDate.getTime() === new Date(2017, 1, 9).getTime() && task.duration === 0;
      },
      desc: 'End date changed, duration is 0'
    }, {
      click: '.b-end-date .b-icon-angle-left'
    }, {
      waitForPropagate: gantt
    }, {
      waitFor: function waitFor() {
        return task.endDate.getTime() === new Date(2017, 1, 9).getTime() && task.duration === 0;
      },
      desc: 'End date intact, duration is 0'
    }, {
      type: '[DOWN][TOP][ENTER]'
    }, {
      waitForPropagate: gantt
    }, {
      waitFor: function waitFor() {
        return task.endDate.getTime() === new Date(2017, 1, 9).getTime() && task.duration === 0;
      },
      desc: 'End date intact, duration is 0'
    }, {
      click: '.b-end-date .b-icon-angle-right'
    }, {
      waitFor: function waitFor() {
        return task.endDate.getTime() === new Date(2017, 1, 10).getTime() && task.duration === 1;
      },
      desc: 'End date chaged, duration is 1'
    });
  }); // #8632 - Task end date/duration is not properly editing after cancel

  t.it('Should continue editing after cancel/undo', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      project: t.getProject({
        calendar: 'general'
      }),
      features: {
        taskTooltip: false
      }
    });
    var task = gantt.taskStore.getById(13);
    t.chain({
      dblclick: '.b-gantt-task.id13'
    }, {
      click: '.b-end-date .b-icon-angle-left'
    }, {
      waitFor: function waitFor() {
        return task.endDate.getTime() === new Date(2017, 0, 25).getTime() && task.duration === 7;
      },
      desc: 'End date changed, duration is 7'
    }, {
      click: '.b-gantt-task.id12'
    }, {
      waitForPropagate: gantt
    }, {
      waitFor: function waitFor() {
        return task.endDate.getTime() === new Date(2017, 0, 26).getTime() && task.duration === 8;
      },
      desc: 'End date restored, duration is 8'
    }, {
      dblclick: '.b-gantt-task.id13'
    }, {
      click: '.b-end-date .b-icon-angle-left'
    }, {
      waitFor: function waitFor() {
        return task.endDate.getTime() === new Date(2017, 0, 25).getTime() && task.duration === 7;
      },
      desc: 'End date changed, duration is 7'
    });
  });
});