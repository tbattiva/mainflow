import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Mainflow from './pages/Mainflow';
import Register from './pages/Register';
import Logon from './pages/Logon';

function Routes(){
    return (
        <BrowserRouter>
            <Switch>
                <Route path='/panel' component={Mainflow}></Route>
                <Route path='/register' component={Register}></Route>
                <Route path='/' component={Logon}></Route>
            </Switch>
        </BrowserRouter>
    )
}


export default Routes;