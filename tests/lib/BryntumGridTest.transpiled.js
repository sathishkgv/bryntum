"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Class('BryntumGridTest', {
  isa: Siesta.Test.Browser,
  override: {
    earlySetup: function earlySetup(callback, errback) {
      // Reset theme and language for demo tests
      if (this.url.indexOf('/examples') > -1) {
        localStorage.removeItem('exampleLanguage');
        localStorage.removeItem('bryntumExampleTheme');
      }

      this.SUPER(callback, errback);
    },
    setup: function setup(callback, errback) {
      // // allow test to specify required classes as requires: []
      // // test wont start until all classes are loaded
      // let config   = this.harness.getScriptDescriptor(this),
      //     requires = config.requires || config.testConfig && config.testConfig.requires;
      // if (requires) {
      //     new Loader().load(requires, '../lib/', true, this.global.document, true, callback);
      // } else {
      //     callback();
      // }
      // running with bundle, but tests are written for import. need to publish all classes to global
      if (this.global.bryntum && this.global.bryntum.grid) {
        // If there's no UI, disable creation of debugging data by Base constructor
        if (!window.Ext) {
          this.global.bryntum.DISABLE_DEBUG = true;
        }

        for (var className in this.global.bryntum.grid) {
          if (!this.global[className]) this.global[className] = this.global.bryntum.grid[className];
        }
      }

      var me = this,
          allowedMessageRe = /promise rejection/,
          harness = me.harness;

      if (!harness.getDescriptorConfig(harness.getScriptDescriptor(me), 'usesConsole')) {
        // Allow no noise in the console
        me.global.console.error = me.global.console.warn = me.global.console.log = me.global.console.info = function (msg) {
          if (!allowedMessageRe.exec(msg)) {
            // eslint-disable-next-line no-useless-call
            me.fail(['console output: '].concat([].slice.apply(arguments)).join(''));
          }

          console.log(msg);
        };
      }

      if (!me.parent && me.harness.getScriptDescriptor(me).recordVideo && me.global.location.host === 'local') {
        me.startVideoRecording(callback);
      } else {
        me.SUPER(callback, errback);
      }

      if (me.global && me.global.DOMRect) {
        Object.defineProperty(me.global.DOMRect.prototype, 'x', {
          get: function get() {
            return me.fail('x property accessed from a DOMRect');
          }
        });
        Object.defineProperty(me.global.DOMRect.prototype, 'y', {
          get: function get() {
            return me.fail('y property accessed from a DOMRect');
          }
        });
      }
    },
    tearDown: function tearDown(callback) {
      if (this.isFailed() && this.rootCause) {
        var failedAssertions = this.getFailedAssertions();
        var failMsg = failedAssertions[0] && (failedAssertions[0].description || failedAssertions[0].annotation);
        var err = new Error(this.name + ': ' + (failMsg || ''));
        err.stack = ''; // disable grouping of tests by callstack

        this.rootCause.finalizeSiestaTestCallback = callback;
        this.rootCause.logException(err);
      } else {
        this.SUPERARG(arguments);
      }
    }
  },
  methods: {
    initialize: function initialize() {
      this.SUPERARG(arguments);
      this.on('beforetestfinalizeearly', this.performPostTestSanityChecks);
    },
    performPostTestSanityChecks: function performPostTestSanityChecks(evt, t) {
      if (!this.parent && !this.url.match(/docs\//)) {
        this.assertNoDomGarbage();
        this.assertNoResizeMonitors();
      }
    },
    isOnline: function isOnline() {
      return window.location.href.match(/bryntum\.com/i);
    },
    touchStart: function touchStart(element, identifier) {
      if (!identifier) {
        identifier = Math.round(Math.random() * 1000000);
      }

      var box = element.getBoundingClientRect(),
          x = box.left + box.width / 2,
          y = box.left + box.height / 2,
          touch = new Touch({
        target: element,
        identifier: identifier,
        pageX: x,
        pageY: y,
        screenX: x,
        screenY: y,
        clientX: x,
        clientY: y,
        radiusX: 1,
        radiusY: 1,
        rotationAngle: 0,
        force: 0.5
      }),
          touches = [touch],
          touchEvent = new TouchEvent('touchstart', {
        bubbles: true,
        cancelable: true,
        touches: touches,
        changedTouches: touches,
        targetTouches: touches
      });
      element.dispatchEvent(touchEvent);
      return touch;
    },
    touchEnd: function touchEnd(touch) {
      var touches = [touch],
          touchEvent = new TouchEvent('touchend', {
        bubbles: true,
        cancelable: true,
        touches: touches,
        changedTouches: touches,
        targetTouches: touches
      });
      touch.target.dispatchEvent(touchEvent);
    },
    getRemoteGrid: function getRemoteGrid(cfg) {
      var me = this,
          url = me.url + '/' + me.generation,
          generator = me.global.DataGenerator;
      generator && generator.reset();
      cfg = cfg || {};
      cfg.store = {
        fields: [{
          name: 'fullName',
          dataSource: 'name'
        }, {
          name: 'ageInYears',
          dataSource: 'age'
        }, {
          name: 'town',
          dataSource: 'city'
        }, {
          name: 'favouriteFood',
          dataSource: 'food'
        }, {
          name: 'favouriteColor',
          dataSource: 'color'
        }, {
          name: 'codingScore',
          dataSource: 'score'
        }, {
          name: 'codingRank',
          dataSource: 'rank'
        }, {
          name: 'codingPercent',
          dataSource: 'percent'
        }, {
          name: 'startDate',
          dataSource: 'start',
          type: 'date'
        }],
        readUrl: url,
        autoLoad: true
      };
      me.mockUrl(url, {
        synchronous: true,
        responseText: JSON.stringify(generator.generateData(cfg.count || 25))
      });

      if (!cfg.columns) {
        cfg.columns = [{
          text: 'Name',
          field: 'fullName',
          width: 150,
          editor: 'text',
          cellCls: 'name'
        }, {
          text: 'Age',
          field: 'ageInYears',
          width: 100,
          editor: 'number',
          cellCls: 'age',
          filterType: 'number'
        }, {
          text: 'City',
          field: 'town',
          flex: 2,
          editor: false,
          cellCls: 'city'
        }, {
          text: 'Food',
          field: 'favouriteFood',
          flex: 1,
          cellCls: 'food'
        }, {
          text: 'Color',
          field: 'favouriteColor',
          flex: 1,
          editor: {
            type: 'combo',
            items: generator ? generator.colors : []
          },
          cellCls: 'color'
        }, {
          // initially hidden column must not be navigated to by tests
          text: 'Start Date',
          type: 'date',
          field: 'startDate',
          hidden: true
        }];
      }

      if (cfg.extraColumns) {
        cfg.columns.push.apply(cfg.columns, cfg.extraColumns);
      }

      return me.getGrid(cfg);
    },
    getGrid: function getGrid(cfg) {
      if (!cfg) cfg = {};
      var generator = this.global.DataGenerator;
      generator && generator.reset();

      if (generator && !cfg.data && !cfg.store) {
        cfg.data = generator.generateData(cfg.count || 25, cfg.randomHeight);
      }

      if (generator && cfg.store && !cfg.store.data && !cfg.store.readUrl) {
        cfg.store.data = generator.generateData(cfg.count || 25, cfg.randomHeight);
      }

      if (!cfg.columns) {
        cfg.columns = [{
          text: 'Name',
          field: 'name',
          width: 150,
          editor: 'text',
          cellCls: 'name'
        }, {
          text: 'Age',
          field: 'age',
          width: 100,
          editor: 'number',
          cellCls: 'age'
        }, {
          text: 'City',
          field: 'city',
          flex: 2,
          editor: false,
          cellCls: 'city'
        }, {
          text: 'Food',
          field: 'food',
          flex: 1,
          cellCls: 'food'
        }, {
          text: 'Color',
          field: 'color',
          flex: 1,
          editor: {
            type: 'combo',
            items: generator ? generator.colors : []
          },
          cellCls: 'color'
        }];
      }

      if (cfg.rowNumber) {
        cfg.columns.unshift({
          type: 'rownumber'
        });
      }

      if (!cfg.appendTo) {
        cfg.appendTo = this.global.document.body;
      }

      var grid = new this.global.Grid(cfg);

      if (grid.isVisible && cfg.sanityCheck !== false) {
        this.checkGridSanity(grid);
      }

      return grid;
    },
    getTree: function getTree(cfg) {
      if (!cfg) cfg = {};
      cfg.features = cfg.features || {};
      cfg.features.tree = cfg.features.tree || true;

      if (!cfg.data && !cfg.store) {
        cfg.data = [{
          'id': 1000,
          'StartDate': '2018-01-16',
          'Name': 'Project A',
          'Description': 'Project A description',
          'PercentDone': 50,
          'Duration': 20,
          'expanded': true,
          'children': [{
            'id': 1,
            'Name': 'Planning',
            'PercentDone': 50,
            'StartDate': '2018-01-16',
            'Duration': 10,
            'expanded': true,
            'children': [{
              'id': 11,
              'leaf': true,
              'Name': 'Investigate',
              'PercentDone': 50,
              'StartDate': '2018-01-16',
              'Duration': 8
            }, {
              'id': 12,
              'leaf': true,
              'Name': 'Assign resources',
              'PercentDone': 50,
              'StartDate': '2018-01-16',
              'Duration': 10
            }, {
              'id': 13,
              'leaf': true,
              'Name': 'Gather documents',
              'PercentDone': 50,
              'StartDate': '2018-01-16',
              'Duration': 10
            }, {
              'id': 17,
              'leaf': true,
              'Name': 'Report to management',
              'PercentDone': 0,
              'StartDate': '2018-01-28',
              'Duration': 0
            }]
          }, {
            'id': 4,
            'Name': 'Implementation Phase',
            'PercentDone': 45,
            'StartDate': '2018-01-30',
            'Duration': 10,
            'expanded': true,
            'children': [{
              'id': 34,
              'leaf': true,
              'Name': 'Preparation work',
              'PercentDone': 30,
              'StartDate': '2018-01-30',
              'Duration': 5
            }, {
              'id': 16,
              'leaf': true,
              'Name': 'Choose technology suite',
              'PercentDone': 30,
              'StartDate': '2018-01-30',
              'Duration': 5
            }, {
              'id': 15,
              'Name': 'Build prototype',
              'PercentDone': 60,
              'StartDate': '2018-02-06',
              'Duration': 5,
              'expanded': false,
              'children': [{
                'id': 20,
                'leaf': true,
                'Name': 'Step 1',
                'PercentDone': 60,
                'StartDate': '2018-02-06',
                'Duration': 4
              }, {
                'id': 19,
                'leaf': true,
                'Name': 'Step 2',
                'PercentDone': 60,
                'StartDate': '2018-02-06',
                'Duration': 4
              }, {
                'id': 18,
                'leaf': true,
                'Name': 'Step 3',
                'PercentDone': 60,
                'StartDate': '2018-02-06',
                'Duration': 4
              }, {
                'id': 21,
                'leaf': true,
                'Name': 'Follow up with customer',
                'PercentDone': 60,
                'StartDate': '2018-02-10',
                'Duration': 1
              }]
            }]
          }, {
            'id': 5,
            'leaf': true,
            'Name': 'Customer approval',
            'PercentDone': 0,
            'StartDate': '2018-02-11',
            'Duration': 0
          }]
        }, {
          'id': 1001,
          'StartDate': '2018-01-23',
          'Name': 'Project B',
          'Description': 'Project B description goes here',
          'PercentDone': 35,
          'Duration': 25,
          'expanded': true,
          'children': [{
            'id': 10,
            'Name': 'Planning',
            'PercentDone': 50,
            'StartDate': '2018-01-23',
            'Duration': 10,
            'expanded': true,
            'children': [{
              'id': 110,
              'leaf': true,
              'Name': 'Investigate',
              'PercentDone': 50,
              'StartDate': '2018-01-23',
              'Duration': 5
            }, {
              'id': 120,
              'leaf': true,
              'Name': 'Assign resources',
              'PercentDone': 50,
              'StartDate': '2018-01-23',
              'Duration': 10
            }, {
              'id': 130,
              'leaf': true,
              'Name': 'Gather documents',
              'PercentDone': 50,
              'StartDate': '2018-01-23',
              'Duration': 10
            }, {
              'id': 170,
              'leaf': true,
              'Name': 'Report to management',
              'PercentDone': 0,
              'StartDate': '2018-02-04',
              'Duration': 0
            }]
          }, {
            'id': 40,
            'Name': 'Implementation Phase 1',
            'PercentDone': 40,
            'StartDate': '2018-02-06',
            'Duration': 6,
            'expanded': false,
            'children': [{
              'id': 340,
              'leaf': true,
              'Name': 'Preparation work',
              'PercentDone': 30,
              'StartDate': '2018-02-06',
              'Duration': 5
            }, {
              'id': 140,
              'leaf': true,
              'Name': 'Evaluate chipsets',
              'PercentDone': 30,
              'StartDate': '2018-02-06',
              'Duration': 5
            }, {
              'id': 160,
              'leaf': true,
              'Name': 'Choose technology suite',
              'PercentDone': 30,
              'StartDate': '2018-02-06',
              'Duration': 5
            }, {
              'id': 150,
              'Name': 'Build prototype',
              'PercentDone': 60,
              'StartDate': '2018-02-07',
              'Duration': 5,
              'expanded': true,
              'children': [{
                'id': 200,
                'leaf': true,
                'Name': 'Step 1',
                'PercentDone': 60,
                'StartDate': '2018-02-07',
                'Duration': 4
              }, {
                'id': 190,
                'leaf': true,
                'Name': 'Step 2',
                'PercentDone': 60,
                'StartDate': '2018-02-07',
                'Duration': 4
              }, {
                'id': 180,
                'leaf': true,
                'Name': 'Step 3',
                'PercentDone': 60,
                'StartDate': '2018-02-07',
                'Duration': 4
              }, {
                'id': 210,
                'leaf': true,
                'Name': 'Follow up with customer',
                'PercentDone': 60,
                'StartDate': '2018-02-13',
                'Duration': 1
              }]
            }]
          }, {
            'id': 50,
            'leaf': true,
            'Name': 'Customer approval',
            'PercentDone': 0,
            'StartDate': '2018-02-14',
            'Duration': 0
          }, {
            'id': 60,
            'Name': 'Implementation Phase 2',
            'PercentDone': 15,
            'StartDate': '2018-02-15',
            'Duration': 8,
            'expanded': false,
            'children': [{
              'id': 250,
              'leaf': true,
              'Name': 'Task 1',
              'PercentDone': 10,
              'StartDate': '2018-02-15',
              'Duration': 8
            }, {
              'id': 260,
              'leaf': true,
              'Name': 'Task 2',
              'PercentDone': 20,
              'StartDate': '2018-02-15',
              'Duration': 8
            }, {
              'id': 270,
              'leaf': true,
              'Name': 'Task 3',
              'PercentDone': 20,
              'StartDate': '2018-02-15',
              'Duration': 8
            }]
          }, {
            'id': 100,
            'leaf': true,
            'Name': 'Customer approval 2',
            'PercentDone': 0,
            'StartDate': '2018-02-25',
            'Duration': 0
          }]
        }];
      }

      if (!cfg.columns) {
        cfg.columns = [{
          text: 'Name',
          field: 'Name',
          width: 150,
          editor: 'text',
          cellCls: 'name',
          type: 'tree'
        }, {
          text: 'PercentDone',
          field: 'PercentDone',
          width: 100,
          editor: 'number',
          cellCls: 'age'
        }, {
          text: 'Date',
          field: 'StartDate',
          flex: 2,
          editor: false
        }];
      }

      if (!cfg.appendTo) {
        cfg.appendTo = this.global.document.body;
      }

      return new this.global.TreeGrid(cfg);
    },
    checkGridSanity: function checkGridSanity(grid) {
      var _this = this;

      var columns = grid.columns.leaves.filter(function (col) {
        return !col.hidden;
      }),
          shrinkwrapGroupColumns = grid.columns.allRecords.filter(function (c) {
        return c.children && !c.width && !c.flex && c.children.every(function (cc) {
          return cc.width;
        });
      }),
          columnCount = columns.length,
          rows = grid.rowManager.rows,
          rowCount = rows.length,
          headerEls = [],
          footerEls = [],
          i,
          j,
          row,
          cell;

      for (i = 0; i < columnCount; i++) {
        headerEls[i] = grid.getHeaderElement(columns[i].id);
        footerEls[i] = grid.fromCache(".b-grid-footer[data-column-id=".concat(columns[i].id, "]"));
      }

      var _loop = function _loop() {
        var headerEl = headerEls[i],
            footerEl = footerEls[i],
            column = columns[i],
            othersFlexed = grid.subGrids[column.region].columns.some(function (c) {
          return c !== column && !c.hidden && c.flex;
        }); // Allow width : '100px' as well as width : 100

        var w = column.width;

        if (w && w.endsWith && w.endsWith('px')) {
          w = parseInt(w);
        } // Check that columns configured with flex are obeying both in header and in any footer


        if (column.flex) {
          var domFlex = new RegExp("^".concat(column.flex, " 1 0(?:px|%)$"));

          if (!domFlex.test(headerEl.style.flex)) {
            _this.fail("Grid ".concat(grid.id, ", header[").concat(i, "] not flexed as configured"));
          }

          if (footerEl && !domFlex.test(footerEl.style.flex)) {
            _this.fail("Grid ".concat(grid.id, ", footer[").concat(i, "] not flexed as configured"));
          }
        } // Check that columns configured with a numeric width are obeying both in header and in any footer
        else if (typeof w === 'number') {
            // Last column in a grid which is configured fillLastColumn : true is special
            if (grid.fillLastColumn && column.isLastInSubGrid) {
              // If there is flex in siblings, then this column won't need to to fill
              // the grid, and it should attain its configured width
              if (othersFlexed) {
                if (headerEl.offsetWidth !== w) {
                  _this.fail("Grid ".concat(grid.id, ", header[").concat(i, "] does not match its configured width"));
                }

                if (footerEl && footerEl.offsetWidth !== w) {
                  _this.fail("Grid ".concat(grid.id, ", footer[").concat(i, "] does not match its configured width"));
                }
              } // If there's no flex in siblings, we must have a flex-grow style in order to satisfy the fillLastColumn
              else {
                  if (isNaN(headerEl.ownerDocument.defaultView.getComputedStyle(headerEl).getPropertyValue('flex-grow'))) {
                    _this.fail("Grid ".concat(grid.id, ", header[").concat(i, "] should be flex:1 "));
                  }

                  if (footerEl && isNaN(headerEl.ownerDocument.defaultView.getComputedStyle(footerEl).getPropertyValue('flex-grow'))) {
                    _this.fail("Grid ".concat(grid.id, ", footer[").concat(i, "] should be flex:1 "));
                  }
                }
            } else {
              if (headerEl.offsetWidth !== w) {
                _this.fail("Grid ".concat(grid.id, ", header[").concat(i, "] does not match its configured width"));
              }

              if (footerEl && footerEl.offsetWidth !== w) {
                _this.fail("Grid ".concat(grid.id, ", footer[").concat(i, "] does not match its configured width"));
              }
            }
          }
      };

      for (i = 0; i < columnCount; i++) {
        _loop();
      } // Check that group columns which have no flex and no width, who's children are all widthed
      // acquire the sum of the width of the children


      for (i = 0; i < shrinkwrapGroupColumns.length; i++) {
        var el = shrinkwrapGroupColumns[i].element,
            column = shrinkwrapGroupColumns[i],
            childTotalWidth = column.children.reduce(function (result, col) {
          return result += col.element.offsetWidth;
        }, 0);

        if (el.offsetWidth !== childTotalWidth) {
          this.fail("Grid ".concat(grid.id, ", group header[").concat(i, "] does not shrinkwrap its widthed children"));
        }
      }

      for (i = 0; i < rowCount; i++) {
        row = rows[i];

        for (j = 0; j < columnCount; j++) {
          cell = grid.getCell({
            id: row.id,
            columnId: columns[j].id
          });

          if (cell.offsetWidth !== headerEls[j].offsetWidth) {
            this.fail("Grid ".concat(grid.id, ", cell[").concat(i, "].offsetWidth (").concat(cell.offsetWidth, ") != header[").concat(columns[j].id, "].offsetWidth (").concat(headerEls[j].offsetWidth, "})"));
          }
        }
      }
    },
    addListenerToObservable: function addListenerToObservable(observable, event, listener, isSingle) {
      if ('on' in observable) {
        observable.on(event, listener);
      } else if ('addEventListener' in observable) {
        observable.addEventListener(event, listener);
      }
    },
    removeListenerFromObservable: function removeListenerFromObservable(observable, event, listener) {
      observable.un(event, listener);
    },
    getTimeZone: function getTimeZone() {
      var Date = this.global.Date,
          date = new Date();
      return date.toLocaleString().replace(/.*(GMT.*)/, '$1');
    },
    getDSTDates: function getDSTDates() {
      var year = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 2012;
      var Date = this.global.Date,
          yearStart = new Date(year, 0, 1),
          yearEnd = new Date(year, 11, 31),
          dstDates = [];

      for (var i = yearStart; i <= yearEnd; i = new Date(i.setDate(i.getDate() + 1))) {
        var midnightOffset = new Date(year, i.getMonth(), i.getDate()).getTimezoneOffset(),
            noonOffset = new Date(year, i.getMonth(), i.getDate(), 12).getTimezoneOffset();
        if (midnightOffset != noonOffset) dstDates.push(i);
      }

      return dstDates;
    },
    assertNoDomGarbage: function assertNoDomGarbage() {
      var body = this.global.document.body;
      var invalid = ['[id*="undefined"]', '[id*="null"]', '[class*="undefined"]', '[class*="null"]', '[class*="null"]'];
      this.contentNotLike(body, 'NaN', 'No "NaN" string found in DOM');
      this.contentNotLike(body, ' id=""', 'No empty id found in DOM');
      this.contentNotLike(body, /L{.*?}/, 'No non-localized string templates L{xx}'); // do not run this check in framework demos, or renderers demos since it test code editor which has a valid "undefined" in it

      if (!/angular|ionic|react|vue|renderers/.test(this.global.document.location.href)) {
        this.unlike(body.outerHTML, /object object|undefined/i, 'No "Object object" or undefined string found in DOM');

        if (this.global.monkeyActions && body.outerHTML.match(/object object|undefined/i)) {
          this.fail('Monkey steps:' + JSON.stringify(this.global.monkeyActions));
        }
      }

      if (this.$(invalid.join(','), body).length) {
        this.selectorNotExists(invalid, 'No DOM attribute garbage found in DOM');

        if (this.global.monkeyActions && body.querySelector(invalid)) {
          this.fail('Monkey steps:' + JSON.stringify(this.global.monkeyActions));
        }
      }
    },
    assertNoResizeMonitors: function assertNoResizeMonitors() {
      var _this2 = this;

      Array.from(document.querySelectorAll('*')).forEach(function (e) {
        if (e._bResizemonitor && e._bResizemonitor.handlers.length) {
          _this2.fail("".concat(e.tagName, "#e.id has ").concat(e._bResizemonitor.handlers.length, " resize monitors attached"));
        }
      });
    },
    waitForRowsVisible: function waitForRowsVisible(grid, next) {
      if (typeof grid === 'function') {
        next = grid;
        grid = null;
      }

      var root = grid && grid.element || this.global.document.body;
      this.waitFor(function () {
        return root.querySelector('.b-grid-cell');
      }, next);
    },
    waitForAnimationFrame: function waitForAnimationFrame(next) {
      var frameFired = false;
      this.waitFor(function () {
        return frameFired;
      }, next);
      requestAnimationFrame(function () {
        frameFired = true;
      });
    },

    /**
     * Registers the passed URL to return the passed mocked up XHR response object to the
     * AjaxHelper's promise resolve function.
     * @param {String} url The url to return mock data for
     * @param {Object} response A mocked up XHR response object which must contain
     * at least the `responseText` property.
     * @param {String} response.responseText The data to return.
     * @param {Boolean} [response.synchronous] resolve the Promise immediately
     * @param {Number} [response.delay] resolve the Promise after this number of milliseconds.
     */
    mockUrl: function mockUrl(url, response) {
      var me = this,
          AjaxHelper = me.global.AjaxHelper;

      if (!AjaxHelper) {
        throw new Error('AjaxHelper must be injected into the global namespace');
      }

      (me.mockAjaxMap || (me.mockAjaxMap = {}))[url] = response; // Inject the overrides into the AjaxHelper instance

      if (!AjaxHelper.originalGet) {
        // cannot use Reflect in IE11
        //Reflect.set(AjaxHelper, 'originalGet', AjaxHelper.get);
        //Reflect.set(AjaxHelper, 'get', Test.mockAjaxGet.bind(Test));
        AjaxHelper.originalGet = AjaxHelper.get;
        AjaxHelper.originalPost = AjaxHelper.post;
      }

      AjaxHelper.get = me.mockAjaxGet.bind(me);
      AjaxHelper.post = me.mockAjaxPost.bind(me);
    },
    mockAjaxGet: function mockAjaxGet(url, options) {
      var result = this.mockAjaxMap[url.split('?')[0]];
      var win = this.global;

      if (result) {
        var parsedJson;

        try {
          parsedJson = options.parseJson && JSON.parse(result.responseText);
        } catch (e) {}

        result = this.global.Object.assign({
          status: 200,
          ok: true,
          // Not supported in IE11
          headers: new win.Headers(),
          statusText: 'OK',
          url: url,
          parsedJson: parsedJson,
          text: function text() {
            return new Promise(function (resolve, reject) {
              resolve(result.responseText);
            });
          },
          json: function json() {
            return new Promise(function (resolve, reject) {
              var json;

              try {
                json = JSON.parse(result.responseText);
              } catch (e) {}

              if (json) {
                resolve(json);
              } else {
                reject();
              }
            });
          }
        }, result);
        return new win.Promise(function (resolve, reject) {
          if (result.synchronous) {
            resolve(result);
          } else {
            win.setTimeout(function () {
              resolve(result);
            }, 'delay' in result ? result.delay : 100);
          }
        });
      } else {
        return win.AjaxHelper.originalGet(url, options);
      }
    },
    mockAjaxPost: function mockAjaxPost(url, data, options) {
      var result = this.mockAjaxMap[url.split('?')[0]];
      var win = this.global;

      if (result) {
        var parsedJson;

        try {
          parsedJson = options.parseJson && JSON.parse(result.responseText);
        } catch (e) {}

        result = this.global.Object.assign({
          status: 200,
          ok: true,
          headers: new win.Headers(),
          statusText: 'OK',
          url: url,
          parsedJson: parsedJson,
          text: function text() {
            return new Promise(function (resolve) {
              resolve(result.responseText);
            });
          },
          json: function json() {
            return new Promise(function (resolve) {
              resolve(JSON.parse(result.responseText));
            });
          }
        }, result);
        return new win.Promise(function (resolve, reject) {
          if (result.synchronous) {
            resolve(result);
          } else {
            win.setTimeout(function () {
              resolve(result);
            }, 'delay' in result ? result.delay : 100);
          }
        });
      } else {
        return win.AjaxHelper.originalPost(url, data, options);
      }
    },
    getFirstRenderedRow: function getFirstRenderedRow(grid) {
      var root = grid && grid.element || this.global.document.body;
      var rows = root.querySelectorAll('.b-grid-row');
      var y = Number.MAX_VALUE;
      var row;
      [].forEach.call(rows, function (node) {
        var nodeY = node.getBoundingClientRect();

        if (nodeY.top < y) {
          y = nodeY.top;
          row = node;
        }
      });
      return row;
    },
    getLastRenderedRow: function getLastRenderedRow(grid) {
      var root = grid && grid.element || this.global.document.body;
      var rows = root.querySelectorAll('.b-grid-row');
      var y = -1;
      var row;
      [].forEach.call(rows, function (node) {
        var nodeY = node.getBoundingClientRect();

        if (nodeY.top > y) {
          y = nodeY.top;
          row = node;
        }
      });
      return row;
    },
    isRectApproxEqual: function isRectApproxEqual(rect1, rect2, threshold, descr) {
      for (var o in rect1) {
        this.isApprox(rect1[o], rect2[o], threshold, descr || '');
      }
    },
    startVideoRecording: function startVideoRecording(callback) {
      var me = this,
          appIds = {
        grid: '9ea6c8f84f179d4c4b7be11ff217bc29367357f8',
        scheduler: '3dcfabf52d4fa704fb95259a317c72a6ce376313',
        gantt: '9df03cbdc00b455de8bfe58d831e6fd76cc8881e'
      },
          productId = location.href.includes('gantt') ? 'gantt' : location.href.includes('scheduler') ? 'scheduler' : 'grid',
          document = me.global.document,
          script = document.createElement('script');
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.src = 'https://app.therootcause.io/rootcause-full.js';
      script.addEventListener('load', startRootCause);
      document.head.appendChild(script);

      function startRootCause() {
        me.rootCause = new me.global.RC.Logger({
          captureScreenshot: true,
          applicationId: appIds[productId],
          maxNbrLogs: 1,
          recordSessionVideo: true,
          videoBaseUrl: me.global.location.href.replace(/\/\/local/, '//dev.bryntum.com'),
          onErrorLogged: function onErrorLogged(responseText) {
            var data;

            try {
              data = JSON.parse(responseText);
            } catch (e) {}

            if (data && data.link) {
              me.fail('VIDEO: ' + data.link);
            }

            this.finalizeSiestaTestCallback && this.finalizeSiestaTestCallback();
          },
          onErrorLogFailed: function onErrorLogFailed() {
            this.finalizeSiestaTestCallback && this.finalizeSiestaTestCallback();
          }
        });
        callback.call(me);
      }
    },
    handlerThrowsOk: function handlerThrowsOk(fn) {
      var me = this,
          oldOnError = me.global.onerror,
          success = false,
          doneCalled = false,
          done = function done() {
        if (!doneCalled) {
          doneCalled = true;
          me.global.onerror = oldOnError;

          if (success) {
            me.pass('Expected error was thrown');
          } else {
            me.fail('Expected error was not thrown');
          }

          me.endAsync(async);
        }
      },
          async;

      me.global.onerror = function (ex) {
        success = true;
        done();
        return true;
      };

      async = me.beginAsync(); // We must return the destroy method first in case the
      // passed method is not in fact async.

      setTimeout(fn, 0);
      return done;
    },
    removeIframe: function removeIframe(iframeId) {
      var t = this;
      var _document = t.global.document;

      var iframe = _document.getElementById(iframeId);

      if (iframe) {
        iframe.parentElement.removeChild(iframe);
      } else {
        t.fail('Cannot find iframe with id ' + iframeId);
      }
    },
    setIframe: function setIframe(config) {
      config = config || {};

      var t = this,
          id = config.iframeId || config.id,
          onload = config.onload,
          html = config.html,
          async = config.async,
          _document = t.global.document,
          iframe = _document.body.appendChild(_document.createElement('iframe'));

      iframe.width = 900;
      iframe.height = 1600;

      if (id) {
        iframe.setAttribute('id', id);
      }

      var doc = iframe.contentWindow.document;

      if (onload) {
        async = async || t.beginAsync();

        iframe.onload = function () {
          t.endAsync(async);
          onload(doc, iframe);
        };
      }

      if (html) {
        doc.open();
        doc.write(html);
        doc.close();
      }

      return iframe;
    },
    forceTestVisible: function forceTestVisible() {
      // select test to get it visible
      var grid = window.top.Ext.first('testgrid');
      grid.getSelectionModel().select(grid.store.getById(this.url));
    },
    getSVGBox: function getSVGBox(svgElement) {
      var svgBox = svgElement.getBBox(),
          containerBox = svgElement.viewportElement.getBoundingClientRect();
      return {
        left: svgBox.x + containerBox.left,
        right: svgBox.x + containerBox.left + svgBox.width,
        top: svgBox.y + containerBox.top,
        bottom: svgBox.y + containerBox.top + svgBox.height
      };
    }
  }
}); // eslint-disable-next-line no-unused-vars

var BryntumTestHelper =
/*#__PURE__*/
function () {
  function BryntumTestHelper() {
    _classCallCheck(this, BryntumTestHelper);
  }

  _createClass(BryntumTestHelper, null, [{
    key: "prepareMonkeyTests",
    value: function prepareMonkeyTests(items) {
      var root = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var urls = [];
      return items.map(function (item) {
        if (item && item.skipMonkey !== true) {
          var pageUrl = typeof item === 'string' ? '../examples/' + item : item.pageUrl;

          if (pageUrl) {
            var id = pageUrl.replace(/\.+\//g, '').replace(/[?&./]/g, '-').replace('--', '-'),
                config = {};

            if (item instanceof Object) {
              for (var key in item) {
                if (item.hasOwnProperty(key)) {
                  config[key] = item[key];
                }
              }
            }

            config.pageUrl = pageUrl;
            config.keepPageUrl = true;
            config.url = "".concat(root, "examples/monkey.t.js?id=").concat(id); // Avoid duplicates

            if (urls.indexOf(config.url) === -1) {
              urls.push(config.url);
              return config;
            }
          }
        }
      });
    }
  }, {
    key: "prepareItem",
    value: function prepareItem(item, mode, isTrial) {
      // Update test url and pageUrl for mode
      if (mode !== 'es6') {
        if (item.url && !item.keepUrl) {
          item.url = item.url.replace('.t.js', ".t.".concat(mode, ".js"));
        }

        if (item.pageUrl && !item.keepPageUrl && !(mode === 'module' && isTrial)) {
          // keep querystring also for bundle (works with both url/?develop and url?develop)
          var qs = item.pageUrl.match(/(.*?)(\/*)([?#].*)/);

          if (qs) {
            item.pageUrl = "".concat(qs[1], "/index.").concat(mode, ".html").concat(qs[3]);
          } else {
            item.pageUrl += "/index.".concat(mode, ".html");
          }
        }
      }
    }
  }, {
    key: "normalizeItem",
    value: function normalizeItem(item, mode) {
      // Apply custom properties for mode or default
      if (item instanceof Object) {
        for (var key in item) {
          if (item.hasOwnProperty(key)) {
            var val = item[key];

            if (val && (val[mode] || val.default)) {
              item[key] = val[mode] ? val[mode] : val.default;
            }
          }
        }
      }
    }
  }, {
    key: "prepareItems",
    value: function prepareItems(items, mode, isTrial) {
      items && items.map(function (item, i) {
        if (item) {
          BryntumTestHelper.normalizeItem(item, mode); // Include for bundle and skip handling

          if (item.skip !== null && item.skip === true || item.includeFor && item.includeFor.replace(' ', '').split(',').indexOf(mode) === -1) {
            items[i] = null;
          } else {
            // Normalize URL
            if (typeof item === 'string') {
              item = items[i] = {
                url: item
              };
            } // Add full path in title to be visible in test tree


            if (item.url && !item.group && item.url.indexOf('monkey.t') === -1) {
              items[i].title = item.url || item.pageUrl;
            }

            BryntumTestHelper.prepareItem(items[i], mode, isTrial);
            BryntumTestHelper.prepareItems(item.items, mode, isTrial);
          }
        }
      });
      return items;
    }
  }]);

  return BryntumTestHelper;
}();
