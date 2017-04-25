import React from 'react';
import PropTypes from 'prop-types';

import ProfileAvatar from './ProfileAvatarView';
import styles from '../styles.module.css';

const ProfileSidePanel = ({ nickname, googleId }) => {
  return (
    <div className={styles.sidePanelWrapper}>
      <ProfileAvatar
          nickname={nickname}
          googleId={googleId} />
    </div>
  );
};

ProfileSidePanel.propTypes = {
  nickname: PropTypes.string.isRequired,
  googleId: PropTypes.string.isRequired
};

export default ProfileSidePanel;
