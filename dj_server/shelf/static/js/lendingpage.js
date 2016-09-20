"use strict";

var SelectMixin = {
  render: function render() {
    if (this.props.list.length == 0) {
      return null;
    }
    return React.createElement(
      "div",
      { className: "select-list input-group" },
      React.createElement(
        "div",
        { className: "select-list-title" },
        this.title
      ),
      React.createElement(
        "select",
        { value: this.props.selected.id, onChange: this.props.onSelect },
        React.createElement(
          "option",
          { value: 0 },
          "--"
        ),
        this.getOptions()
      ),
      this.subDivComp()
    );
  }
};

var SelectAddBoxMixin = {
  getInitialState: function getInitialState() {
    return { list: [] };
  },
  componentDidMount: function componentDidMount() {
    this.updateList();
  },
  getItemFromId: function getItemFromId(id) {
    if (!id) return { id: 0 };
    var results = this.state.list.filter(function (item) {
      return item.id == id;
    });
    return results[0];
  },
  handleSelect: function handleSelect(e) {
    this.props.onSelect(this.getItemFromId(parseInt(e.target.value)));
  }
};

var BookSelect = React.createClass({
  displayName: "BookSelect",

  mixins: [SelectMixin],
  title: 'Books',
  getOptions: function getOptions() {
    return this.props.list.map(function (book) {
      return React.createElement(
        "option",
        { key: book.id, value: book.id },
        book.title,
        " - ",
        book.author
      );
    });
  },
  divBookStatus: function divBookStatus() {
    var status = this.props.selected.status;
    var msg = status == 'on_shelf' ? 'is on shelf' : status == 'lended' ? 'is lent' : '';
    if (msg) {
      return React.createElement(
        "div",
        { className: "book-status" },
        msg
      );
    }
    return null;
  },
  subDivComp: function subDivComp() {
    return this.divBookStatus();
  }
});

var AddBookForm = React.createClass({
  displayName: "AddBookForm",

  getInitialState: function getInitialState() {
    return { title: '', author: '' };
  },
  handleTitleChange: function handleTitleChange(e) {
    this.setState({ title: e.target.value });
  },
  handleAuthorChange: function handleAuthorChange(e) {
    this.setState({ author: e.target.value });
  },
  handleSubmit: function handleSubmit(e) {
    e.preventDefault();
    var title = this.state.title.trim();
    var author = this.state.author.trim();
    if (!title || !author) {
      return;
    }
    this.props.onSubmit({ title: title, author: author });
    this.setState({ title: '', author: '' });
  },
  render: function render() {
    return React.createElement(
      "form",
      { className: "addForm formInputText", onSubmit: this.handleSubmit },
      React.createElement("input", {
        type: "text",
        placeholder: "Title",
        value: this.state.title,
        onChange: this.handleTitleChange
      }),
      React.createElement("input", {
        type: "text",
        placeholder: "Author",
        value: this.state.author,
        onChange: this.handleAuthorChange
      }),
      React.createElement("input", {
        type: "submit", value: "Add Book"
      })
    );
  }
});

var BookBox = React.createClass({
  displayName: "BookBox",

  mixins: [SelectAddBoxMixin],
  updateList: function updateList() {
    apiAllBooks(this, function (data) {
      this.setState({ list: data });
    }, function (xhr, status, err) {});
  },
  handleAddSubmit: function handleAddSubmit(book) {
    apiAddBook(this, book.title, book.author, function (data) {
      this.setState({
        list: this.state.list.concat([data])
      });
      this.props.onSelect(data);
    }, function (xhr, status, err) {});
  },
  render: function render() {
    return React.createElement(
      "div",
      { className: "bookBox" },
      React.createElement(BookSelect, { selected: this.props.selected, list: this.state.list, onSelect: this.handleSelect }),
      React.createElement(AddBookForm, { onSubmit: this.handleAddSubmit })
    );
  }
});

var BorrowerSelect = React.createClass({
  displayName: "BorrowerSelect",

  mixins: [SelectMixin],
  title: 'Borrowers',
  getOptions: function getOptions() {
    return this.props.list.map(function (borrower) {
      return React.createElement(
        "option",
        { key: borrower.id, value: borrower.id },
        borrower.name
      );
    });
  },
  subDivComp: function subDivComp() {
    return undefined;
  }
});

var AddBorrowerForm = React.createClass({
  displayName: "AddBorrowerForm",

  getInitialState: function getInitialState() {
    return { name: '' };
  },
  handleNameChange: function handleNameChange(e) {
    this.setState({ name: e.target.value });
  },
  handleSubmit: function handleSubmit(e) {
    e.preventDefault();
    var name = this.state.name.trim();
    if (!name) {
      return;
    }
    this.props.onSubmit({ name: name });
    this.setState({ name: '' });
  },
  render: function render() {
    return React.createElement(
      "form",
      { className: "addForm formInputText", onSubmit: this.handleSubmit },
      React.createElement("input", {
        type: "text",
        placeholder: "Name",
        value: this.state.name,
        onChange: this.handleNameChange
      }),
      React.createElement("input", {
        type: "submit", value: "Add Borrower"
      })
    );
  }
});

var BorrowerBox = React.createClass({
  displayName: "BorrowerBox",

  mixins: [SelectAddBoxMixin],
  updateList: function updateList() {
    apiAllBorrowers(this, function (data) {
      this.setState({ list: data });
    }, function (xhr, status, err) {});
  },
  handleAddSubmit: function handleAddSubmit(borrower) {
    apiAddBorrower(this, borrower.name, function (data) {
      this.setState({
        list: this.state.list.concat([data])
      });
      this.props.onSelect(data);
    }, function (xhr, status, err) {});
  },
  render: function render() {
    return React.createElement(
      "div",
      { className: "borrowerBox" },
      React.createElement(BorrowerSelect, { selected: this.props.selected, list: this.state.list, onSelect: this.handleSelect }),
      React.createElement(AddBorrowerForm, { onSubmit: this.handleAddSubmit })
    );
  }
});

var ActionBox = React.createClass({
  displayName: "ActionBox",

  render: function render() {
    var canLendBook = this.props.book.id && this.props.borrower.id && this.props.book.status != "lended";
    var canGetBookBack = this.props.book && this.props.borrower && this.props.book.borrowerId == this.props.borrower.id;
    var button;
    if (canLendBook) {
      button = React.createElement(LendButton, { book: this.props.book, borrower: this.props.borrower, onLendBook: this.props.onLendBook });
    } else if (canGetBookBack) {
      button = React.createElement(GetBackButton, { book: this.props.book, onGetBookBack: this.props.onGetBookBack });
    }
    return React.createElement(
      "div",
      { className: "actionBox" },
      button
    );
  }
});

var LendButton = React.createClass({
  displayName: "LendButton",

  lendFunction: function lendFunction() {
    apiLendBook(this, this.props.book.id, this.props.borrower.id, function () {
      this.props.onLendBook();
    }, function () {});
  },
  render: function render() {
    return React.createElement(
      "button",
      { className: "action-button", onClick: this.lendFunction },
      "Lend to"
    );
  }
});

var GetBackButton = React.createClass({
  displayName: "GetBackButton",

  getBackFunction: function getBackFunction() {
    apiGetBack(this, this.props.book.id, function () {
      this.props.onGetBookBack();
    }, function () {});
  },
  render: function render() {
    return React.createElement(
      "button",
      { className: "action-button", onClick: this.getBackFunction },
      "Get back"
    );
  }
});

var LendingBox = React.createClass({
  displayName: "LendingBox",

  getInitialState: function getInitialState() {
    return {
      book: { id: 0 },
      borrower: { id: 0 }
    };
  },
  updateSelectBook: function updateSelectBook(book) {
    if (book.status == "lended") {
      apiGetCurrentBorrowerOfBook(this, book.id, function (borrower) {
        book.borrowerId = borrower.id;
        this.setState({
          borrower: borrower,
          book: book
        });
      }, function () {});
    } else this.setState({ book: book });
  },
  updateSelectBorrower: function updateSelectBorrower(borr) {
    this.setState({ borrower: borr });
  },
  handleLendBook: function handleLendBook() {
    var updatedBook = this.state.book;
    updatedBook.status = "lended";
    updatedBook.borrowerId = this.state.borrower.id;
    this.setState({ book: updatedBook });
  },
  handleGetBookBack: function handleGetBookBack() {
    var updatedBook = this.state.book;
    updatedBook.status = "on_shelf";
    updatedBook.borrowerId = undefined;
    this.setState({ book: updatedBook });
  },
  render: function render() {
    return React.createElement(
      "div",
      { className: "lendingBox" },
      React.createElement(BookBox, { selected: this.state.book, onSelect: this.updateSelectBook }),
      React.createElement(ActionBox, { book: this.state.book, borrower: this.state.borrower,
        onLendBook: this.handleLendBook,
        onGetBookBack: this.handleGetBookBack
      }),
      React.createElement(BorrowerBox, { selected: this.state.borrower, onSelect: this.updateSelectBorrower })
    );
  }
});

ReactDOM.render(React.createElement(LendingBox, null), document.getElementById('content'));
//# sourceMappingURL=lendingpage.js.map