import React from 'react';
import jwt_decode from 'jwt-decode';

import PostForm from './PostForm';

class SignedIn extends React.Component {
  render() {
    return (
      <table>
        <tbody>
          <tr>
            <td>
              Welcome, {localStorage.username}!
            </td>
            <td>
              <button onClick={this.props.logout}>Log out</button>
            </td>
          </tr>
          <tr>
            <td>
              <PostForm {...this.props}
                userId={localStorage.user_id} />
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}

class SignIn extends React.Component {
  render() {
    return (
      <React.Fragment>
        <table>
          <tbody>
            <tr>
              <td>
                <label htmlFor="username">Username:</label>
              </td>
              <td>
                <input
                  type="text"
                  value={this.props.username}
                  onChange={(e) => this.props.setUsername(
                    e.target.value.trim())} />
              </td>
              <td>
                <button
                  onClick={this.props.newAccount}>New Account</button>
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="password">Password:</label>
              </td>
              <td>
                <input
                  type="password"
                  value={this.props.password}
                  onChange={(e) => this.props.setPassword(
                    e.target.value.trim())} />
              </td>
              <td>
                <button onClick={this.props.login}>Login</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p>{this.props.loginErrors}</p>
      </React.Fragment>
    );
  }
}

class SignUp extends React.Component {
  state = {
    confirmEmail: '',
    confirmPassword: '',
    email: '',
    emailErrors: '',
    passwordErrors: '',
    usernameErrors: ''
  }

  register = async () => {
    try {
      let errors = false;

      let updates = {
        emailErrors: '',
        passwordErrors: '',
        usernameErrors: '',
        confirmEmail: this.state.confirmEmail,
        confirmPassword: this.state.confirmPassword
      };

      if (this.state.email !== this.state.confirmEmail) {
        updates['emailErrors'] = 'Email addresses do not match.';
        updates['confirmEmail'] = '';
        errors = true;
      }

      if (this.props.password !== this.state.confirmPassword) {
        updates['passwordErrors'] = 'Passwords do not match.';
        updates['confirmPassword'] = '';
        errors = true;
      }

      this.setState(updates);

      const data = {
        username: this.props.username, 
        password: this.props.password,
        email: this.state.email
      }

      errors = false;

      const results = await fetch(
        'http://localhost:8000/users/',
        {
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify(data),
          method: 'POST'
        });

      const json = await results.json(); 
      if (results.status !== 201) {
        let emailErrors = '';
        let passwordErrors = '';
        let usernameErrors = '';
        if (typeof json.email !== "undefined") {
          emailErrors = json.email.join(' ');
          errors = true;
        }

        if (typeof json.password !== "undefined") {
          passwordErrors = json.password.join(' ');
          errors = true;
        }

        if (typeof json.username !== "undefined") {
          usernameErrors = json.username.join(' ');
          errors = true;
        }

        if (errors) {
          this.setState({
            emailErrors: emailErrors,
            passwordErrors: passwordErrors,
            usernameErrors: usernameErrors});
          return;
        }
      }

      // if all is good, login
      this.setState({newAccount: false});
      this.props.login();
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return (
      <React.Fragment>
        <table>
          <tbody>
            <tr>
              <td>
                <label htmlFor="username">Username:</label>
              </td>
              <td>
                <input
                  type="text"
                  value={this.props.username}
                  onChange={(e) => this.props.setUsername(
                    e.target.value.trim())} />
              </td>
            </tr>
            <tr>
              <td></td>
              <td>
                <p>{this.state.usernameErrors}</p>
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="email">Email address:</label>
              </td>
              <td>
                <input
                  id="email"
                  type="text"
                  value={this.state.email}
                  onChange={(e) => this.setState(
                    {email: e.target.value.trim()})} />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="confirm_email">Confirm email address:</label>
              </td>
              <td>
                <input
                  id="confirm_email"
                  type="text"
                  value={this.state.confirmEmail}
                  onChange={(e) => this.setState(
                    {confirmEmail: e.target.value.trim()})} />
              </td>
            </tr>
            <tr>
              <td></td>
              <td>
                <p>{this.state.emailErrors}</p>
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="password">Password:</label>
              </td>
              <td>
                <input
                  type="password"
                  value={this.props.password}
                  onChange={(e) => this.props.setPassword(
                    e.target.value.trim())} />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="password">Confirm password:</label>
              </td>
              <td>
                <input
                  id="password"
                  type="password"
                  value={this.state.confirmPassword}
                  onChange={(e) => this.setState(
                    {confirmPassword: e.target.value.trim()})} />
              </td>
              <td>
                <button onClick={this.register}>Register</button>
              </td>
            </tr>
            <tr>
              <td></td>
              <td>
                <p>{this.state.passwordErrors}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

class Login extends React.Component {
  state = {
    username: '',
    password: '',
    loginErrors: '',
    newAccount: false
  }

  newAccount = () => {
    this.setState({newAccount: true});
  }

  setUsername = (username) => {
    this.setState({username: username})
  }

  setPassword = (password) => {
    this.setState({password: password})
  }

  login = async () => {
    try {
      const data = {
        username: this.state.username, 
        password: this.state.password
      }

      const results = await fetch(
        'http://localhost:8000/auth/token/obtain/',
        {
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify(data),
          method: 'POST'
        });

      const token = await results.json(); 
      if (results.status === 200) {
        this.storeToken(this.state.username, token.access);
        this.setState({loginErrors: ''});
      } else {
          this.setState({loginErrors: 'Invalid username or password'});
      }
    } catch (e) {
      console.log(e);
    }
  }

  logout = () => {
    for (let field of ['username', 'user_id', 'exp']) {
      localStorage.removeItem(field);
    }
    this.props.setUser('');
    this.setState({username: '', password: ''});
  }

  storeToken = (username, token) => {
    const decoded = jwt_decode(token);
    for (let field of ['user_id', 'exp']) {
      localStorage[field] = decoded[field];
    }

    localStorage.token = token;
    localStorage.username = username;
    this.props.setUser(username);

  }

  render() {
    let now = new Date();
    if (localStorage.exp < now.getTime() / 1000) {
      this.logout();
    }

    if (this.props.user) {
      return <SignedIn {...this.props}
               logout={this.logout} />
    }

    if (this.state.newAccount) {
      return <SignUp {...this.props}
               username={this.state.username}
               password={this.state.password}
               login={this.login}
               setUsername={this.setUsername}
               setPassword={this.setPassword} />
    }

    return (
      <SignIn {...this.props}
        username={this.state.username}
        password={this.state.password}
        login={this.login}
        loginErrors={this.state.loginErrors}
        newAccount={this.newAccount}
        setUsername={this.setUsername}
        setPassword={this.setPassword} />
    );
  }
}

export default Login;
