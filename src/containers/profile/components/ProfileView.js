import React from 'react';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';

import Page from '../../../components/page/Page';
import ProfileSidePanel from './ProfileSidePanelView';
import ProfileMainPanel from './ProfileMainPanelView';
import styles from '../styles.module.css';

const ProfileView = ({ nickname, googleId, email }) => {
  return (
    <DocumentTitle title="Profile">
      <Page>
        <Page.Header>
          <Page.Title>{nickname}</Page.Title>
        </Page.Header>
        <Page.Body>
          <div className={styles.profileWrapper}>
            <ProfileSidePanel
                nickname={nickname}
                googleId={googleId} />
            <ProfileMainPanel
                email={email} />
          </div>
        </Page.Body>
      </Page>
    </DocumentTitle>
  );
};

ProfileView.propTypes = {
  nickname: PropTypes.string.isRequired,
  googleId: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired
};

export default ProfileView;
