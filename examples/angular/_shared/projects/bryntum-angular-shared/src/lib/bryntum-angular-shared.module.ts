/**
 * @author Saki
 * @date 2019-05-22 12:47:21
 * @Last Modified by: Saki
 * @Last Modified time: 2019-05-22 17:27:43
 */
import { NgModule } from '@angular/core';
import { GanttComponent } from './gantt.component';
import { FullscreenComponent } from './fullscreen.component';

@NgModule({
    declarations: [
        GanttComponent,
        FullscreenComponent
    ],
    imports: [
    ],
    exports: [
        GanttComponent,
        FullscreenComponent
    ]
})
export class BryntumAngularSharedModule { }

// eof
