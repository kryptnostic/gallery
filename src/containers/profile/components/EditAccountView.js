import React from 'react';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';

import Page from '../../../components/page/Page';
import AuthService from '../../../utils/AuthService';
import BasicInfoForm from '../containers/BasicInfoForm';
import AccountInfoForm from '../containers/AccountInfoForm';
import OrganizationsSection from '../containers/OrganizationsSection';

// TODO:  Rename to NOT container
export default class EditAccountView extends React.Component {
  static propTypes = {
    auth: PropTypes.instanceOf(AuthService).isRequired
  }
  render() {
    return (
      <DocumentTitle title="Account">
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
