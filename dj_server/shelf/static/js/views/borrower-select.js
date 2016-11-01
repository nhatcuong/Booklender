import React from 'react';
import { connect } from 'react-redux';
import { SelectMixin } from './mixins';

import * as api from '../api';

var mapStateToProps = function(store) {
  return {
    selected: store.borrowerState.borrower,
    list: store.borrowerState.borrowerList
  };
};

const mapDispatchToProps = function(dispatch, ownProps) {
  return {
    onSelect: function(selectedItem) {
      dispatch({type: 'SELECT_BORROWER', item: selectedItem});
    },
    onLoadBorrowers: function(borrowers) {
      dispatch({type: 'LOAD_BORROWERS', borrowers: borrowers});
    }
  }
}

var BorrowerSelect = React.createClass({
  mixins: [SelectMixin],
  title: 'Borrowers',
  selectEventType: 'SELECT_BORROWER',
  componentDidMount: function() {
    api.allBorrowers(this,
      function(data) {
        this.props.onLoadBorrowers(data);
      },
      function(xhr, status, err) {}
    )
  },
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

export default connect(mapStateToProps, mapDispatchToProps)(BorrowerSelect)
