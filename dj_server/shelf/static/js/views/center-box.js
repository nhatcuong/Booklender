import React from "react";
import {connect} from "react-redux";
import * as api from "../api";

var mapStateToProps = function(store) {
  return {
    book: store.bookState.book,
    borrower: store.borrowerState.borrower
  }
}

var mapDispatchToProps = function(dispatch, ownProps) {
  return {
    onLendBook: function(lending) {
      dispatch({type: 'LEND_BOOK', lending: lending});
    },
    onGetBookBack: function() {
      dispatch({type: 'GET_BACK'});
    }
  }
}

var CenterBox = React.createClass({
  lendFunction: function () {
    api.lendBook(this, this.props.book.id, this.props.borrower.id,
      function (resp) {
        this.props.onLendBook(resp['lending']);
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
      this.props.book && this.props.book.current_lending;
    var button = (
      <button className="action-button" onClick={this.lendFunction}>
        {"Lend to"}
      </button>
    );
    var lendedLabel = (
      <div className="label">{"is lended to"}</div>
    );
    var content = canLendBook ? button :
      canGetBookBack ? lendedLabel : undefined;
    // else if (canGetBookBack) {
    //   button = (
    //     <button className="action-button" onClick={this.getBackFunction}>
    //       {"Get back"}
    //     </button>
    //   );
    // }
    return (
      <div className="actionBox">
        {content}
      </div>
    )
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(CenterBox)
