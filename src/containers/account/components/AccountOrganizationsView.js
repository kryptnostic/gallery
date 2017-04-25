import React from 'react';
import PropTypes from 'prop-types';

import AccountSectionWrapper from '../../../components/account/AccountSectionWrapper';
import styles from '../styles.module.css';

const renderContent = (content) => {
  const renderedUserOrgs = content.map((org) => {
    return (
      <div className={styles.orgWrapper} key={org.id}>
        <div className={styles.orgTitle}>
          {org.title}
        </div>
        <div className={styles.orgRoles}>
          Roles: {org.roles}
        </div>
      </div>
    );
  });

  return renderedUserOrgs;
};

const AccountOrganizationsView = ({ content }) => {
  return (
    <AccountSectionWrapper header="Your Organizations">
      <div className={styles.contentWrapper}>
        {content.length > 0 ? renderContent(content) : 'You\'re not a member of any organizations yet.'}
      </div>
    </AccountSectionWrapper>
  );
};

AccountOrganizationsView.propTypes = {
  content: PropTypes.array.isRequired
};

export default AccountOrganizationsView;
