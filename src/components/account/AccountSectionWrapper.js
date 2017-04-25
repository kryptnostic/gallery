import React, { PropTypes } from 'react';
import styles from './styles.module.css';

const AccountSectionWrapper = ({ header, ...props }) => {
  return (
    <form className={styles.accountFormWrapper}>
      <div className={styles.header}>
        {header}
      </div>
      <div className={styles.sectionContent}>
        {props.children}
      </div>
    </form>
  );
};

AccountSectionWrapper.propTypes = {
  header: PropTypes.string.isRequired,
  children: PropTypes.object.isRequired
};

export default AccountSectionWrapper;
