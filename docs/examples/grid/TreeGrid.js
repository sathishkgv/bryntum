(function () {
const targetElement = document.querySelector('div[data-file="grid/TreeGrid.js"] .external-target');
// User may already have navigated away from the documentation part that shows the example
if (!targetElement) return;

targetElement.innerHTML = '<p>A basic TreeGrid with minimal configuration:</p>';
//START
// basic TreeGrid
let tree = new TreeGrid({
    appendTo : targetElement,

    // makes tree as high as it needs to be to fit rows
    autoHeight : true,

    data : [
        {
            name     : 'ABBA',
            iconCls  : 'b-icon b-fa-users',
            born     : null,
            expanded : true,
            children : [
                { name : 'Anni-Frid', born : 1945, iconCls : 'b-icon b-fa-user' },
                { name : 'Bjorn', born : 1945, iconCls : 'b-icon b-fa-user' },
                { name : 'Benny', born : 1946, iconCls : 'b-icon b-fa-user' },
                { name : 'Agnetha', born : 1950, iconCls : 'b-icon b-fa-user' }
            ]
        },
        {
            name     : 'Roxette',
            iconCls  : 'b-icon b-fa-users',
            born     : null,
            children : [
                { name : 'Per', born : 1959, iconCls : 'b-icon b-fa-user' },
                { name : 'Marie', born : 1958, iconCls : 'b-icon b-fa-user' }
            ]
        }
    ],

    columns : [
        { type : 'tree', field : 'name', text : 'Name', flex : 1 },
        { type : 'number', field : 'born', text : 'Born', flex : 1 }
    ]
});
//END
})();
