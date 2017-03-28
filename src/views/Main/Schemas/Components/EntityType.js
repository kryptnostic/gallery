import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { Promise } from 'bluebird';
import { EntityDataModelApi } from 'loom-data';
import InlineEditableControl from '../../../../components/controls/InlineEditableControl';
import FileService from '../../../../utils/FileService';
import { PropertyList } from './PropertyList';
import FileConsts from '../../../../utils/Consts/FileConsts';
import ActionConsts from '../../../../utils/Consts/ActionConsts';
import styles from '../styles.module.css';

export class EntityType extends React.Component {
  static propTypes = {
    entityType: PropTypes.object,
    idToPropertyTypes: PropTypes.object
  }

  static contextTypes = {
    isAdmin: PropTypes.bool
  }

  constructor() {
    super();
    this.state = {
      properties: []
    };
  }

  componentDidMount() {
    this.loadProperties(this.props.entityType.properties);
  }

  componentWillReceiveProps(nextProps) {
    this.loadProperties(nextProps.entityType.properties);
  }

  loadProperties = (propertyIds) => {
    const properties = propertyIds.map((id) => {
      return this.props.idToPropertyTypes[id];
    });
    this.setState({ properties });
  }

  updateFn = () => {
    EntityDataModelApi.getEntityType(this.props.entityType.id)
    .then((entityType) => {
      Promise.map(entityType.properties, (propertyId) => {
        return EntityDataModelApi.getPropertyType(propertyId);
      }).then((properties) => {
        this.setState({ properties });
      });
    });
  }

  downloadFile = () => {
    const properties = {
      properties: this.state.properties
    };
    const entityType = Object.assign(this.props.entityType, properties);
    FileService.saveFile(entityType, this.props.entityType.title, FileConsts.JSON, this.enableButton);
  }

  updateEntityType = (newTypeUuid, action) => {
    if (action === ActionConsts.ADD) {
      EntityDataModelApi.addPropertyTypeToEntityType(this.props.entityType.id, newTypeUuid[0])
      .then(() => {
        this.updateFn();
      });
    }
    else if (action === ActionConsts.REMOVE) {
      EntityDataModelApi.removePropertyTypeFromEntityType(this.props.entityType.id, newTypeUuid[0])
      .then(() => {
        this.updateFn();
      });
    }
  }

  updateEntityTypeTitle = (title) => {
    EntityDataModelApi.updateEntityTypeMetaData(this.props.entityType.id, { title })
    .then(() => this.updateFn());
  }

  updateEntityTypeDescription = (description) => {
    EntityDataModelApi.updateEntityTypeMetaData(this.props.entityType.id, { description })
    .then(() => this.updateFn());
  }

  render() {
    const entityType = this.props.entityType;
    return (
      <div>
        <div className={styles.italic}>{`${entityType.type.namespace}.${entityType.type.name}`}</div>
        <div className={styles.spacerSmall} />
        <InlineEditableControl
            type="text"
            size="xlarge"
            placeholder="Entity type title..."
            value={entityType.title}
            viewOnly={!this.context.isAdmin}
            onChange={this.updateEntityTypeTitle} />
        <InlineEditableControl
            type="textarea"
            size="small"
            placeholder="Entity type description..."
            value={entityType.description}
            viewOnly={!this.context.isAdmin}
            onChange={this.updateEntityTypeDescription} />
        <div className={styles.spacerSmall} />
        <div className={styles.dropdownButtonContainer}>
          <Button bsStyle="primary" onClick={this.downloadFile}>Download as JSON</Button>
        </div>
        <div className={styles.spacerMed} />
        <PropertyList
            properties={this.state.properties}
            primaryKey={entityType.key}
            entityTypeName={entityType.type.name}
            entityTypeNamespace={entityType.type.namespace}
            updateFn={this.updateEntityType}
            editingPermissions={false} />
        <div className={styles.spacerBig} />
        <hr />
      </div>
    );
  }
}

export default EntityType;
