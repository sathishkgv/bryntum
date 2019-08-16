/**
 * @author Saki
 * @date 2019-05-22 18:21:57
 * @Last Modified by: Saki
 * @Last Modified time: 2019-06-27 09:51:21
 */
import { Component, OnInit } from '@angular/core';
import ganttConfig from './ganttConfig';
import { BryntumWidgetAdapter } from 'bryntum-gantt/gantt.umd.js';

@Component({
    selector    : 'app-root',
    templateUrl : './app.component.html',
    styleUrls   : ['./app.component.scss']
})
export class AppComponent implements OnInit{

    title = 'Task editor customization Angular demo';
    ganttConfig = ganttConfig;
    
    ngOnInit(): void {
    } // eo function ngOnInit

} // eo class AppComponent

// eof
