"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/* global ProjectModel */
StartTest(function (t) {
  var gantt;
  t.beforeEach(function () {
    return gantt && gantt.destroy();
  });

  function assertTask(t, taskOrId, index) {
    var task = getTask(taskOrId),
        taskEl = gantt.getElementFromTaskRecord(task),
        hasParentClass = taskEl && taskEl.parentElement.classList.contains('b-gantt-task-parent');
    var result = true;

    if (!taskEl) {
      t.fail("Element for ".concat(task.name, " is not found"));
      result = false;
    } else {
      if (task.isLeaf && hasParentClass || !task.isLeaf && !hasParentClass) {
        t.fail("".concat(task.name, " has incorrect leaf/parent cls"));
        result = false;
      }

      if (!isTaskPositioned(t, task)) {
        t.fail("".concat(task.name, " is positioned incorrectly"));
        result = false;
      }
    }

    if (index != null) {
      var currentTask = gantt.getRecordFromElement(gantt.rowManager.rows[index].elements.normal);
      t.is(currentTask.id, task.id, "Task ".concat(task.name, " is displayed in correct row"));
    }

    if (result) {
      t.pass("".concat(task.name, " is ok"));
    }
  }

  function isTaskPositioned(t, taskOrId) {
    var task = getTask(taskOrId),
        taskEl = gantt.getElementFromTaskRecord(task),
        taskBox = taskEl.getBoundingClientRect(),
        // cannot rely on cells order, need to validate
    // https://app.assembla.com/spaces/bryntum/tickets/7598-subgrids-order-need-to-be-fixed/details
    rowBox = gantt.getRowFor(task).cells.find(function (cell) {
      return cell.classList.contains('b-sch-timeaxis-cell');
    }).getBoundingClientRect();
    return taskBox.top >= rowBox.top && taskBox.bottom <= rowBox.bottom && taskBox.left === gantt.getCoordinateFromDate(task.startDate, false);
  }

  function tasksPositioned(t) {
    return gantt.project.eventStore.getRange().filter(function (record) {
      return gantt.getRowFor(record);
    }).every(function (record) {
      return isTaskPositioned(t, record);
    });
  }

  function getTask(id) {
    return gantt.project.eventStore.getById(id);
  }

  t.it('Gantt should refresh on task add/update/remove',
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee6(t) {
      var projectA;
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              gantt = t.getGantt({
                appendTo: document.body,
                enableEventAnimations: false,
                tasks: [{
                  id: 1,
                  name: 'Project A',
                  startDate: '2017-01-16',
                  duration: 5,
                  expanded: true,
                  children: [{
                    id: 11,
                    name: 'Child 1',
                    startDate: '2017-01-16',
                    duration: 5,
                    leaf: true,
                    cls: 'child1'
                  }]
                }, {
                  id: 2,
                  name: 'Project B',
                  startDate: '2017-01-16',
                  duration: 5
                }, {
                  id: 3,
                  name: 'Project C',
                  startDate: '2017-01-17',
                  duration: 4
                }],
                dependencies: []
              });
              projectA = getTask(1);
              t.chain({
                waitForSelector: '.b-gantt-task'
              },
              /*#__PURE__*/
              _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee() {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return projectA.waitForPropagateCompleted();

                      case 2:
                        t.diag('Append child to the bottom');
                        projectA.appendChild({
                          id: 12,
                          name: 'Child 2',
                          startDate: '2017-01-16',
                          duration: 1,
                          cls: 'child2'
                        });

                      case 4:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, this);
              })), {
                waitForSelector: '.b-gantt-task.child2'
              }, {
                waitFor: tasksPositioned,
                desc: 'Tasks positioned ok'
              },
              /*#__PURE__*/
              _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee2() {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        t.diag('Insert child to the top');
                        projectA.insertChild({
                          id: 13,
                          name: 'Child 3',
                          startDate: '2017-01-17',
                          duration: 1,
                          cls: 'child3'
                        }, getTask(11));

                      case 2:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2, this);
              })), {
                waitForSelector: '.b-gantt-task.child3'
              }, {
                waitFor: tasksPositioned,
                desc: 'Tasks positioned ok'
              },
              /*#__PURE__*/
              _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee3() {
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        t.diag('Remove task');
                        getTask(11).remove();

                      case 2:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3, this);
              })), {
                waitForElementNotVisible: '.b-gantt-task.child1'
              }, {
                waitFor: tasksPositioned,
                desc: 'Tasks positioned ok'
              },
              /*#__PURE__*/
              _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee4() {
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                  while (1) {
                    switch (_context4.prev = _context4.next) {
                      case 0:
                        t.diag('Update task');
                        _context4.next = 3;
                        return getTask(12).setStartDate(new Date(2017, 0, 18));

                      case 3:
                      case "end":
                        return _context4.stop();
                    }
                  }
                }, _callee4, this);
              })), {
                click: '.b-grid-header.b-sortable',
                desc: 'Sort tasks'
              }, {
                waitFor: tasksPositioned,
                desc: 'Tasks positioned ok'
              },
              /*#__PURE__*/
              _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee5() {
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        t.diag('Append child to sorted project A. It should appear first');
                        projectA.appendChild({
                          id: 14,
                          name: 'Child 1',
                          startDate: '2017-01-18',
                          duration: 1,
                          cls: 'child1'
                        });

                      case 2:
                      case "end":
                        return _context5.stop();
                    }
                  }
                }, _callee5, this);
              })), {
                waitForSelector: '.b-gantt-task.child1'
              }, {
                waitFor: tasksPositioned,
                desc: 'Tasks positioned ok'
              }, function () {
                t.diag('Filter store');
                projectA.project.eventStore.filter(function (r) {
                  return r.name !== 'Child 2';
                });
                t.ok(tasksPositioned(t), 'Tasks positioned ok');
              });

            case 3:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, this);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
  t.it('Gantt should refresh when multiple tasks added/removed',
  /*#__PURE__*/
  function () {
    var _ref7 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee10(t) {
      var projectA;
      return regeneratorRuntime.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              gantt = t.getGantt({
                appendTo: document.body,
                enableEventAnimations: false,
                tasks: [{
                  id: 1,
                  name: 'Project A',
                  startDate: '2017-01-16',
                  duration: 5,
                  expanded: true,
                  children: [{
                    id: 11,
                    name: 'Child 1',
                    startDate: '2017-01-16',
                    duration: 5,
                    leaf: true,
                    cls: 'child1'
                  }]
                }, {
                  id: 2,
                  name: 'Project B',
                  startDate: '2017-01-16',
                  duration: 5
                }, {
                  id: 3,
                  name: 'Project C',
                  startDate: '2017-01-17',
                  duration: 4
                }],
                dependencies: []
              });
              projectA = getTask(1);
              t.chain({
                waitForSelector: '.b-gantt-task'
              },
              /*#__PURE__*/
              _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee7() {
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                  while (1) {
                    switch (_context7.prev = _context7.next) {
                      case 0:
                        return _context7.abrupt("return", projectA.waitForPropagateCompleted());

                      case 1:
                      case "end":
                        return _context7.stop();
                    }
                  }
                }, _callee7, this);
              })),
              /*#__PURE__*/
              _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee8() {
                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                  while (1) {
                    switch (_context8.prev = _context8.next) {
                      case 0:
                        t.diag('Append child to the bottom');
                        projectA.appendChild([{
                          id: 12,
                          name: 'Child 2',
                          startDate: '2017-01-16',
                          duration: 1,
                          cls: 'child2'
                        }, {
                          id: 13,
                          name: 'Child 3',
                          startDate: '2017-01-16',
                          duration: 1,
                          cls: 'child3'
                        }]);

                      case 2:
                      case "end":
                        return _context8.stop();
                    }
                  }
                }, _callee8, this);
              })), {
                waitForSelector: '.b-gantt-task.child2'
              }, {
                waitFor: tasksPositioned,
                desc: 'Tasks positioned ok'
              },
              /*#__PURE__*/
              _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee9() {
                return regeneratorRuntime.wrap(function _callee9$(_context9) {
                  while (1) {
                    switch (_context9.prev = _context9.next) {
                      case 0:
                        t.diag('Insert child to the top');
                        projectA.insertChild([{
                          id: 14,
                          name: 'Child 4',
                          startDate: '2017-01-17',
                          duration: 1,
                          cls: 'child4'
                        }, {
                          id: 15,
                          name: 'Child 5',
                          startDate: '2017-01-17',
                          duration: 1,
                          cls: 'child5'
                        }], getTask(11));

                      case 2:
                      case "end":
                        return _context9.stop();
                    }
                  }
                }, _callee9, this);
              })), {
                waitForSelector: '.b-gantt-task.child4'
              }, {
                waitFor: tasksPositioned,
                desc: 'Tasks positioned ok'
              });

            case 3:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10, this);
    }));

    return function (_x2) {
      return _ref7.apply(this, arguments);
    };
  }());
  t.it('Should render tasks properly after scroll', function (t) {
    var tasks = [],
        dependencies = [];

    for (var i = 0; i < 20; i++) {
      var currentId = i + 1,
          task = {
        id: currentId,
        name: "Task ".concat(currentId),
        startDate: '2017-01-17',
        duration: 2,
        expanded: true,
        children: []
      };

      for (var j = 0; j < 10; j++) {
        task.children.push({
          id: "".concat(currentId, "-").concat(j + 1),
          name: "Task ".concat(currentId, "-").concat(j + 1),
          startDate: '2017-01-17',
          duration: 2
        });

        if (j < 9) {
          dependencies.push({
            id: "".concat(currentId, "-").concat(j + 1),
            fromEvent: "".concat(currentId, "-").concat(j + 1),
            toEvent: "".concat(currentId, "-").concat(j + 2),
            lag: -1
          });
        }
      }

      tasks.push(task);
    }

    gantt = t.getGantt({
      appendTo: document.body,
      features: {
        labels: {
          right: 'name'
        }
      },
      startDate: '2017-01-15',
      endDate: '2017-02-19',
      tasks: tasks,
      dependencies: dependencies
    });

    function assertRenderedTasks() {
      Array.from(document.querySelectorAll('.b-gantt-task-wrap')).forEach(function (el) {
        var taskRecord = gantt.resolveTaskRecord(el);
        assertTask(t, taskRecord);
      });
    }

    function assertDependencies() {
      Array.from(gantt.foregroundCanvas.querySelectorAll('.b-sch-dependency')).forEach(function (dep) {
        t.assertDependency(gantt, gantt.getDependencyForElement(dep));
      });
    }

    var _dependenciesDrawn = false,
        scrollEnded = false;
    t.chain({
      waitForPropagate: gantt
    }, {
      waitFor: tasksPositioned,
      desc: 'Tasks positioned ok'
    }, function (next) {
      assertRenderedTasks();
      gantt.on({
        'dependenciesDrawn': function dependenciesDrawn() {
          return _dependenciesDrawn = true;
        },
        once: true
      });
      gantt.scrollable.on({
        'scrollend': function scrollend() {
          return scrollEnded = true;
        },
        once: true
      });
      t.diag('Scrolling down to 1000px');
      gantt.scrollTop = 1000;
      next();
    }, {
      waitFor: function waitFor() {
        return _dependenciesDrawn && scrollEnded;
      },
      desc: 'Scroll ended & dependencies are redrawn'
    }, function (next) {
      assertRenderedTasks();
      assertDependencies();
      _dependenciesDrawn = false;
      scrollEnded = false;
      gantt.on({
        'dependenciesDrawn': function dependenciesDrawn() {
          return _dependenciesDrawn = true;
        },
        once: true
      });
      gantt.scrollable.on({
        'scrollend': function scrollend() {
          return scrollEnded = true;
        },
        once: true
      });
      t.diag('Scrolling up to 0px');
      gantt.scrollTop = 0;
      next();
    }, {
      waitFor: function waitFor() {
        return _dependenciesDrawn && scrollEnded;
      },
      desc: 'Scroll ended & dependencies are redrawn'
    }, function (next) {
      assertRenderedTasks();
      assertDependencies();
    });
  });
  t.it('Should render tasks properly after tree node removal', function (t) {
    gantt = t.getGantt({
      appendTo: document.body
    });
    t.chain({
      waitForPropagate: gantt
    },
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee11() {
      return regeneratorRuntime.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              gantt.taskStore.getById(3).remove();
              Array.from(document.querySelectorAll('.b-sch-timeaxis-cell')).forEach(function (el) {
                var task = gantt.getRecordFromElement(el);
                assertTask(t, task);
              });
              _context11.next = 4;
              return gantt.collapse(gantt.taskStore.getById(2));

            case 4:
              gantt.taskStore.getById(22).remove();

            case 5:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11, this);
    })), {
      waitForPropagate: gantt
    }, {
      waitForSelectorNotFound: '.b-animating'
    },
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee12() {
      return regeneratorRuntime.wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              Array.from(document.querySelectorAll('.b-sch-timeaxis-cell')).forEach(function (el) {
                var task = gantt.getRecordFromElement(el);
                assertTask(t, task);
              });

            case 1:
            case "end":
              return _context12.stop();
          }
        }
      }, _callee12, this);
    })));
  });
  t.it('Should add task below', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      enableEventAnimations: false,
      tasks: [{
        id: 1,
        name: 'Project A',
        startDate: '2017-01-16',
        duration: 5,
        expanded: true,
        children: [{
          id: 11,
          name: 'Child 1',
          startDate: '2017-01-16',
          duration: 5,
          leaf: true,
          cls: 'child1'
        }]
      }, {
        id: 2,
        name: 'Project B',
        startDate: '2017-01-16',
        duration: 5
      }, {
        id: 3,
        name: 'Project C',
        startDate: '2017-01-17',
        duration: 4
      }],
      dependencies: [],
      columns: [{
        type: 'wbs'
      }, {
        type: 'name'
      }]
    });
    t.chain({
      waitForPropagate: gantt
    },
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee13() {
      return regeneratorRuntime.wrap(function _callee13$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              gantt.addTaskBelow(getTask(11));
              return _context13.abrupt("return", gantt.project.waitForPropagateCompleted());

            case 2:
            case "end":
              return _context13.stop();
          }
        }
      }, _callee13, this);
    })), {
      waitFor: function waitFor() {
        return document.querySelectorAll('.b-grid-subgrid-locked .b-grid-row').length === 5;
      },
      desc: 'Rows are ok'
    },
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee14() {
      return regeneratorRuntime.wrap(function _callee14$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              t.isDeeply(Array.from(document.querySelectorAll('.b-grid-cell[data-column=wbsCode]')).map(function (el) {
                return el.textContent;
              }), ['1', '1.1', '1.2', '2', '3']);
              gantt.addTaskBelow(getTask(11));
              return _context14.abrupt("return", gantt.project.waitForPropagateCompleted());

            case 3:
            case "end":
              return _context14.stop();
          }
        }
      }, _callee14, this);
    })), {
      waitFor: function waitFor() {
        return document.querySelectorAll('.b-grid-subgrid-locked .b-grid-row').length === 6;
      },
      desc: 'Rows are ok'
    },
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee15() {
      return regeneratorRuntime.wrap(function _callee15$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              t.isDeeply(Array.from(document.querySelectorAll('.b-grid-cell[data-column=wbsCode]')).map(function (el) {
                return el.textContent;
              }), ['1', '1.1', '1.2', '1.3', '2', '3']);
              gantt.addTaskBelow(getTask(11));
              return _context15.abrupt("return", gantt.project.waitForPropagateCompleted());

            case 3:
            case "end":
              return _context15.stop();
          }
        }
      }, _callee15, this);
    })), {
      waitFor: function waitFor() {
        return document.querySelectorAll('.b-grid-subgrid-locked .b-grid-row').length === 7;
      },
      desc: 'Rows are ok'
    },
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee16() {
      return regeneratorRuntime.wrap(function _callee16$(_context16) {
        while (1) {
          switch (_context16.prev = _context16.next) {
            case 0:
              t.isDeeply(Array.from(document.querySelectorAll('.b-grid-cell[data-column=wbsCode]')).map(function (el) {
                return el.textContent;
              }), ['1', '1.1', '1.2', '1.3', '1.4', '2', '3']);

            case 1:
            case "end":
              return _context16.stop();
          }
        }
      }, _callee16, this);
    })));
  });
  t.it('Should add task above/below milestone', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      enableEventAnimations: false,
      startDate: '2019-05-27',
      endDate: '2019-06-01',
      project: new ProjectModel({
        eventsData: [{
          id: 1,
          name: 'Project A',
          startDate: '2019-05-27',
          duration: 2,
          expanded: true,
          children: [{
            id: 11,
            name: 'Child 11',
            startDate: '2019-05-27',
            duration: 2,
            leaf: true
          }, {
            id: 12,
            name: 'Child 12',
            startDate: '2019-05-29',
            duration: 0,
            leaf: true
          }]
        }, {
          id: 2,
          name: 'Project B',
          startDate: '2019-05-27',
          duration: 5
        }],
        calendarsData: [{
          'id': 'general',
          'name': 'General',
          'intervals': [{
            'recurrentStartDate': 'on Fri at 17:00',
            'recurrentEndDate': 'on Mon at 9:00',
            'isWorking': false
          }]
        }],
        dependenciesData: [{
          fromEvent: 11,
          toEvent: 12
        }],
        calendar: 'general'
      }),
      columns: [{
        type: 'wbs'
      }, {
        type: 'name'
      }],
      features: {
        taskContextMenu: true
      }
    });
    var task1, task2, task3;
    t.chain({
      waitForPropagate: gantt
    },
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee17() {
      return regeneratorRuntime.wrap(function _callee17$(_context17) {
        while (1) {
          switch (_context17.prev = _context17.next) {
            case 0:
              _context17.next = 2;
              return gantt.addTaskBelow(getTask(12));

            case 2:
              task1 = _context17.sent;
              t.is(task1.startDate, new Date(2019, 4, 27), 'Start date ok');
              t.is(task1.endDate, new Date(2019, 4, 27), 'End date ok');
              t.is(task1.duration, 0, 'Duration date ok');

            case 6:
            case "end":
              return _context17.stop();
          }
        }
      }, _callee17, this);
    })), {
      waitFor: function waitFor() {
        return document.querySelectorAll('.b-grid-subgrid-locked .b-grid-row').length === 5;
      },
      desc: 'Rows are ok'
    },
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee18() {
      return regeneratorRuntime.wrap(function _callee18$(_context18) {
        while (1) {
          switch (_context18.prev = _context18.next) {
            case 0:
              t.isDeeply(Array.from(document.querySelectorAll('.b-grid-cell[data-column=wbsCode]')).map(function (el) {
                return el.textContent;
              }), ['1', '1.1', '1.2', '1.3', '2']);
              _context18.next = 3;
              return gantt.addTaskBelow(getTask(12));

            case 3:
              task2 = _context18.sent;
              t.is(task2.startDate, new Date(2019, 4, 27), 'Start date ok');
              t.is(task2.endDate, new Date(2019, 4, 27), 'End date ok');
              t.is(task2.duration, 0, 'Duration date ok');

            case 7:
            case "end":
              return _context18.stop();
          }
        }
      }, _callee18, this);
    })), {
      waitFor: function waitFor() {
        return document.querySelectorAll('.b-grid-subgrid-locked .b-grid-row').length === 6;
      },
      desc: 'Rows are ok'
    },
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee19() {
      return regeneratorRuntime.wrap(function _callee19$(_context19) {
        while (1) {
          switch (_context19.prev = _context19.next) {
            case 0:
              t.isDeeply(Array.from(document.querySelectorAll('.b-grid-cell[data-column=wbsCode]')).map(function (el) {
                return el.textContent;
              }), ['1', '1.1', '1.2', '1.3', '1.4', '2']);
              _context19.next = 3;
              return gantt.addTaskAbove(getTask(12));

            case 3:
              task3 = _context19.sent;
              t.is(task3.startDate, new Date(2019, 4, 27), 'Start date ok');
              t.is(task3.endDate, new Date(2019, 4, 27), 'End date ok');
              t.is(task3.duration, 0, 'Duration date ok');

            case 7:
            case "end":
              return _context19.stop();
          }
        }
      }, _callee19, this);
    })), {
      waitFor: function waitFor() {
        return document.querySelectorAll('.b-grid-subgrid-locked .b-grid-row').length === 7;
      },
      desc: 'Rows are ok'
    },
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee20() {
      return regeneratorRuntime.wrap(function _callee20$(_context20) {
        while (1) {
          switch (_context20.prev = _context20.next) {
            case 0:
              t.isDeeply(Array.from(document.querySelectorAll('.b-grid-cell[data-column=wbsCode]')).map(function (el) {
                return el.textContent;
              }), ['1', '1.1', '1.2', '1.3', '1.4', '1.5', '2']);
              [task1, task2, task3].forEach(function (record) {
                t.is(record.startDate, new Date(2019, 4, 27), 'Start date ok');
                t.is(record.endDate, new Date(2019, 4, 27), 'End date ok');
                t.is(record.duration, 0, 'Duration date ok');
              });

            case 2:
            case "end":
              return _context20.stop();
          }
        }
      }, _callee20, this);
    })));
  });
  t.it('Appending new task should not cause scheduling conflict', function (t) {
    gantt = t.getGantt({
      appendTo: document.body,
      startDate: '2019-05-20',
      endDate: '2019-05-27',
      project: {
        startDate: '2019-05-20',
        tasksData: [{
          id: 1,
          name: 'Project A',
          startDate: '2019-05-20',
          duration: 1,
          expanded: true,
          children: [{
            id: 11,
            name: 'Task 11',
            startDate: '2019-05-20',
            duration: 1
          }, {
            id: 12,
            name: 'Task 12',
            startDate: '2019-05-21',
            expanded: true,
            children: [{
              id: 121,
              name: 'task 121',
              startDate: '2019-05-21',
              duration: 1
            }]
          }]
        }],
        dependenciesData: [{
          id: 1,
          fromEvent: 11,
          toEvent: 12
        }]
      }
    });
    t.wontFire(gantt.project, 'schedulingconflict'); // we added listener, we have to continue propagation

    gantt.project.on('schedulingconflict', function (_ref21) {
      var continueWithResolutionResult = _ref21.continueWithResolutionResult;
      continueWithResolutionResult();
    });
    t.chain({
      waitForPropagate: gantt
    },
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee21() {
      var task;
      return regeneratorRuntime.wrap(function _callee21$(_context21) {
        while (1) {
          switch (_context21.prev = _context21.next) {
            case 0:
              _context21.next = 2;
              return gantt.addTaskBelow(gantt.taskStore.getById(121));

            case 2:
              task = _context21.sent;
              t.is(task.startDate, new Date(2019, 4, 21), 'Task start is ok');
              t.is(task.endDate, new Date(2019, 4, 22), 'Task end is ok');
              t.is(task.duration, 1, 'Task duration is ok');

            case 6:
            case "end":
              return _context21.stop();
          }
        }
      }, _callee21, this);
    })));
  });
  t.it('Gantt tasks should animate to new state when modified',
  /*#__PURE__*/
  function () {
    var _ref23 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee23(t) {
      var project, task11, task11El, startTask11Rect, expectedTask11Data, startTime;
      return regeneratorRuntime.wrap(function _callee23$(_context23) {
        while (1) {
          switch (_context23.prev = _context23.next) {
            case 0:
              gantt = t.getGantt({
                appendTo: document.body,
                startDate: '2019-07-07',
                endDate: '2019-07-29',
                project: {
                  startDate: '2019-07-07',
                  duration: 30,
                  eventsData: [{
                    id: 1,
                    name: 'Project A',
                    duration: 30,
                    expanded: true,
                    children: [{
                      id: 11,
                      name: 'Child 1',
                      duration: 5,
                      leaf: true,
                      cls: 'child1'
                    }]
                  }]
                }
              });
              project = gantt.project, task11 = gantt.taskStore.getById(11), task11El = gantt.getElementFromTaskRecord(task11);
              t.chain({
                waitForPropagate: project
              }, // Wait for initial animation to be over
              {
                waitForSelectorNotFound: '.b-animating'
              },
              /*#__PURE__*/
              _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee22() {
                return regeneratorRuntime.wrap(function _callee22$(_context22) {
                  while (1) {
                    switch (_context22.prev = _context22.next) {
                      case 0:
                        t.diag('Change position of task 11'); // Capture start position

                        startTask11Rect = Rectangle.from(task11El, gantt.timeAxisSubGridElement); // Make a long transition so we can determine that it moves slowly

                        CSSHelper.insertRule('.b-animating .b-gantt-task-wrap { transition-duration: 5s !important; }');
                        gantt.transitionDuration = 5000; // When we hit the end condition, *approx* 5000ms must have elapsed from here

                        startTime = performance.now(); // Move task into future and make it longer

                        task11.set({
                          startDate: '2019-07-15',
                          endDate: '2019-07-27',
                          duration: 10
                        });
                        project.propagate();

                      case 7:
                      case "end":
                        return _context22.stop();
                    }
                  }
                }, _callee22, this);
              })), // Wait for corrected data to get to the task
              {
                waitForPropagate: project
              }, function (next) {
                var r = Rectangle.from(task11El, gantt.timeAxisSubGridElement); // It must not start moving until the next AF

                t.is(r.x, startTask11Rect.x, 'Task has not started moving');
                t.is(r.width, startTask11Rect.width, 'Task has not started changing width');
                next();
              }, {
                waitFor: 500
              }, // After 500 ms, it must not have moved to its final position
              function (next) {
                // Calculate the final position where it will animate to.
                expectedTask11Data = gantt.currentOrientation.getTimeSpanRenderData(task11, task11);
                var r = Rectangle.from(task11El, gantt.timeAxisSubGridElement);
                t.isLess(r.x, expectedTask11Data.left, 'Task has not reached its final position');
                t.isLess(r.width, expectedTask11Data.width, 'Task has not reached its funal width');
                next();
              }, // Wait for final position and width to happen.
              {
                waitFor: function waitFor() {
                  var r = Rectangle.from(task11El, gantt.timeAxisSubGridElement);
                  return r.x === expectedTask11Data.left && r.width === expectedTask11Data.width;
                },
                desc: 'Task has reached its final position and width'
              }, // It must have taken Approx 5 seconds to get here
              function () {
                // .7 second margin due to slow test platforms
                t.isApprox(performance.now(), startTime + 5000, 700, 'Transition took correct time');
              });

            case 3:
            case "end":
              return _context23.stop();
          }
        }
      }, _callee23, this);
    }));

    return function (_x3) {
      return _ref23.apply(this, arguments);
    };
  }());
});