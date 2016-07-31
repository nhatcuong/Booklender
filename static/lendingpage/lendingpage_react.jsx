var SelectMixin = {
  render: function () {
    return (
      <div className="select-list input-group">
        <div className="select-list-title">{this.title}</div>
        <select value={this.props.selected} onChange={this.props.onSelect}>
          {this.getOptions()}
        </select>
      </div>
    )
  }
};

var SelectAddBoxMixin = {
  getInitialState: function() {
    return {list: [], selectedItem: -1};
  },
  componentDidMount: function() {
    this.updateList();
  },
  getItemFromId: function(id) {
    var results = this.state.list.filter(
      function(item) {return item.id == id}
    );
    return results[0];
  },
  handleSelect: function(e) {
    this.props.onSelect(this.getItemFromId(e.target.value));
  },
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
  handleSubmit: function(e) {
    e.preventDefault();
    var title = this.state.title.trim();
    var author = this.state.author.trim();
    if (!title || !author) {
      return;
    }
    this.props.onSubmit({title: title, author:author});
    this.setState({title: '', author: ''});
  },
  render: function () {
    return (
      <form className="addForm" onSubmit={this.handleSubmit}>
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
  updateList: function() {
    apiAllBooks(this,
      function(data) {
        this.setState({list: data.books})
      },
      function(xhr, status, err) {

      }
    );
  },
  handleAddSubmit: function(book) {
    apiAddBook(this, book.title, book.author,
      function(data) {
        this.setState({
          list: this.state.list.concat([data.newBook]),
          selectedItem: data.newBook.id
        })
      },
      function(xhr, status, err) {

      }
    )
  },
  render: function () {
    return (
      <div className="bookBox">
        <BookSelect selected={this.state.selectedItem} list={this.state.list} onSelect={this.handleSelect}/>
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
  handleSubmit: function(e) {
    e.preventDefault();
    var name = this.state.name.trim();
    if (!name) {
      return;
    }
    this.props.onSubmit({name: name});
    this.setState({name: name});
  },
  render: function () {
    return (
      <form className="addForm" onSubmit={this.handleSubmit}>
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
  updateList: function() {
    apiAllBorrowers(this,
      function(data) {
        this.setState({list: data.readers})
      },
      function(xhr, status, err) {

      }
    );
  },
  handleAddSubmit: function(borrower) {
    apiAddBorrower(this, borrower.name,
      function(data) {
        this.setState({
          list: this.state.list.concat([data.newReader])
        });
        this.props.onSelect(data.newReader);
      },
      function(xhr, status, err) {

      }
    )
  },
  render: function () {
    return (
      <div className="bookBox">
        <BorrowerSelect selected={this.props.selected} list={this.state.list} onSelect={this.handleSelect}/>
        <AddBorrowerForm onSubmit={this.handleAddSubmit}/>
      </div>
    );
  }
});

var LendingBox = React.createClass({
  getInitialState: function() {
    return {
      book: {title: '', author: '', id: -1},
      borrower: {name: '', id: -1}
    };
  },
  updateSelectBook: function(book) {
    this.setState({book: book});
  },
  updateSelectBorrower: function(borr) {
    this.setState({borrower: borr});
  },
  render: function() {
    return (
      <div className="lendingBox">
        currentBorrower: {this.state.borrower.name}
        <BorrowerBox selected={this.state.borrower.id} onSelect={this.updateSelectBorrower}/>
      </div>
    )
  }
});

ReactDOM.render(
  <LendingBox/>,
  document.getElementById('content-right')
);

// ReactDOM.render(
//   <BookBox/>,
//   document.getElementById('content-left')
// );
//
// ReactDOM.render(
//   <BorrowerBox/>,
//   document.getElementById('content-right')
// );
