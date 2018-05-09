import React from 'react';

import Login from './Login';
import Post from './Post';

class Wall extends React.Component {
  state = {
    posts: []
  }

  componentDidMount() {
    this.loadPosts();
  }

  loadPosts = async () => {
    try {
      const results = await fetch('http://localhost:8000/posts/');
      const posts = await results.json();
      this.setState({posts: posts});
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="login">
          <Login {...this.props}
            loadPosts={this.loadPosts} />
        </div>
        <div className="main">
          {this.state.posts.map((post, index) => {
            return <Post
                     key={post.id}
                     id={post.id}
                     index={index}
                     title={post.title}
                     username={post.username}
                     datetime={post.datetime}
                     body={post.body} />
          })}
        </div>
      </React.Fragment>
    );
  }
}

export default Wall;
