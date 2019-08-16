"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

StartTest(function (t) {
  var field;
  t.beforeEach(function (t) {
    field && field.destroy();
  });

  var getProject = function getProject() {
    return new MinimalProject(t.getProjectData());
  };

  t.it('Should show/hide picker on trigger click', function (t) {
    var project = getProject(),
        eventStore = project.getEventStore();
    var event = eventStore.getById(115);
    field = new AssignmentField({
      appendTo: document.body,
      width: 300,
      projectEvent: event,
      store: {
        floatAssignedResources: false
      }
    });
    t.chain({
      click: function click() {
        return field.triggers.expand.element;
      }
    }, function (next) {
      t.elementIsVisible('.b-assignmentpicker', 'Picker is shown');
      next();
    }, {
      click: function click() {
        return field.triggers.expand.element;
      }
    }, function () {
      t.selectorNotExists('.b-assignmentpicker', 'Picker is hidden');
    });
  });
  t.it('Should save changes upon save button click',
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2(t) {
      var project, eventStore, resourceStore, event, Arcady, Nick, Maxim;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              project = getProject(), eventStore = project.getEventStore(), resourceStore = project.getResourceStore();
              _context2.next = 3;
              return project.propagate();

            case 3:
              event = eventStore.getById(115);
              field = new AssignmentField({
                appendTo: document.body,
                width: 300,
                projectEvent: event,
                store: {
                  floatAssignedResources: false
                }
              }); // Task(115) initially has 2 resources assigned
              // - Arcady(1) 100%
              // - Nick(8) 10%
              // let's unassign Nick and assign Maxim(7) with 50%

              Arcady = resourceStore.getById(1), Nick = resourceStore.getById(8), Maxim = resourceStore.getById(7);
              t.chain({
                click: function click() {
                  return field.triggers.expand.element;
                }
              }, {
                waitForElementVisible: '.b-assignmentpicker'
              }, {
                click: '.b-assignmentgrid .b-grid-row[data-index=7] .b-checkbox'
              }, {
                click: '.b-assignmentgrid .b-grid-row[data-index=6] .b-checkbox'
              }, {
                dblclick: '.b-assignmentgrid .b-grid-row[data-index=6] .b-grid-cell[data-column=units]'
              }, {
                click: '.b-spin-down'
              }, {
                click: '.b-spin-down'
              }, {
                click: '.b-spin-down'
              }, {
                click: '.b-spin-down'
              }, {
                click: '.b-spin-down'
              }, {
                type: '[Enter]'
              }, {
                click: '.b-button:contains(Save)'
              },
              /*#__PURE__*/
              _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee() {
                var arcadyAssignments, nickAssignments, maximAssignments;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return project.waitForPropagateCompleted();

                      case 2:
                        arcadyAssignments = Array.from(Arcady.assignments), nickAssignments = Array.from(Nick.assignments), maximAssignments = Array.from(Maxim.assignments);
                        t.is(arcadyAssignments.length, 1, 'Arcady assignment present');
                        t.ok(arcadyAssignments[0].event === event && arcadyAssignments[0].units === 100, 'Arcady assignment is untouched');
                        t.is(nickAssignments.length, 0, 'Nick assignment is removed');
                        t.isDeeply(maximAssignments.map(function (a) {
                          return {
                            event: a.event,
                            units: a.units
                          };
                        }).sort(function (a, b) {
                          return a.units - b.units;
                        }), [{
                          event: event,
                          units: 50
                        }, {
                          event: eventStore.getById(121),
                          units: 100
                        }], 'Maxim\'s assignments are ok');

                      case 7:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, this);
              })));

            case 7:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
  t.it('Should cancel changes upon cancel button click',
  /*#__PURE__*/
  function () {
    var _ref3 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3(t) {
      var project, eventStore, assignmentStore, event, initialAssignments;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              project = getProject(), eventStore = project.getEventStore(), assignmentStore = project.getAssignmentStore();
              event = eventStore.getById(115);
              field = new AssignmentField({
                appendTo: document.body,
                width: 300,
                projectEvent: event,
                store: {
                  floatAssignedResources: false
                }
              }); // Task(115) initially has 2 resources assigned
              // - Arcady(1) 100%
              // - Nick(8) 10%
              // Let's modify some assignments and then cancel, assignment store data should left untouched

              initialAssignments = assignmentStore.map(function (a) {
                return a.data;
              });
              t.chain({
                click: function click() {
                  return field.triggers.expand.element;
                }
              }, {
                waitForElementVisible: '.b-assignmentpicker'
              }, {
                click: '.b-assignmentgrid .b-grid-row[data-index=7] .b-checkbox'
              }, {
                click: '.b-assignmentgrid .b-grid-row[data-index=6] .b-checkbox'
              }, {
                dblclick: '.b-assignmentgrid .b-grid-row[data-index=6] .b-grid-cell[data-column=units]'
              }, {
                click: '.b-spin-down'
              }, {
                click: '.b-spin-down'
              }, {
                click: '.b-spin-down'
              }, {
                click: '.b-spin-down'
              }, {
                click: '.b-spin-down'
              }, {
                type: '[Enter]'
              }, {
                click: '.b-button:contains(Cancel)'
              }, function () {
                var assignments = assignmentStore.map(function (a) {
                  return a.data;
                });
                t.isDeeply(initialAssignments, assignments, 'Assignments are left untouched');
              });

            case 5:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    return function (_x2) {
      return _ref3.apply(this, arguments);
    };
  }());
  t.it('Should trigger minimal events on AssignmentStore',
  /*#__PURE__*/
  function () {
    var _ref4 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee4(t) {
      var project, eventStore, assignmentStore, event;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              project = getProject(), eventStore = project.getEventStore(), assignmentStore = project.getAssignmentStore();
              _context4.next = 3;
              return project.propagate();

            case 3:
              event = eventStore.getById(115);
              field = new AssignmentField({
                appendTo: document.body,
                width: 300,
                projectEvent: event,
                store: {
                  floatAssignedResources: false
                }
              });
              t.firesOk(assignmentStore, {
                add: 1,
                remove: 1,
                update: 0
              }); // Task(115) initially has 2 resources assigned
              // Lets unassign both and assign 3 others

              t.chain({
                click: function click() {
                  return field.triggers.expand.element;
                }
              }, {
                waitForElementVisible: '.b-assignmentpicker'
              }, {
                click: '.b-assignmentgrid .b-grid-row[data-index=7] .b-checkbox'
              }, {
                click: '.b-assignmentgrid .b-grid-row[data-index=6] .b-checkbox'
              }, {
                click: '.b-assignmentgrid .b-grid-row[data-index=5] .b-checkbox'
              }, {
                click: '.b-assignmentgrid .b-grid-row[data-index=4] .b-checkbox'
              }, {
                click: '.b-assignmentgrid .b-grid-row[data-index=0] .b-checkbox'
              }, {
                type: '[Enter]'
              }, {
                click: '.b-button:contains(Save)'
              }, {
                waitForPropagate: project
              }, function () {
                t.notOk(field.store.changes, 'No changes remain on AssignmentsManipulationStore');
              });

            case 7:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    return function (_x3) {
      return _ref4.apply(this, arguments);
    };
  }());
});