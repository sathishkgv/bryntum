/**
 * @author Saki
 * @date 2019-05-22 12:41:23
 * @Last Modified by: Saki
 * @Last Modified time: 2019-06-27 09:42:27
 * 
 * Bryntum Gantt Angular wrapper
 */
import {
    Component,
    OnInit,
    OnChanges,
    ElementRef,
    Input,
    Output,
    EventEmitter,
    SimpleChanges
} from '@angular/core';
// UMD bundle is used to support IE11 browser. If you don't need it just use import from 'bryntum-gantt' instead
import {Gantt, ProjectModel } from 'bryntum-gantt/gantt.umd.js';
// import { Gantt, ProjectModel } from 'bryntum-gantt';

@Component({
    selector:'bry-gantt',
    template:''
})

export class GanttComponent implements OnInit, OnChanges {

    private elementRef : ElementRef;
    public ganttEngine : Gantt;

    // available features
    private featureInputs = [
        'cellEdit',
        'cellTooltip',
        'columnDragToolbar',
        'columnPicker',
        'columnReorder',
        'columnResize',
        'contextMenu',
        'filter',
        'filterBar',
        'group',
        'groupSummary',
        'headerContextMenu',
        'labels',
        'nonWorkingTime',
        'pan',
        'percentBar',
        'projectLines',
        'quickFind',
        'regionResize',
        'resourceTimeRanges',
        'search',
        'sort',
        'stripe',
        'summary',
        'taskContextMenu',
        'taskDrag',
        'taskDragCreate',
        'taskEdit',
        'taskResize',
        'taskTooltip',
        'timeRanges',
        'tree'
    ];

    // config options
    private configInputs = [
        'assignments',
        'autoHeight',
        'barMargin',
        'calendars',
        'cls',
        'columnLines',
        'columns',
        'crudManager',
        'dependencies',
        'data',
        'durationDisplayPrecision',
        'emptyText',
        'endDate',
        'eventColor',
        'eventStyle',
        'fillLastColumn',
        'ganttId',
        'height',
        'minWidth',
        'minHeight',
        'project',
        'readOnly',
        'ref',
        'resources',
        'responsiveLevels',
        'rowHeight',
        'scheduledEventName',
        'snap',
        'startDate',
        'store',
        'style',
        'taskRenderer',
        'tasks',
        'tooltip',
        'viewPreset',
        'width'
    ];

    //#region configs
    @Input() assignments : object[];
    @Input() autoHeight : boolean;
    @Input() barMargin : number;
    @Input() calendars : object[];
    @Input() cls : string;
    @Input() columnLines : boolean | object;
    @Input() columns : object[];
    @Input() crudManager : object;
    @Input() dependencies : boolean | object;
    @Input() data : object[];
    @Input() durationDisplayPrecision : boolean | number;
    @Input() emptyText : string;
    @Input() endDate : any;
    @Input() eventColor : string;
    @Input() eventStyle : string;
    @Input() fillLastColumn : boolean;
    @Input() ganttId : string;
    @Input() height : number | string;
    @Input() minHeight : number | string;
    @Input() minWidth : number | string;
    @Input() project : ProjectModel;
    @Input() readOnly : boolean;
    @Input() ref : string;
    @Input() resources : object[];
    @Input() responsiveLevels : any;
    @Input() rowHeight : null | number;
    @Input() scheduledEventName : string;
    @Input() snap : boolean;
    @Input() startDate : any;
    @Input() store : object;
    @Input() style : string;
    @Input() taskRenderer : any; 
    @Input() tasks : object[];
    @Input() tooltip : string;
    @Input() viewPreset : any;
    @Input() width : number | string;
    //#endregion configs

    //#region features
    @Input() cellEdit : boolean | object;
    @Input() cellTooltip : boolean | object;
    @Input() columnDragToolbar : boolean | object;
    @Input() columnPicker: boolean;
    @Input() columnReorder: boolean;
    @Input() columnResize: boolean;
    @Input() contextMenu: boolean | object;
    @Input() filter : boolean | object;
    @Input() filterBar : boolean | object;
    @Input() group: boolean | object | string;
    @Input() groupSummary: boolean | object;
    @Input() headerContextMenu: boolean | object;
    @Input() labels: boolean | object;
    @Input() nonWorkingTime: boolean;
    @Input() pan : boolean | object;
    @Input() percentBar : boolean | object;
    @Input() projectLines : boolean | object;
    @Input() quickFind : boolean | object;
    @Input() regionResize : boolean | object;
    @Input() resourceTimeRanges : boolean | object;
    @Input() search : boolean | object;
    @Input() sort : boolean | object;
    @Input() stripe : boolean | object;
    @Input() summary : boolean | object;
    @Input() taskContextMenu : boolean | object;
    @Input() taskDrag : boolean | object;
    @Input() taskDragCreate : boolean | object;
    @Input() taskEdit : boolean | object;
    @Input() taskResize : boolean | object;
    @Input() taskTooltip : boolean | object;
    @Input() timeRanges : boolean | object;
    @Input() tree : boolean | object;
    //#endregion features
   
    @Output() onGanttEvents = new EventEmitter<object>();

    constructor(element : ElementRef) {
        // Gantt is rendered into this element
        this.elementRef = element;
    } // eo function constructor

    ngOnInit(): void {
        
        const 
            featureConfig = {},
            config = {
                appendTo  : this.elementRef.nativeElement,
                listeners : {
                    catchAll(task) {
                        this.onGanttEvents.emit(event);
                    },
                    thisObj : this
                },
                features: featureConfig
            }
        ; // eo const

        // process config options
        this.configInputs.forEach(configName => {
            if('ganttId' === configName && this[configName]) {
                //@ts-ignore
                config.id = this[configName];
            }
            else if (undefined !== this[configName]) {
                config[configName] = this[configName];
            }
        });

        // process features
        this.featureInputs.forEach(featureName => {
            if(featureName in this) {
                featureConfig[featureName] = this[featureName];
            }
        });

        // create the Bryntum Gantt
        const engine = this.ganttEngine = new Gantt(config);

        //@ts-ignore
        engine.eventStore.relayAll(engine, 'tasks');

        //@ts-ignore
        engine.resourceStore.relayAll(engine, 'resources');

    } // eo function ngOnInit

    ngOnChanges(changes: SimpleChanges): void {
        const me = this;

        if(me.ganttEngine) {
            Object.entries(changes).forEach(([name, {currentValue}]) => {
                if (me.configInputs.includes(name)) {
                    me.ganttEngine[name] = currentValue;
                }

                if (me.featureInputs.includes(name)) {
                    me.ganttEngine[name] = currentValue;
                }
            });
        }
    } // eo function ngOnChanges

} // eo export class GanttComponent

// eof
