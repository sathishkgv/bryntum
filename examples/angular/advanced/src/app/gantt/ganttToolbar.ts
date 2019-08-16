/**
 * @author Saki
 * @date 2019-04-23 14:53:56
 * @Last Modified by: Saki
 * @Last Modified time: 2019-06-24 13:53:22
 * 
 * Toolbar instance export
 */
/* <remove-on-release> */
/* cSpell: ignore recordingstop, restoringstop, toggleable */
/* </remove-on-release> */

import { 
    Toolbar,
    Toast,
    DateHelper,
    Menu,
    Popup,
    WidgetHelper
} from 'bryntum-gantt/gantt.umd.js';

export default (gantt) => {
    
    const 
        stm = gantt.project.stm,
        // gantt = config.gantt,
        toolbar = new Toolbar(getDefaultConfig(gantt)),
        updateUndoRedoButtons = () => {

            const { undoBtn, redoBtn } = toolbar.widgetMap,
                redoCount = stm.length - stm.position
            ;

            undoBtn.badge = stm.position || '';
            redoBtn.badge = redoCount || '';

            undoBtn.disabled = !stm.canUndo;
            redoBtn.disabled = !stm.canRedo;
            
        } // eo function updateUndoRedoButtons
    ;

    stm.on({
        recordingstop : updateUndoRedoButtons,
        restoringstop : updateUndoRedoButtons
    });

    return toolbar;
} // eo default export

const getDefaultConfig = gantt => {
    return {
        gantt,
        // Only one tooltip instance using forSelector to show for every button
        // which has a tipText property
        tooltip : {
            forSelector : '.b-button',
            onBeforeShow() {
                const activeButton = this.activeTarget && WidgetHelper.fromElement(this.activeTarget, 'button');

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
                        onAction   : 'up.onFeaturesClick'
                    },
                    {
                        type       : 'button',
                        color      : 'b-blue',
                        ref        : 'settingsButton',
                        icon       : 'b-fa b-fa-cogs',
                        text       : 'Settings',
                        tipText    : 'Adjust settings',
                        toggleable : true,
                        onAction   : 'up.onSettingsClick'
                    }
                ]
            },
            {
                type      : 'datefield',
                ref       : 'startDateField',
                label     : 'Project start',
                width     : '17em',
                required  : true,
                // @todo: listeners defined this way should work (@Nige)
                // listeners : {
                //     change : 'up.onStartDateChange'
                // }
                onChange  : 'up.onStartDateChange'
            },
            {
                type                 : 'textfield',
                ref                  : 'filterByName',
                width                : '13em',
                placeholder          : 'Find tasks by name',
                clearable            : true,
                keyStrokeChangeDelay : 100,
                triggers             : {
                    filter : {
                        align : 'start',
                        cls   : 'b-fa b-fa-filter'
                    }
                },
                onChange : 'up.onFilterChange'
            }
        ], // eo items

        // region controller methods
        async onAddTaskClick() {
            const 
                gantt = this.gantt,
                added = gantt.taskStore.rootNode.appendChild({
                    name     : 'New task',
                    duration : 1
                })
            ;
            // run propagation to calculate new task fields
            await gantt.project.propagate();

            // scroll to the added task
            await gantt.scrollRowIntoView(added);

            gantt.features.cellEdit.startEditing({
                record : added,
                field  : 'name'
            });

        }, // eo function on AddTaskClick
    
        onEditTaskClick() {
            const gantt = this.gantt;
            if (gantt.selectedRecord) {
                gantt.editTask(gantt.selectedRecord);
            }
            else {
                Toast.show('First select the task you want to edit');
            }
        }, // eo function onEditTaskClick

        onExpandAllClick() {
            this.gantt.expandAll();
        }, // eo function onExpandAllClick
    
        onCollapseAllClick() {
            this.gantt.collapseAll();
        }, // eo function onCollapseAllClick
    
        onZoomInClick() {
            this.gantt.zoomIn();
        }, // eo function onZoomInClick
    
        onZoomOutClick() {
            this.gantt.zoomOut();
        }, // eo function onZoomOutClick
    
        onZoomToFitClick() {
            this.gantt.zoomToFit({
                leftMargin  : 50,
                rightMargin : 50
            });
        }, // eo function onZoomToFitClick

        onShiftPreviousClick() {
            this.gantt.shiftPrevious();
        }, // eo function onShiftPreviousClick
    
        onShiftNextClick() {
            this.gantt.shiftNext();
        }, // eo function onShiftNextClick
    
        onStartDateChange({ value }) {
            this.gantt.startDate = DateHelper.add(value, -1, 'week');
    
            this.gantt.project.setStartDate(value);
        }, // eo function onStartDateChange
     
        onFilterChange({ value }) {
            if (value === '') {
                this.gantt.taskStore.clearFilters();
            }
            else {
                value = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
                this.gantt.taskStore.filter(task => task.name && task.name.match(new RegExp(value, 'i')));
            }
        }, // eo function onFilterChange

        onFeaturesClick({ source }) {
            const gantt = this.gantt,
                features = gantt.features;
    
            new Menu({
                forElement  : source.element,
                closeAction : 'destroy',
                items       : [
                    {
                        text     : 'Draw dependencies',
                        checked  : !features.dependencies.disabled,
                        onToggle : () => features.dependencies.disabled = !features.dependencies.disabled
                    },
                    {
                        text     : 'Task labels',
                        checked  : !features.labels.disabled,
                        onToggle : () => features.labels.disabled = !features.labels.disabled
                    },
                    {
                        text     : 'Project lines',
                        checked  : !features.projectLines.disabled,
                        onToggle : () => features.projectLines.disabled = !features.projectLines.disabled
                    },
                    {
                        text     : 'Highlight non-working time',
                        checked  : !features.nonWorkingTime.disabled,
                        onToggle : () => features.nonWorkingTime.disabled = !features.nonWorkingTime.disabled
                    },
                    {
                        text     : 'Enable cell editing',
                        checked  : !features.cellEdit.disabled,
                        onToggle : () => features.cellEdit.disabled = !features.cellEdit.disabled
                    },
                    {
                        text     : 'Hide schedule',
                        cls      : 'b-separator',
                        checked  : gantt.subGrids.normal.collapsed,
                        onToggle : () => gantt.subGrids.normal.collapsed = !gantt.subGrids.normal.collapsed
                    }
                ],
                onDestroy() {
                    source.pressed = false;
                }
            });
        }, // eo function onFeaturesClick
        
        onSettingsClick({ source }) {
            const gantt = this.gantt;
    
            const popup = new Popup({
                forElement  : source.element,
                closeAction : 'destroy',
                anchor      : true,
                layoutStyle : {
                    flexDirection : 'column'
                },
                items : [
                    {
                        type      : 'slider',
                        ref       : 'rowHeight',
                        text      : 'Row height',
                        width     : '10em',
                        showValue : true,
                        value     : gantt.rowHeight,
                        min       : 30,
                        max       : 70,
                        style     : 'margin-bottom: .5em',
                        onInput({ value }) {
                            gantt.rowHeight = value;
                            popup.widgetMap.barMargin.max = (value / 2) - 5;
                        }
                    },
                    {
                        type      : 'slider',
                        ref       : 'barMargin',
                        text      : 'Bar margin',
                        width     : '10em',
                        showValue : true,
                        value     : gantt.barMargin,
                        min       : 0,
                        max       : (gantt.rowHeight / 2) - 5,
                        onInput   : ({ value }) => gantt.barMargin = value
                    }
                ],
                onDestroy() {
                    source.pressed = false;
                }
            });
        }, // eo function onSettingsClick
    
        onUndoClick() {
            this.gantt.project.stm.canUndo && this.gantt.project.stm.undo();
        }, // eo function onUndoClick
    
        onRedoClick() {
            this.gantt.project.stm.canRedo && this.gantt.project.stm.redo();
        } // eo function onRedoClick
    
    };

} // eo defaultConfig getter

// eof
