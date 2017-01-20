import React from 'react';
import { PropertyTypePropType } from '../../../../components/propertytype/PropertyTypeStorage';
import styles from '../styles.module.css';

export class PropertyType extends React.Component {
  static propTypes = {
    propertyType: PropertyTypePropType.isRequired
  };

  render() {
    const prop = this.props.propertyType;
    return (
      <div>
        <div className={styles.italic}>{`${prop.type.namespace}.${prop.type.name}`}</div>
        <div className={styles.spacerSmall} />
        <div className={styles.title}>{prop.title}</div>
        <div className={styles.description}>{prop.description}</div>
        <div className={styles.spacerSmall} />
        <div className={styles.italic}>datatype: {prop.datatype}</div>
        <div className={styles.spacerBig} />
        <hr />
      </div>
    );
  }
}

export default PropertyType;
