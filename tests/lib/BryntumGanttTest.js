/* globals bowser */
Class('BryntumGanttTest', {

    // eslint-disable-next-line no-undef
    isa : BryntumSchedulerTest,

    does : [
        // eslint-disable-next-line no-undef
        BryntumGanttData
    ],

    override : {
        setup : function(callback, errback) {
            let me = this;

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
            if (this.global.bryntum && this.global.bryntum.gantt) {
                for (let className in this.global.bryntum.gantt) {
                    if (!this.global[className]) this.global[className] = this.global.bryntum.gantt[className];
                }

                this.global.WidgetHelper.adapter = this.global.BryntumWidgetAdapter;
            }

            me.SUPER(callback, errback);
        }
    },

    methods : {
        waitForPropagate : async function(partOfProject, next) {
            const async = this.beginAsync();

            partOfProject = partOfProject.project || partOfProject;

            await partOfProject.waitForPropagateCompleted();

            this.endAsync(async);

            next();
        },

        getProject(config = {}) {
            return new this.global.ProjectModel(Object.assign({
                startDate  : '2017-01-16',
                eventsData : [
                    {
                        'id'          : 1000,
                        'cls'         : 'id1000',
                        'startDate'   : '2017-01-16',
                        'endDate'     : '2017-02-13',
                        'name'        : 'Project A',
                        'percentDone' : 43,
                        'expanded'    : true,
                        'children'    : [
                            {
                                'id'          : 1,
                                'cls'         : 'id1',
                                'name'        : 'Planning',
                                'percentDone' : 60,
                                'startDate'   : '2017-01-16',
                                'duration'    : 10,
                                'expanded'    : true,
                                'rollup'      : true,
                                'children'    : [
                                    {
                                        'id'             : 11,
                                        'cls'            : 'id11',
                                        'name'           : 'Investigate',
                                        'percentDone'    : 70,
                                        'startDate'      : '2017-01-16',
                                        'duration'       : 10,
                                        'schedulingMode' : 'FixedDuration'
                                    },
                                    {
                                        'id'             : 12,
                                        'cls'            : 'id12',
                                        'name'           : 'Assign resources',
                                        'percentDone'    : 60,
                                        'startDate'      : '2017-01-16',
                                        'duration'       : 8,
                                        'schedulingMode' : 'FixedUnits'
                                    },
                                    {
                                        'id'             : 13,
                                        'cls'            : 'id13',
                                        'name'           : 'Gather documents',
                                        'percentDone'    : 50,
                                        'startDate'      : '2017-01-16',
                                        'duration'       : 8,
                                        'schedulingMode' : 'FixedEffort'
                                    },
                                    {
                                        'id'          : 14,
                                        'cls'         : 'id14',
                                        'name'        : 'Report to management',
                                        'percentDone' : 0,
                                        'startDate'   : '2017-01-28',
                                        'duration'    : 0
                                    }
                                ]
                            },
                            {
                                'id'          : 2,
                                'cls'         : 'id2',
                                'name'        : 'Implementation Phase',
                                'percentDone' : 20,
                                'startDate'   : '2017-01-30',
                                'duration'    : 10,
                                'expanded'    : true,
                                'rollup'      : true,
                                'children'    : [
                                    {
                                        'id'          : 21,
                                        'cls'         : 'id21',
                                        'name'        : 'Preparation work',
                                        'percentDone' : 40,
                                        'startDate'   : '2017-01-30',
                                        'duration'    : 5
                                    },
                                    {
                                        'id'          : 22,
                                        'cls'         : 'id22',
                                        'leaf'        : true,
                                        'name'        : 'Choose technology suite',
                                        'percentDone' : 30,
                                        'startDate'   : '2017-01-30',
                                        'duration'    : 4,
                                        'rollup'      : true
                                    },
                                    {
                                        'id'          : 23,
                                        'cls'         : 'id23',
                                        'name'        : 'Build prototype',
                                        'percentDone' : 9,
                                        'startDate'   : '2017-02-06',
                                        'duration'    : 5,
                                        'expanded'    : true,
                                        'children'    : [
                                            {
                                                'id'          : 231,
                                                'cls'         : 'id231',
                                                'name'        : 'Step 1',
                                                'percentDone' : 20,
                                                'startDate'   : '2017-02-06',
                                                'duration'    : 4
                                            },
                                            {
                                                'id'          : 232,
                                                'cls'         : 'id232',
                                                'name'        : 'Step 2',
                                                'percentDone' : 10,
                                                'startDate'   : '2017-02-06',
                                                'duration'    : 4
                                            },
                                            {
                                                'id'          : 233,
                                                'cls'         : 'id233',
                                                'name'        : 'Step 3',
                                                'percentDone' : 0,
                                                'startDate'   : '2017-02-06',
                                                'duration'    : 4
                                            },
                                            {
                                                'id'          : 234,
                                                'cls'         : 'id234',
                                                'name'        : 'Follow up with customer',
                                                'percentDone' : 0,
                                                'startDate'   : '2017-02-10',
                                                'duration'    : 1,
                                                'rollup'      : true
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                'id'          : 3,
                                'cls'         : 'id3',
                                'name'        : 'Customer approval',
                                'percentDone' : 0,
                                'startDate'   : '2017-02-13',
                                'duration'    : 0,
                                'rollup'      : true
                            }
                        ]
                    }
                ],

                dependenciesData : [
                    {
                        'id'        : 1,
                        'fromEvent' : 11,
                        'toEvent'   : 14
                    },
                    {
                        'id'        : 2,
                        'fromEvent' : 12,
                        'toEvent'   : 14
                    },
                    {
                        'id'        : 3,
                        'fromEvent' : 13,
                        'toEvent'   : 14
                    },
                    {
                        'id'        : 4,
                        'fromEvent' : 14,
                        'toEvent'   : 21
                    },
                    {
                        'id'        : 10,
                        'fromEvent' : 234,
                        'toEvent'   : 3
                    },
                    {
                        'id'        : 12,
                        'fromEvent' : 14,
                        'toEvent'   : 22
                    },
                    {
                        'id'        : 13,
                        'fromEvent' : 22,
                        'toEvent'   : 231
                    },
                    {
                        'id'        : 14,
                        'fromEvent' : 22,
                        'toEvent'   : 232
                    },
                    {
                        'id'        : 15,
                        'fromEvent' : 22,
                        'toEvent'   : 233
                    },
                    {
                        'id'        : 16,
                        'fromEvent' : 233,
                        'toEvent'   : 234
                    }
                ],

                calendarsData : [
                    {
                        id        : 'general',
                        name      : 'General',
                        intervals : [
                            {
                                recurrentStartDate : 'on Sat at 0:00',
                                recurrentEndDate   : 'on Mon at 0:00',
                                isWorking          : false
                            }
                        ],
                        expanded : true,
                        children : [
                            {
                                id                  : 'business',
                                name                : 'Business',
                                defaultAvailability : ['08:00-12:00', '13:00-17:00'],
                                hoursPerDay         : 8,
                                daysPerWeek         : 5,
                                daysPerMonth        : 20,
                                intervals           : [
                                    {
                                        recurrentStartDate : 'every weekday at 0:00',
                                        recurrentEndDate   : 'every weekday at 8:00',
                                        isWorking          : false
                                    },
                                    {
                                        recurrentStartDate : 'every weekday at 12:00',
                                        recurrentEndDate   : 'every weekday at 13:00',
                                        isWorking          : false
                                    },
                                    {
                                        recurrentStartDate : 'every weekday at 17:00',
                                        recurrentEndDate   : 'every weekday at 00:00',
                                        isWorking          : false
                                    }
                                ]
                            },
                            {
                                id                  : 'night',
                                name                : 'Night shift',
                                defaultAvailability : ['00:00-06:00', '22:00-24:00'],
                                hoursPerDay         : 8,
                                daysPerWeek         : 5,
                                daysPerMonth        : 20,
                                intervals           : [
                                    {
                                        recurrentStartDate : 'every weekday at 6:00',
                                        recurrentEndDate   : 'every weekday at 22:00',
                                        isWorking          : false
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }, config));
        },

        getTaskStore(config = {}, doNotLoad) {
            const taskStore = new this.global.TaskStore(Object.assign({
                cascadeChanges : true,
                cascadeDelay   : 0,

                autoSync : false,
                autoLoad : false
            }, config || {}));

            if (!doNotLoad) {
                taskStore.data = config.DATA || [
                    {
                        'children' : [
                            {
                                'id'           : 117,
                                'startDate'    : '2010-02-03T00:00:00',
                                'percentDone'  : 0,
                                'name'         : 'New task 1',
                                'duration'     : 6,
                                'durationUnit' : 'd'
                            },
                            {
                                'id'           : 118,
                                'startDate'    : '2010-02-03T00:00:00',
                                'percentDone'  : 0,
                                'name'         : 'New task 2',
                                'duration'     : 6,
                                'durationUnit' : 'd'
                            }
                        ],
                        'expanded'     : true,
                        'id'           : 114,
                        'startDate'    : '2010-02-03T00:00:00',
                        'percentDone'  : 0,
                        'name'         : 'New task 3',
                        'duration'     : 6,
                        'durationUnit' : 'd'
                    },
                    {
                        'id'           : 115,
                        'startDate'    : '2010-02-11T00:00:00',
                        'percentDone'  : 0,
                        'name'         : 'New task 4',
                        'duration'     : 5,
                        'durationUnit' : 'd'
                    },
                    {
                        'id'           : 116,
                        'startDate'    : '2010-02-18T00:00:00',
                        'percentDone'  : 0,
                        'name'         : 'New task 5',
                        'duration'     : 5,
                        'durationUnit' : 'd'
                    },
                    {
                        'children' : [
                            {
                                'id'           : 121,
                                'startDate'    : '2010-02-03T00:00:00',
                                'percentDone'  : 0,
                                'name'         : 'New task 6',
                                'duration'     : 6,
                                'durationUnit' : 'd'
                            }
                        ],
                        'expanded'     : true,
                        'id'           : 119,
                        'startDate'    : '2010-02-03T00:00:00',
                        'percentDone'  : 0,
                        'name'         : 'New task 7',
                        'duration'     : 6,
                        'durationUnit' : 'd'
                    },
                    {
                        'children'     : null,
                        'expanded'     : false,
                        'id'           : 120,
                        'startDate'    : '2010-02-11T00:00:00',
                        'percentDone'  : 0,
                        'name'         : 'New task 8',
                        'duration'     : 7,
                        'durationUnit' : 'd'
                    }
                ];
            }

            return taskStore;
        },

        getGantt(config = {}) {
            const Date = this.global.Date,
                Gantt  = this.global.Gantt;

            config = config || {};

            //PresetManager.registerDefaults();

            if (!('startDate' in config)) {
                config.startDate = new Date(2017, 0, 16);
                config.endDate = new Date(2017, 1, 13);
            }

            let projectConfig = {},
                project       = config.project && config.project.construct ? config.project : null;

            // no project instance is provided
            if (!project) {
                // no project config
                if (!config.project) {
                    if (config.tasks) {
                        projectConfig.eventsData  = config.tasks;
                        delete config.tasks;
                    }

                    if (config.resources) {
                        projectConfig.resourcesData  = config.resources;
                        delete config.resources;
                    }

                    if (config.dependencies) {
                        projectConfig.dependenciesData  = config.dependencies;
                        delete config.dependencies;
                    }

                    if (config.assignments) {
                        projectConfig.assignmentsData  = config.assignments;
                        delete config.assignments;
                    }
                }
                // project config is given
                else {
                    projectConfig = config.project;
                    delete config.project;
                }

                project = this.getProject(projectConfig);
            }

            return new Gantt(this.global.Object.assign({
                columns       : [{ type : 'name' }],
                destroyStores : true,
                project
            }, config));
        },

        forceTestVisible : function() {
            // select test to get it visible
            var grid = window.top.Ext.first('testgrid');

            grid.getSelectionModel().select(grid.store.getById(this.url));
        },

        verifyCachedDependenciesState : function(taskStore, dependencyStore) {
            dependencyStore = dependencyStore || taskStore.dependencyStore;

            var me          = this;
            var tasksCopies = {};

            // Iterate over all the existing dependencies and collect successors/predecessors arrays for all of them
            dependencyStore.forEach(function(dependency) {
                var from = dependency.fromEvent,
                    to   = dependency.toEvent;

                if (from && to) {
                    var fromId   = from.id;
                    var fromCopy = tasksCopies[fromId] = tasksCopies[fromId] || { outgoingDeps : new Set(), incomingDeps : new Set() };

                    fromCopy.outgoingDeps.add(dependency);

                    var toId   = to.id;
                    var toCopy = tasksCopies[toId] = tasksCopies[toId] || { outgoingDeps : new Set(), incomingDeps : new Set() };

                    toCopy.incomingDeps.add(dependency);
                }
            });

            var stateIsCorrect = true;

            taskStore.forEach(function(task) {
                var taskCopy = tasksCopies[task.id];

                // if the task is not met among the dependency store records
                if (!taskCopy) {
                    if (task.outgoingDeps.length || task.incomingDeps.length) {
                        me.fail('Missing dependencies for task: ', {
                            annotation : 'Task id : ' + task.id
                        });

                        return stateIsCorrect = false;
                    }
                }
                else {
                    // if set of successors found in dependency store doesn't match the task "successors" property
                    if (
                        !me.compareObjects(taskCopy.outgoingDeps, task.outgoingDeps)
                    ) {
                        me.fail('Successors of copy and real task does not match', {
                            got  : task.outgoingDeps,
                            need : taskCopy.outgoingDeps,

                            annotation : 'Task id : ' + task.id
                        });

                        return stateIsCorrect = false;
                    }

                    // if set of predecessors found in dependency store doesn't match the task "predecessors" property
                    if (
                        !me.compareObjects(taskCopy.incomingDeps, task.incomingDeps)
                    ) {
                        me.fail('Predecessors of copy and real task does not match', {
                            got  : task.incomingDeps,
                            need : taskCopy.incomingDeps,

                            annotation : 'Task id : ' + task.id
                        });

                        return stateIsCorrect = false;
                    }
                }

                return true;
            });

            if (stateIsCorrect) this.pass('Dependencies cache state is correct');
        },

        assertDependency : function(gantt, dependency, { fromSide, toSide } = {}) {
            const arrowMargin = gantt.features.dependencies.pathFinder.startArrowMargin;

            function getPointFromBox(record, side) {
                let point,
                    adjustLeft  = 0,
                    adjustRight = 0,
                    adjustTop   = 0,
                    el          = gantt.getElementFromTaskRecord(record),
                    width       = 0,
                    box, rowBox, start;

                if (el) {
                    box = el.getBoundingClientRect();
                }
                else if ((el = gantt.getRowFor(record).elements.normal)) {
                    rowBox = el.getBoundingClientRect();

                    if (record.endDate <= gantt.startDate) {
                        start = rowBox.left + (record.milestone ? -arrowMargin : 0);
                    }
                    else {
                        start = rowBox.right - 1 + (record.milestone ? arrowMargin : 0);
                    }

                    box = {
                        left   : start,
                        right  : start + width,
                        top    : rowBox.top + gantt.barMargin,
                        height : rowBox.height - gantt.barMargin * 2,
                        width
                    };
                }

                if (record.milestone) {
                    if (!el.classList.contains('b-sch-event-withicon')) {
                        adjustLeft = -1 * (adjustRight = box.height / 2);
                    }
                    else {
                        box = el.querySelector('*').getBoundingClientRect();
                    }
                }
                // In gantt there is an adjustment for normal endtostart dependencies
                else if (side === 'top-left') {
                    adjustLeft = arrowMargin;
                    adjustTop = box.height / 2;
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
                    let from = dependency.fromEvent,
                        fromTime = from.endDate.getTime(),
                        fromIndex = gantt.taskStore.indexOf(from),
                        to = dependency.toEvent,
                        toTime = to.startDate.getTime(),
                        toIndex = gantt.taskStore.indexOf(to);

                    if (dependency.type === 2) {
                        if (to.milestone && fromTime < toTime) {
                            result = 'top';
                        }
                        else if (!to.milestone && !from.milestone && fromTime <= toTime && toIndex > fromIndex) {
                            result = 'top-left';
                        }
                        else if (!to.milestone && from.milestone && fromTime < toTime && toIndex > fromIndex) {
                            result = 'top-left';
                        }
                    }
                }

                return result;
            }

            let from         = dependency.sourceEvent,
                to           = dependency.targetEvent;

            if (from && to) {
                let dependencyEl = gantt.features.dependencies.getElementForDependency(dependency),
                    fromPoint    = getPointFromBox(from, fromSide || getFromSide(dependency)),
                    toPoint      = getPointFromBox(to, toSide || getToSide(dependency));

                let svgBox           = dependencyEl.ownerSVGElement.getBoundingClientRect(),
                    dependencyPoints = dependencyEl.getAttribute('points').split(' '),
                    depStartPoint    = dependencyPoints[dependencyPoints.length - 1].split(',').map(item => parseInt(item)),
                    depEndPoint      = dependencyPoints[0].split(',').map(item => parseInt(item)),
                    depFromPoint     = [depStartPoint[0] + svgBox.left, depStartPoint[1] + svgBox.top],
                    depToPoint       = [depEndPoint[0] + svgBox.left, depEndPoint[1] + svgBox.top],
                    // Edge gives very precise values with may differ by 1.000003, trying with slightly bigger threshold
                    threshold        = bowser.msedge ? 2.2 : 1.5;

                this.isApprox(depFromPoint[0], fromPoint[0], threshold, `Dependency start point x is ok (${from.name})`);
                this.isApprox(depFromPoint[1], fromPoint[1], threshold, `Dependency start point y is ok (${from.name})`);

                this.isApprox(depToPoint[0], toPoint[0], threshold, `Dependency end point x is ok (${to.name})`);
                this.isApprox(depToPoint[1], toPoint[1], threshold, `Dependency end point y is ok (${to.name})`);
            }
        },

        assertHorizontalBreakOnRowBorder : function(gantt, dependencyId, taskId, expectedPoints = 6) {
            const
                dependency = gantt.dependencyStore.getById(dependencyId),
                depElement = gantt.getElementForDependency(dependency),
                path       = depElement.getAttribute('points'),
                rowBox     = gantt.getRecordCoords(taskId, true),
                rowBottom  = rowBox.y + rowBox.height;

            if (expectedPoints >= 4) {
                let [point1, point2] = path.split(' ').slice(expectedPoints / 2 - 1, expectedPoints / 2 + 1);

                this.ok(
                    (rowBottom === point1.split(',')[1] - 0) && (rowBottom === point2.split(',')[1] - 0),
                    `Dependency ${dependency.id} is aligned with row boundary`
                );
            }

            this.is(path.split(' ').length, expectedPoints, `Points amount is correct for dependency ${dependency.id}`);
        }
    }
});
