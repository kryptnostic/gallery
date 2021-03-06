import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import moment from 'moment';
import { Button, DropdownButton, MenuItem } from 'react-bootstrap';
import { Constants } from 'lattice';

import EdmConsts from '../../../utils/Consts/EdmConsts';
import styles from '../styles.module.css';
import { HistogramVisualization } from '../../visualizations/HistogramVisualization';
import { COUNT_FQN } from '../../../utils/Consts/StringConsts';

const { OPENLATTICE_ID_FQN } = Constants;

const DEFAULT_SELECTED_ENTITY_TYPE = {
  title: 'Select an entity type',
  id: '',
  properties: []
};

const DEFAULT_SELECTED_PROPERTY_TYPE = {
  title: 'Select a property type',
  fqn: '',
  datatype: ''
};

const DATE_GROUPING_OPTIONS = {
  DAY: 'Day',
  MONTH: 'Month',
  YEAR: 'Year'
};

const OTHER_LABEL = 'Other...';

export default class TopUtilizersHistogram extends React.Component {
  static propTypes = {
    results: PropTypes.array.isRequired,
    propertyTypes: PropTypes.array.isRequired,
    entityType: PropTypes.object.isRequired,
    neighborEntityTypes: PropTypes.array.isRequired,
    neighborPropertyTypes: PropTypes.object.isRequired,
    neighbors: PropTypes.instanceOf(Immutable.Map).isRequired,
    entitySetPropertyMetadata: PropTypes.instanceOf(Immutable.Map).isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      selectedEntityType: DEFAULT_SELECTED_ENTITY_TYPE,
      selectedPropertyType: DEFAULT_SELECTED_PROPERTY_TYPE,
      selectedPropertyTypeDateGroup: DATE_GROUPING_OPTIONS.MONTH,
      selectedDrillDownEntityType: DEFAULT_SELECTED_ENTITY_TYPE,
      selectedDrillDownPropertyType: DEFAULT_SELECTED_PROPERTY_TYPE,
      selectedDrillDownPropertyTypeDateGroup: DATE_GROUPING_OPTIONS.MONTH,
      histogramData: {
        counts: [],
        fields: []
      },
      drillDown: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.neighbors.size !== this.props.neighbors.size
      && this.state.selectedEntityType.id && this.state.selectedPropertyType.id) {
      this.setState({ histogramData: this.getHistogramData(
          this.state.selectedEntityType,
          this.state.selectedPropertyType,
          this.state.selectedDrillDownEntityType,
          this.state.selectedDrillDownPropertyType,
          this.state.drillDown,
          nextProps.neighbors) });
    }
  }


  formatDate = (date, dateGroup) => {
    if (!date.isValid()) return date;
    switch (dateGroup) {
      case DATE_GROUPING_OPTIONS.DAY:
        return date.format('MM/DD/YYYY');

      case DATE_GROUPING_OPTIONS.YEAR:
        return date.format('YYYY');

      case DATE_GROUPING_OPTIONS.MONTH:
      default:
        return date.format('MMM, YYYY');
    }
  }

  getFieldValues = (utilizer, neighbors, entityTypeId, propertyType, dateGroup) => {
    const values = [];
    const propertyTypeFqn = `${propertyType.type.namespace}.${propertyType.type.name}`;
    if (entityTypeId === this.props.entityType.id && utilizer[propertyTypeFqn]) {
      utilizer[propertyTypeFqn].forEach((value) => {
        if (EdmConsts.EDM_DATE_TYPES.includes(propertyType.datatype)) {
          values.push(this.formatDate(moment.parseZone(value), dateGroup));
        }
        else values.push(value);
      });
    }
    neighbors.forEach((neighbor) => {
      if (neighbor && neighbor.has('neighborEntitySet')
        && neighbor.getIn(['neighborEntitySet', 'entityTypeId']) === entityTypeId
        && neighbor.has('neighborDetails')) {
        neighbor.getIn(['neighborDetails', propertyTypeFqn], []).forEach((value) => {
          if (EdmConsts.EDM_DATE_TYPES.includes(propertyType.datatype)) {
            values.push(this.formatDate(moment.parseZone(value), dateGroup));
          }
          else values.push(value);
        });
      }
    });
    return values;
  }

  getHistogramData = (
    selectedEntityType,
    selectedPropertyType,
    selectedDrillDownEntityType,
    selectedDrillDownPropertyType,
    drillDown,
    optionalNeighbors,
    optionalSelectedPropertyTypeDateGroup,
    optionalSelectedDrillDownPropertyTypeDateGroup) => {
    const resultList = [];
    const counts = {};
    const fields = new Set();

    const neighbors = optionalNeighbors || this.props.neighbors;
    const selectedPropertyTypeDateGroup =
      optionalSelectedPropertyTypeDateGroup || this.state.selectedPropertyTypeDateGroup;
    const selectedDrillDownPropertyTypeDateGroup =
      optionalSelectedDrillDownPropertyTypeDateGroup || this.state.selectedDrillDownPropertyTypeDateGroup;
    const isSimple = (!drillDown || !selectedDrillDownEntityType.id || !selectedDrillDownPropertyType.id);
    if (isSimple) fields.add(COUNT_FQN);
    this.props.results.forEach((utilizer) => {
      const entityId = utilizer[OPENLATTICE_ID_FQN][0];
      const primaryValues = (neighbors.get(entityId)) ? this.getFieldValues(
        utilizer,
        neighbors.get(entityId),
        selectedEntityType.id,
        selectedPropertyType,
        selectedPropertyTypeDateGroup) : [];
      primaryValues.forEach((primaryValue) => {
        if (!counts[primaryValue]) counts[primaryValue] = {};
        const fieldNames = (isSimple) ? [COUNT_FQN] : this.getFieldValues(
          utilizer,
          neighbors.get(entityId),
          selectedDrillDownEntityType.id,
          selectedDrillDownPropertyType,
          selectedDrillDownPropertyTypeDateGroup);
        fieldNames.forEach((fieldName) => {
          const shouldAdd = (Object.keys(counts[primaryValue]).length < 9) || counts[primaryValue][fieldName];
          const formattedName = (shouldAdd) ? fieldName : OTHER_LABEL;
          fields.add(formattedName);
          const newCount = (counts[primaryValue][formattedName]) ? counts[primaryValue][formattedName] + 1 : 1;
          counts[primaryValue] = Object.assign(counts[primaryValue], { [formattedName]: newCount });
        });
      });
    });

    this.sortValuesAndDates(Object.keys(counts), selectedPropertyType).forEach((barName) => {
      const histogramValues = { name: barName };
      Object.keys(counts[barName]).forEach((fieldName) => {
        histogramValues[fieldName] = counts[barName][fieldName];
      });
      resultList.push(histogramValues);
    });
    return {
      counts: resultList,
      fields: this.sortValuesAndDates(Array.from(fields), selectedDrillDownPropertyType, true)
    };
  }

  sortValuesAndDates = (arr, propertyType, otherLabel) => {
    return arr.sort((v1, v2) => {
      if (otherLabel && v1 === OTHER_LABEL) return 1;
      if (otherLabel && v2 === OTHER_LABEL) return -1;

      const isDate = EdmConsts.EDM_DATE_TYPES.includes(propertyType.datatype);
      const formatted1 = (isDate) ? new Date(v1) : v1;
      const formatted2 = (isDate) ? new Date(v2) : v2;

      if (formatted1 < formatted2) return -1;
      if (formatted1 > formatted2) return 1;
      return 0;
    });
  }

  renderPropertyTypeSelection = (isDrillDown) => {
    const selectedEntityType = (isDrillDown) ? this.state.selectedDrillDownEntityType : this.state.selectedEntityType;
    if (!selectedEntityType) return null;
    const propertyTypes = (selectedEntityType.id === this.props.entityType.id)
      ? this.props.propertyTypes : selectedEntityType.properties.map((propertyTypeId) => {
        return this.props.neighborPropertyTypes[propertyTypeId];
      });
    const menuItems = [];
    propertyTypes.forEach((propertyType) => {
      if (isDrillDown && this.state.selectedEntityType.id === this.state.selectedDrillDownEntityType.id
        && propertyType.id === this.state.selectedPropertyType.id) return;
      const key = (isDrillDown) ? `drilldown-${propertyType.id}` : propertyType.id;
      const selectedPropertyType = (isDrillDown) ? this.state.selectedPropertyType : propertyType;
      let selectedDrillDownEntityType = this.state.selectedDrillDownEntityType;
      let selectedDrillDownPropertyType = (isDrillDown) ? propertyType : this.state.selectedDrillDownPropertyType;
      if (!isDrillDown && this.state.selectedEntityType.id === this.state.selectedDrillDownEntityType.id
        && propertyType.id === this.state.selectedDrillDownPropertyType.id) {
        selectedDrillDownEntityType = DEFAULT_SELECTED_ENTITY_TYPE;
        selectedDrillDownPropertyType = DEFAULT_SELECTED_PROPERTY_TYPE;
      }
      const title = this.props.entitySetPropertyMetadata.getIn([propertyType.id, 'title'], propertyType.title);
      menuItems.push(
        <MenuItem
            onClick={() => {
              this.setState({
                selectedPropertyType,
                selectedDrillDownPropertyType,
                selectedDrillDownEntityType,
                histogramData: this.getHistogramData(
                  this.state.selectedEntityType,
                  selectedPropertyType,
                  selectedDrillDownEntityType,
                  selectedDrillDownPropertyType,
                  this.state.drillDown)
              });
            }}
            key={key}
            eventKey={key}>
          {title}
        </MenuItem>
      );
    });
    return menuItems;
  }

  renderDateGroupingSelection = (propertyType, isDrillDown) => {
    if (!propertyType || !EdmConsts.EDM_DATE_TYPES.includes(propertyType.datatype)) return null;
    const title = (isDrillDown) ?
      this.state.selectedDrillDownPropertyTypeDateGroup : this.state.selectedPropertyTypeDateGroup;

    const menuItems = [];
    Object.keys(DATE_GROUPING_OPTIONS).forEach((dateGroupKey) => {
      const groupLabel = DATE_GROUPING_OPTIONS[dateGroupKey];
      const selectedPropertyTypeDateGroup = (isDrillDown) ?
        this.state.selectedPropertyTypeDateGroup : groupLabel;
      const selectedDrillDownPropertyTypeDateGroup =
        (isDrillDown) ? groupLabel : this.state.selectedDrillDownPropertyTypeDateGroup;
      const key = (isDrillDown) ? `${groupLabel}-drilldown` : `${groupLabel}-primary`;

      menuItems.push(
        <MenuItem
            onClick={() => {
              this.setState({
                selectedPropertyTypeDateGroup,
                selectedDrillDownPropertyTypeDateGroup,
                histogramData: this.getHistogramData(
                  this.state.selectedEntityType,
                  this.state.selectedPropertyType,
                  this.state.selectedDrillDownEntityType,
                  this.state.selectedDrillDownPropertyType,
                  this.state.drillDown,
                  this.props.neighbors,
                  selectedPropertyTypeDateGroup,
                  selectedDrillDownPropertyTypeDateGroup)
              });
            }}
            key={key}
            eventKey={key}>
          {groupLabel}
        </MenuItem>
      );
    });
    return (
      <DropdownButton
          bsStyle="default"
          title={title}
          id="date-group-select">
        {menuItems}
      </DropdownButton>
    );
  }

  renderDropdownSelection = (isDrillDown) => {
    const selectedEntityType = (isDrillDown) ? this.state.selectedDrillDownEntityType : this.state.selectedEntityType;
    const selectedPropertyType = (isDrillDown) ? this.state.selectedDrillDownPropertyType
      : this.state.selectedPropertyType;
    const entityTypeOptions = [this.props.entityType].concat(this.props.neighborEntityTypes).map((entityType) => {
      const key = (isDrillDown) ? `drilldown-${entityType.id}` : entityType.id;
      return (
        <MenuItem
            onClick={() => {
              if (entityType.id !== selectedEntityType.id) {
                const selectedEntityTypeValue = (isDrillDown) ? this.state.selectedEntityType : entityType;
                const selectedDrillDownEntityTypeValue = (isDrillDown) ? entityType : DEFAULT_SELECTED_ENTITY_TYPE;
                const selectedPropertyTypeValue = (isDrillDown)
                  ? this.state.selectedPropertyType : DEFAULT_SELECTED_PROPERTY_TYPE;

                this.setState({
                  selectedEntityType: selectedEntityTypeValue,
                  selectedDrillDownEntityType: selectedDrillDownEntityTypeValue,
                  selectedPropertyType: selectedPropertyTypeValue,
                  selectedDrillDownPropertyType: DEFAULT_SELECTED_PROPERTY_TYPE
                });
              }
            }}
            key={key}
            eventKey={key}>
          {entityType.title}
        </MenuItem>
      );
    });

    const title = this.props.entitySetPropertyMetadata
      .getIn([selectedPropertyType.id, 'title'], selectedPropertyType.title);

    return (
      <div className={styles.generateHistogramButtonRow}>
        <DropdownButton bsStyle="default" title={selectedEntityType.title} id="entity-type-select">
          {entityTypeOptions}
        </DropdownButton>
        <DropdownButton
            bsStyle="default"
            title={title}
            id="property-select"
            disabled={!selectedEntityType.id}>
          {this.renderPropertyTypeSelection(isDrillDown)}
        </DropdownButton>
        {this.renderDateGroupingSelection(selectedPropertyType, isDrillDown)}
      </div>
    );
  }

  renderDrillDownButton = () => {
    const disabled = (!this.state.selectedEntityType.id || !this.state.selectedPropertyType.id);
    const buttonText = (this.state.drillDown) ? 'Hide drill down' : 'Drill down';
    return (
      <div className={styles.generateHistogramButtonRow}>
        <Button
            bsStyle="success"
            bsSize="small"
            disabled={disabled}
            onClick={() => {
              const histogramData = (this.state.drillDown) ? this.getHistogramData(
                this.state.selectedEntityType,
                this.state.selectedPropertyType,
                {},
                {},
                !this.state.drillDown) : this.state.histogramData;
              this.setState({
                drillDown: !this.state.drillDown,
                histogramData
              });
            }}>{buttonText}</Button>
      </div>
    );
  }

  renderDrillDownSelection = () => {
    if (!this.state.drillDown || !this.state.selectedEntityType.id || !this.state.selectedPropertyType.id) return null;
    return this.renderDropdownSelection(true);
  }

  renderHistogram = () => {
    let content;
    const { counts, fields } = this.state.histogramData;
    if (counts.length && fields.length) {
      content = <HistogramVisualization counts={counts} fields={fields} />;
    }
    return <div className={styles.histogramContainer}>{content}</div>;
  }

  renderHistogramLabel = () => {
    const {
      selectedEntityType,
      selectedPropertyType,
      selectedDrillDownEntityType,
      selectedDrillDownPropertyType,
      drillDown
    } = this.state;

    let primaryLabel = '';
    let drillDownLabel = '';

    if (selectedEntityType.id && selectedPropertyType.id) {
      primaryLabel = `${selectedEntityType.title}: ${selectedPropertyType.title}`;
    }
    if (drillDown && selectedDrillDownEntityType.id && selectedDrillDownPropertyType.id) {
      drillDownLabel = `drill down by ${selectedDrillDownEntityType.title}: ${selectedDrillDownPropertyType.title}`;
    }
    return (
      <div>
        <div className={styles.primaryLabel}>{primaryLabel}</div>
        <div className={styles.drillDownLabel}>{drillDownLabel}</div>
      </div>
    );
  }

  render() {
    if (this.props.propertyTypes.length === 0) return null;
    return (
      <div className={styles.histogramSection}>
        {this.renderDropdownSelection(false)}
        {this.renderDrillDownSelection()}
        {this.renderDrillDownButton()}
        {this.renderHistogram()}
        {this.renderHistogramLabel()}
      </div>
    );
  }
}
