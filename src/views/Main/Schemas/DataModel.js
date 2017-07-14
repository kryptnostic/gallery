import React, { PropTypes } from 'react';
import { hashHistory } from 'react-router';
import DocumentTitle from 'react-document-title';
import Page from '../../../components/page/Page';
import { SchemaList } from './Components/SchemaList';
import EntityTypeSearch from './Components/EntityTypeSearch';
import AssociationTypeSearch from './Components/AssociationTypeSearch';
import PropertyTypeSearch from './Components/PropertyTypeSearch';
import { DataModelToolbar } from './Components/DataModelToolbar';
import EdmConsts from '../../../utils/Consts/EdmConsts';

export class DataModel extends React.Component {

  static propTypes = {
    updateTopbarFn: PropTypes.func,
    location: PropTypes.shape({
      query: PropTypes.shape({
        type: PropTypes.string
      })
    })
  }

  static childContextTypes = {
    isAdmin: PropTypes.bool
  };

  componentDidMount() {
    if (!this.props.location.query.type) {
      this.changeDataModelView(EdmConsts.ENTITY_TYPE);
    }
    this.props.updateTopbarFn();
  }

  getDataModelView() {
    const view = this.props.location.query.type;
    switch (view) {
      case EdmConsts.SCHEMA:
        return (
          <DocumentTitle title="Schemas">
            <SchemaList />
          </DocumentTitle>);
      case EdmConsts.PROPERTY_TYPE:
        return (
          <DocumentTitle title="Property Types">
            <PropertyTypeSearch location={this.props.location} />
          </DocumentTitle>);
      case EdmConsts.ASSOCIATION_TYPE:
        return (
          <DocumentTitle title="Association Types">
            <AssociationTypeSearch location={this.props.location} />
          </DocumentTitle>);
      case EdmConsts.ENTITY_TYPE:
      default:
        return (
          <DocumentTitle title="Entity Types">
            <EntityTypeSearch location={this.props.location} />
          </DocumentTitle>);
    }
  }

  changeDataModelView = (newView) => {
    this.props.updateTopbarFn();
    const query = { type: newView };
    const newLocation = Object.assign({}, this.props.location, { query });
    hashHistory.push(newLocation);
  }

  render() {
    const view = this.props.location.query.type;
    return (
      <Page>
        <Page.Header>
          <Page.Title>Data model</Page.Title>
          <DataModelToolbar view={view} changeView={this.changeDataModelView} />
        </Page.Header>
        <Page.Body>
          {this.getDataModelView()}
        </Page.Body>
      </Page>
    );
  }
}

export default DataModel;
