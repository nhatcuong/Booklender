var SelectMixin = {
  handleSelect: function(e) {
    var selectedItem = this.getItemFromId(parseInt(e.target.value));
    // store.dispatch({type: this.selectEventType, action: selectedItem});
    this.props.onSelect(selectedItem);
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

export { SelectMixin };