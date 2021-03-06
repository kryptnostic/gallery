import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Table, Column, Cell } from 'fixed-data-table';
import { Button, ButtonGroup } from 'react-bootstrap';

import EventTimeline from './EventTimeline';
import TextCell from './TextCell';
import EdmConsts from '../../utils/Consts/EdmConsts';
import styles from './styles.module.css';

const NO_NEIGHBOR = 'NO_NEIGHBOR';

const TABLE_WIDTH = 1000;
const ROW_HEIGHT = 50;
const TABLE_OFFSET = 2;

const NEIGHBOR_VIEW = {
  TABLE: 'TABLE',
  TIMELINE: 'TIMELINE'
};

export default class RowNeighbors extends React.Component {

  static propTypes = {
    neighbors: PropTypes.array.isRequired,
    propertyTypesByFqn: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
    formatValueFn: PropTypes.func.isRequired,
    entitySetTitle: PropTypes.string
  }

  constructor(props) {
    super(props);
    this.state = Object.assign(this.organizeNeighbors(props.neighbors), {
      neighborView: NEIGHBOR_VIEW.TABLE
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.neighbors !== nextProps.neighbors) {
      this.setState(this.organizeNeighbors(nextProps.neighbors));
    }
  }

  organizeNeighbors = (neighbors) => {
    const organizedNeighbors = {};
    const dateProps = {};
    neighbors.forEach((neighbor) => {
      if (!neighbor) return;
      const associationEntitySetId = neighbor.associationEntitySet.id;
      const neighborEntitySetId = (neighbor.neighborEntitySet) ? neighbor.neighborEntitySet.id : NO_NEIGHBOR;

      if (!organizedNeighbors[associationEntitySetId]) {
        organizedNeighbors[associationEntitySetId] = {};
        Object.keys(neighbor.associationDetails).forEach((fqn) => {
          const propertyType = this.props.propertyTypesByFqn[fqn];
          if (EdmConsts.EDM_DATE_TYPES.includes(propertyType.datatype)) {
            if (dateProps[associationEntitySetId]) {
              dateProps[associationEntitySetId].push(propertyType.id);
            }
            else {
              dateProps[associationEntitySetId] = [propertyType.id];
            }
          }
        });
      }
      if (!organizedNeighbors[associationEntitySetId][neighborEntitySetId]) {
        organizedNeighbors[associationEntitySetId][neighborEntitySetId] = [neighbor];

        if (neighbor.neighborDetails) {
          Object.keys(neighbor.neighborDetails).forEach((fqn) => {
            const propertyType = this.props.propertyTypesByFqn[fqn];
            if (EdmConsts.EDM_DATE_TYPES.includes(propertyType.datatype)) {
              if (dateProps[neighborEntitySetId]) {
                dateProps[neighborEntitySetId].push(propertyType.id);
              }
              else {
                dateProps[neighborEntitySetId] = [propertyType.id];
              }
            }
          });
        }
      }
      else {
        organizedNeighbors[associationEntitySetId][neighborEntitySetId].push(neighbor);
      }
    });

    return { organizedNeighbors, dateProps };
  }

  columnIsEmpty = (fqn, results) => {
    let empty = true;
    results.forEach((row) => {
      if (row[fqn] && row[fqn].length) empty = false;
    });
    return empty;
  }

  getColumnNamesToShow = (neighborGroup, noNeighbor, rowValues) => {
    const columnNamesToShow = [];
    Object.keys(neighborGroup.associationDetails).forEach((fqn) => {
      if (!this.columnIsEmpty(fqn, rowValues)) columnNamesToShow.push(fqn);
    });
    if (!noNeighbor) {
      Object.keys(neighborGroup.neighborDetails).forEach((fqn) => {
        if (!this.columnIsEmpty(fqn, rowValues)) columnNamesToShow.push(fqn);
      });
    }
    return columnNamesToShow;
  }

  renderColumns = (renderingAssociation, rowValues, neighborGroup, noNeighbor) => {
    const entitySetId = (noNeighbor) ? null : neighborGroup.neighborEntitySet.id;
    const columnNamesToShow = this.getColumnNamesToShow(neighborGroup, noNeighbor, rowValues);
    const numColumns = columnNamesToShow.length;
    const propertyTypeFqns = (renderingAssociation) ?
      Object.keys(neighborGroup.associationDetails) : Object.key(neighborGroup.neighborDetails);

    const columnWidth = (TABLE_WIDTH - 1) / numColumns;
    const allColumns = [];
    propertyTypeFqns.forEach((fqn) => {
      const propertyType = this.props.propertyTypesByFqn[fqn];
      const field = fqn;
      const neighborPropertyTypes = neighborGroup.neighborDetails
        ? Object.keys(neighborGroup.neighborDetails).map(ptfqn => this.props.propertyTypesByFqn[ptfqn])
        : null;
      if (columnNamesToShow.includes(field)) {
        const renderImage = (propertyType.type.name === 'mugshot'
          || propertyType.type.name === 'scars'
          || propertyType.type.name === 'tattoos');
        allColumns.push(
          <Column
              key={`${entitySetId}-${propertyType.id}`}
              header={<Cell>{propertyType.title}</Cell>}
              cell={
                <TextCell
                    results={rowValues}
                    field={field}
                    formatValueFn={this.props.formatValueFn}
                    onClick={this.props.onClick}
                    width={columnWidth}
                    entitySetId={entitySetId}
                    propertyTypes={neighborPropertyTypes}
                    renderImage={renderImage} />
              }
              width={columnWidth} />
        );
      }
    });
    return allColumns;
  }


  renderNeighborGroupTitle = (neighbor, neighborId) => {
    const entitySetTitle = this.props.entitySetTitle || '';
    const neighborTitle = (neighborId === NO_NEIGHBOR)
      ? <div className={styles.neighborGroupTitleUnclickable}>?</div>
      : (<Link to={`/entitysets/${neighborId}`} className={styles.neighborGroupTitle}>
        {neighbor.neighborEntitySet.title}
      </Link>);
    return (neighbor.src)
      ? <div className={styles.neighborContainer}>
        {entitySetTitle} {`${neighbor.associationEntitySet.title}`} {neighborTitle}</div>
    : <div className={styles.neighborContainer}>
      {neighborTitle} {`${neighbor.associationEntitySet.title}`} {entitySetTitle}</div>;
  }

  renderNeighborGroup = (neighborGroup, neighborId, shouldShowTitle) => {
    const noNeighbor = neighborId === NO_NEIGHBOR;
    const tableHeight = ((neighborGroup.length + 1) * ROW_HEIGHT) + TABLE_OFFSET;

    const rowValues = neighborGroup.map((neighbor) => {
      const row = (noNeighbor) ? neighbor.associationDetails :
        Object.assign({}, neighbor.associationDetails, neighbor.neighborDetails);
      if (!noNeighbor) row.id = [neighbor.neighborId];
      return row;
    });
    const associationColumns = this.renderColumns(true, rowValues, neighborGroup[0], noNeighbor);
    const neighborColumns = (noNeighbor) ? null :
      this.renderColumns(false, rowValues, neighborGroup[0], noNeighbor);

    const title = (shouldShowTitle) ? this.renderNeighborGroupTitle(neighborGroup[0], neighborId) : null;
    return (
      <div key={neighborId}>
        {title}
        <Table
            rowsCount={neighborGroup.length}
            rowHeight={ROW_HEIGHT}
            headerHeight={ROW_HEIGHT}
            width={TABLE_WIDTH}
            height={tableHeight}>
          {associationColumns}
          {neighborColumns}
        </Table>
      </div>
    );
  }

  renderAssociationGroup = (associationGroup) => {
    const neighborGroups = Object.keys(associationGroup).map((neighborId) => {
      const neighborGroup = associationGroup[neighborId];
      return this.renderNeighborGroup(neighborGroup, neighborId, true);
    });
    const title = Object.values(associationGroup)[0][0].associationEntitySet.title;
    return (
      <div>
        <div className={styles.spacerSmall} />
        <hr />
        <div className={styles.spacerSmall} />
        <div className={styles.associationGroupTitle}>{title}</div>
        {neighborGroups}
      </div>
    );
  }

  renderNeighbors = () => {
    const neighbors = Object.keys(this.state.organizedNeighbors).map((associationId) => {
      const associationGroup = this.state.organizedNeighbors[associationId];
      return (
        <div key={associationId}>
          {this.renderAssociationGroup(associationGroup)}
        </div>
      );
    });
    return neighbors;
  }

  renderTimeline = () => {
    return (
      <EventTimeline
          organizedNeighbors={this.state.organizedNeighbors}
          dateProps={this.state.dateProps}
          renderNeighborGroupFn={this.renderNeighborGroup} />
    );
  }

  renderViewToolbar = () => {
    return (
      <div className={styles.viewToolbar}>
        <ButtonGroup>
          <Button
              onClick={() => {
                this.setState({ neighborView: NEIGHBOR_VIEW.TABLE });
              }}
              active={this.state.neighborView === NEIGHBOR_VIEW.TABLE}>
            Table</Button>
          <Button
              onClick={() => {
                this.setState({ neighborView: NEIGHBOR_VIEW.TIMELINE });
              }}
              active={this.state.neighborView === NEIGHBOR_VIEW.TIMELINE}>
            Timeline</Button>
        </ButtonGroup>
      </div>
    );
  }

  render() {
    if (this.props.neighbors.length === 0) return null;
    const content = (this.state.neighborView === NEIGHBOR_VIEW.TABLE)
      ? this.renderNeighbors() : this.renderTimeline();
    return (
      <div>
        {this.renderViewToolbar()}
        {content}
      </div>
    );
  }

}
