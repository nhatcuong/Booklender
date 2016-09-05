var SelectMixin = {
  render: function () {
    return (
      <div className="select-list input-group">
        <div className="select-list-title">{this.title}</div>
        <select value={this.props.selected} onChange={this.props.onSelect}>
          <option value={0}>--</option>
          {this.getOptions()}
        </select>
      </div>
    )
  }
};

var SelectAddBoxMixin = {
  getInitialState: function () {
    return {list: []};
  },
  componentDidMount: function () {
    this.updateList();
  },
  getItemFromId: function (id) {
    if (!id) return {id: 0};
    var results = this.state.list.filter(
      function (item) {
        return item.id == id
      }
    );
    return results[0];
  },
  handleSelect: function (e) {
    this.props.onSelect(this.getItemFromId(parseInt(e.target.value)));
  },
};

var BookSelect = React.createClass({
  mixins: [SelectMixin],
  title: 'Books',
  getOptions: function () {
    return this.props.list.map(
      function (book) {
        return (
          <option key={book.id} value={book.id}>{book.title} - {book.author} - {book.status}</option>
        )
      }
    );
  },
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
    if (!title || !author) {
      return;
    }
    this.props.onSubmit({title: title, author: author});
    this.setState({title: '', author: ''});
  },
  render: function () {
    return (
      <form className="addForm formInputText" onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={this.state.title}
          onChange={this.handleTitleChange}
        />
        <input
          type="text"
          placeholder="Author"
          value={this.state.author}
          onChange={this.handleAuthorChange}
        />
        <input
          type="submit" value="Add"
        />
      </form>
    );
  }
});

var BookBox = React.createClass({
  mixins: [SelectAddBoxMixin],
  updateList: function () {
    apiAllBooks(this,
      function (data) {
        this.setState({list: data})
      },
      function (xhr, status, err) {

      }
    );
  },
  handleAddSubmit: function (book) {
    apiAddBook(this, book.title, book.author,
      function (data) {
        this.setState({
          list: this.state.list.concat([data])
        });
        this.props.onSelect(data);
      },
      function (xhr, status, err) {

      }
    )
  },
  render: function () {
    return (
      <div className="bookBox">
        <BookSelect selected={this.props.selected} list={this.state.list} onSelect={this.handleSelect}/>
        <AddBookForm onSubmit={this.handleAddSubmit}/>
      </div>
    );
  }
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
    if (!name) {
      return;
    }
    this.props.onSubmit({name: name});
    this.setState({name: ''});
  },
  render: function () {
    return (
      <form className="addForm formInputText" onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={this.state.name}
          onChange={this.handleNameChange}
        />
        <input
          type="submit" value="Add"
        />
      </form>
    );
  }
});

var BorrowerBox = React.createClass({
  mixins: [SelectAddBoxMixin],
  updateList: function () {
    apiAllBorrowers(this,
      function (data) {
        this.setState({list: data})
      },
      function (xhr, status, err) {

      }
    );
  },
  handleAddSubmit: function (borrower) {
    apiAddBorrower(this, borrower.name,
      function (data) {
        this.setState({
          list: this.state.list.concat([data])
        });
        this.props.onSelect(data);
      },
      function (xhr, status, err) {

      }
    )
  },
  render: function () {
    return (
      <div className="borrowerBox">
        <BorrowerSelect selected={this.props.selected} list={this.state.list} onSelect={this.handleSelect}/>
        <AddBorrowerForm onSubmit={this.handleAddSubmit}/>
      </div>
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
      function () {
      }
    )
  },
  render: function () {
    return (
      <button className="lendButton actionButton" onClick={this.lendFunction}>
        {"Lend it to"}
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
      function () {
      }
    )
  },
  render: function () {
    return (
      <button className="lendButton actionButton" onClick={this.getBackFunction}>
        {"Get it back"}
      </button>
    );
  }
});

var LendingBox = React.createClass({
  getInitialState: function () {
    return {
      book: {id: 0},
      borrower: {id: 0}
    };
  },
  updateSelectBook: function (book) {
    if (book.status == "lended") {
      apiGetCurrentBorrowerOfBook(this, book.id,
        function (borrower) {
          book.borrowerId = borrower.id;
          this.setState({
            borrower: borrower,
            book: book
          });
        },
        function () {
        }
      );
    }
    else this.setState({book: book});
  },
  updateSelectBorrower: function (borr) {
    this.setState({borrower: borr});
  },
  handleLendBook: function () {
    var updatedBook = this.state.book;
    updatedBook.status = "lended";
    updatedBook.borrowerId = this.state.borrower.id;
    this.setState({book: updatedBook});
  },
  handleGetBookBack: function () {
    var updatedBook = this.state.book;
    updatedBook.status = "on_shelf";
    updatedBook.borrowerId = undefined;
    this.setState({book: updatedBook});
  },
  render: function () {
    return (
      <div className="lendingBox">
        <BookBox selected={this.state.book.id} onSelect={this.updateSelectBook}/>
        <ActionBox book={this.state.book} borrower={this.state.borrower}
                   onLendBook={this.handleLendBook}
                   onGetBookBack={this.handleGetBookBack}
        />
        <BorrowerBox selected={this.state.borrower.id} onSelect={this.updateSelectBorrower}/>
      </div>
    )
  }
});

ReactDOM.render(
  <LendingBox/>,
  document.getElementById('content')
);
