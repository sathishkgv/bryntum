"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

StartTest(function (t) {
  var assignmentsManipulationStore;
  t.beforeEach(function (t) {
    if (assignmentsManipulationStore) {
      assignmentsManipulationStore.destroy();
      assignmentsManipulationStore = null;
    }
  });

  var getProject = function getProject() {
    return new MinimalProject(t.getProjectData());
  };

  t.it('Should fill itself up using provided task',
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(t) {
      var project, eventStore, resourceStore, assignmentStore, event, assignedResourcesCount;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              project = getProject(), eventStore = project.getEventStore(), resourceStore = project.getResourceStore(), assignmentStore = project.getAssignmentStore();
              _context.next = 3;
              return project.propagate();

            case 3:
              event = eventStore.getById(117);
              assignmentsManipulationStore = new AssignmentsManipulationStore({
                projectEvent: event
              });
              t.is(assignmentsManipulationStore.resourceStore, resourceStore, 'Assignment manipulation store obtained resource store via event');
              t.is(assignmentsManipulationStore.assignmentStore, assignmentStore, 'Assignment manipulation store obtained assignment store via event');
              t.is(assignmentsManipulationStore.count, resourceStore.count, 'All resources are available for assignment');
              assignedResourcesCount = assignmentsManipulationStore.reduce(function (count, assignment) {
                return count + (assignment.event === event ? 1 : 0);
              }, 0);
              t.is(assignedResourcesCount, 2, "Event ".concat(event.id, " has ").concat(assignedResourcesCount, " resources assigned"));

            case 10:
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
  t.it('Should apply the changes back to original assignment store',
  /*#__PURE__*/
  function () {
    var _ref2 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2(t) {
      var project, eventStore, resourceStore, event, Arcady, Maxim, Nick, ArcadyAssignmentList, MaximAssignmentList, NickAssignmentList;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              project = getProject(), eventStore = project.getEventStore(), resourceStore = project.getResourceStore();
              _context2.next = 3;
              return project.propagate();

            case 3:
              event = eventStore.getById(115);
              assignmentsManipulationStore = new AssignmentsManipulationStore({
                projectEvent: event
              });
              Arcady = resourceStore.getById(1), Maxim = resourceStore.getById(7), Nick = resourceStore.getById(8); // Event 115 has two resources assigned:
              // - Arcady(1) (100%)
              // - Nick(8) (10%)
              // Let's:
              // - assign Maxim(7) with 75% units to the task
              // - change units for already assigned Arcady(1) from 100% to 30%
              // - unassing Nick(8) completely

              assignmentsManipulationStore.assignResource(Maxim, 75);
              assignmentsManipulationStore.assignResource(Arcady, 30);
              assignmentsManipulationStore.unassignResource(Nick); // Now let's apply the changes

              _context2.next = 11;
              return assignmentsManipulationStore.applyChanges();

            case 11:
              ArcadyAssignmentList = Array.from(Arcady.assignments);
              t.is(ArcadyAssignmentList.length, 1, 'Arcady has only one assignment');
              t.is(ArcadyAssignmentList[0].event, event, "He is assigned to ".concat(event.name));
              t.is(ArcadyAssignmentList[0].units, 30, 'With 30% units');
              MaximAssignmentList = Array.from(Maxim.assignments).sort(function (a1, a2) {
                return a1.event.id - a2.event.id;
              });
              t.is(MaximAssignmentList.length, 2, 'Maxim has assignments');
              t.is(MaximAssignmentList[0].event, event, "He is assigned to task ".concat(event.name));
              t.is(MaximAssignmentList[0].units, 75, 'With 75% units');
              t.is(MaximAssignmentList[1].event, eventStore.getById(121), 'As well as to task 121');
              t.is(MaximAssignmentList[1].units, 100, 'With 100% units');
              NickAssignmentList = Array.from(Nick.assignments);
              t.is(NickAssignmentList.length, 0, 'Nick has no more assignements');

            case 23:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    return function (_x2) {
      return _ref2.apply(this, arguments);
    };
  }());
  t.it('Should be possible to assign/unassign in bulk',
  /*#__PURE__*/
  function () {
    var _ref3 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3(t) {
      var project, eventStore, resourceStore, event, Nick, allAssignedCorrect, allUnassignedCorrect;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              project = getProject(), eventStore = project.getEventStore(), resourceStore = project.getResourceStore();
              _context3.next = 3;
              return project.propagate();

            case 3:
              event = eventStore.getById(115);
              assignmentsManipulationStore = new AssignmentsManipulationStore({
                projectEvent: null
              });
              t.firesOnce(assignmentsManipulationStore, 'allAssigned', 'all-assigned event fired once');
              t.firesOnce(assignmentsManipulationStore, 'noneAssigned', 'none-assigned event fired once');
              t.firesOnce(assignmentsManipulationStore, 'someAssigned', 'some-assigned event fired once');
              assignmentsManipulationStore.projectEvent = event;
              t.ok(assignmentsManipulationStore.areSomeAssigned, 'Some assigned flag is correct');
              t.notOk(assignmentsManipulationStore.areAllAssigned, 'All assigned flag is correct');
              t.notOk(assignmentsManipulationStore.areNoneAssigned, 'None assigned flag is correct'); // Task 115 has two resources assigned:
              // - Arcady(1) (100%)
              // - Nick(8) (10%)

              Nick = resourceStore.getById(8); // Let's assign all resources possible, all currently unassigned resources
              // will be assigned to the task with 100% units

              t.diag('Assigning all unassinged resources with 100% units');
              assignmentsManipulationStore.assignAllResources();
              assignmentsManipulationStore.forEach(function (a) {
                t.is(a.event, event, 'Resource is assigned to the correct task');

                if (a.resource == Nick) {
                  t.is(a.units, 10, 'Nick units are untouched');
                } else {
                  t.is(a.units, 100, 'Resource units are correct');
                }
              });
              t.ok(assignmentsManipulationStore.areAllAssigned, 'All assigned flag is correct');
              t.notOk(assignmentsManipulationStore.areSomeAssigned, 'Some assigned flag is correct');
              t.notOk(assignmentsManipulationStore.areNoneAssigned, 'None assigned flag is correct'); // Now let's force units, all resources should have 100% units, even Nick

              t.diag('Forcefully assign all resources to 100% units');
              assignmentsManipulationStore.assignAllResources(100, true);
              allAssignedCorrect = Array.from(assignmentsManipulationStore).every(function (a) {
                return a.event === event && a.units === 100;
              });
              t.ok(allAssignedCorrect, 'All resources are assigned to the correct task and have 100% units assigned for the task'); // Now let's unassign all

              t.diag('Unassign all');
              assignmentsManipulationStore.unassignAllResources();
              allUnassignedCorrect = Array.from(assignmentsManipulationStore).every(function (a) {
                return a.event === null && a.units === 0;
              });
              t.ok(allUnassignedCorrect, 'All resources are unassinged, units are reset to 0');
              t.ok(assignmentsManipulationStore.areNoneAssigned, 'None assigned flag is correct');
              t.notOk(assignmentsManipulationStore.areAllAssigned, 'All assigned flag is correct');
              t.notOk(assignmentsManipulationStore.areSomeAssigned, 'Some assigned flag is correct');

            case 30:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    return function (_x3) {
      return _ref3.apply(this, arguments);
    };
  }());
});