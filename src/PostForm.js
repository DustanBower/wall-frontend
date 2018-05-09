import React from 'react';

class PostForm extends React.Component {
  state = {
    title: '',
    body: ''
  }

  updateTitle = (title) => {
    this.setState({title: title});
  }

  updateBody = (body) => {
    this.setState({body: body});
  }

  createPost = async () => {
    try {
      const data = {
        title: this.state.title,
        body: this.state.body,
        user: this.props.userId
      }

      let token = localStorage.getItem('token') || null;
      const results = await fetch(
        'http://localhost:8000/posts/',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-type': 'application/json'
          },
          body: JSON.stringify(data),
          method: 'POST',
        });

      if (results.status !== 201) {
        alert('Could not post message.');
      } else {
        this.setState({title: '', body: ''});
        this.props.loadPosts();
      }
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return (
      <React.Fragment>
        <p>Post a message for others to see!</p>
        <table>
          <tbody>
            <tr>
              <td><label htmlFor="title">Title:</label></td>
              <td>
                <input
                  type="text"
                  id="title"
                  value={this.state.title} 
                  onChange={(e) => {this.updateTitle(e.target.value)}} />
              </td>
            </tr>
            <tr>
              <td><label htmlFor="body">Body:</label></td>
              <td>
                <textarea
                  id="body"
                  value={this.state.body}
                  onChange={(e) => {this.updateBody(e.target.value)}} />
              </td>
            </tr>
            <tr>
              <td></td>
              <td><button onClick={this.createPost}>Post</button></td>
            </tr>
          </tbody>
        </table>
      </React.Fragment>
    )
  }
}

export default PostForm;
