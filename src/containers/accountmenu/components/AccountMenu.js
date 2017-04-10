import React, { PropTypes } from 'react';

import userProfileImg from '../../../images/user-profile-icon.png';
import styles from '../styles.module.css';

const AccountMenu = ({}) => {
  return(
    <div>
      <img src={userProfileImg} className={styles.avatarIcon} />
    </div>
  );
};

export default AccountMenu;


// <Link
//     to={`/${PageConsts.LOGIN}`}
//     className={styles.headerNavLink}
//     onClick={this.onLogoutClick}>
//   Logout
// </Link>
