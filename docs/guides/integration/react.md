<h1 class="title-with-image"><img src="resources/images/react.png" alt="Bryntum Gantt supports React"/>Using Bryntum Gantt with React</h1>

The Gantt chart itself is framework agnostic, but it ships with demos to simplify using it with popular frameworks such as React. The purpose of this guide is to give you a basic introduction on how to use the Bryntum Gantt with React.

There are React demos that have been created  using <a href="https://github.com/facebook/create-react-app" target="_blank">create-react-app</a> script which run either in development mode or can be built for production. They are located in `examples/react/javascript` folder. The demos are ready for direct viewing (in production mode) here: <a href="../examples/#Integration/React" target="_blank">React Integration Examples</a>.

If you want to run an example locally in development mode change to its directory and run:

    npm install
    npm start

and then navigate to <a href="http://localhost:3000" target="_blank">http://localhost:3000</a>. If you modify the example code while running it locally it is automatically re-built and updated in the browser allowing you to see your changes immediately.

You can also build the examples, or your own application, for production by running:

    npm install
    npm run build

The built production version is then located in `build` directory that can be deployed to your production server.

For more information on React, please visit <a href="https://reactjs.org/" target="_blank">reactjs.org</a>.

## Integrating Gantt with React
Although the Gantt is a very complex and sophisticated component, it is very easy to use. All the Gantt needs is:

1. a configuration object
2. an element to render to


### Gantt configuration
The recommended practice is to keep Gantt configuration in a separate file from which it is imported and passed to the Gantt constructor. The code would then look similar to the following:

```jsx
import { Gantt } from 'bryntum-gantt';
import ganttConfig from './ganttConfig.js';

ganttConfig.appendTo = 'container';

const gantt = new Gantt(ganttConfig);
```

where `ganttConfig.js` would contain configuration similar to the following:
```jsx
export default {
    startDate : '2019-06-20 08:00:00',
    project : new ProjectModel({
        transport       : {
            load : {
                url : '...'
            }
        }
    }),

    columns : [...]

    // other config options
}
```
To find out more about all the available configuration options of the Bryntum Gantt, please consult the <a href="#api">API docs</a>.

Note: `bryntum-gantt` is a locally installed package that contains Bryntum Gantt and all its other supporting widgets. See `package.json` of any example to understand how it is configured:
```json
"dependencies": {
    "bryntum-gantt": "file:../../../../build"
    ... other dependencies
}

```


### Rendering to an element
The Bryntum Gantt needs an existing HTML element to render into. It can be declared as `appendTo`, `insertBefore` or `insertFirst` property with values being either an HTMLElement instance or a string which is  the id of an element. The Gantt renders itself as the part of its instantiation if any of the above properties is specified in the config passed into constructor.

In the above example we assign `ganttConfig.appendTo = 'container'`, which is the id of the containing element, for example `<div id="container"></div>`.

If we do not want to render Gantt during instantiation you can omit the above properties and render the component manually at the appropriate time by passing the container to the `render` method. It would look like this:

```jsx
import Gantt from 'bryntum-gantt';
import ganttConfig from './ganttConfig.js'

// some other code...

const gantt = new Gantt(ganttConfig);

// some other code...

gantt.render('container');

```

The most common scenario is to render Gantt in the `componentDidMount` method if you use classes in your application or in the `useEffect` initial call if you use React hooks.

### Rendering in React component
The example of using Gantt in a React component is the following:
```jsx
import React, { Component } from 'react';
import Gantt from 'bryntum-gantt';
import ganttConfig from './ganttConfig'

class myGantt extends Component {
    componentDidMount() {
        const gantt = new Gantt({
            ...ganttConfig,
            appendTo: this.el
        });
        this.ganttEngine = gantt;
    }

    componentWillUnmount() {
        this.ganttEngine.destroy();
    }

    render() {
        return ('<div ref={el => this.el = el}></div>')
    }
}

export default myGantt;
```
Here we let React to create element we return from `render` method keeping the reference to it and when the element will become available in `componentDidMount` lifecycle method we configure and create Bryntum Gantt itself.

Keeping its reference in the class property `ganttEngine` is important for it's proper destroy in `componentWillUnmount` or in other methods of this class or for outside layers wishing to access the Gantt.

### Rendering in React Hooks
If you are using React Hooks then Gantt could be integrated as follows:

```jsx
import React, { useEffect, useRef } from 'react';
import { Gantt } from 'gantt';
import ganttConfig from './ganttConfig';

cont myGantt = props => {

    const elementRef = useRef(),
          ganttRef = userRef();

    useEffect(() => {
        ganttRef.current = new Gantt({
            ...ganttConfig,
            appendTo: elementRef.current
        });
        return () => {
            if(ganttRef.current) {
                ganttRef.current.destroy();
            }
        };
    }, []);

    return (
        <div ref={elementRef}></div>
    )
}

export default myGantt;
```

`useEffect` above will run only once on the component initialization (due to empty array [] passed as the second argument) and we create and render Gantt there. The function returned is run on component destroy.

### Updating properties at runtime
At this point we have Gantt properly configured and rendered on the the screen so now it is time to pass to it changes that may occur as results of user actions, if you need it.

As with rendering there are two possible scenarios: React Class Component and React Functional Component using hooks.

For Component, we would use `shouldComponentUpdate` function that is called by React when a component property changes. In the function we would analyze what has changed and what action to take: either to ignore the change if it is not related to Gantt or to pass it to `ganttEngine` by calling its method or assigning a new value to its property.

Do not forget to return `false` from this method to prevent React from destroying and re-rendering our Gantt.

For Functional Component we would call `useEffect` again, now with a list of properties as the second argument. Function passed as the first argument would then run whenever any of the listed properties changes when we would propagate this change down to `ganttRef.current`.

### Listening to Gantt events
The last missing piece is listening and reacting to events fired by the Gantt chart. For example, listening to selection change as the user clicks on tasks.

You can install listeners on Gantt by

* passing `listeners` config option
* calling `on` or `addListener` method

Listeners config could look similar to this:

```jsx
    listeners : {
        selectionchange : (event) {
            console.log(event);
        }
    }
```

The same effect can be achieved by calling `on` method on Gantt instance:

```jsx
ganttRef.current.on('selectionchange', (event) => {
    console.log(event);
})
```

## Further reading
* For more information on config options, features, events and methods consult please the <a href="#api">API docs</a>
* For more information on React see the <a href="https://reactjs.org" target="_blank">React docs</a>
* For more information on Create React App scripts see <a href="https://facebook.github.io/create-react-app/" target="_blank">the documentation</a>
* If you have any questions related to the integration or Gantt itself you can always ask on <a href="https://www.bryntum.com/forum/">our forum</a>


<p class="last-modified">Last modified on 2019-07-05 8:45:15</p>