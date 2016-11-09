import React from "react";
import {connect} from "react-redux";
import * as api from "../api";
import moment from 'moment';

var mapStateToProps = function(store) {
  return {
    book: store.bookState.book
  };
};

var mapDispatchToProps = function(dispatch, ownProps) {
  return {
    onGetBack: function() {
      dispatch({type: 'GET_BACK'});
    }
  };
};

var GetBackButton = React.createClass({
  getBackFunction: function () {
    api.getBack(this, this.props.book.id,
      function () {
        this.props.onGetBack();
      },
      function () {}
    )
  },
  render: function() {
    return (
      <button className="action-button" onClick={this.getBackFunction}>
        {"Get back"}
      </button>
    );
  }
});

var LendingInfoBox = React.createClass({
  render: function() {
    var lending = this.props.book.current_lending;
    if (!lending) {
      return undefined;
    }
    return (
      <div className="lending-info-box">
        <div className="borrower-name label-input-like">
          {lending.borrower.name}
        </div>
        <div className="since-date label-input-like">
          {'since'} {moment(lending.start_date).format('MMMM Do YYYY')}
        </div>
        <GetBackButton book={this.props.book} onGetBack={this.props.onGetBack}/>
      </div>
    );
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(LendingInfoBox);
