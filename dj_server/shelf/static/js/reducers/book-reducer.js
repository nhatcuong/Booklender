const initialState = {
  book: {id: 0},
  bookList: []
}

var bookReducer = function(state = initialState, action) {
  if (action.type == 'SELECT_BOOK') {
    return Object.assign({}, state, {book: action.item})
  }
  if (action.type == 'NEW_BOOK') {
    return {
      book: action.newBook,
      bookList: state.bookList.concat([action.newBook])
    }
  }
  if (action.type == 'LOAD_BOOKS') {
    return Object.assign({}, state, {bookList: action.books});
  }
  return state;
};

export default bookReducer;