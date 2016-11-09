import React from "react";
import {connect} from "react-redux";
import BookSelect from "./book-select";
import BorrowerSelect from "./borrower-select";
import AddBookForm from "./add-book-form";
import AddBorrowerForm from "./add-borrower-form";
import CenterBox from "./center-box";
import LendingInfo from "./lending-info-box";


const mapStateToProps = function(store) {
  return {
    book: store.bookState.book
  };
};

var MainBox = React.createClass({
  getRightColComponent: function() {
    if (this.props.book.current_lending) {
      return (
        <div className="rightCol">
          <LendingInfo/>
        </div>
      );
    }
    return (
      <div className="rightCol">
        <BorrowerSelect/>
        <AddBorrowerForm/>
      </div>
    );
  },
  render: function () {
    return (
      <div className="mainBox">
        <div className="leftCol">
          <BookSelect/>
          <AddBookForm/>
        </div>
        <div className="centerCol">
          <CenterBox/>
        </div>
        {this.getRightColComponent()}
      </div>
    )
  }
});

export default connect(mapStateToProps)(MainBox);