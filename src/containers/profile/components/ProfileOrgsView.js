import React from 'react';
import PropTypes from 'prop-types';

import ProfileSectionWrapper from '../../../components/profile/ProfileSectionWrapper';
import styles from '../styles.module.css';

// TODO: COMPLETE
const getRoles = (org) => {
  return 'Owner, admin';
};

const renderOrgs = (orgs) => {
  if (orgs.length === 0) {
    return 'No organizations.';
  }

  return orgs.map((org) => {
    return (
      <div className={styles.contentItemWrapper} key={org.id}>
        <div className={styles.contentItemLabel}>{org.title}:</div>
        <div className={styles.contentItemDescription}>{getRoles(org)}</div>
      </div>
    );
  });
};

const ProfileOrgs = ({ orgs }) => {
  const header = 'Organizations';

  return (
    <ProfileSectionWrapper header={header}>
      <div className={styles.sectionContent}>
        {renderOrgs(orgs)}
      </div>
    </ProfileSectionWrapper>
  );
};

ProfileOrgs.propTypes = {
  orgs: PropTypes.array.isRequired
};

export default ProfileOrgs;
