"use strict";

(function () {
  var targetElement = document.querySelector('div[data-file="column/TreeColumn.js"] .external-target'); // User may already have navigated away from the documentation part that shows the example

  if (!targetElement) return; //START
  // grid with TreeColumn

  var grid = new Grid({
    appendTo: targetElement,
    // makes grid as high as it needs to be to fit rows
    autoHeight: true,
    features: {
      tree: true
    },
    store: {
      tree: true,
      data: [{
        name: 'ABBA',
        iconCls: 'b-icon b-fa-users',
        children: [{
          name: 'Anni-Frid',
          iconCls: 'b-icon b-fa-user'
        }, {
          name: 'Bjorn',
          iconCls: 'b-icon b-fa-user'
        }, {
          name: 'Benny',
          iconCls: 'b-icon b-fa-user'
        }, {
          name: 'Agnetha',
          iconCls: 'b-icon b-fa-user'
        }]
      }, {
        name: 'Roxette',
        iconCls: 'b-icon b-fa-users',
        children: [{
          name: 'Per',
          iconCls: 'b-icon b-fa-user'
        }, {
          name: 'Marie',
          iconCls: 'b-icon b-fa-user'
        }]
      }]
    },
    columns: [{
      type: 'tree',
      field: 'name',
      text: 'Name',
      flex: 1
    }]
  }); //END
})();
