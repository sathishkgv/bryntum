Class('BryntumSchedulerTest', {
    // eslint-disable-next-line no-undef
    isa : BryntumGridTest, // Have to do `chmod a+r tests/lib/BryntumGridTest.js` after build (644 access rights)

    override : {
        setup : function(callback, errback) {
            const me = this;
            const global = this.global;

            // // allow test to specifiy required classes as requires: []
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
                for (let className in global.bryntum.scheduler) {
                    if (!global[className]) global[className] = global.bryntum.scheduler[className];
                }
            }

            me.SUPER(callback, errback);
        },

        mimicFocusOnMouseDown : function(el, mouseDownEvent) {
            // Allow mousedown on label to run its course
            if (el.tagName !== 'LABEL') {
                this.SUPER(el, mouseDownEvent);
            }
        }
    },

    methods : {
        getTimeAxis : function(TimeAxis, PresetManager, presetName, cfg) {
            const Date = this.global.Date;

            return new TimeAxis(this.global.Object.assign({
                startDate    : new Date(2010, 1, 1),
                endDate      : new Date(2010, 1, 11),
                weekStartDay : 1,
                viewPreset   : presetName
            }, cfg));
        },

        getAssignmentStore : function(config, nbrAssignments = 5) {
            const AssignmentStore = this.global.AssignmentStore;

            return new AssignmentStore(this.global.Object.assign({

                data : (function() {
                    const records = [];
                    for (let i = 1; i <= nbrAssignments; i++) {
                        records.push({
                            id         : 'a' + i,
                            eventId    : i,
                            resourceId : 'r' + i
                        });
                    }

                    return records;
                })()
            }, config || {}));
        },

        getEventStore : function(config, nbrEvents = 5) {
            const Date       = this.global.Date,
                  EventStore = this.global.EventStore;

            return new EventStore(this.global.Object.assign({

                data : (function() {
                    const events = [];
                    for (let i = 1; i <= nbrEvents; i++) {
                        events.push({
                            id         : i,
                            cls        : 'event' + i,
                            resourceId : 'r' + i,
                            name       : 'Assignment ' + i,
                            startDate  : new Date(2011, 0, 3 + i),
                            endDate    : new Date(2011, 0, 5 + i)
                        });
                    }

                    return events;
                })()
            }, config || {}));
        },

        getResourceStore : function(config) {
            const ResourceStore = this.global.ResourceStore;

            config = config || {};

            return new ResourceStore(this.global.Object.assign({
                data : [
                    { id : 'r1', name : 'Mike' },
                    { id : 'r2', name : 'Linda' },
                    { id : 'r3', name : 'Don' },
                    { id : 'r4', name : 'Karen' },
                    { id : 'r5', name : 'Doug' },
                    { id : 'r6', name : 'Peter' }
                ]
            }, config));
        },

        getResourceStore2 : function(config, nbrResources) {
            const ResourceStore = this.global.ResourceStore;

            return new ResourceStore(this.global.Object.assign({
                data : (function() {
                    let resources = [];
                    for (let i = 1; i <= nbrResources; i++) {
                        resources.push({
                            id   : 'r' + i,
                            name : 'Resource ' + i
                        });
                    }

                    return resources;
                })()
            }, config));
        },

        getResourceTreeStore : function(config) {
            const ResourceStore = this.global.ResourceStore;

            config = config || {};

            return new ResourceStore(this.global.Object.assign({
                tree : true,
                data : [
                    {
                        id : 'r1',

                        name     : 'Kastrup Airport',
                        expanded : true,

                        children : [
                            {
                                id       : 'r2',
                                name     : 'Terminal A',
                                expanded : false,

                                children : [
                                    {
                                        id       : 'r3',
                                        name     : 'Gates 1 - 5',
                                        expanded : true,

                                        children : [
                                            {
                                                id   : 'r4',
                                                name : 'Gate 1'
                                            },
                                            {
                                                id   : 'r5',
                                                name : 'Gate 2'
                                            },
                                            {
                                                id   : 'r6',
                                                name : 'Gate 3'
                                            },
                                            {
                                                id   : 'r7',
                                                name : 'Gate 4'
                                            },
                                            {
                                                id   : 'r8',
                                                name : 'Gate 5'
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                id   : 'r42222',
                                name : 'Gate 1214312421'
                            }
                        ]
                    }
                    // eof Kastrup
                ]

                // eof data

            }, config));
        },

        getDependencyStore : function(config, nbrEvents) {
            const DependencyStore = this.global.DependencyStore;

            if (nbrEvents === undefined) nbrEvents = 5;

            return new DependencyStore(this.global.Object.assign({

                data : (function() {
                    const dependencies = [];
                    for (let i = 1; i <= nbrEvents - 1; i++) {
                        dependencies.push({
                            id   : i,
                            from : i,
                            to   : i + 1
                        });
                    }
                    return dependencies;
                })()

            }, config || {}));
        },

        getScheduler : function(config, nbrEvents) {
            const Date          = this.global.Date,
                  Scheduler     = this.global.Scheduler,
                  PresetManager = this.global.PresetManager;

            config = config || {};

            if (!config.features) {
                config.features = {
                    eventEdit        : false, // some tests not written to have event editor or context menu
                    eventContextMenu : false,
                    contextMenu      : false
                };
            }

            PresetManager.registerDefaults();

            // Secret flag to easily get a scheduler tree
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

                viewPreset : 'dayAndWeek',

                //width  : 800,
                //height : 400,

                //viewConfig : {
                //    barMargin       : 2,
                //    cellBorderWidth : 0
                //},
                rowHeight : 45,

                // eventRenderer : (item, r, tplData, row) => {
                //     const bgColor = ['lightgray', 'orange', 'lightblue'][row % 3];
                //
                //     tplData.style = "background-color:" + bgColor;
                //     tplData.cls["sch-custom-css-class"] = 1;
                //
                //     return item.get('Name');
                // },

                // Setup static columns
                columns : [
                    { text : 'Name', sortable : true, width : 100, field : 'name', locked : true }
                ],

                destroyStores : true,

                useInitialAnimation : false

            }, config));
        },

        isDeeplyUnordered : function(array, toMatch, desc) {
            const failDesc = 'isDeeplyUnordered check failed: ' + desc,
                  passDesc = 'isDeeplyUnordered check passed: ' + desc;

            if (!this.global.Array.isArray(array) || !this.global.Array.isArray(toMatch)) {
                return this.isDeeply.apply(this, arguments);
            }

            if (array.length !== toMatch.length) {
                this.fail(failDesc);
                return;
            }

            const joined = array.concat(toMatch),
                  set    = new this.global.Set(joined);

            if (set.size !== array.length) {
                this.fail(failDesc);
                return;
            }

            this.pass(passDesc);
        },

        snapShotListeners : function(observable, name) {
            this._observableData = this._observableData || {};
            this._observableData[name] = {};

            // if (!name) throw 'Must provide a name for the observable';

            Object.keys(observable.eventListeners).forEach(key => {
                this._observableData[name][key] = observable.eventListeners[key].slice();
            });
        },

        verifyListeners : function(observable, name, allowedObservers) {
            let needListeners = this._observableData[name],
                count         = 0;

            function logListener(listener) {
                const result = Object.assign({}, listener);
                result.thisObj = result.thisObj && result.thisObj.constructor.name || undefined;
                return result;
            }

            allowedObservers = allowedObservers || [];

            Object.keys(observable.eventListeners).forEach(key => {
                if (!needListeners[key]) {
                    observable.eventListeners[key].forEach(listener => {
                        if (!allowedObservers.includes(listener.thisObj)) {
                            count++;
                            this.is(logListener(listener), null, `Extra ${key} event listener found`);
                        }
                    });
                }
                else {
                    observable.eventListeners[key].forEach(listener => {
                        if (!needListeners[key].includes(listener) && !allowedObservers.includes(listener.thisObj)) {
                            count++;
                            this.is(logListener(listener), null, `Extra ${key} event listener found`);
                        }
                    });

                    needListeners[key].forEach(listener => {
                        if (observable.eventListeners[key].indexOf(listener) === -1) {
                            this.is(null, logListener(listener), `${key} event listener is missing`);
                        }
                    });
                }
            });

            this.is(count, 0, 'No extra listeners found');
        },

        getHeaderAndBodyScrollValues : function(scheduler) {
            const bodyScroll   = scheduler.timeAxisSubGrid.scrollable.x,
                  headerScroll = scheduler.timeAxisSubGrid.header.scrollable.x;

            return {
                header : headerScroll,
                body   : bodyScroll
            };
        },

        waitForHeaderAndBodyScrollSynced : function(scheduler, next) {
            this.waitFor(() => {
                const values = this.getHeaderAndBodyScrollValues(scheduler);

                return values.header === values.body;
            }, next);
        },

        waitForAnimations : function(callback) {
            const me = this;

            me.SUPER(function() {
                me.waitForSelectorNotFound('.b-animating', function() {
                    callback();
                });
            });
        },

        assertHeaderAndBodyAreScrollSynced : function(scheduler) {
            const values = this.getHeaderAndBodyScrollValues(scheduler);

            this.is(values.header, values.body, 'Header and body scroll is synced');
        },

        assertDependency : function(scheduler, dependency, { fromSide, toSide, fromBox, toBox } = {}) {
            function getPointFromBox(record, side, box) {
                let point,
                    adjustLeft  = 0,
                    adjustRight = 0,
                    adjustTop   = 0,
                    [el] = scheduler.getElementsFromEventRecord(record),
                    // taken from SchedulerRegions#adjustItemBox
                    viewStartDate = scheduler.startDate,
                    viewEndDate   = scheduler.endDate,
                    OUTSIDE_VIEW_OFFSET = 40;

                if (box) {
                    if (record.startDate > viewEndDate) {
                        box.left = box.left + OUTSIDE_VIEW_OFFSET;
                    }
                    else if (record.endDate < viewStartDate) {
                        box.left = box.left - OUTSIDE_VIEW_OFFSET;
                    }
                    box.right = box.left + box.width;
                }
                else {
                    box = el.getBoundingClientRect();
                }

                if (record.milestone) {
                    if (!el.classList.contains('b-sch-event-withicon')) {
                        adjustLeft = -1 * (adjustRight = box.height / 2);
                    }
                    else {
                        box = el.querySelector('*').getBoundingClientRect();
                    }
                }

                switch (side) {
                    case 'top'    :
                        point = [box.left + box.width / 2, box.top];
                        break;
                    case 'bottom' :
                        point = [box.left + box.width / 2, box.bottom];
                        break;
                    case 'left'   :
                        point = [box.left + adjustLeft, box.top + box.height / 2 - adjustTop];
                        break;
                    case 'right'  :
                        point = [box.right + adjustRight, box.top + box.height / 2];
                        break;
                    case 'top-left' :
                        point = [box.left + adjustLeft, box.top];
                        break;
                }

                return point;
            }

            function getFromSide(dependency) {
                return dependency.fromSide || (dependency.type < 2 ? 'left' : 'right');
            }

            function getToSide(dependency) {
                let result;

                if (dependency.toSide) {
                    result = dependency.toSide;
                }
                else {
                    result = dependency.type % 2 ? 'right' : 'left';
                }

                return result;
            }

            let from     = dependency.sourceEvent,
                to       = dependency.targetEvent;

            if (from && to) {
                // Using '_features' instead of 'features' for IE11 compatibility
                let dependencyEl     = scheduler._features.dependencies.getElementForDependency(dependency),
                    fromPoint        = getPointFromBox(from, fromSide || getFromSide(dependency), fromBox),
                    toPoint          = getPointFromBox(to, toSide || getToSide(dependency), toBox),
                    svgBox           = dependencyEl.ownerSVGElement.getBoundingClientRect(),
                    dependencyPoints = dependencyEl.getAttribute('points').split(' '),
                    depStartPoint    = dependencyPoints[0].split(',').map(item => parseInt(item)),
                    depEndPoint      = dependencyPoints[dependencyPoints.length - 1].split(',').map(item => parseInt(item)),
                    depFromPoint     = [depStartPoint[0] + svgBox.left, depStartPoint[1] + svgBox.top],
                    depToPoint       = [depEndPoint[0] + svgBox.left, depEndPoint[1] + svgBox.top];

                this.isApprox(depFromPoint[0], fromPoint[0], 1, `Dependency start point x is ok (${from.name})`);
                this.isApprox(depFromPoint[1], fromPoint[1], 1, `Dependency start point y is ok (${from.name})`);

                this.isApprox(depToPoint[0], toPoint[0], 1, `Dependency end point x is ok (${to.name})`);
                this.isApprox(depToPoint[1], toPoint[1], 1, `Dependency end point y is ok (${to.name})`);
            }
        }
    }
});

// Override so that when we run grid tests over here in Scheduler, we run them on an instance of Scheduler
var getScheduler = BryntumSchedulerTest.prototype.getScheduler; // eslint-disable-line no-undef
BryntumSchedulerTest.prototype.getGrid = function(cfg) { // eslint-disable-line no-undef
    if (!cfg.appendTo) {
        cfg.appendTo = this.scopeProvider.iframe.contentDocument.body;
    }
    return getScheduler.call(this, cfg);
};
