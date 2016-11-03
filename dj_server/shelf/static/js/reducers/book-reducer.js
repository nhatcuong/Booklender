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
  if (action.type == 'LEND_BOOK' && action.borrower) {
    var lendedBook = Object.assign({}, state.book, {
      status: 'lended',
      borrowerId: action.borrower.id
    });
    var newBookList = state.bookList.slice();
    var index = newBookList.indexOf(state.book);
    newBookList.splice(index, 1, lendedBook)
    return Object.assign({}, state, {book: lendedBook, bookList: newBookList});
  }
  if (action.type == 'GET_BACK') {
    var returnedBook = Object.assign({}, state.book, {
      status: 'on_shelf',
      borrowerId: undefined
    });
    var newBookList = state.bookList.slice();
    var index = newBookList.indexOf(state.book);
    newBookList.splice(index, 1, returnedBook);
    return Object.assign({}, state, {book: returnedBook, bookList: newBookList});
  }
  return state;
};

export default bookReducer;