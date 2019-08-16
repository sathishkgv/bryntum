/**
 * @author Saki
 * @date 2019-06-28 19:37:14
 * @Last Modified by: Saki
 * @Last Modified time: 2019-06-30 23:01:01
 */
import React, { Component } from 'react';
// we import gantt.umd for IE11 compatibility only. If you don't use IE import:
// import { Gantt, ObjectHelper } from 'bryntum-gantt';
import { Gantt, ObjectHelper } from 'bryntum-gantt/gantt.umd';

// Defines a React component that wraps Bryntum Gantt
class BryntumGantt extends Component {

    // defaults for gantt. Feel free to adjust it
    static defaultProps = {
        viewPreset       : 'hourAndDay',
        barMargin        : 2
    };

    featureRe = /Feature$/;

    /* #region Features */
    features = [
        'baselinesFeature',
        'cellEditFeature',
        'cellTooltipFeature',
        // 'columnDragToolbarFeature',
        // 'columnLinesFeature',
        // 'columnPickerFeature',
        // 'columnReorderFeature',
        // 'columnResizeFeature',
        'criticalPathsFeature',
        'contextMenuFeature',
        'dependenciesFeature',
        'dependencyEditFeature',
        // 'eventContextMenuFeature',
        // 'eventDragCreateFeature',
        // 'eventDragFeature',
        // 'eventEditFeature',
        // 'eventFilterFeature',
        // 'eventResizeFeature',
        // 'eventTooltipFeature',
        // 'filterBarFeature',
        // 'filterFeature',
        // 'groupFeature',
        // 'groupSummaryFeature',
        // 'headerContextMenuFeature',
        // 'labelsFeature',
        // 'nonWorkingTimeFeature',
        // 'panFeature',
        'percentBarFeature',
        'progressLineFeature',
        'projectLinesFeature',
        // 'quickFindFeature',
        // 'regionResizeFeature',
        // 'resourceTimeRangesFeature',
        // 'rowReorderFeature',
        // 'scheduleContextMenuFeature',
        // 'scheduleTooltipFeature',
        // 'searchFeature',
        // 'sortFeature',
        // 'stripeFeature',
        // 'summaryFeature',
        'taskContextMenuFeature',
        'taskDragCreateFeature',
        'taskDragFeature',
        'taskEditFeature',
        'taskResizeFeature',
        'taskTooltipFeature',
        // 'timeRangesFeature',
        // 'treeFeature'
    ];
    /* #endregion */

    /* #region Configs */
    configs = [
        'animateRemovingRows',
        'barMargin',
        'cls',
        'columnLines',
        'columns',
        'data',
        'dataset',
        'disabled',
        'displayDateFormat',
        'durationDisplayPrecision',
        'emptyText',
        'enableDeleteKey',
        'enableTextSelection',
        'endDate',
        'eventColor',
        'eventStyle',
        'fillLastColumn',
        'flex',
        'forceFit',
        'fullRowRefresh',
        'height',
        'hideHeaders',
        'listeners',
        'loadMask',
        'longPressTime',
        'managedEventSizing',
        'maxHeight',
        'maxWidth',
        'maxZoomLevel',
        'milestoneLayoutMode',
        'minHeight',
        'minWidth',
        'minZoomLevel',
        'navigator',
        'partner',
        'plugins',
        'project',
        'readOnly',
        'ref',
        'responsiveLevels',
        'ripple',
        'rowHeight',
        'scrollLeft',
        'scrollTop',
        'selectedCell',
        'selectedRecord',
        'selectedRecords',
        'showDirty',
        'showRemoveRowInContextMenu',
        'snap',
        'snapRelativeToEventStartDate',
        'startDate',
        'store',
        'style',
        'subGridConfigs',
        'taskRenderer',
        'tickWidth',
        'timeAxis',
        'timeResolution',
        'title',
        'tooltip',
        'viewportCenterDate',
        'viewPreset',
        'width',
        'workingTime',
        'zoomLevel',
        'zoomLevels'
    ]
    /* #endregion */

    // React component rendered to DOM, render gantt to it
    componentDidMount() {
        const config = {
            appendTo        : this.el,
            callOnFunctions : true,
            features        : {}
        };

        // relay properties with names matching this.featureRe to features
        this.features.forEach(featureName => {
            if (featureName in this.props) {
                config.features[featureName.replace(this.featureRe,'')] = this.props[featureName];
            }
        });

        // Handle config (relaying all props except those used for features to gantt)
        Object.keys(this.props).forEach(propName => {
            if (!propName.match(this.featureRe) && undefined !== this.props[propName]) {
                config[propName] = this.props[propName];
            }
        });

        // console.log(config);

        // Create the actual gantt, used as engine for the wrapper
        const engine = this.ganttEngine = this.props.ganttClass ? new this.props.ganttClass(config) : new Gantt(config);

        // Map all features from ganttEngine to gantt to simplify calls
        Object.keys(engine.features).forEach(key => {
            let featureName = key + 'Feature';
            if (!this[featureName]) {
                this[featureName] = engine.features[key];
            }
        });
    }

    // React component removed, destroy engine
    componentWillUnmount() {
        this.ganttEngine.destroy();
    }

    // Component about to be updated, from changing a prop using state. React to it depending on what changed and
    // prevent react from re-rendering our component.
    shouldComponentUpdate(nextProps, nextState) {
        const engine = this.ganttEngine,
            props = this.props,
            // These props are ignored or has special handling below
            excludeProps = ['events', 'resources', 'eventsVersion', 'resourcesVersion', 'timeRanges', 'columns', 'adapter', 'ref', 'children', ...this.features];

        // Reflect configuration changes. Since most gantt configs are reactive the gantt will update automatically
        Object.keys(props).forEach(propName => {
            // Only apply if prop has changed
            if (!excludeProps.includes(propName) && !ObjectHelper.isEqual(props[propName], nextProps[propName])) {
                engine[propName] = nextProps[propName];
            }
        });

        // xxVersion used to flag that data has changed
        if (nextProps.resourcesVersion !== props.resourcesVersion) {
            engine.resources = nextProps.resources;
        }

        if (nextProps.eventsVersion !== props.eventsVersion) {
            engine.eventStore.data = nextProps.events;
        }

        // Reflect feature config changes
        this.features.forEach(featureName => {
            const currentProp = props[featureName],
                nextProp = nextProps[featureName];

            if (featureName in props && !ObjectHelper.isEqual(currentProp, nextProp)) {
                engine.features[featureName.replace(this.featureRe,'')].setConfig(nextProp);
            }
        });

        return false;
    }

    render() {
        return <div className={'b-react-gantt-container'} ref={el => this.el = el}></div>;
    } // eo function render

} // eo class BryntumGantt

export default BryntumGantt;

// eof
