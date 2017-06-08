import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


class GetUserInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: 'test3@alphapoint.com'
    };
  }

  handleChange(event) {
     this.setState({username: event.target.value});
  }

  showUserInfo(body) {
    this.setState({
      verificationLevel: body.userInfo.VerificationLevels[0],
      use2FA: body.userInfo.UserInfoKVP.UseGoogle2FA
    });
  }

  getUserInfo() {
    var request = require('request-promise');

    var options = {
        method: 'POST',
        uri: 'https://sim3.alphapoint.com:8451/ajax/v1/GetUserInformation',
        body: {
          "sessionToken": this.props.sessionToken,
          "userId": this.state.username
        },
        json: true
    };

    var that = this;
    request(options)
        .then((parsedBody) => that.showUserInfo(parsedBody))
        .catch((err) => console.console.error(err));
  }

  setVerificationLevel(level) {
    var request = require('request-promise');

    var options = {
        method: 'POST',
        uri: 'https://sim3.alphapoint.com:8451/ajax/v1/SetUserVerificationLevel',
        body: {
          "sessionToken": this.props.sessionToken,
          "VerificationLevel" : '' + level,
          "UserId" : this.state.username,
          "Action" : "Add"
        },
        json: true
    };

    var that = this;
    request(options)
        .then((parsedBody) => console.log(parsedBody))
        .catch((err) => console.console.error(err));
  }

  twoFA(status) {
//     {
//   "sessionToken": "03c7157c-2485-4c58-879b-42efdeaaca62",
//   "userId" : "test3@alphapoint.com",
//   "userInfoKVP" : [
//   		{
//             "key": "UseAuthy2FA",
//             "value": "true"
//         }
//   	]
// }
  }

  render() {
    if (!this.props.sessionToken) return null;

    return (
      <div>
        <div>Get User Info</div>
        <label>Username</label>
        <input type="text" value={this.state.username} onChange={this.handleChange}/>
        <button onClick={() => this.getUserInfo()}>POST</button>
        {this.state.verificationLevel &&
          <div>
            <br/>
            <label>VerificationLevel: {this.state.verificationLevel}</label>
            <button onClick={() => this.setVerificationLevel(0)}>BASIC</button>
            <button onClick={() => this.setVerificationLevel(1)}>SILVER</button>
            <button onClick={() => this.setVerificationLevel(2)}>GOLD</button>
            <button onClick={() => this.setVerificationLevel(3)}>PLATINUM</button>
            <br/>
            <label>Use 2FA: {this.state.use2FA}</label>
            <button onClick={() => this.twoFA(true)}>Habilitado</button>
            <button onClick={() => this.twoFA(false)}>Desabilitado</button>
          </div>
        }
      </div>
    );
  }
}

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'marco'
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
     this.setState({name: event.target.value});
  }

  setSessionToken(sessionToken) {
    this.setState({sessionToken: sessionToken});
  }

  login() {
    var request = require('request-promise');

    var options = {
        method: 'POST',
        uri: 'https://sim3.alphapoint.com:8451/ajax/v1/Login',
        body: {
          "adminUserId":"marco",
          "password":"1234"
        },
        json: true
    };

    var that = this;
    request(options)
        .then((parsedBody) => that.setSessionToken(parsedBody.sessionToken))
        .catch((err) => console.error(err));
  }

  render() {
    return (
      <div>
        <label>Admin User</label>
        <input type="text" value={this.state.name} onChange={this.handleChange}/>
        <button onClick={() => this.login()}>Login</button>
        <br/>
        <label>Session token: {this.state.sessionToken}</label>
        <br/>
        <br/>
        <GetUserInfo sessionToken={this.state.sessionToken}/>
      </div>
    );
  }
}

ReactDOM.render(
  <Main />,
  document.getElementById('root')
);
