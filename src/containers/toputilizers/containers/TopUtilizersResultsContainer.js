import React from 'react';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';
import Promise from 'bluebird';
import Immutable from 'immutable';
import { Button, ButtonGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { EntityDataModelApi } from 'lattice';

import * as actionFactory from '../TopUtilizersActionFactory';
import TopUtilizersTable from '../components/TopUtilizersTable';
import TopUtilizersHistogram from '../components/TopUtilizersHistogram';
import TopUtilizersMultiHistogram from '../components/TopUtilizersMultiHistogram';
import LoadingSpinner from '../../../components/asynccontent/LoadingSpinner';
import styles from '../styles.module.css';

const DISPLAYS = {
  TABLE: 'table',
  HISTOGRAM: 'histogram',
  MULTI_HISTOGRAM: 'multi_histogram'
};

class TopUtilizersResultsContainer extends React.Component {
  static propTypes = {
    results: PropTypes.object.isRequired,
    isGettingResults: PropTypes.bool.isRequired,
    isGettingNeighbors: PropTypes.bool.isRequired,
    entitySet: PropTypes.object.isRequired,
    propertyTypes: PropTypes.array.isRequired,
    downloadResults: PropTypes.func.isRequired,
    topUtilizersDetails: PropTypes.instanceOf(Immutable.List).isRequired,
    neighbors: PropTypes.instanceOf(Immutable.Map).isRequired,
    neighborTypes: PropTypes.instanceOf(Immutable.List).isRequired,
    entitySetPropertyMetadata: PropTypes.instanceOf(Immutable.Map).isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      entityType: null,
      propertyTypes: [],
      display: DISPLAYS.TABLE,
      neighborEntityTypes: [],
      neighborPropertyTypes: {},
      edgeTypeCounts: {}
    };
  }

  componentDidMount() {
    this.loadEntitySet();
    const neighborTypeIds = new Set();
    this.props.topUtilizersDetails.forEach((detailsObj) => {
      detailsObj.get('neighborTypeIds', []).forEach((id) => {
        neighborTypeIds.add(id);
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isGettingNeighbors && !nextProps.isGettingNeighbors) {
      this.countEdgeTypesPerEntity(nextProps);
      
    }
  }

  // each element in 'neighbor' is an array that contains associations that belong to search parameters.
  // maintain a count of each association type within each neighbor object and display that on the table.
  countEdgeTypesPerEntity = (nextProps) => {
    console.log('this.props.results', this.props.results);
    console.log('nextprops.neighbors', nextProps.neighbors);
    console.log(this.props.results.first());
    const countHeaders = this.createHeadersForEdgeTypes();
    this.props.results.forEach((result) => {
      const entityId = result.id[0];
      // Get List of neighbors for specific entity
      const neighborList = nextProps.neighbors.get(entityId);
      const neighborCount = {};

      // For each edge in the list of neighbors, count occurances for each unique assoc -> neighbor
      neighborList.forEach((edge) => {
        const associationEntityId = edge.getIn(['associationEntitySet', 'entityTypeId']);
        const neighborEntityId = edge.getIn(['neighborEntitySet', 'entityTypeId']);
        const isSrc = edge.get('src');

        const edgeId = this.getEdgeId(associationEntityId, neighborEntityId, isSrc);
        const edgeFqn = `count.${edgeId}`;
        if (neighborCount[edgeFqn] !== undefined) {
          neighborCount[edgeFqn] += 1;
        }
        else {
          neighborCount[edgeFqn] = 1;
        }
      });

      // Assign neighborCount to current result element
      Object.assign(result, neighborCount, { countHeaders });
    });

  }

  createHeadersForEdgeTypes = () => {
    // Must match ids from neighborTypes to topUtilizersDetails as it does not include necessary 'type' property
    // Tried modifying topUtilizersDetails but the exact object is used to make a strict request
    const countHeaders = [];
    this.props.topUtilizersDetails.forEach((selectedEdge) => {

      const selectedAssocTypeId = selectedEdge.get('associationTypeId');
      const selectedNeighborTypeId = selectedEdge.getIn(['neighborTypeIds', 0]);
      const selectedIsSrc = selectedEdge.get('utilizerIsSrc');

      const indexOfNeighborType = this.props.neighborTypes.findIndex((neighborType) => {
        const associationMatch = neighborType.getIn(['associationEntityType', 'id']) === selectedAssocTypeId;
        const neighborMatch = neighborType.getIn(['neighborEntityType', 'id']) === selectedNeighborTypeId;

        return associationMatch && neighborMatch;
      });

      const associationTypeTitle = this.props.neighborTypes.getIn([indexOfNeighborType, 'associationEntityType', 'title']);
      const neighborTypeTitle = this.props.neighborTypes.getIn([indexOfNeighborType, 'neighborEntityType', 'title']);

      const headerId = this.getEdgeId(selectedAssocTypeId, selectedNeighborTypeId, selectedIsSrc);
      const headerValue = this.getEdgeValue(associationTypeTitle, neighborTypeTitle, selectedIsSrc);

      countHeaders.push({
        id: `count.${headerId}`,
        value: `${headerValue}`
      });
    });
    return countHeaders;
  }

  getEdgeId = (associationTypeId, neighborTypeId, src) => {
    return (src ? [associationTypeId, neighborTypeId] : [associationTypeId, neighborTypeId]).join('|');
  };

  getEdgeValue = (associationTypeTitle, neighborTypeTitle, src) => {
    return (src ? [associationTypeTitle, neighborTypeTitle] : [neighborTypeTitle, associationTypeTitle]).join(' ');
  };

  loadEntitySet = () => {
    EntityDataModelApi.getEntityType(this.props.entitySet.entityTypeId)
    .then((entityType) => {
      Promise.map(entityType.properties, (propertyId) => {
        return EntityDataModelApi.getPropertyType(propertyId);
      }).then((propertyTypes) => {
        this.setState({ entityType, propertyTypes });
        this.loadNeighborTypes();
      });
    });
  }

  loadNeighborTypes = () => {
    const neighborTypeIds = new Set();
    this.props.topUtilizersDetails.forEach((detailsObj) => {
      detailsObj.get('neighborTypeIds', []).forEach((id) => {
        neighborTypeIds.add(id);
      });
    });
    Promise.map(neighborTypeIds, (entityTypeId) => {
      return EntityDataModelApi.getEntityType(entityTypeId);
    }).then((neighborEntityTypes) => {
      const neighborPropertyTypes = {};
      neighborEntityTypes.forEach((entityType) => {
        entityType.properties.forEach((propertyTypeId) => {
          neighborPropertyTypes[propertyTypeId] = {};
        });
      });
      Promise.map(Object.keys(neighborPropertyTypes), (propertyTypeId) => {
        return EntityDataModelApi.getPropertyType(propertyTypeId);
      }).then((propertyTypes) => {
        propertyTypes.forEach((propertyType) => {
          neighborPropertyTypes[propertyType.id] = propertyType;
        });
        this.setState({ neighborEntityTypes, neighborPropertyTypes });
      });
    });
  }

  renderDownloadButton = () => {
    return (
      <div className={styles.downloadButton}>
        <Button
            bsStyle="primary"
            onClick={() => {
              this.props.downloadResults(this.props.entitySet.id, this.props.topUtilizersDetails);
            }}>Download as CSV</Button>
      </div>
    );
  }

  renderContent = () => {
    return this.props.isGettingResults ? <LoadingSpinner /> : this.renderResultsContainer();
  }

  renderResultsContainer = () => {
    return (this.props.results.size === 0) ?
    (
      <div>No results found.</div>
    ) : (
      <div>
        {this.renderDisplayToolbar()}
        {this.renderResults()}
        {this.renderDownloadButton()}
      </div>
    );
  }

  renderDisplayToolbar = () => {
    return (
      <div className={styles.displayToolbar}>
        <ButtonGroup>
          <Button
              onClick={() => {
                this.setState({ display: DISPLAYS.TABLE });
              }}
              active={this.state.display === DISPLAYS.TABLE}>
            Table</Button>
          <Button
              onClick={() => {
                this.setState({ display: DISPLAYS.HISTOGRAM });
              }}
              active={this.state.display === DISPLAYS.HISTOGRAM}>
            Histogram</Button>
          <Button
              onClick={() => {
                this.setState({ display: DISPLAYS.MULTI_HISTOGRAM });
              }}
              active={this.state.display === DISPLAYS.MULTI_HISTOGRAM}>
            Multi-Histogram</Button>
        </ButtonGroup>
      </div>
    );
  }

  renderHistogram = () => {
    if (this.props.isGettingNeighbors) return <LoadingSpinner />;
    return (
      <TopUtilizersHistogram
          results={this.props.results.toJS()}
          propertyTypes={this.state.propertyTypes}
          entityType={this.state.entityType}
          neighborEntityTypes={this.state.neighborEntityTypes}
          neighborPropertyTypes={this.state.neighborPropertyTypes}
          neighbors={this.props.neighbors}
          entitySetPropertyMetadata={this.props.entitySetPropertyMetadata} />
    );
  }

  renderMultiHistogram = () => {
    if (this.props.isGettingNeighbors) return <LoadingSpinner />;

    const allPropertyTypes = Object.assign({}, this.state.neighborPropertyTypes);
    this.state.propertyTypes.forEach((propertyType) => {
      allPropertyTypes[propertyType.id] = propertyType;
    });

    const allEntityTypes = {};
    [this.state.entityType].concat(this.state.neighborEntityTypes).forEach((entityType) => {
      allEntityTypes[entityType.id] = entityType;
    });

    return (
      <TopUtilizersMultiHistogram
          results={this.props.results.toJS()}
          entityType={this.state.entityType}
          allEntityTypes={allEntityTypes}
          allPropertyTypes={allPropertyTypes}
          neighbors={this.props.neighbors}
          entitySetPropertyMetadata={this.props.entitySetPropertyMetadata} />
    );
  }

  renderResults = () => {
    if (this.state.display === DISPLAYS.TABLE) {
      return (<TopUtilizersTable
          results={this.props.results.toJS()}
          propertyTypes={this.props.propertyTypes}
          entitySetId={this.props.entitySet.id}
          entitySetPropertyMetadata={this.props.entitySetPropertyMetadata} />);
    }
    else if (this.state.display === DISPLAYS.HISTOGRAM) {
      return this.renderHistogram();
    }

    else if (this.state.display === DISPLAYS.MULTI_HISTOGRAM) {
      return this.renderMultiHistogram();
    }
    return null;
  }

  render() {
    return (
      <DocumentTitle title="Top Utilizers">
        {this.renderContent()}
      </DocumentTitle>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const topUtilizers = state.get('topUtilizers');
  const entitySetPropertyMetadata = state
    .getIn(['edm', 'entitySetPropertyMetadata', ownProps.entitySet.id], Immutable.Map());

  return {
    results: topUtilizers.get('topUtilizersResults'),
    isGettingResults: topUtilizers.get('isGettingResults'),
    isGettingNeighbors: topUtilizers.get('isGettingNeighbors'),
    associations: topUtilizers.get('associations'),
    topUtilizersDetails: topUtilizers.get('topUtilizersDetailsList'),
    neighbors: topUtilizers.get('neighbors'),
    neighborTypes: topUtilizers.get('neighborTypes'),
    entitySetPropertyMetadata
  };
}

function mapDispatchToProps(dispatch) {
  const actions = {
    downloadResults: actionFactory.downloadTopUtilizersRequest
  };

  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TopUtilizersResultsContainer);
