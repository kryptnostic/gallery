import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { PrincipalsApi } from 'loom-data';

import ProfileView from '../components/ProfileView';

class Profile extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      user: {
        name: '',
        nickname: '',
        email: ''
      }
    };
  }

  componentDidMount() {
    PrincipalsApi.getUser(this.props.id)
      .then((user) => {
        console.log('user:', user);
        this.setState({ user });
      });

    PrincipalsApi.getAllUsers().then((users) => {console.log('all users:', users)});
  }

  getGoogleId = () => {
    return this.props.id.slice(14);
  }

  render() {

    return (
      <ProfileView
          fullName={this.state.user.nickname}
          googleId={this.getGoogleId()}
          email={this.state.user.email} />
    );
  }
}

function mapStateToProps(state, ownProps) {

  return {
    id: ownProps.params.id
  };
}

export default connect(mapStateToProps, null)(Profile);
