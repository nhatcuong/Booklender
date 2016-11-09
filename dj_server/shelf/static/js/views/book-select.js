import React from "react";
import {connect} from "react-redux";
import {SelectMixin} from "./mixins";
import * as api from "../api";

const mapStateToProps = function(store) {
  return {
    selected: store.bookState.book,
    list: store.bookState.bookList
  };
};

const mapDispatchToProps = function(dispatch, ownProps) {
  return {
    onSelect: function (book) {
      dispatch({type: 'SELECT_BOOK', item: book});
      // if (book.status == "lended") {
      //   api.getCurrentBorrowerOfBook(this, book.id,
      //     function (borrower) {
      //       dispatch({type: 'SELECT_BORROWER', item: borrower});
      //       book.borrowerId = borrower.id
      //       dispatch({type: 'SELECT_BOOK', item: book});
      //     },
      //     function () {}
      //   );
      // // }
      // else dispatch({type: 'SELECT_BOOK', item: book});
    },
    onLoadBooks: function(books) {
      dispatch({type: 'LOAD_BOOKS', books: books});
    }
  }
}

var BookSelect = React.createClass({
  mixins: [SelectMixin],
  title: 'Books',
  selectEventType: 'SELECT_BOOK',
  componentDidMount: function() {
    api.allBooks(this,
      function (data) {
        this.props.onLoadBooks(data);
      },
      function (xhr, status, err) {}
    );
  },
  getOptions: function () {
    return this.props.list.map(
      function (book) {
        return (
          <option key={book.id} value={book.id}>{book.title} - {book.author}</option>
        )
      }
    );
  },
  divBookStatus: function () {
    var status = this.props.selected.status;
    var msg = status == 'on_shelf' ? 'is on shelf' : '';
    if (msg) {
      return (
        <div className="book-status">{msg}</div>
      )
    }
    return null;
  },
  subDivComp: function() {
    return this.divBookStatus()
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(BookSelect);
