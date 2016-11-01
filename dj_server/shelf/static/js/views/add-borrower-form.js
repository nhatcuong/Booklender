import React from 'react';
import { connect } from 'react-redux';

import * as api from '../api';

var mapDispatchToProps = function(dispatch, ownProps) {
  return {
    onNew: function (borrower) {
      dispatch({
        type: 'NEW_BORROWER',
        newBorrower: borrower
      });
    }
  };
}

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
      api.addBorrower(this, name,
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


export default connect(null, mapDispatchToProps)(AddBorrowerForm)


