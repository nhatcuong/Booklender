import React from "react";
import { connect } from 'react-redux';
import * as api from '../api';

var mapStateToProps = function(store) {
  return {
    book: store.bookState.book,
    borrower: store.borrowerState.borrower
  }
}

var mapDispatchToProps = function(dispatch, ownProps) {
  return {
    onLendBook: function(borrower) {
      dispatch({type: 'LEND_BOOK', borrower: borrower});
    },
    onGetBookBack: function() {
      dispatch({type: 'GET_BACK'});
    }
  }
}

var ActionBox = React.createClass({
  lendFunction: function () {
    api.lendBook(this, this.props.book.id, this.props.borrower.id,
      function () {
        this.props.onLendBook(this.props.borrower);
      },
      function () {}
    )
  },
  getBackFunction: function () {
    api.getBack(this, this.props.book.id,
      function () {
        this.props.onGetBookBack();
      },
      function () {}
    )
  },
  render: function () {
    var canLendBook =
      this.props.book.id && this.props.borrower.id &&
      this.props.book.status != "lended";
    var canGetBookBack =
      this.props.book && this.props.borrower &&
      this.props.book.borrowerId == this.props.borrower.id;
    var button;
    if (canLendBook) {
      button = (
        <button className="action-button" onClick={this.lendFunction}>
          {"Lend to"}
        </button>
      );
    }
    else if (canGetBookBack) {
      button = (
        <button className="action-button" onClick={this.getBackFunction}>
          {"Get back"}
        </button>
      );
    }
    return (
      <div className="actionBox">
        {button}
      </div>
    )
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ActionBox)
