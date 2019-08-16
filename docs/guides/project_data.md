# Project data

## Logical structure

Bryntum Gantt operates on a top-level entity called a "Project". A Project consists of several collections
of other entities. Collections are created as instances of the [Store](#Common/data/Store) class in the Bryntum Common
package and individual entities are represented by [Model](#Common/data/Model) instances.

Bryntum Gantt manages the project's data using the Scheduling Engine. The engine is a separate project written in TypeScript.
Gantt makes use of the mixins defined in the Scheduling Engine to build the actual classes that are used to store and manage the data.
If you are new to the mixin concept, you can check this [blog post](https://www.bryntum.com/blog/the-mixin-pattern-in-typescript-all-you-need-to-know/)
to become familiar with it. The main idea is that you can freely combine several mixins and not be tied to a single
superclass in the hierarchy (as you would be if using classic single superclass inheritance).

The "Project" itself is represented by a [ProjectModel](#Gantt/model/ProjectModel). It is a regular [Model](#Common/data/Model), capable of storing any project-wide configuration options.

The primary collections of the Project are:

* [Calendar manager store](#Gantt/model/ProjectModel#property-calendarManagerStore). This is a tree store containing all the calendars of the Project.
The collection is represented by a [CalendarManagerStore](#Gantt/data/CalendarManagerStore).
The entity is represented by a [CalendarModel](#Gantt/model/CalendarModel).
Please refer to the [calendars guide](#guides/calendars.md) for more information about the calendars system in Bryntum Gantt.

* [Resources store](#Gantt/model/ProjectModel#property-resourceStore). This is a flat store, keeping all resources of the Project.
The collection is represented by a [ResourceStore](#Gantt/data/ResourceStore). The entity is represented by a [ResourceModel](#Gantt/model/ResourceModel).

* [Task store](#Gantt/model/ProjectModel#property-taskStore). This is a flat store, keeping all tasks of the Project.
The collection is represented by a [TaskStore](#Gantt/data/TaskStore). The entity is represented by a [TaskModel](#Gantt/model/TaskModel).

* [Assignment store](#Gantt/model/ProjectModel#property-assignmentStore). This is a flat store, keeping all assignments of the Project.
The collection is represented by a [AssignmentStore](#Gantt/data/AssignmentStore). The entity is represented by a [AssignmentModel](#Gantt/model/AssignmentModel).

* [Dependency store](#Gantt/model/ProjectModel#property-dependencyStore). This is a flat store, keeping all dependencies of the Project.
The collection is represented by a [DependencyStore](#Gantt/data/DependencyStore). The entity is represented by a [DependencyModel](#Gantt/model/DependencyModel).

Please refer to the documentation of mentioned classes above for detailed lists of available fields and methods.


## Creating a project

A project can be created as any other regular [Model](#Common/data/Model) instance. For example, here we create a project with a specified start date
and initial data for the internal stores (example assumes using the UMD bundle):

```javascript
const project = new bryntum.gantt.ProjectModel({
    startDate  : '2017-01-01',

    eventsData : [
        { id : 1, name : 'Proof-read docs', startDate : '2017-01-02', endDate : '2017-01-09' },
        { id : 2, name : 'Release docs', startDate : '2017-01-09', endDate : '2017-01-10' }
    ],

    dependenciesData : [
        { fromEvent : 1, toEvent : 2 }
    ]
});
```

All project stores are created from scratch, but they will remain empty if no data was provided to them.


## Adding custom fields to entities

You can add any number of custom fields to any entity of the project (including project itself). For that, first, subclass that entity
and list additional fields in the accessor for static [fields](#Common/data/Model#property-fields-static) property. For example, to add `company` field to the [ResourceModel](#Gantt/model/ResourceModel):

```javascript
class MyResourceModel extends ResourceModel {
    static get fields() {
        return [
            { field: 'company', type: 'string' }
        ]
    }
}
```

When creating the project, specify the newly defined model class using the [resourceModelClass](#Gantt/model/ProjectModel#config-resourceModelClass) config.
There are analogous configs for the other entities managed by the project.

If you want to use a custom store type for some collection, do it in the same way - first subclass the store class,
then use [resourceStoreClass](#Gantt/model/ProjectModel#config-resourceStoreClass) config or similar during project creation.


## Updating the project data

The [Model](#Common/data/Model) class lets you define special kind of properties of the class, which are called "fields".
Defining a field will auto-create accessors to get/set its value, so the usage looks very much like a regular property:

```javascript
class MyModel extends Model {
    static get fields() {
        return [
            { name : 'myField', type : 'string' }
        ]
    }
}

const myModel = new MyModel({ myField : 'someValue' })

// read
const lowerCased = myModel.someValue.toLowerCase()
// write
myModel.someValue = 'anothervalue'
```

One important thing to know is that some fields in the Gantt entities are special. These are the fields that, when changed, will
cause changes of fields in other dependent entities (potentially in many others). This process is called - "propagation of changes", or just
"propagation". For example, a change of the start date of a task, will be propagated and potentially will cause changes in many
other dependent tasks.

For fields that cause this propagation of changes, one should use *setter methods* instead of using the direct accessor. The setter method
is a regular method whose name starts with `set` and then continues with the uppercased field name. For example, for the
`startDate` field, the setter method will be: `setStartDate`

**The setter methods that affect the schedule are asynchronous and return a `Promise`**. It's done this way since during calculation of the
new schedule, a scheduling conflict may arise, requiring user input on how to resolve it. This brings an asynchronous "gap" into the
calculation. Thankfully, because `async/await` syntax is supported by every modern browser now, the changes for the code are minimal.

**It is forbidden to modify the schedule, while an asynchronous change propagation is in progress.**. One should always use `then` method of the
returned `Promise`, or `await` the method call.

For example, let's say we want to change the start date of a task which may affect many other tasks in the schedule.
Using a plain `Promise`, it would look like:

```javascript
const eventStore    = project.eventStore
const event         = eventStore.getById(1)

event.setStartDate(new Date(2019, 3, 25)).then(() => {
    ... // continue after start date update
})
```

Or, with `async/await` (wrapped with extra function, since global `async/await` is still in the proposal stage):

```javascript
const updateStartDate = async () => {
    const eventStore    = project.eventStore
    const event         = eventStore.getById(1)

    await event.setStartDate(new Date(2019, 3, 25))

    ... // continue after start date update
}
```

Such asynchronous setters methods are explicitly marked as returning `Promise` in the documentation.

In general, if a field has a documented setter method, that should be used instead of the accessor.

**Sometimes you might need to initiate propagation of changes manually**. This is needed only if you have directly added/removed an entity from the
collection, bypassing an API method that returns a `Promise`. For example:

```javascript
const eventStore    = project.eventStore
const event         = eventStore.add({ name : 'New task', startDate : new Date(2019, 3, 1), duration : 1 })

eventStore.getProject().propagate().then(() => {
    ... // continue after adding a new task
})
```

In general, you should always use API methods, like [assign](#Gantt/model/TaskModel#function-assign)/[unassign](#Gantt/model/TaskModel#function-unassign)
instead of manually modifying the store (`AssignmentStore` in this case).

## Persisting the project data

The `ProjectModel` class implements a [AbstractCrudManagerMixin](#Scheduler/crud/AbstractCrudManagerMixin) mixin, specialized for Gantt.
It uses the [JsonEncoder](#Scheduler/crud/encoder/JsonEncoder) for serialization and [AjaxTransport](#Scheduler/crud/transport/AjaxTransport) for
communication with server.

The crud manager mixin, provides two additional methods for the project instance:

- [load](#Scheduler/crud/AbstractCrudManagerMixin#function-load) Loads a new data package from server. The data package will contain
data for all stores, used in the project.
- [sync](#Scheduler/crud/AbstractCrudManagerMixin#function-sync) Persists the changes from all project stores to the server.

For more general information about the Crud manager architecture please refer to [this guide](#guides/crud_manager.md).


<p class="last-modified">Last modified on 2019-06-18 20:01:52</p>