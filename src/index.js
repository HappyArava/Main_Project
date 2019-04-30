import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Router,Route,browserHistory } from 'react-router';
import Admin ,{ Sorry }from './Compos/Admin.js';


ReactDOM.render(

    <Router history={browserHistory} >
        <Route path="/" component={App} />
        <Route path="/admin" exact component={Admin} />
        <Route path="/*" component={Sorry} />
    </Router>
                        , document.getElementById('root'));
          //    {/* <App/> */} This is App Component Call              

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
