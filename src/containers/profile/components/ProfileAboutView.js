import React, { PropTypes } from 'react';

import ProfileSectionWrapper from '../../../components/profile/ProfileSectionWrapper';
import styles from '../styles.module.css';

const ProfileAbout = ({ email }) => {
  const header = "About";
  return (
    <ProfileSectionWrapper header={header}>
      <div className={styles.sectionContent}>
        <div className={styles.contentItemWrapper}>
          <div className={styles.contentItemLabel}>Email address:</div>
          <div className={styles.contentItemDescription}>{email}</div>
        </div>
      </div>
    </ProfileSectionWrapper>
  );
};

ProfileAbout.propTypes = {

};

export default ProfileAbout;
