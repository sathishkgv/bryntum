/**
 * @author Saki
 * @date 2019-04-29 16:36:33
 * @Last Modified by: Saki
 * @Last Modified time: 2019-05-22 17:24:14
 * 
 * Angular wrapper for Bryntum Fullscreen button
 */

/* <remove-on-release> */
/* cSpell: ignore toggleable */
/* </remove-on-release> */

import { 
    Component, 
    OnInit,
    OnDestroy,
    ElementRef
} from '@angular/core';
import { 
    Fullscreen,
    WidgetHelper
// If you don't need IE11 compatibility import from 'bryntum-scheduler'
// } from 'bryntum-scheduler';
} from 'bryntum-gantt/gantt.umd.js';

@Component({
    selector : 'bry-fullscreen',
    template : ''
})
export class FullscreenComponent implements OnInit, OnDestroy {
  
    // class variables
    private elementRef : ElementRef;
    private button     : any;

    /**
     * Saves element to have container to render the button to
     * @param element 
     */
    constructor(element : ElementRef) {
        this.elementRef = element;
    } // eo function constructor

    /**
     * Runs once on component init. Creates and renders Bryntum Button
     */
    ngOnInit() {
        if(!Fullscreen.enabled) {
            return;
        }
        const button = WidgetHelper.createWidget({
            type : 'button',
            appendTo : this.elementRef.nativeElement,
            icon : 'b-icon b-icon-fullscreen',
            tooltip : 'Fullscreen',
            toggleable : true,
            cls : 'b-blue b-raised',
            onToggle : ({ pressed}) => {
                if(pressed) {
                    Fullscreen.request(document.documentElement);
                }
                else {
                    Fullscreen.exit();
                }
            }
        });

        Fullscreen.onFullscreenChange(() => {
            button['pressed'] = Fullscreen.isFullscreen;
        });

        this.button = button;
        
    } // eo function ngOnInit

    /**
     * Destroys the Bryntum button
     */
    ngOnDestroy() {
        if(this.button) {
            this.button.destroy();
        }
    } // eo function ngOnDestroy
    
} // eo class FullscreenComponent

// eof
