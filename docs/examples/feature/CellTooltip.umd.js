"use strict";

/* eslint-disable no-unused-vars,no-undef */
(function () {
  var targetElement = document.querySelector('div[data-file="feature/CellTooltip.js"] .external-target'); // User may already have navigated away from the documentation part that shows the example

  if (!targetElement) return;
  targetElement.innerHTML = '<p>Hover a cell to show the cell tooltip</p>'; //START
  // grid with cell editing

  var grid = new Grid({
    appendTo: targetElement,
    // makes grid as high as it needs to be to fit rows
    autoHeight: true,
    features: {
      // enable CellTooltip and configure a default renderer
      cellTooltip: {
        tooltipRenderer: function tooltipRenderer(_ref) {
          var record = _ref.record,
              column = _ref.column;
          return record[column.field];
        },
        hoverDelay: 200
      }
    },
    data: DataGenerator.generateData(5),
    columns: [// basic columns has a TextField as editor by default
    {
      field: 'name',
      text: 'Name',
      flex: 1
    }, // a custom editor can be specified
    {
      field: 'city',
      text: 'City',
      flex: 1,
      editor: {
        type: 'combo',
        items: ['Stockholm', 'New York', 'Moscow']
      }
    }, // column types may specify an editor
    // NumberColumn for example uses a NumberField
    {
      field: 'score',
      text: 'Score',
      flex: 1
    }, // specify editor: false to make a column "readonly"
    {
      type: 'number',
      field: 'age',
      text: 'Age (readonly)',
      flex: 1,
      editor: false
    }]
  }); //END
})();
