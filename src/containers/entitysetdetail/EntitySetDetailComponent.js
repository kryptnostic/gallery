import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { denormalize } from 'normalizr';
import { Button } from 'react-bootstrap';

import { EntitySetPropType, EntitySetNschema } from '../../components/entityset/EntitySetStorage';
import { EntitySetDetail } from '../../components/entityset/EntitySet';
import AsyncContent, { AsyncStatePropType } from '../../components/asynccontent/AsyncContent';
import * as actionFactories from './EntitySetDetailActionFactories';
import ActionDropdown from '../../components/entityset/ActionDropdown';
import styles from './entitysetdetail.module.css';

class EntitySetDetailComponent extends React.Component {
  static propTypes = {
    asyncState: AsyncStatePropType.isRequired,
    entitySet: EntitySetPropType,
    loadEntitySet: PropTypes.func.isRequired
  };

  renderHeaderContent = () => {
    const { entitySet } = this.props;
    return (
      <div className={styles.headerContent}>
        <h1 className={styles.title}>{entitySet.title}</h1>
        <h2>About this data</h2>
        {entitySet.description}

        <div className={styles.controls}>
          <Button bsStyle="primary" bsSize="large">Manage Permissions</Button>
          <ActionDropdown entitySet={entitySet}/>
        </div>
      </div>
    );
  };

  render() {
    return (
      <div className={styles.catalog}>
        <header>
            <AsyncContent {...this.props.asyncState} content={this.renderHeaderContent}/>
        </header>
        <div className={styles.content}>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.props.loadEntitySet();
  }
}


function mapStateToProps(state, ownProps) {
  const entitySetDetail = state.get('entitySetDetail').toJS(),
    normalizedData = state.get('normalizedData');

  const entitySetId = ownProps.params.id;
  let entitySet;
  if (normalizedData.hasIn(['entitySets'], entitySetId)) {
    entitySet = denormalize(entitySetId, EntitySetNschema, normalizedData.toJS());
  } else {
    entitySet = null;
  }

  return {
    asyncState: entitySetDetail.asyncState,
    entitySet
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    loadEntitySet: () => { dispatch(actionFactories.entitySetDetailRequest(ownProps.params.id)); }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EntitySetDetailComponent);
