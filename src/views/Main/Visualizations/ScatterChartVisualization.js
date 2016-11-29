import React, { PropTypes } from 'react';
import {
  CartesianGrid,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import styles from './styles.module.css';

const lineData = [
  [{ name: 1994, salary: 300, life_expectancy: 47 }],
  [{ name: 1995, salary: 305, life_expectancy: 51 }],
  [{ name: 1996, salary: 321, life_expectancy: 54 }],
  [{ name: 1997, salary: 323, life_expectancy: 70 }],
  [{ name: 1998, salary: 318, life_expectancy: 69 }],
  [{ name: 1999, salary: 340, life_expectancy: 75 }],
  [{ name: 2000, salary: 408, life_expectancy: 90 }],
  [{ name: 2001, salary: 425, life_expectancy: 95 }],
  [{ name: 2002, salary: 515, life_expectancy: 133 }],
  [{ name: 2003, salary: 502, life_expectancy: 143 }],
  [{ name: 2004, salary: 541, life_expectancy: 161 }],
  [{ name: 2005, salary: 561, life_expectancy: 201 }],
  [{ name: 2006, salary: 594, life_expectancy: 184 }],
  [{ name: 2007, salary: 677, life_expectancy: 190 }],
  [{ name: 2008, salary: 731, life_expectancy: 224 }],
  [{ name: 2009, salary: 623, life_expectancy: 281 }],
  [{ name: 2010, salary: 608, life_expectancy: 231 }],
  [{ name: 2011, salary: 509, life_expectancy: 202 }],
  [{ name: 2012, salary: 580, life_expectancy: 170 }],
  [{ name: 2013, salary: 602, life_expectancy: 205 }],
  [{ name: 2014, salary: 634, life_expectancy: 230 }],
  [{ name: 2015, salary: 640, life_expectancy: 269 }],
  [{ name: 2016, salary: 680, life_expectancy: 298 }]
];

const labelElementId = 'visualization_label';

export class ScatterChartVisualization extends React.Component {

  static propTypes = {
    entitySetName: PropTypes.string,
    xProp: PropTypes.string,
    yProp: PropTypes.string
  }

  render() {
    if (this.props.xProp === undefined || this.props.yProp === undefined) return null;

    const scatterPoints = lineData.map((point) => {
      return (
        <Scatter
          data={point}
          fill="#8884d8"
          key={point[0].name}
        />
      );
    });
    const xProp = JSON.parse(this.props.xProp).name;
    const yProp = JSON.parse(this.props.yProp).name;
    return (
      <div className={styles.visualizationContainer}>
        <div className={styles.visualizationWrapper}>
          <ScatterChart width={750} height={250}>
            <XAxis
              dataKey={xProp}
              name={xProp}
              type="number"
              domain={['dataMin', 'dataMax']}
            />
            <YAxis
              dataKey={yProp}
              name={yProp}
              type="number"
              domain={['dataMin', 'dataMax']}
            />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            {scatterPoints}
          </ScatterChart>
        </div>
        <div className={styles.label} id={labelElementId} />
      </div>
    );
  }
}

export default ScatterChartVisualization;
