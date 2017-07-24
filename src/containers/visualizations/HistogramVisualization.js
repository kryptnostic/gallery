import React, { PropTypes } from 'react';
import {
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import * as formatter from './FormatUtils';
import EdmConsts from '../../utils/Consts/EdmConsts';
import styles from './styles.module.css';

export class HistogramVisualization extends React.Component {

  static propTypes = {
    data: PropTypes.object,
    propertyType: PropTypes.object
  }

  render() {
    const { data, propertyType } = this.props;
    if (data === undefined) return null;
    const barData = Object.keys(data).map((rawName) => {
      const name = (EdmConsts.EDM_DATE_TYPES.includes(propertyType.datatype))
        ? formatter.formatDate(rawName) : rawName;
      return {
        name,
        count: data[rawName]
      };
    });
    return (
      <div className={styles.visualizationContainer}>
        <div className={styles.visualizationWrapper}>
          <BarChart
              width={600}
              height={300}
              data={barData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </div>
      </div>
    );
  }
}

export default HistogramVisualization;