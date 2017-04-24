import React, { PropTypes } from 'react';
import DocumentTitle from 'react-document-title';

import Page from '../../../components/page/Page';
import ProfileSidePanel from './ProfileSidePanelView';
import ProfileMainPanel from './ProfileMainPanelView';
import ProfileAvatar from './ProfileAvatarView';
import styles from '../styles.module.css';

const ProfileView = ({ fullName, googleId, email, orgs }) => {
  return (
    <DocumentTitle title="Profile">
      <Page>
        <Page.Header>
          <Page.Title>{fullName}</Page.Title>
        </Page.Header>
        <Page.Body>
          <div className={styles.profileWrapper}>
            <ProfileSidePanel
                fullName={fullName}
                googleId={googleId} />
            <ProfileMainPanel
                email={email}
                orgs={orgs} />
          </div>
        </Page.Body>
      </Page>
    </DocumentTitle>
  );
};

ProfileView.propTypes = {

};

export default ProfileView;
