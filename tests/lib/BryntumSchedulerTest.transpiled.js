"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

Class('BryntumSchedulerTest', {
  // eslint-disable-next-line no-undef
  isa: BryntumGridTest,
  // Have to do `chmod a+r tests/lib/BryntumGridTest.js` after build (644 access rights)
  override: {
    setup: function setup(callback, errback) {
      var me = this;
      var global = this.global; // // allow test to specifiy required classes as requires: []
      // // test wont start until all classes are loaded
      // let config   = this.harness.getScriptDescriptor(this),
      //     requires = config.requires || config.testConfig && config.testConfig.requires;
      // if (requires) {
      //     new Loader().load(requires, '../lib/', true, this.global.document, true, callback);
      // } else {
      //     callback();
      // }
      // running with bundle, but tests are written for import. need to publish all classes to global

      if (global.bryntum && global.bryntum.scheduler) {
        for (var className in global.bryntum.scheduler) {
          if (!global[className]) global[className] = global.bryntum.scheduler[className];
        }
      }

      me.SUPER(callback, errback);
    },
    mimicFocusOnMouseDown: function mimicFocusOnMouseDown(el, mouseDownEvent) {
      // Allow mousedown on label to run its course
      if (el.tagName !== 'LABEL') {
        this.SUPER(el, mouseDownEvent);
      }
    }
  },
  methods: {
    getTimeAxis: function getTimeAxis(TimeAxis, PresetManager, presetName, cfg) {
      var Date = this.global.Date;
      return new TimeAxis(this.global.Object.assign({
        startDate: new Date(2010, 1, 1),
        endDate: new Date(2010, 1, 11),
        weekStartDay: 1,
        viewPreset: presetName
      }, cfg));
    },
    getAssignmentStore: function getAssignmentStore(config) {
      var nbrAssignments = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;
      var AssignmentStore = this.global.AssignmentStore;
      return new AssignmentStore(this.global.Object.assign({
        data: function () {
          var records = [];

          for (var i = 1; i <= nbrAssignments; i++) {
            records.push({
              id: 'a' + i,
              eventId: i,
              resourceId: 'r' + i
            });
          }

          return records;
        }()
      }, config || {}));
    },
    getEventStore: function getEventStore(config) {
      var nbrEvents = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;
      var Date = this.global.Date,
          EventStore = this.global.EventStore;
      return new EventStore(this.global.Object.assign({
        data: function () {
          var events = [];

          for (var i = 1; i <= nbrEvents; i++) {
            events.push({
              id: i,
              cls: 'event' + i,
              resourceId: 'r' + i,
              name: 'Assignment ' + i,
              startDate: new Date(2011, 0, 3 + i),
              endDate: new Date(2011, 0, 5 + i)
            });
          }

          return events;
        }()
      }, config || {}));
    },
    getResourceStore: function getResourceStore(config) {
      var ResourceStore = this.global.ResourceStore;
      config = config || {};
      return new ResourceStore(this.global.Object.assign({
        data: [{
          id: 'r1',
          name: 'Mike'
        }, {
          id: 'r2',
          name: 'Linda'
        }, {
          id: 'r3',
          name: 'Don'
        }, {
          id: 'r4',
          name: 'Karen'
        }, {
          id: 'r5',
          name: 'Doug'
        }, {
          id: 'r6',
          name: 'Peter'
        }]
      }, config));
    },
    getResourceStore2: function getResourceStore2(config, nbrResources) {
      var ResourceStore = this.global.ResourceStore;
      return new ResourceStore(this.global.Object.assign({
        data: function () {
          var resources = [];

          for (var i = 1; i <= nbrResources; i++) {
            resources.push({
              id: 'r' + i,
              name: 'Resource ' + i
            });
          }

          return resources;
        }()
      }, config));
    },
    getResourceTreeStore: function getResourceTreeStore(config) {
      var ResourceStore = this.global.ResourceStore;
      config = config || {};
      return new ResourceStore(this.global.Object.assign({
        tree: true,
        data: [{
          id: 'r1',
          name: 'Kastrup Airport',
          expanded: true,
          children: [{
            id: 'r2',
            name: 'Terminal A',
            expanded: false,
            children: [{
              id: 'r3',
              name: 'Gates 1 - 5',
              expanded: true,
              children: [{
                id: 'r4',
                name: 'Gate 1'
              }, {
                id: 'r5',
                name: 'Gate 2'
              }, {
                id: 'r6',
                name: 'Gate 3'
              }, {
                id: 'r7',
                name: 'Gate 4'
              }, {
                id: 'r8',
                name: 'Gate 5'
              }]
            }]
          }, {
            id: 'r42222',
            name: 'Gate 1214312421'
          }] // eof Kastrup

        }] // eof data

      }, config));
    },
    getDependencyStore: function getDependencyStore(config, nbrEvents) {
      var DependencyStore = this.global.DependencyStore;
      if (nbrEvents === undefined) nbrEvents = 5;
      return new DependencyStore(this.global.Object.assign({
        data: function () {
          var dependencies = [];

          for (var i = 1; i <= nbrEvents - 1; i++) {
            dependencies.push({
              id: i,
              from: i,
              to: i + 1
            });
          }

          return dependencies;
        }()
      }, config || {}));
    },
    getScheduler: function getScheduler(config, nbrEvents) {
      var Date = this.global.Date,
          Scheduler = this.global.Scheduler,
          PresetManager = this.global.PresetManager;
      config = config || {};

      if (!config.features) {
        config.features = {
          eventEdit: false,
          // some tests not written to have event editor or context menu
          eventContextMenu: false,
          contextMenu: false
        };
      }

      PresetManager.registerDefaults(); // Secret flag to easily get a scheduler tree
      //if (config.__tree) {
      //    return this.getSchedulerTree(config, nbrEvents);
      //}

      if (config.dependencyStore === true) {
        config.dependencyStore = this.getDependencyStore({}, nbrEvents);
      }

      if ((config.dependencyStore || config.dependencies) && !config.features.dependencies) config.features.dependencies = true;

      if (!('startDate' in config)) {
        config.startDate = new Date(2011, 0, 3);
        config.endDate = new Date(2011, 0, 13);
      }

      if (!config.events && !config.eventStore) {
        config.eventStore = this.getEventStore({}, nbrEvents);
      }

      if (!config.resources && !config.resourceStore) {
        config.resourceStore = this.getResourceStore();
      }

      return new Scheduler(this.global.Object.assign({
        //eventResizeHandles : 'both',
        viewPreset: 'dayAndWeek',
        //width  : 800,
        //height : 400,
        //viewConfig : {
        //    barMargin       : 2,
        //    cellBorderWidth : 0
        //},
        rowHeight: 45,
        // eventRenderer : (item, r, tplData, row) => {
        //     const bgColor = ['lightgray', 'orange', 'lightblue'][row % 3];
        //
        //     tplData.style = "background-color:" + bgColor;
        //     tplData.cls["sch-custom-css-class"] = 1;
        //
        //     return item.get('Name');
        // },
        // Setup static columns
        columns: [{
          text: 'Name',
          sortable: true,
          width: 100,
          field: 'name',
          locked: true
        }],
        destroyStores: true,
        useInitialAnimation: false
      }, config));
    },
    isDeeplyUnordered: function isDeeplyUnordered(array, toMatch, desc) {
      var failDesc = 'isDeeplyUnordered check failed: ' + desc,
          passDesc = 'isDeeplyUnordered check passed: ' + desc;

      if (!this.global.Array.isArray(array) || !this.global.Array.isArray(toMatch)) {
        return this.isDeeply.apply(this, arguments);
      }

      if (array.length !== toMatch.length) {
        this.fail(failDesc);
        return;
      }

      var joined = array.concat(toMatch),
          set = new this.global.Set(joined);

      if (set.size !== array.length) {
        this.fail(failDesc);
        return;
      }

      this.pass(passDesc);
    },
    snapShotListeners: function snapShotListeners(observable, name) {
      var _this = this;

      this._observableData = this._observableData || {};
      this._observableData[name] = {}; // if (!name) throw 'Must provide a name for the observable';

      Object.keys(observable.eventListeners).forEach(function (key) {
        _this._observableData[name][key] = observable.eventListeners[key].slice();
      });
    },
    verifyListeners: function verifyListeners(observable, name, allowedObservers) {
      var _this2 = this;

      var needListeners = this._observableData[name],
          count = 0;

      function logListener(listener) {
        var result = Object.assign({}, listener);
        result.thisObj = result.thisObj && result.thisObj.constructor.name || undefined;
        return result;
      }

      allowedObservers = allowedObservers || [];
      Object.keys(observable.eventListeners).forEach(function (key) {
        if (!needListeners[key]) {
          observable.eventListeners[key].forEach(function (listener) {
            if (!allowedObservers.includes(listener.thisObj)) {
              count++;

              _this2.is(logListener(listener), null, "Extra ".concat(key, " event listener found"));
            }
          });
        } else {
          observable.eventListeners[key].forEach(function (listener) {
            if (!needListeners[key].includes(listener) && !allowedObservers.includes(listener.thisObj)) {
              count++;

              _this2.is(logListener(listener), null, "Extra ".concat(key, " event listener found"));
            }
          });
          needListeners[key].forEach(function (listener) {
            if (observable.eventListeners[key].indexOf(listener) === -1) {
              _this2.is(null, logListener(listener), "".concat(key, " event listener is missing"));
            }
          });
        }
      });
      this.is(count, 0, 'No extra listeners found');
    },
    getHeaderAndBodyScrollValues: function getHeaderAndBodyScrollValues(scheduler) {
      var bodyScroll = scheduler.timeAxisSubGrid.scrollable.x,
          headerScroll = scheduler.timeAxisSubGrid.header.scrollable.x;
      return {
        header: headerScroll,
        body: bodyScroll
      };
    },
    waitForHeaderAndBodyScrollSynced: function waitForHeaderAndBodyScrollSynced(scheduler, next) {
      var _this3 = this;

      this.waitFor(function () {
        var values = _this3.getHeaderAndBodyScrollValues(scheduler);

        return values.header === values.body;
      }, next);
    },
    waitForAnimations: function waitForAnimations(callback) {
      var me = this;
      me.SUPER(function () {
        me.waitForSelectorNotFound('.b-animating', function () {
          callback();
        });
      });
    },
    assertHeaderAndBodyAreScrollSynced: function assertHeaderAndBodyAreScrollSynced(scheduler) {
      var values = this.getHeaderAndBodyScrollValues(scheduler);
      this.is(values.header, values.body, 'Header and body scroll is synced');
    },
    assertDependency: function assertDependency(scheduler, dependency) {
      var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          fromSide = _ref.fromSide,
          toSide = _ref.toSide,
          fromBox = _ref.fromBox,
          toBox = _ref.toBox;

      function getPointFromBox(record, side, box) {
        var point,
            adjustLeft = 0,
            adjustRight = 0,
            adjustTop = 0,
            _scheduler$getElement = scheduler.getElementsFromEventRecord(record),
            _scheduler$getElement2 = _slicedToArray(_scheduler$getElement, 1),
            el = _scheduler$getElement2[0],
            viewStartDate = scheduler.startDate,
            viewEndDate = scheduler.endDate,
            OUTSIDE_VIEW_OFFSET = 40;

        if (box) {
          if (record.startDate > viewEndDate) {
            box.left = box.left + OUTSIDE_VIEW_OFFSET;
          } else if (record.endDate < viewStartDate) {
            box.left = box.left - OUTSIDE_VIEW_OFFSET;
          }

          box.right = box.left + box.width;
        } else {
          box = el.getBoundingClientRect();
        }

        if (record.milestone) {
          if (!el.classList.contains('b-sch-event-withicon')) {
            adjustLeft = -1 * (adjustRight = box.height / 2);
          } else {
            box = el.querySelector('*').getBoundingClientRect();
          }
        }

        switch (side) {
          case 'top':
            point = [box.left + box.width / 2, box.top];
            break;

          case 'bottom':
            point = [box.left + box.width / 2, box.bottom];
            break;

          case 'left':
            point = [box.left + adjustLeft, box.top + box.height / 2 - adjustTop];
            break;

          case 'right':
            point = [box.right + adjustRight, box.top + box.height / 2];
            break;

          case 'top-left':
            point = [box.left + adjustLeft, box.top];
            break;
        }

        return point;
      }

      function getFromSide(dependency) {
        return dependency.fromSide || (dependency.type < 2 ? 'left' : 'right');
      }

      function getToSide(dependency) {
        var result;

        if (dependency.toSide) {
          result = dependency.toSide;
        } else {
          result = dependency.type % 2 ? 'right' : 'left';
        }

        return result;
      }

      var from = dependency.sourceEvent,
          to = dependency.targetEvent;

      if (from && to) {
        // Using '_features' instead of 'features' for IE11 compatibility
        var dependencyEl = scheduler._features.dependencies.getElementForDependency(dependency),
            fromPoint = getPointFromBox(from, fromSide || getFromSide(dependency), fromBox),
            toPoint = getPointFromBox(to, toSide || getToSide(dependency), toBox),
            svgBox = dependencyEl.ownerSVGElement.getBoundingClientRect(),
            dependencyPoints = dependencyEl.getAttribute('points').split(' '),
            depStartPoint = dependencyPoints[0].split(',').map(function (item) {
          return parseInt(item);
        }),
            depEndPoint = dependencyPoints[dependencyPoints.length - 1].split(',').map(function (item) {
          return parseInt(item);
        }),
            depFromPoint = [depStartPoint[0] + svgBox.left, depStartPoint[1] + svgBox.top],
            depToPoint = [depEndPoint[0] + svgBox.left, depEndPoint[1] + svgBox.top];

        this.isApprox(depFromPoint[0], fromPoint[0], 1, "Dependency start point x is ok (".concat(from.name, ")"));
        this.isApprox(depFromPoint[1], fromPoint[1], 1, "Dependency start point y is ok (".concat(from.name, ")"));
        this.isApprox(depToPoint[0], toPoint[0], 1, "Dependency end point x is ok (".concat(to.name, ")"));
        this.isApprox(depToPoint[1], toPoint[1], 1, "Dependency end point y is ok (".concat(to.name, ")"));
      }
    }
  }
}); // Override so that when we run grid tests over here in Scheduler, we run them on an instance of Scheduler

var getScheduler = BryntumSchedulerTest.prototype.getScheduler; // eslint-disable-line no-undef

BryntumSchedulerTest.prototype.getGrid = function (cfg) {
  // eslint-disable-line no-undef
  if (!cfg.appendTo) {
    cfg.appendTo = this.scopeProvider.iframe.contentDocument.body;
  }

  return getScheduler.call(this, cfg);
};
