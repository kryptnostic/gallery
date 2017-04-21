import React, { PropTypes } from 'react';

import ProfileSectionWrapper from '../../../components/profile/ProfileSectionWrapper';
import styles from '../styles.module.css';

const ProfileAbout = ({}) => {
  const header = "About";
  return (
    <ProfileSectionWrapper header={header}>
      <div className={styles.sectionContent}>
        <div>blah</div>
        <div>blablahblahblahblahh</div>
        <div>blablahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblahblahh</div>
      </div>
    </ProfileSectionWrapper>
  );
};

ProfileAbout.propTypes = {

};

export default ProfileAbout;
