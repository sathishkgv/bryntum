/**
 * @author Saki
 * @date 2019-05-24 09:05:15
 * @Last Modified by: Saki
 * @Last Modified time: 2019-05-24 09:05:39
 */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BryntumAngularSharedModule } from 'bryntum-angular-shared';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BryntumAngularSharedModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }

// eof