import { combineReducers } from 'redux';

import bookReducer from './book-reducer';
import borrowerReducer from './borrower-reducer';

export default combineReducers({
  bookState: bookReducer,
  borrowerState: borrowerReducer
})
