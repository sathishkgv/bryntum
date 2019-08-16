/**
 * @author Saki
 * @date 2019-06-08 18:49:27
 * @Last Modified by: Saki
 * @Last Modified time: 2019-06-28 22:03:39
 */
import React, { Component } from 'react';

// we import gantt.umd for IE11 compatibility only. If you don't use IE import:
// import { WidgetHelper, ObjectHelper } from 'bryntum-gantt';
import { WidgetHelper, ObjectHelper } from 'bryntum-gantt/gantt.umd';

class BryntumWidget extends Component {

    static defaultProps = {
    }

    /* #region configs */
    // this is only a subset of all possible widget properties of all types
    configs = [
        'activeTab',
        'allowOver',
        'anchorToTarget',
        'animateTabChange',
        'autoClose',
        'autoComplete',
        'autoExpand',
        'autoShow',
        'badge',
        'bbar',
        'checked',
        'chipView',
        'clearable',
        'clearHandler',
        'closable',
        'closeAction',
        'closeParent',
        'cls',
        'color',
        'dataset',
        'defaults',
        'disabled',
        'displayField',
        'displayValueRenderer',
        'editable',
        'emptyText',
        'filterOperator',
        'filterSelected',
        'flex',
        'focusOnHover',
        'footer',
        'forElement',
        'forSelector',
        'format',
        'header',
        'height',
        'hidden',
        'hideDelay',
        'highlightExternalChange',
        'html',
        'icon',
        'iconTpl',
        'inline',
        'inputWidth',
        'itemCls',
        'items',
        'keyStrokeChangeDelay',
        'keyStrokeFilterDelay',
        'label',
        'labelWidth',
        'layoutStyle',
        'listCls',
        'listeners',
        'listItemCls',
        'loadingMsg',
        'margin',
        'max',
        'menu',
        'min',
        'minChars',
        'mode',
        'mouseOffsetX',
        'mouseOffsetY',
        'multiSelect',
        'onAction',
        'onChange',
        'onClick',
        'onItem',
        'picker',
        'pickerAlignElement',
        'pickerFormat',
        'pickerWidth',
        'placeholder',
        'pressed',
        'readOnly',
        'required',
        'resize',
        'ripple',
        'selected',
        'showOnClick',
        'showOnHover',
        'showProgress',
        'showTooltip',
        'showValue',
        'step',
        'store',
        'style',
        'tabMinWidth',
        'tabMaxWidth',
        'tbar',
        'text',
        'timeout',
        'title',
        'toggle',
        'toggleable',
        'toggleGroup',
        'tools',
        'tooltip',
        'trapFocus',
        'triggerAction',
        'triggers',
        'type',
        'unit',
        'useAbbreviation',
        'validateFilter',
        'value',
        'valueField',
        'visible',
        'width'
    ];
    /* #endregion */

    /* #region skipUpdateProps */
    // this is only a subset of props that should not be updated
    skipUpdateProps = [
        'clearable',
        'listeners',
        'placeholder',
        'triggers',
        'type'
    ];
    /* #endregion */
    
    // runs when React rendered DOM so we render the widget into that dom
    componentDidMount() {
        const config = {
            appendTo : this.props.container || this.el
        }
        this.configs.forEach(configName => {
            if(undefined !== this.props[configName])
            config[configName] = this.props[configName];
        });
        this.widget = WidgetHelper.createWidget(config);

    } // eo function componentDidMount

    shouldComponentUpdate(nextProps, nextState) {
        const 
            widget = this.widget,
            props = this.props,
            configs = this.configs,
            skipUpdateProps = this.skipUpdateProps
        ;
        Object.keys(props).forEach(propName => {
            // we update only changed props skipping the listed props
            if(configs.includes(propName) && !skipUpdateProps.includes(propName) && !ObjectHelper.isEqual(props[propName], nextProps[propName])) {
                widget[propName] = nextProps[propName];
            }
        });

        // we don't let React to re-render this component
        return false;
    } // eo function shouldComponentUpdate

    // let's destroy the underlying Bryntum widget
    componentWillUnmount() {
        this.widget.destroy();
    } // eo function componentWillUnmount

    render() {
        return this.props.container ? null : <div ref={el => this.el = el}></div>;

    } // eo function render

} // eo class BryntumWidget

export default BryntumWidget;

// eof
