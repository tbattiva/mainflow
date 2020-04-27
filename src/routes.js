import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Logon from './pages/Logon';

function Routes(){
    return (
        <BrowserRouter>
            <Switch>
                <Route path='/' component={Logon}></Route>
            </Switch>
        </BrowserRouter>
    )
}


export default Routes;