import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import store, { history } from './store';
import App from './app'


// Styles
// Import Font Awesome Icons Set
import 'font-awesome/css/font-awesome.min.css';
// Import Simple Line Icons Set
import 'simple-line-icons/css/simple-line-icons.css';
// Import Main styles for this application
import '../scss/style.scss'
// Temp fix for reactstrap
import '../scss/core/_dropdown-menu-right.scss'

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div style={{height:"100%"}}>
        <App />
      </div>
    </ConnectedRouter>
  </Provider>,
	document.querySelector('#root')
);