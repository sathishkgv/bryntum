## Basic React demo

This example shows simple Gantt configuration running in React app. Although simple, yet it shows how to use Bryntum Gantt.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Dependency

The example requires package `bryntum-react-shared` that is located in `../../_shared` directory. This dependency has to be built first. To build it run:

    cd ../../_shared
    npm install
    npm run build

It is only necessary to build the shared package once, not for each example.

## Build

Run:

    npm install
    npm run build

to build the project. The build artifacts will be stored in the `build/` directory.

## Troubleshooting

In the case of compile error (`npm run build` or `npm start` fails) the first thing to try are the following steps:

    rm -rf node_modules package-lock.json
    npm install
    npm run build # or npm start


