const initialState = {
  borrower: {id: 0},
  borrowerList: []
}

var borrowerReducer = function(state = initialState, action) {
  if (action.type == 'SELECT_BORROWER') {
    return Object.assign({}, state, {borrower: action.item})
  }
  if (action.type == 'NEW_BORROWER') {
    return {
      borrower: action.newBorrower,
      borrowerList: state.borrowerList.concat([action.newBorrower])
    }
  }
  if (action.type == 'LOAD_BORROWERS') {
    return Object.assign({}, state, {borrowerList: action.borrowers});
  }
  return state
}

export default borrowerReducer;