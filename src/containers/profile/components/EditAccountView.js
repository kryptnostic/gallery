import React from 'react';
import DocumentTitle from 'react-document-title';

import Page from '../../../components/page/Page';
import BasicInfoForm from '../containers/BasicInfoForm';
import AccountInfoForm from '../containers/AccountInfoForm';
import OrganizationsSection from '../containers/OrganizationsSection';

// TODO:  Rename to NOT container
export default class EditAccountView extends React.Component {

  render() {
    return (
      <DocumentTitle title="Profile">
        <Page>
          <Page.Header>
            <Page.Title>Account</Page.Title>
          </Page.Header>
          <Page.Body>
            <BasicInfoForm />
            <AccountInfoForm />
            <OrganizationsSection auth={this.props.auth} />
          </Page.Body>
        </Page>
      </DocumentTitle>
    );
  }
}
