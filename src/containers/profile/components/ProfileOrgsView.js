import React, { PropTypes } from 'react';

import ProfileSectionWrapper from '../../../components/profile/ProfileSectionWrapper';
import styles from '../styles.module.css';

const ProfileOrgs = ({}) => {
  const orgs = [
    {
      title: 'Cats'
    },
    {
      title: 'Dogs'
    }
  ];

  const orgElements = orgs.map((org) => {
    return (
      <div>{org.title}</div>
    );
  });

  const header = 'Organizations';

  return (
    <ProfileSectionWrapper header={header}>
      <div className={styles.sectionContent}>
        {orgElements}
      </div>
    </ProfileSectionWrapper>
  );
};

ProfileOrgs.propTypes = {

};

export default ProfileOrgs;
