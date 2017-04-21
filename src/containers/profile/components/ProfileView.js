import React, { PropTypes } from 'react';
import DocumentTitle from 'react-document-title';

import Page from '../../../components/page/Page';
import ProfileAvatar from './ProfileAvatarView';
import ProfileAbout from './ProfileAboutView';
import ProfileOrgs from './ProfileOrgsView';
import styles from '../styles.module.css';

const ProfileView = ({}) => {
  const name = 'Corwin';
  return (
    <DocumentTitle title="Profile">
      <Page>
        <Page.Header>
          <Page.Title>{name}&#39;s Profile</Page.Title>
        </Page.Header>
        <Page.Body>
          <ProfileAvatar />
          <ProfileAbout />
          <ProfileOrgs />
        </Page.Body>
      </Page>
    </DocumentTitle>
  );
};

ProfileView.propTypes = {

};

export default ProfileView;
