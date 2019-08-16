import { Toolbar, Toast, DateHelper, IdHelper, CSSHelper, PercentDoneColumn, ColumnStore, ResourceAssignmentColumn, Column, TaskModel, Gantt, Panel, ProjectModel, EffectResolutionResult, WidgetHelper } from '../../build/gantt.module.js?433978';
import shared from '../_shared/shared.module.js?433978';

/**
 * @module GanttToolbar
 */

/**
 * @extends Common/widget/Toolbar
 */
class GanttToolbar extends Toolbar {

    construct(config) {
        const
            me      = this,
            gantt   = me.gantt = config.gantt,
            project = gantt.project;

        project.on({
            load                : me.updateStartDateField,
            propagationComplete : me.updateStartDateField,
            thisObj             : me
        });

        const stm = project.stm;

        stm.on({
            recordingstop : me.updateUndoRedoButtons,
            restoringstop : me.updateUndoRedoButtons,
            queueReset    : me.updateUndoRedoButtons,
            thisObj       : me
        });

        super.construct(config);

        // Since the code is shared between "advanced" and "php" demo
        // in "php" demo we make "Save" button visible
        // and track project changes to disable/enable the button
        if (project.transport.sync) {
            // track project changes to disable/enable "Save" button
            gantt.project.on({
                haschanges : me.onProjectChanges,
                nochanges  : me.onProjectChanges,
                thisObj    : me
            });

            // make button visible
            me.widgetMap.saveButton.show();
        }
    }

    static get defaultConfig() {
        return {
            // Only one tooltip instance using forSelector to show for every button
            // which has a tipText property
            tooltip : {
                forSelector : '.b-button',
                onBeforeShow() {
                    const activeButton = this.activeTarget && IdHelper.fromElement(this.activeTarget, 'button');

                    if (activeButton && activeButton.tipText) {
                        this.html = activeButton.tipText;
                    }
                    else {
                        return false;
                    }
                }
            },
            items : [
                {
                    type  : 'buttonGroup',
                    items : [
                        {
                            type     : 'button',
                            color    : 'b-green',
                            ref      : 'addTaskButton',
                            icon     : 'b-fa b-fa-plus',
                            text     : 'Create',
                            tipText  : 'Create new task',
                            onAction : 'up.onAddTaskClick'
                        }
                    ]
                },
                {
                    type  : 'buttonGroup',
                    items : [
                        {
                            type     : 'button',
                            color    : 'b-blue',
                            ref      : 'editTaskButton',
                            icon     : 'b-fa b-fa-pen',
                            text     : 'Edit',
                            tipText  : 'Edit selected task',
                            onAction : 'up.onEditTaskClick'
                        },
                        {
                            type     : 'button',
                            color    : 'b-blue',
                            ref      : 'undoBtn',
                            icon     : 'b-icon b-fa b-fa-undo',
                            tipText  : 'Undo',
                            disabled : true,
                            width    : '2em',
                            onAction : 'up.onUndoClick'
                        },
                        {
                            type     : 'button',
                            color    : 'b-blue',
                            ref      : 'redoBtn',
                            icon     : 'b-icon b-fa b-fa-redo',
                            tipText  : 'Redo',
                            disabled : true,
                            width    : '2em',
                            onAction : 'up.onRedoClick'
                        }
                    ]
                },
                {
                    type  : 'buttonGroup',
                    items : [
                        {
                            type     : 'button',
                            color    : 'b-blue',
                            ref      : 'expandAllButton',
                            icon     : 'b-fa b-fa-angle-double-down',
                            tipText  : 'Expand all',
                            onAction : 'up.onExpandAllClick'
                        },
                        {
                            type     : 'button',
                            color    : 'b-blue',
                            ref      : 'collapseAllButton',
                            icon     : 'b-fa b-fa-angle-double-up',
                            tipText  : 'Collapse all',
                            onAction : 'up.onCollapseAllClick'
                        }
                    ]
                },
                {
                    type  : 'buttonGroup',
                    items : [
                        {
                            type     : 'button',
                            color    : 'b-blue',
                            ref      : 'zoomInButton',
                            icon     : 'b-fa b-fa-search-plus',
                            tipText  : 'Zoom in',
                            onAction : 'up.onZoomInClick'
                        },
                        {
                            type     : 'button',
                            color    : 'b-blue',
                            ref      : 'zoomOutButton',
                            icon     : 'b-fa b-fa-search-minus',
                            tipText  : 'Zoom out',
                            onAction : 'up.onZoomOutClick'
                        },
                        {
                            type     : 'button',
                            color    : 'b-blue',
                            ref      : 'zoomToFitButton',
                            icon     : 'b-fa b-fa-compress-arrows-alt',
                            tipText  : 'Zoom to fit',
                            onAction : 'up.onZoomToFitClick'
                        },
                        {
                            type     : 'button',
                            color    : 'b-blue',
                            ref      : 'previousButton',
                            icon     : 'b-fa b-fa-angle-left',
                            tipText  : 'Previous time span',
                            onAction : 'up.onShiftPreviousClick'
                        },
                        {
                            type     : 'button',
                            color    : 'b-blue',
                            ref      : 'nextButton',
                            icon     : 'b-fa b-fa-angle-right',
                            tipText  : 'Next time span',
                            onAction : 'up.onShiftNextClick'
                        }
                    ]
                },
                {
                    type  : 'buttonGroup',
                    items : [
                        {
                            type       : 'button',
                            color      : 'b-blue',
                            ref        : 'featuresButton',
                            icon       : 'b-fa b-fa-tasks',
                            text       : 'Features',
                            tipText    : 'Toggle features',
                            toggleable : true,
                            menu       : {
                                onItem       : 'up.onFeaturesClick',
                                onBeforeShow : 'up.onFeaturesShow',
                                items        : [
                                    {
                                        text    : 'Draw dependencies',
                                        feature : 'dependencies',
                                        checked : false
                                    },
                                    {
                                        text    : 'Task labels',
                                        feature : 'labels',
                                        checked : false
                                    },
                                    {
                                        text    : 'Project lines',
                                        feature : 'projectLines',
                                        checked : false
                                    },
                                    {
                                        text    : 'Highlight non-working time',
                                        feature : 'nonWorkingTime',
                                        checked : false
                                    },
                                    {
                                        text    : 'Enable cell editing',
                                        feature : 'cellEdit',
                                        checked : false
                                    },
                                    {
                                        text    : 'Show baselines',
                                        feature : 'baselines',
                                        checked : false
                                    },
                                    {
                                        text    : 'Show progress line',
                                        feature : 'progressLine',
                                        checked : false
                                    },
                                    {
                                        text    : 'Hide schedule',
                                        cls     : 'b-separator',
                                        subGrid : 'normal',
                                        checked : false
                                    }
                                ]
                            }
                        },
                        {
                            type       : 'button',
                            color      : 'b-blue',
                            ref        : 'settingsButton',
                            icon       : 'b-fa b-fa-cogs',
                            text       : 'Settings',
                            tipText    : 'Adjust settings',
                            toggleable : true,
                            menu       : {
                                type        : 'popup',
                                anchor      : true,
                                layoutStyle : {
                                    flexDirection : 'column'
                                },
                                onBeforeShow : 'up.onSettingsShow',

                                items : [
                                    {
                                        type      : 'slider',
                                        ref       : 'rowHeight',
                                        text      : 'Row height',
                                        width     : '12em',
                                        showValue : true,
                                        min       : 30,
                                        max       : 70,
                                        style     : 'margin-bottom: .5em',
                                        onInput   : 'up.onSettingsRowHeightChange'
                                    },
                                    {
                                        type      : 'slider',
                                        ref       : 'barMargin',
                                        text      : 'Bar margin',
                                        width     : '12em',
                                        showValue : true,
                                        min       : 0,
                                        max       : 10,
                                        onInput   : 'up.onSettingsMarginChange'
                                    },
                                    {
                                        type      : 'slider',
                                        ref       : 'duration',
                                        text      : 'Animation duration ',
                                        width     : '12em',
                                        min       : 0,
                                        max       : 2000,
                                        step      : 100,
                                        showValue : true,
                                        onInput   : 'up.onSettingsDurationChange'
                                    }
                                ]
                            }
                        },
                        {
                            type       : 'button',
                            color      : 'b-blue',
                            ref        : 'criticalPathsButton',
                            icon       : 'b-fa b-fa-fire',
                            text       : 'Critical paths',
                            tipText    : 'Highlight critical paths',
                            toggleable : true,
                            onAction   : 'up.onCriticalPathsClick'
                        }
                    ]
                },
                {
                    type      : 'datefield',
                    ref       : 'startDateField',
                    label     : 'Project start',
                    required  : true,
                    width     : '17em',
                    listeners : {
                        change : 'up.onStartDateChange'
                    }
                },
                {
                    type                 : 'textfield',
                    ref                  : 'filterByName',
                    width                : '12.5em',
                    placeholder          : 'Find tasks by name',
                    clearable            : true,
                    keyStrokeChangeDelay : 100,
                    triggers             : {
                        filter : {
                            align : 'end',
                            cls   : 'b-fa b-fa-filter'
                        }
                    },
                    onChange : 'up.onFilterChange'
                },
                {
                    type     : 'button',
                    color    : 'b-green',
                    ref      : 'saveButton',
                    icon     : 'b-fa b-fa-save',
                    text     : 'Save',
                    tipText  : 'Save changes',
                    onAction : 'up.onSaveClick',
                    hidden   : true
                }
            ]
        };
    }

    updateUndoRedoButtons() {
        const gantt                = this.gantt,
            project              = gantt.project,
            stm                  = project.stm,
            { undoBtn, redoBtn } = this.widgetMap,
            redoCount            = stm.length - stm.position;

        undoBtn.badge = stm.position || '';
        redoBtn.badge = redoCount || '';

        undoBtn.disabled = !stm.canUndo;
        redoBtn.disabled = !stm.canRedo;
    }

    setAnimationDuration(value) {
        const
            me      = this,
            cssText = `.b-animating .b-gantt-task-wrap { transition-duration: ${value / 1000}s !important; }`;

        me.gantt.transitionDuration = value;

        if (me.transitionRule) {
            me.transitionRule.cssText = cssText;
        }
        else {
            me.transitionRule = CSSHelper.insertRule(cssText);
        }
    }

    updateStartDateField() {
        this.widgetMap.startDateField.value = this.gantt.project.startDate;
    }

    // region controller methods
    async onAddTaskClick() {
        const gantt = this.gantt,
            added = gantt.taskStore.rootNode.appendChild({ name : 'New task', duration : 1 });

        // run propagation to calculate new task fields
        await gantt.project.propagate();

        // scroll to the added task
        await gantt.scrollRowIntoView(added);

        gantt.features.cellEdit.startEditing({
            record : added,
            field  : 'name'
        });
    }

    onEditTaskClick() {
        const gantt = this.gantt;

        if (gantt.selectedRecord) {
            gantt.editTask(gantt.selectedRecord);
        }
        else {
            Toast.show('First select the task you want to edit');
        }
    }

    onExpandAllClick() {
        this.gantt.expandAll();
    }

    onCollapseAllClick() {
        this.gantt.collapseAll();
    }

    onZoomInClick() {
        this.gantt.zoomIn();
    }

    onZoomOutClick() {
        this.gantt.zoomOut();
    }

    onZoomToFitClick() {
        this.gantt.zoomToFit({
            leftMargin  : 50,
            rightMargin : 50
        });
    }

    onShiftPreviousClick() {
        this.gantt.shiftPrevious();
    }

    onShiftNextClick() {
        this.gantt.shiftNext();
    }

    onStartDateChange({ value, oldValue }) {
        if (!oldValue) { // ignore initial set
            return;
        }

        this.gantt.startDate = DateHelper.add(value, -1, 'week');

        this.gantt.project.setStartDate(value);
    }

    onFilterChange({ value }) {
        if (value === '') {
            this.gantt.taskStore.clearFilters();
        }
        else {
            value = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

            this.gantt.taskStore.filter(task => task.name && task.name.match(new RegExp(value, 'i')));
        }
    }

    onFeaturesClick({ source : item }) {
        const
            gantt = this.gantt;

        if (item.feature) {
            const feature = gantt.features[item.feature];
            feature.disabled = !feature.disabled;
        }
        else if (item.subGrid) {
            const subGrid = gantt.subGrids[item.subGrid];
            subGrid.collapsed = !subGrid.collapsed;
        }
    }

    onFeaturesShow({ source : menu }) {
        const gantt = this.gantt;
        menu.items.map(item => {
            item.checked = item.feature ? !gantt.features[item.feature].disabled : gantt.subGrids[item.subGrid].collapsed;
        });
    }

    onSettingsShow({ source : menu }) {
        const gantt   = this.gantt,
            widgets = menu.widgetMap;
        widgets.rowHeight.value = gantt.rowHeight;
        widgets.barMargin.value = gantt.barMargin;
        widgets.barMargin.max = (gantt.rowHeight / 2) - 5;
        widgets.duration.value = gantt.transitionDuration;
    }

    onSettingsRowHeightChange({ value }) {
        this.gantt.rowHeight = value;
        this.widgetMap.settingsButton.menu.widgetMap.barMargin.max = (value / 2) - 5;
    }

    onSettingsMarginChange({ value }) {
        this.gantt.barMargin = value;
    }

    onSettingsDurationChange({ value }) {
        this.gantt.transitionDuration = value;
        this.styleNode.innerHTML = `.b-animating .b-gantt-task-wrap { transition-duration: ${value / 1000}s !important; }`;
    };

    onCriticalPathsClick({ source }) {
        this.gantt.features.criticalPaths.disabled = !source.pressed;
    }

    onUndoClick() {
        this.gantt.project.stm.canUndo && this.gantt.project.stm.undo();
    }

    onRedoClick() {
        this.gantt.project.stm.canRedo && this.gantt.project.stm.redo();
    }

    onProjectChanges({ type }) {
        const saveButton = this.widgetMap.saveButton;

        // disable "Save" button if there is no changes in the project data
        saveButton.disabled = type === 'nochanges';
    }

    onSaveClick() {
        this.gantt.project.sync();
    }

    // endregion
};


/**
 * @module PercentDonePieColumn
 */

/**
 * A column drawing a pie chart of the `percentDone` value
 *
 * @extends Gantt/column/PercentDoneColumn
 * @classType percentdonepie
 */
class PercentDonePieColumn extends PercentDoneColumn {
    static get type() {
        return 'percentdonepie';
    }

    static get isGanttColumn() {
        return true;
    }

    static get defaults() {
        return {
            // Set your default instance config propertiess here
            htmlEncode : false,
            align      : 'center'
        };
    }

    //endregion

    renderer({ value }) {
        if (value) {
            return `<div class="b-pie" style="animation-delay: -${value}s;"></div>`;
        }
    }
}

ColumnStore.registerColumnType(PercentDonePieColumn);


/**
 * @module ResourceAvatarColumn
 */

const imgFolderPath = '../_shared/images/users/';

/**
 * Column showing avatars of the assigned resource
 *
 * @extends Grid/column/Column
 * @classType resourceavatar
 */
class ResourceAvatarColumn extends ResourceAssignmentColumn {
    static get type() {
        return 'resourceavatar';
    }

    static get isGanttColumn() {
        return true;
    }

    static get defaults() {
        return {
            repaintOnResize : true,
            htmlEncode      : false,
            cellCls         : 'b-resource-avatar-cell'
        };
    }

    renderer({ value }) {
        const imgSize = 30,
            nbrVisible = Math.floor((this.width - 20) / (imgSize + 2));

        return Array.from(value).map((assignment, i) => {
            const resource = assignment.resource;

            let markup = '';

            if (resource) {
                const
                    imgMarkup = `<img title="${resource.name} ${assignment.units}%" class="b-resource-avatar" src="${imgFolderPath}${resource.name.toLowerCase() || 'none'}.jpg">`,
                    lastIndex = nbrVisible - 1,
                    overflowCount = value.length - nbrVisible;

                if (overflowCount === 0 || i < lastIndex) {
                    markup = imgMarkup;
                }
                else if (i === lastIndex && overflowCount > 0) {
                    markup = `<div class="b-overflow-img">
                                  ${imgMarkup}
                                  <span class="b-overflow-count" title="${resource.name} ${assignment.units}% (+${overflowCount} more resources)">+${overflowCount}</span>
                              </div>`;
                }
            }

            return markup;
        }).join('');
    }
}

ColumnStore.registerColumnType(ResourceAvatarColumn);


/**
 * @module StatusColumn
 */

/**
 * A column showing the status of a task
 *
 * @extends Gantt/column/Column
 * @classType percentdonepie
 */
class StatusColumn extends Column {
    static get type() {
        return 'statuscolumn';
    }

    static get isGanttColumn() {
        return true;
    }

    static get defaults() {
        return {
            // Set your default instance config propertiess here
            text       : 'Status',
            htmlEncode : false,
            editor     : false
        };
    }

    //endregion

    renderer({ record }) {
        let icon = '',
            status = '',
            cls = '';

        if (record.isCompleted) {
            status = 'Completed';
            cls = 'b-completed';
        }
        else if (record.endDate > Date.now()) {
            status = 'Late';
            cls = 'b-late';
        }
        else if (record.isStarted) {
            status = 'Started';
            cls = 'b-started';
        }

        return status ? `<i class="b-fa b-fa-circle ${status}"></i>${status}` : '';
    }
}

ColumnStore.registerColumnType(StatusColumn);


// here you can extend our default Task class with your additional fields, methods and logic
class Task extends TaskModel {

    static get fields() {
        return [
            { name : 'deadline', type : 'date' }
        ];
    }

    get isLate() {
        return this.deadline && Date.now() > this.deadline;
    }
}
/* eslint-disable no-unused-vars */

const project = window.project = new ProjectModel({

    // Let the Project know we want to use our own Task model with custom fields / methods
    taskModelClass : Task,
    transport      : {
        load : {
            url : '../_datasets/launch-saas.json'
        }
    }
});

const gantt = new Gantt({
    project : project,

    startDate : '2019-01-12',
    endDate   : '2019-03-24',

    columns : [
        { type : 'wbs' },
        { type : 'name', width : 250 },
        { type : 'startdate' },
        { type : 'duration' },
        { type : 'percentdone', width : 70 },
        { type : 'resourceavatar', width : 120 },
        {
            type  : 'predecessor',
            width : 112
        },
        {
            type  : 'successor',
            width : 112
        },
        { type : 'schedulingmodecolumn' },
        { type : 'calendar' },
        { type : 'percentdonepie', text : '%', width : 70 },
        { type : 'constrainttype' },
        { type : 'constraintdate' },
        { type : 'statuscolumn' },
        {
            type  : 'date',
            text  : 'Deadline',
            field : 'deadline'
        },
        { type : 'addnew' }
    ],

    subGridConfigs : {
        locked : {
            flex : 1
        },
        normal : {
            flex : 2
        }
    },

    columnLines : false,

    features : {
        baselines : {
            disabled : true
        },
        progressLine : {
            disabled   : true,
            statusDate : new Date(2019, 0, 25)
        },
        taskContextMenu : {
            // Our items is merged with the provided defaultItems
            // So we add the provided convertToMilestone option.
            items : {
                convertToMilestone : true
            },
            processItems({ taskRecord, items }) {
                if (taskRecord.isMilestone) {
                    items.convertToMilestone = false;
                }
            }
        },
        filter         : true,
        nonWorkingTime : true,
        dependencyEdit : true,
        timeRanges     : {
            showCurrentTimeLine : true
        },
        labels : {
            left : {
                field  : 'name',
                editor : {
                    type : 'textfield'
                }
            }
        }
    }
});

const panel = new Panel({
    appendTo : 'container',
    layout   : 'fit',
    items    : [
        gantt
    ],
    tbar : new GanttToolbar({ gantt })
});

// console.time("load data");
project.load().then(() => {
    // console.timeEnd("load data");
    const stm = gantt.project.stm;

    stm.enable();
    stm.autoRecord = true;

    // let's track scheduling conflicts happened
    project.on('schedulingconflict', context => {
        // show notification to user
        Toast.show('Scheduling conflict has happened ..recent changes were reverted');
        // as the conflict resolution approach let's simply cancel the changes
        context.continueWithResolutionResult(EffectResolutionResult.Cancel);
    });
});
