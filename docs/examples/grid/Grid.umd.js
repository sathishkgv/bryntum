"use strict";

/* eslint-disable no-unused-vars,no-undef */
(function () {
  var targetElement = document.querySelector('div[data-file="grid/Grid.js"] .external-target'); // User may already have navigated away from the documentation part that shows the example

  if (!targetElement) return;
  targetElement.innerHTML = '<p>A basic grid with no extra configuration, this what you get straight out of the box</p>'; //START
  // grid with basic configuration

  var grid = new Grid({
    appendTo: targetElement,
    // makes grid as high as it needs to be to fit rows
    autoHeight: true,
    columns: [{
      field: 'name',
      text: 'Name'
    }, {
      field: 'job',
      text: 'Job',
      renderer: function renderer(_ref) {
        var value = _ref.value;
        return value || 'Unemployed';
      }
    }],
    data: [{
      name: 'Bill',
      job: 'Retired'
    }, {
      name: 'Elon',
      job: 'Visionary'
    }, {
      name: 'Me'
    }]
  }); //END
})();
