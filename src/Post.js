import React from 'react';

class Post extends React.Component {
  render() {
    let divider = this.props.index === 0 ? null : <hr />
    let date = new Date(this.props.datetime).toDateString();
    return (
      <React.Fragment>
        {divider}
        <div>
          <strong>{this.props.title}</strong> by {this.props.username} {date}
          {this.props.body.split("\n").map((line, index) => {
            return <p key={index}>{line}</p>;
          })}
        </div>
      </React.Fragment>
    )
  }
}

export default Post;
