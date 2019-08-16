"use strict";

(function () {
  var targetElement = document.querySelector('div[data-file="guides/features/TreeGrid.js"]');
  if (!targetElement) return; //START

  var tree = new TreeGrid({
    appendTo: targetElement,
    autoHeight: true,
    data: [{
      name: 'ABBA',
      iconCls: 'b-icon b-fa-users',
      born: '',
      children: [{
        name: 'Anni-Frid',
        born: 1945,
        iconCls: 'b-icon b-fa-user'
      }, {
        name: 'Bjorn',
        born: 1945,
        iconCls: 'b-icon b-fa-user'
      }, {
        name: 'Benny',
        born: 1946,
        iconCls: 'b-icon b-fa-user'
      }, {
        name: 'Agnetha',
        born: 1950,
        iconCls: 'b-icon b-fa-user'
      }]
    }, {
      name: 'Roxette',
      iconCls: 'b-icon b-fa-users',
      born: '',
      children: [{
        name: 'Per',
        born: 1959,
        iconCls: 'b-icon b-fa-user'
      }, {
        name: 'Marie',
        born: 1958,
        iconCls: 'b-icon b-fa-user'
      }]
    }],
    columns: [{
      type: 'tree',
      field: 'name',
      text: 'Name',
      flex: 1
    }, {
      type: 'number',
      field: 'born',
      text: 'Born',
      flex: 1
    }]
  }); //END
})();
