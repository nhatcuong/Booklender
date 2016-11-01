import React from 'react';
import ReactDOM from 'react-dom';
import * as Redux from 'redux';
import {connect, Provider} from 'react-redux';

import BookSelect from './views/book-select';
import BorrowerSelect from './views/borrower-select';
import AddBookForm from './views/add-book-form';
import AddBorrowerForm from './views/add-borrower-form';
import ActionBox from './views/action-box';

import reducers from './reducers';

var store = Redux.createStore(reducers);

var LendingBox = React.createClass({
  render: function () {
    return (
      <Provider store={store}>
        <div className="lendingBox">
          <div className="leftCol">
            <BookSelect/>
            <AddBookForm/>
          </div>
          <div className="centerCol">
            <ActionBox/>
          </div>
          <div className="rightCol">
            <BorrowerSelect/>
            <AddBorrowerForm/>
          </div>
        </div>
      </Provider>
    )
  }
});

ReactDOM.render(
  <LendingBox/>,
  document.getElementById('content')
);
