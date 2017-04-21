import React, { PropTypes } from 'react';

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

  return (
    <div>
      {orgElements}
    </div>
  );
};

ProfileOrgs.propTypes = {

};

export default ProfileOrgs;
