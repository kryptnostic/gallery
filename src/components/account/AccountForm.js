import React, { PropTypes } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

import AccountSectionWrapper from './AccountSectionWrapper';
import styles from './styles.module.css';

const getFormItems = (content) => {
  const formItems = content.map((item) => {
    return (
      <div className={styles.formRow} key={item.key}>
        <ControlLabel className={styles.controlLabel}>
          {item.label}
        </ControlLabel>
        <FormControl
            className={styles.formControl}
            type="text"
            value={item.value}
            disabled />
      </div>
    );
  });

  return formItems;
};

const AccountForm = ({ header, content }) => {
  return (
    <AccountSectionWrapper header={header}>
      <FormGroup className={styles.sectionContent}>
        {getFormItems(content)}
      </FormGroup>
    </AccountSectionWrapper>
  );
};

AccountForm.propTypes = {
  header: PropTypes.string.isRequired,
  content: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  })).isRequired
};

export default AccountForm;
