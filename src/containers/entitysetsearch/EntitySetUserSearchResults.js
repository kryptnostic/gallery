import React, { PropTypes } from 'react';
import UserRow from './UserRow';
import EntityRow from './EntityRow';

export default class EntitySetUserSearchResults extends React.Component {
  static propTypes = {
    results: PropTypes.array.isRequired,
    entitySetId: PropTypes.string.isRequired,
    propertyTypes: PropTypes.array.isRequired,
    firstName: PropTypes.object.isRequired,
    lastName: PropTypes.object.isRequired,
    dob: PropTypes.object,
    hidePaginationFn: PropTypes.func,
    formatValueFn: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = {
      results: props.results,
      selectedId: undefined,
      selectedRow: undefined,
      selectedEntitySetId: undefined,
      selectedPropertyTypes: undefined,
      breadcrumbs: []
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      results: nextProps.results
    });
  }

  onUserSelect = (selectedId, selectedRow, selectedEntitySetId, selectedPropertyTypes, breadcrumbTitle) => {
    const crumb = {
      id: selectedId,
      title: breadcrumbTitle,
      row: selectedRow,
      propertyTypes: selectedPropertyTypes,
      entitySetId: selectedEntitySetId
    };
    const breadcrumbs = this.state.breadcrumbs.concat(crumb);
    this.setState({ selectedId, selectedRow, selectedEntitySetId, selectedPropertyTypes, breadcrumbs });
    this.props.hidePaginationFn(true);
  }

  jumpToRow = (index) => {
    const crumb = this.state.breadcrumbs[index];
    const breadcrumbs = this.state.breadcrumbs.slice(0, index + 1);
    this.setState({
      selectedId: crumb.id,
      selectedRow: crumb.row,
      selectedEntitySetId: crumb.entitySetId,
      selectedPropertyTypes: crumb.propertyTypes,
      breadcrumbs
    });
  }

  onUserDeselect = () => {
    this.setState({
      selectedId: undefined,
      selectedRow: undefined,
      selectedEntitySetId: undefined,
      selectedPropertyTypes: undefined
    });
    this.props.hidePaginationFn(false);
  }

  renderAllUserResults = () => {
    const firstNameId = this.props.firstName.id;
    const lastNameId = this.props.lastName.id;
    const resultRows = [];
    this.state.results.forEach((row) => {
      const propertyTypeIds = Object.keys(row).filter((id) => {
        return (id !== 'id');
      });
      if (propertyTypeIds.includes(firstNameId) && propertyTypeIds.includes(lastNameId)) {
        resultRows.push(
          <UserRow
              key={row.id}
              row={row}
              entitySetId={this.props.entitySetId}
              propertyTypes={this.props.propertyTypes}
              firstName={this.props.firstName}
              lastName={this.props.lastName}
              dob={this.props.dob}
              selectUserFn={this.onUserSelect}
              formatValueFn={this.props.formatValueFn}
              entityId={row.id} />
        );
      }
    });
    return resultRows;
  }

  renderSingleUser = () => {
    const row = Object.assign({}, this.state.selectedRow);
    delete row.id;
    return (
      <UserRow
          row={row}
          entityId={this.state.selectedId}
          entitySetId={this.state.selectedEntitySetId}
          propertyTypes={this.state.selectedPropertyTypes}
          firstName={this.props.firstName}
          lastName={this.props.lastName}
          dob={this.props.dob}
          backFn={this.onUserDeselect}
          userPage
          formatValueFn={this.props.formatValueFn}
          onClick={this.onUserSelect}
          jumpFn={this.jumpToRow}
          breadcrumbs={this.state.breadcrumbs} />
    );
  }

  renderSingleRow = () => {
    const row = Object.assign({}, this.state.selectedRow);
    delete row.id;
    return (
      <EntityRow
          row={row}
          entityId={this.state.selectedId}
          entitySetId={this.state.selectedEntitySetId}
          propertyTypes={this.state.selectedPropertyTypes}
          backFn={this.onUserDeselect}
          formatValueFn={this.props.formatValueFn}
          onClick={this.onUserSelect}
          jumpFn={this.jumpToRow}
          breadcrumbs={this.state.breadcrumbs} />);
  }

  renderResults = () => {
    if (this.state.selectedRow) {
      return (this.state.selectedEntitySetId === this.props.entitySetId) ?
        this.renderSingleUser() : this.renderSingleRow();
    }
    return this.renderAllUserResults();
  }

  renderNoResults = () => {
    return (
      <div>There are no results to display.</div>
    );
  }

  render() {
    const content = (this.state.results.length < 1) ? this.renderNoResults() : this.renderResults();
    return (
      <div>{content}</div>
    );
  }
}
