/**
 * @author Saki
 * @date 2019-03-15 16:48:15
 * @Last Modified by: Saki
 * @Last Modified time: 2019-04-24 17:58:52
 *
 * Page header container component. Contains also controls (tools).
 * It is implemented as a functional component using React hooks that
 * were introduced in React 16.8.0. If you cannot upgrade to that or
 * later version of React then you must convert this component to class.
 */
// libraries
import React from 'react';

// our stuff (buttons)
// import Tools from '../../bryntum-common/Tools';
import { Tools } from 'bryntum-react-shared';
import Fullscreen from './Fullscreen.js';

const header = props => {
    const href = props.titleHref || '#';

    return (
        <header className="demo-header">
            <div id="title-container">
                <a id="title" href={href}>Gantt Advanced React demo</a>
            </div>
            <Tools>
                <Fullscreen container='tools'/>
            </Tools>
        </header>
    );

}; // eo function header

export default header;

// eof
