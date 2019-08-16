/**
 * folder  : example folder under ./examples
 * group   : browser page group
 * title   : example title
 * build   : true if example needs building
 * offline : true if example is not available online
 * since   : package version since example is available
 * ie      : false if not supported for IE
 * edge    : false if not supported for Edge
 */

// eslint-disable-next-line no-unused-vars
var examples = [
    { folder : 'advanced', group : 'Advanced', title : 'Advanced' },
    { folder : 'basic', group : 'Basic', title : 'Basic' },
    { folder : 'bigdataset', group : 'Intermediate', title : 'Big data set' },
    { folder : 'esmodule', group : 'Integration', title : 'Include using EcmaScript module' },
    { folder : 'labels', group : 'Basic', title : 'Labels' },
    { folder : 'localization', group : 'Intermediate', title : 'Localization' },
    { folder : 'php', group : 'Integration', title : 'Backend in PHP', offline : true },
    { folder : 'requirejs', group : 'Integration', title : 'Include with RequireJS' },
    { folder : 'responsive', group : 'Basic', title : 'Responsive' },
    { folder : 'scripttag', group : 'Integration', title : 'Include using a script tag' },
    { folder : 'taskcontextmenu', group : 'Intermediate', title : 'Customizing the task context menu' },
    { folder : 'resourceassignment', group : 'Intermediate', title : 'Customizing the resource assignment picker', since : '1.0.1' },
    { folder : 'taskeditor', group : 'Intermediate', title : 'Customizing the task editor' },
    { folder : 'timeline', group : 'Intermediate', title : 'The timeline widget' },
    { folder : 'theme', group : 'Basic', title : 'Theme browser' },
    { folder : 'timeranges', group : 'Basic', title : 'Time Ranges' },
    { folder : 'undoredo', group : 'Intermediate', title : 'Undo/Redo' },
    { folder : 'angular/advanced', group : 'Integration', title : 'Angular Advanced demo', build : true },
    { folder : 'angular/taskeditor', group : 'Integration', title : 'Task editor customization Angular demo', build : true, since : '1.0.2' },
    { folder : 'react/javascript/advanced', group : 'Integration', title : 'React Advanced demo', build : true },
    { folder : 'react/javascript/basic', group : 'Integration', title : 'React Basic demo', build : true, since : '1.1.2' },
    { folder : 'vue/javascript/advanced', group : 'Integration', title : 'Vue Advanced demo', build : true },
    { folder : 'extjsmodern', group : 'Integration', title : 'Ext JS Modern demo', since : '1.0.2' },
    { folder : 'webcomponents', group : 'Integration', title : 'Use as web component (WebKit only)', ie : false, edge : false, since : '1.0.2' },
    { folder : 'baselines', group : 'Basic', title : 'Baselines demo', since : '1.1.0' },
    { folder : 'criticalpaths', group : 'Basic', title : 'Critical paths demo', since : '1.1.0' },
    { folder : 'progressline', group : 'Basic', title : 'Progress line demo', since : '1.1.0' }
];

// Filter out demos by browser
const
    isIE11 = /rv:11/.test(navigator.userAgent),
    isEdge = /Edge/.test(navigator.userAgent),
    browser = isIE11 ? 'ie' : isEdge ? 'edge' : null;

if (browser) {
    window.examples = window.examples.filter(function(e) {
        return e[browser] !== false;
    });
}

// eslint-disable-next-line no-unused-vars
window.introWidget = {
    type       : 'gantt',
    startDate  : new Date(2018, 3, 1),
    endDate    : new Date(2018, 4, 1),
    viewPreset : 'weekAndDayLetter',
    minHeight  : 250,

    columns : [{
        type  : 'name',
        text  : 'Name',
        width : 220
    }],

    tasks : [{
        name        : 'My Project',
        expanded    : true,
        startDate   : '2018-04-02',
        percentDone : 50,
        duration    : 11,
        children    : [{
            id          : 1,
            name        : 'Develop New Cool Product',
            percentDone : 50,
            startDate   : '2018-04-02',
            duration    : 5
        }, {
            id          : 2,
            name        : 'Launch Product',
            percentDone : 50,
            startDate   : '2018-04-09',
            duration    : 4
        }]
    }],

    dependencies : [{
        id        : 1,
        fromEvent : 1,
        toEvent   : 2
    }]
};
