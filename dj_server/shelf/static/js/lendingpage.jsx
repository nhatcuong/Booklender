var SelectMixin = {
  handleSelect: function(e) {
    var selectedBook = this.getItemFromId(parseInt(e.target.value));
    this.props.onSelect(selectedBook);
  },
  getItemFromId: function (id) {
    if (!id) return {id: 0};
    var results = this.props.list.filter(
      function (item) {return item.id == id}
    );
    return results[0];
  },
  render: function () {
    if (this.props.list.length == 0) {
      return null;
    }
    return (
      <div className="select-list input-group">
        <div className="select-list-title">{this.title}</div>
        <select value={this.props.selected.id} onChange={this.handleSelect}>
          <option value={0}>--</option>
          {this.getOptions()}
        </select>
        {this.subDivComp()}
      </div>
    )
  }
};

var BookSelect = React.createClass({
  mixins: [SelectMixin],
  title: 'Books',
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
    var msg = status == 'on_shelf' ? 'is on shelf'
      : status == 'lended' ? 'is lent' : '';
    if (msg) {
      return (
        <div className="book-status">{msg}</div>
      )
    }
    return null;
  },
  subDivComp: function() {
    return this.divBookStatus()
  },
});

var BorrowerSelect = React.createClass({
  mixins: [SelectMixin],
  title: 'Borrowers',
  getOptions: function () {
    return this.props.list.map(
      function (borrower) {
        return (
          <option key={borrower.id} value={borrower.id}>{borrower.name}</option>
        )
      }
    );
  },
  subDivComp: function() {
    return undefined;
  }
});

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
      apiAddBook(this, title, author,
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

var AddBorrowerForm = React.createClass({
  getInitialState: function () {
    return {name: ''};
  },
  handleNameChange: function (e) {
    this.setState({name: e.target.value})
  },
  handleSubmit: function (e) {
    e.preventDefault();
    var name = this.state.name.trim();
    if (name) {
      apiAddBorrower(this, name,
        function (data) {
          this.props.onNew(data);
          this.setState({name: ''});
        },
        function (xhr, status, err) {}
      );
    }
  },
  render: function () {
    return (
      <form className="addForm formInputText" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Name" value={this.state.name}
          onChange={this.handleNameChange}/>
        <input type="submit" value="Add Borrower"/>
      </form>
    );
  }
});

var ActionBox = React.createClass({
  render: function () {
    var canLendBook =
      this.props.book.id && this.props.borrower.id &&
      this.props.book.status != "lended";
    var canGetBookBack =
      this.props.book && this.props.borrower &&
      this.props.book.borrowerId == this.props.borrower.id;
    var button;
    if (canLendBook) {
      button = <LendButton book={this.props.book} borrower={this.props.borrower} onLendBook={this.props.onLendBook}/>
    }
    else if (canGetBookBack) {
      button = <GetBackButton book={this.props.book} onGetBookBack={this.props.onGetBookBack}/>
    }
    return (
      <div className="actionBox">
        {button}
      </div>
    )
  }
});

var LendButton = React.createClass({
  lendFunction: function () {
    apiLendBook(this, this.props.book.id, this.props.borrower.id,
      function () {
        this.props.onLendBook();
      },
      function () {}
    )
  },
  render: function () {
    return (
      <button className="action-button" onClick={this.lendFunction}>
        {"Lend to"}
      </button>
    );
  }
});

var GetBackButton = React.createClass({
  getBackFunction: function () {
    apiGetBack(this, this.props.book.id,
      function () {
        this.props.onGetBookBack();
      },
      function () {}
    )
  },
  render: function () {
    return (
      <button className="action-button" onClick={this.getBackFunction}>
        {"Get back"}
      </button>
    );
  }
});

var LendingBox = React.createClass({
  componentDidMount: function() {
    this.updateBooks();
    this.updateBorrowers();
  },
  getInitialState: function () {
    return {
      books: [],
      borrowers: [],
      book: {id: 0},
      borrower: {id: 0}
    };
  },
  updateBooks: function () {
    apiAllBooks(this,
      function (data) {
        this.setState({books: data});
      },
      function (xhr, status, err) {}
    );
  },
  onNewBook: function(book) {
    this.setState({
      book: book,
      books: this.state.books.concat(book)
    });
  },
  updateBorrowers: function() {
    apiAllBorrowers(this,
      function(data) {
        this.setState({borrowers: data});
      },
      function(xhr, status, err) {}
    )
  },
  onNewBorrower: function(borrower) {
    this.setState({
      borrower: borrower,
      borrowers: this.state.borrowers.concat(borrower)
    });
  },
  onSelectBook: function(book) {
    this.setState({book: book});
    this.updateBorrowerByBook(book);
  },
  updateBorrowerByBook: function (book) {
    if (book.status == "lended") {
      apiGetCurrentBorrowerOfBook(this, book.id,
        function (borrower) {
          book.borrowerId = borrower.id;
          this.setState({borrower: borrower});
        },
        function () {}
      );
    }
    else this.setState({book: book});
  },
  onSelectBorrower: function(borr) {
    this.setState({borrower: borr});
  },
  handleLendBook: function () {
    var updatedBook = this.state.book;
    updatedBook.status = "lended";
    updatedBook.borrowerId = this.state.borrower.id;
    this.setState({book: updatedBook})
  },
  handleGetBookBack: function () {
    var updatedBook = this.state.book;
    updatedBook.status = "on_shelf";
    updatedBook.borrowerId = undefined;
    this.setState({book: updatedBook})
  },
  render: function () {
    return (
      <div className="lendingBox">
        <div className="leftCol">
          <BookSelect selected={this.state.book} list={this.state.books} onSelect={this.onSelectBook}/>
          <AddBookForm onNew={this.onNewBook}/>
        </div>
        <div className="centerCol">
          <ActionBox book={this.state.book} borrower={this.state.borrower}
                     onLendBook={this.handleLendBook}
                     onGetBookBack={this.handleGetBookBack}/>
        </div>
        <div className="rightCol">
          <BorrowerSelect selected={this.state.borrower} list={this.state.borrowers} onSelect={this.onSelectBorrower}/>
          <AddBorrowerForm onNew={this.onNewBorrower}/>
        </div>
      </div>
    )
  }
});

ReactDOM.render(
  <LendingBox/>,
  document.getElementById('content')
);
