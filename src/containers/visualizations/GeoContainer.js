import React, { PropTypes } from 'react';
import { GeoVisualization } from './GeoVisualization';
import styles from './styles.module.css';

export class GeoContainer extends React.Component {

  static propTypes = {
    geoProps: PropTypes.array,
    data: PropTypes.array
  }

  render() {
    const { geoProps, data } = this.props;
    if (geoProps.length <= 1) return null;
    return (
      <div>
        <div className={styles.spacerSmall} />
        <div className={styles.inlineBlock}>
          <GeoVisualization data={data} geoProps={geoProps} />
        </div>
      </div>
    );
  }
}

export default GeoContainer;