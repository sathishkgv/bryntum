(function() {
    const targetElement = document.querySelector('div[data-file="widget/List.js"] .external-target');
    //START
    new List({
        width: 200,
        appendTo: targetElement,
        itemTpl: item => `<i>${item.text}</i>`,
        items: [{
            text: 'Add'
        }, {
            text: 'Remove'
        }],
        onItem({record}) {
            WidgetHelper.toast('You clicked ' + record.text);
        }
    });
    //END
})();