// require('../css/lending_page.scss')

import React from 'react';
import ReactDOM from 'react-dom';
import * as Redux from 'redux';
import {connect, Provider} from 'react-redux';

import reducers from './reducers';
import MainBox from './views/main-box';

var store = Redux.createStore(reducers);

ReactDOM.render(
  (<Provider store={store}>
    <MainBox/>
  </Provider>),
  document.getElementById('content')
);
