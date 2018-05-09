import React from 'react';
import './App.css';

import Wall from './Wall';

class App extends React.Component {
  state = {
    user: ''
  }

  setUser = (username) => {
    this.setState({user: username});
  }

  componentDidMount() {
    if (typeof localStorage.username !== "undefined") {
      this.setState({user: localStorage.username});
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Wall</h1>
        </header>
        <br />
        <Wall
          setUser={this.setUser}
          user={this.state.user} />
      </div>
    );
  }
}

export default App;
