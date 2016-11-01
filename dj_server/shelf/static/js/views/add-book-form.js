import React from 'react';
import { connect } from 'react-redux';

import * as api from '../api';

var mapDispatchToProps = function(dispatch, ownProps) {
  return {
    onNew: function (book) {
      dispatch({
        type: 'NEW_BOOK',
        newBook: book
      });
    }
  };
}

var AddBookForm = React.createClass({
  getInitialState: function () {
    return {title: '', author: ''};
  },
  handleTitleChange: function (e) {
    this.setState({title: e.target.value})
  },
  handleAuthorChange: function (e) {
    this.setState({author: e.target.value})
  },
  handleSubmit: function (e) {
    e.preventDefault();
    var title = this.state.title.trim();
    var author = this.state.author.trim();
    if (title && author) {
      api.addBook(this, title, author,
        function (data) {
          this.props.onNew(data);
          this.setState({title: '', author: ''});
        },
        function (xhr, status, err) {}
      );
    }
  },
  render: function () {
    return (
      <form className="addForm formInputText" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Title" value={this.state.title}
          onChange={this.handleTitleChange}/>
        <input type="text" placeholder="Author" value={this.state.author}
          onChange={this.handleAuthorChange}/>
        <input type="submit" value="Add Book"/>
      </form>
    );
  }
});

export default connect(null, mapDispatchToProps)(AddBookForm)


