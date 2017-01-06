import React, { PropTypes } from 'react';
import FontAwesome from 'react-fontawesome';
import AuthService from '../../../utils/AuthService';
import StringConsts from '../../../utils/Consts/StringConsts';
import PageConsts from '../../../utils/Consts/PageConsts';
import styles from './styles.module.css';
import { Link } from 'react-router';

export class Navbar extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }

  static propTypes = {
    auth: PropTypes.instanceOf(AuthService),
    updateTopbarFn: PropTypes.func
  }

  constructor() {
    super();
    this.state = {
      selected: this.getCurrentState()
    };
  }

  componentDidMount() {
    this.props.updateTopbarFn();
  }

  getCurrentState = () => {
    const hashRegex = /#\/([a-zA-Z]+)(?!\?.*)?/;
    const route = window.location.hash.match(hashRegex)[1];
    switch (route) {
      case (PageConsts.HOME):
        return PageConsts.HOME;
      case (PageConsts.CATALOG):
        return PageConsts.CATALOG;
      case (PageConsts.VISUALIZE):
        return PageConsts.VISUALIZE;
      case (PageConsts.ORG):
        return PageConsts.ORG;
      default:
        return StringConsts.EMPTY;
    }
  }

  showLogoutButton() {
    if (this.props.auth.loggedIn()) {
      return <button onClick={this.logout} className={styles.logoutButton}>Logout</button>;
    }
    return null;
  }

  logout = () => {
    this.props.auth.logout();
    this.context.router.push(`/${PageConsts.LOGIN}`);
  }

  getButtonClass = (state) => {
    return (state === this.state.selected) ? `${styles.navButton} ${styles.navButtonSelected}` : `${styles.navButton}`;
  }

  updateState = (newState) => {
    this.props.updateTopbarFn();
    this.setState({ selected: newState });
  }

  render() {
    return (
      <div className={styles.navbarContainer}>

        <Link
          to={`/${PageConsts.HOME}`}
          className={this.getButtonClass(PageConsts.HOME)}
          onClick={() => {
            this.updateState(PageConsts.HOME);
          }}
        >
          <FontAwesome name="home" size="2x" />
          <div className={styles.navButtonText}>Home</div>
        </Link>

        <Link
          to={`/${PageConsts.CATALOG}`}
          className={this.getButtonClass(PageConsts.CATALOG)}
          onClick={() => {
            this.updateState(PageConsts.CATALOG);
          }}
        >
          <FontAwesome name="book" size="2x" />
          <div className={styles.navButtonText}>Catalog</div>
        </Link>

        <Link
          to={`/${PageConsts.VISUALIZE}`}
          className={this.getButtonClass(PageConsts.VISUALIZE)}
          onClick={() => {
            this.updateState(PageConsts.VISUALIZE);
          }}
        >
          <FontAwesome name="eye" size="2x" />
          <div className={styles.navButtonText}>Visualize</div>
        </Link>

        <Link
          to={`/${PageConsts.SCHEMAS}`}
          className={this.getButtonClass(PageConsts.SCHEMAS)}
          onClick={() => {
            this.updateState(PageConsts.SCHEMAS);
          }}
        >
          <FontAwesome name="circle" size="2x" />
          <div className={styles.navButtonText}>Schemas</div>
        </Link>

        <Link
          to={`/${PageConsts.ORG}`}
          className={this.getButtonClass(PageConsts.ORG)}
          onClick={() => {
            this.updateState(PageConsts.ORG);
          }}
        >
          <FontAwesome name="sitemap" size="2x" />
          <div className={styles.navButtonText}>Org</div>
        </Link>
      </div>
    );
  }
}

export default Navbar;
