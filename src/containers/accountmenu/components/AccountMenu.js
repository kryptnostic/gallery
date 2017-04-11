import React, { PropTypes } from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import { hashHistory } from 'react-router';
import PageConsts from '../../../utils/Consts/PageConsts';

import styles from '../styles.module.css';

const AccountMenu = ({}) => {
  return(
    <DropdownButton
        title={
          <span><FontAwesome name="cog" /></span>
        }
        pullRight
        id={styles.dropdown}
        noCaret>
      <MenuItem eventKey='1' onSelect={() => {
        hashHistory.push('/profile');
      }}>Profile</MenuItem>
      <MenuItem divider />
      <MenuItem eventKey='2'>Logout</MenuItem>
    </DropdownButton>
  );
};

export default AccountMenu;
