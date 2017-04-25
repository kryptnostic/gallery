import React from 'react';
import PropTypes from 'prop-types';

import AccountSectionWrapper from '../../../components/account/AccountSectionWrapper';
import styles from '../styles.module.css';

const ProfileAbout = ({ email }) => {
  const header = 'About';
  return (
    <AccountSectionWrapper header={header}>
      <div className={styles.sectionContent}>
        <div className={styles.contentItemWrapper}>
          <div className={styles.contentItemLabel}>Email address:</div>
          <div className={styles.contentItemDescription}>{email}</div>
        </div>
      </div>
    </AccountSectionWrapper>
  );
};

ProfileAbout.propTypes = {
  email: PropTypes.string.isRequired
};

export default ProfileAbout;
