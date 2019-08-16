# 1.1.2 - 2019-07-05

## BUG FIXES

* Fixed #8804 - Error / warnings in console of web components demo
* Fixed #8805 - Animations not working
* Fixed #8811 - Crash when using context menu in web components demo
* Fixed #8839 - Save/Delete/Cancel button order in TaskEditor should match order in EventEditor

# 1.1.1 - 2019-06-27

## FEATURES / ENHANCEMENTS

* Added Integration Guide for Vue (Fixed #8686)
* Added Integration Guide for Angular (Fixed #8686)
* Added Integration Guide for React (Fixed #8686)
* Added new config option `tabsConfig` for `taskEdit` feature (Fixed #8765)

## BUG FIXES

* Fixed #8754 - Sluggish drag drop experience in advanced demo
* Fixed #8778 - Baselines disappear if scrolling down and back up
* Fixed #8785 - Passing listeners to editor widget in TaskEditor removes internal listeners

# 1.1.0 - 2019-06-20

## FEATURES / ENHANCEMENTS

* There is now a `Baselines` feature which shows baselines for tasks. A task's data block may now contain
a `baselines` property which is an array containing baseline data blocks which must contain at least
`startDate` and `endDate`. See the new example for details. (Fixed #6286)
* New `CriticalPaths` feature which visualizes the project critical paths. Check how it works in the new `criticalpaths` demo. (Fixed #6269)
* New `ProgressLine` feature - a vertical graph that provides the highest level view of schedule progress. Check how it works in the new `progressline` demo. (Fixed #8643)
* New `EarlyStartDate`, `EarlyEndDate`, `LateStartDate`, `LateEndDate` and `TotalSlack` columns. Check how they works in the new `criticalpaths` demo. (Fixed #6285).

## API CHANGES

## BUG FIXES

* Fixed #8539 - Some task editor fields turns red moments before editor is closed after clicking save
* Fixed #8602 - TaskEditor should invalidate an end date < start date
* Fixed #8603 - STYLING: Milestones lack hover color
* Fixed #8604 - Clicking task element does not select the row
* Fixed #8632 - Task end date/duration is not properly editing after cancel
* Fixed #8665 - Task interaction events are not documented
* Fixed #8707 - Resizing column expands collapsed section

# 1.0.2 - 2019-06-03

## FEATURES / ENHANCEMENTS

* New integration demo with Ext JS Modern toolkit (Fixed #8447)
* New webcomponents demo (Fixed #8495)
* TaskEdit feature now fires an event before show to prevent editing or to show a custom editor (Fixed #8510)
* TaskEdit feature now optionally shows a delete button
* Gantt repaints dependencies asynchronously when dependency or task is changed. Use `dependenciesDrawn` event to know when dependency lines are actually painted. `draw`, `drawDependency` and  `drawForEvent` are still synchronous.

## API CHANGES

* DEPRECATED: TaskEditor's `extraWidgets` config was deprecated and will be removed in a future version. Please use
`extraItems` instead.

## BUG FIXES

* Fixed #7925 - Dependency line should only be drawn once on dependency change
* Fixed #8517 - Angular demo tasks animate into view
* Fixed #8518 - React + Vue demos broken rendering
* Fixed #8520 - Labels demo timeaxis incorrectly configured
* Fixed #8529 - Pan feature reacts when dragging task bar
* Fixed #8516 - Customizing resourceassignment picker demo issues
* Fixed #8532 - Adding task above/below of a milestone creates a task with wrong dates
* Fixed #8533 - Cannot destroy ButtonGroup
* Fixed #8556 - Add Task button throws in extjs modern demo
* Fixed #8586 - Add new column header not localized properly

# 1.0.1 - 2019-05-24

## FEATURES / ENHANCEMENTS

* Delimiter used in Successors and Predecessors columns is now configurable, defaulting to ; (Fixed #8292)
* New `timeranges` demo showing how to add custom date indicator lines as well as date ranges to the Gantt chart (Fixed #8320)
* Demos now have a built in code editor that allows you to play around with their code (Chrome only) and CSS (Fixed #7210)
* *BREAKING.* Context menu Features are configured in a slightly different way in this version. If you have used
the `extraItems` or `processItems` options to change the contents of the shown menu, this code must be
updated. Instead of using `extraItems`, use `items`.

  The `items` config is an *`Object`* rather than an array. The property values are your new submenu configs, and the property name is the menu item name. In this way, you may add new items easily, but also, you may override the configuration of the default menu items that we provide.

  The default menu items now all have documented names (see the `defaultItems` config of the Feature), so you may apply config objects which override default config. To remove a provided default completely, specify the config value as `false`.

  This means that the various `showXxxxxxxInContextMenu` configs in the Gantt are now ineffective. Simply
use for example, `items : { addTaskAbove : false }` to remove a provided item by name.

  `processItems` now recieves its `items` parameter as an `Object`, so finding predefined named menu items to mutate is easier. Adding your own entails adding a new named config object. Use the `weight` config to affect the menu item order. Provided items are `weight : 0`. Weight values may be negative to cause your new items  (Fixed #8287)

## BUG FIXES

* Fixed #7561 - Should be able to use Grid & Scheduler & Gantt bundles on the same page
* Fixed #8075 - TimeRanges store not populated if incoming CrudManager dataset contains data
* Fixed #8210 - Terminals not visible when hovering task after creating dependency
* Fixed #8261 - ProjectLines not painted after propagation complete
* Fixed #8264 - Reordering a task into a parent task doesn't recalculate the parent
* Fixed #8275 - Framework integrations missing value in start date field
* Fixed #8276 - Crash if invoking task editor for unscheduled task
* Fixed #8279 - Gantt PHP demo requestPromise.abort is not a function in AjaxTransport.js
* Fixed #8293 - Gantt advanced demo. Graph cycle detected
* Fixed #8295 - Gantt umd bundle doesn't work in angular
* Fixed #8296 - Typings for gantt.umd bundles are incomplete
* Fixed #8325 - Some translations are missing (NL)
* Fixed #8334 - Clicking on a blank space selects a task and scrolls it into view
* Fixed #8341 - Task elements are missing after adding new tasks
* Fixed #8342 - Collapsing all records fails in advanced demo
* Fixed #8357 - TaskEditor needs to provide a simple way of adding extra fields to each tab
* Fixed #8381 - loadMask not shown if Project is using autoLoad true
* Fixed #8384 - Crash in React demo when clicking Edit button
* Fixed #8390 - Undoing project start date change doesn't update project start line
* Fixed #8391 - Progress bar element overflows task bar on hover if task is narrow
* Fixed #8394 - CrudManager reacts incorrectly and tries to save empty changeset
* Fixed #8397 - Inserting two tasks at once breaks normal view
* Fixed #8404 - addTaskBelow fails on 2nd call
* Fixed #8457 - Rendering broken after adding subtask to parent
* Fixed #8462 - Error throw in undoredo example when second transaction is canceled
* Fixed #8475 - STYLING: Misalignment of resource assignment filter field
* Fixed #8494 - Exception thrown when adding task via context menu
* Fixed #8496 - Crash in Gantt docs when viewing ResourceTimeRanges

# 1.0.0 - 2019-04-26

* Today we are super excited to share with you the 1.0 GA of our new Bryntum Gantt product. It is a powerful and high performance Gantt chart component for any web application. It is built
from the ground up with pure JavaScript and TypeScript, and integrates easily with React, Angular, Vue or any other JS framework you are already using.

For a full introduction, please see our blog post for more details about this release. In our docs page you will find extensive API documentation including a getting started guide.

* Blog post: https://www.bryntum.com/blog/announcing-bryntum-gantt-1-0
