import React, { PropTypes } from 'react';
import DocumentTitle from 'react-document-title';

import Page from '../../../components/page/Page';
import ProfileSidePanel from './ProfileSidePanelView';
import ProfileMainPanel from './ProfileMainPanelView';
import ProfileAvatar from './ProfileAvatarView';
import styles from '../styles.module.css';

const ProfileView = ({ fullName, googleId, email }) => {
  const name = 'Corwin Crownover';
  return (
    <DocumentTitle title="Profile">
      <Page>
        <Page.Header>
          <Page.Title>{name}</Page.Title>
        </Page.Header>
        <Page.Body>
          <div className={styles.profileWrapper}>
            <ProfileSidePanel
                fullName={fullName}
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

};

export default ProfileView;
