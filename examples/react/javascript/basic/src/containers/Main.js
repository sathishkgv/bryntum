/**
 * @author Saki
 * @date 2019-02-05 17:45:31
 * @Last Modified by: Saki
 * @Last Modified time: 2019-06-29 21:17:37
 *
 * Implements the top level Main container
 */
// libraries
import React, { Component, Fragment } from 'react';
import { BryntumGantt } from 'bryntum-react-shared';

// our stuff
import Header from '../components/Header.js';
import { ProjectModel } from 'bryntum-gantt/gantt.umd';

class Main extends Component {

    /**
     * render method
     */
    render = () => {
        const project = new ProjectModel({
            autoLoad : true,
            transport : {
                load : {
                    url : 'data/launch-saas.json'
                }
            }
        });
        return (
            <Fragment>
                <Header
                    headerUrl='..'
                />
                <BryntumGantt
                    project={project}
                    columns={[
                        { type : 'name', field : 'name', width : 250 }
                    ]}
                    viewPreset="weekAndDayLetter"
                    barMargin={10}
                />
            </Fragment>
        );
    }; // eo function render
} // eo class Main

export default Main;

// eof
