/**
 * @author Saki
 * @date 2019-02-28 20:21:01
 * @Last Modified by: Saki
 * @Last Modified time: 2019-04-24 17:57:13
 */

// libraries
import React, { Component, Fragment } from 'react';

// our stuff
import Header from '../components/header/Header.js';
import Panel from './Panel';

class Main extends Component {
    render() {
        return (
            <Fragment>
                <Header titleHref=".."/>
                <Panel />
            </Fragment>
        );
    }
} // eo class Main

export default Main;

// eof
