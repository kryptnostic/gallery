import React, { PropTypes } from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

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
      <MenuItem eventKey='1'>Profile</MenuItem>
      <MenuItem divider />
      <MenuItem eventKey='2'>Logout</MenuItem>
    </DropdownButton>
  );
};

export default AccountMenu;
