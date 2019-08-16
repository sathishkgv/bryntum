"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

describe('Test buttons', function (t) {
  var gantt = bryntum.query('gantt'),
      tools = bryntum.fromElement(document.querySelector('.b-top-toolbar')).widgetMap;
  !gantt.features.taskTooltip.isDestroyed && gantt.features.taskTooltip.destroy();
  t.it('Check toolbar buttons', function (t) {
    t.willFireNTimes(gantt, 'zoomchange', 3);
    t.willFireNTimes(gantt, 'timeaxischange', 5);
    t.chain({
      click: tools.addTaskButton.element
    }, {
      waitForSelector: 'input:focus'
    }, // Create task with name foo
    {
      type: 'foo[ENTER]'
    }, // Open task editor
    {
      click: tools.editTaskButton.element
    }, // rename task to bar
    {
      type: '[BACKSPACE][BACKSPACE][BACKSPACE]bar',
      target: '[name=\'name\']'
    }, {
      click: '.b-gantt-taskeditor :textEquals(Save)'
    }, function (next) {
      t.selectorNotExists('.b-grid-cell:textEquals(foo)');
      t.selectorExists('.b-grid-cell:textEquals(bar)');
      next();
    }, {
      click: tools.collapseAllButton.element
    }, function (next) {
      t.is(gantt.taskStore.find(function (task) {
        return !task.isLeaf && task.parent === gantt.taskStore.rootNode && task.isExpanded(gantt.taskStore);
      }), null, 'No expanded nodes found');
      next();
    }, {
      click: tools.expandAllButton.element
    }, function (next) {
      t.is(gantt.taskStore.find(function (task) {
        return !task.isLeaf && task.parent === gantt.taskStore.rootNode && !task.isExpanded(gantt.taskStore);
      }), null, 'No collapsed nodes found');
      next();
    }, // These should trigger 1 timeaxischange each
    {
      click: tools.zoomInButton.element
    }, {
      click: tools.zoomOutButton.element
    }, {
      click: tools.zoomToFitButton.element
    }, {
      click: tools.previousButton.element
    }, {
      click: tools.nextButton.element
    }, {
      click: tools.settingsButton.element
    });
  });
  t.it('Should support turning features on and off', function (t) {
    t.chain({
      click: tools.featuresButton.element
    }, // dependencies
    {
      click: '.b-menu-text:textEquals(Draw dependencies)'
    }, {
      waitForSelectorNotFound: '.b-sch-dependency'
    }, {
      click: '.b-menu-text:textEquals(Draw dependencies)'
    }, {
      waitForSelector: '.b-sch-dependency'
    }, // eof dependencies
    // labels
    {
      click: '.b-menu-text:textEquals(Task labels)'
    }, {
      waitForSelectorNotFound: '.b-gantt-task-wrap:not(.b-sch-released).b-sch-label'
    }, {
      click: '.b-menu-text:textEquals(Task labels)'
    }, {
      waitForSelector: '.b-gantt-task-wrap .b-sch-label'
    }, // eof labels
    // project lines
    {
      click: '.b-menu-text:textEquals(Project lines)'
    }, {
      waitForSelectorNotFound: '.b-gantt-project-line:textEquals(Project start)'
    }, {
      click: '.b-menu-text:textEquals(Project lines)'
    }, {
      waitForSelector: '.b-gantt-project-line:textEquals(Project start)'
    }, // eof project lines
    // non-working time
    {
      click: '.b-menu-text:textEquals(Highlight non-working time)'
    }, {
      waitForSelectorNotFound: '.b-sch-nonworkingtime'
    }, {
      click: '.b-menu-text:textEquals(Highlight non-working time)'
    }, {
      waitForSelector: '.b-sch-nonworkingtime'
    }, // eof non-working time
    // Enable cell editing
    {
      click: '.b-menu-text:textEquals(Enable cell editing)'
    }, {
      waitForSelectorNotFound: '.b-gantt-task-wrap:not(.b-sch-released).b-sch-label'
    }, {
      click: '.b-menu-text:textEquals(Enable cell editing)'
    }, {
      waitForSelector: '.b-gantt-task-wrap .b-sch-label'
    }, // eof cell editing
    // Show baselines
    {
      click: '.b-menu-text:textEquals(Show baselines)'
    }, {
      waitForSelector: '.b-show-baselines'
    }, {
      click: '.b-menu-text:textEquals(Show baselines)'
    }, {
      waitForSelectorNotFound: '.b-show-baselines'
    }, // eof Show baselines
    // schedule collapsing
    {
      click: '.b-menu-text:textEquals(Hide schedule)'
    },
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt("return", t.ok(gantt.subGrids.normal.collapsed, 'Schedule collapsed'));

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    })), {
      click: '.b-menu-text:textEquals(Hide schedule)'
    },
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2() {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              return _context2.abrupt("return", t.notOk(gantt.subGrids.normal.isCollapsed, 'Schedule expanded'));

            case 1:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    })) // eof schedule collapsing
    );
  });
  t.it('Should support turning critical paths on and off', function (t) {
    t.chain({
      click: tools.criticalPathsButton.element
    }, {
      waitForSelector: '.b-gantt-critical-paths'
    }, {
      click: tools.criticalPathsButton.element
    }, {
      waitForSelectorNotFound: '.b-gantt-critical-paths'
    });
  });
});