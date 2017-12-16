import React from "react";
import {connect} from "react-redux"
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';

import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import AuthService from '../../utils/AuthService';
import {logoutUser} from "../../actions/loginActions"
import LoginButton from "../LoginButton"
import PropTypes from 'prop-types';

import {authActions} from '../../reducers/auth';

const mapDispatchToProps = dispatch => ({
    loginSuccess: profile => dispatch(authActions.loginSuccess(profile)),
    loginError: error => dispatch(authActions.loginError(error)),
});

/*@connect((store) => {
  return { login: store.login, };
})*/

class Nav extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.authService = new AuthService();    
  }

    componentWillMount() {
        // Add callback for lock's `authenticated` event
        this.authService.lock.on('authenticated', (authResult) => {
            this.authService.lock.getProfile(authResult.idToken, (error, profile) => {
                if (error) { return this.props.loginError(error); }
                AuthService.setToken(authResult.idToken); // static method
                AuthService.setProfile(profile); // static method
                this.props.loginSuccess(profile);
                return this.props.history.push({ pathname: '/' });
            });
        });
        // Add callback for lock's `authorization_error` event
        this.authService.lock.on('authorization_error', (error) => {
            this.props.loginError(error);
            return this.props.history.push({ pathname: '/' });
        });
    }

  render() {
    const {dispatch,login} = this.props;
    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>        
  
      <AppBar
        title="Training App"
        iconElementLeft={<IconButton><NavigationMenu /></IconButton>}
        iconElementRight={<LoginButton authService={this.authService} />}
         />
      </MuiThemeProvider>        
    );
  }
}

Nav.propTypes = {

    loginSuccess: PropTypes.func.isRequired,
    loginError: PropTypes.func.isRequired,
};


export default connect(
    null, // no mapStateToProps
    mapDispatchToProps,
)(Nav);