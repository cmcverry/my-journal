import './Latest.css';
import { useState, useEffect }from 'react';
import axios from 'axios';

function Latest() {

  const [posts, setPosts] = useState(null);

  const getLatestPosts = async () => {
    try {
        const response = await axios({
            method: "get",
            url: "/api/get/latestPosts",
        });
        console.log(response);
        setPosts(response.data);

    } catch (error) {
        console.log(error);
    }
  }

  useEffect(() => {
    getLatestPosts();
  },[] );


  if (posts != null) {
    return (
        <div className="latest-post-container">
            <h2 className="latest-header">Latest Posts</h2>
            <ul className="latest-posts">
            {posts.map((post, index) => {
              let date;
              if (post.edited != null){
                  date = "Edited on: " + post.edited;
              }
              else {
                  date = "Posted on: " + post.date_created;
              }

                return (
                <li className="post" key={index}>
                    <h3>{post.title}</h3>
                    <h5>{date}</h5>
                    <br/>
                    {post.body}
                    <br/>
                    <h5>Posted by: {post.username}</h5>
                </li>
                )
            })}
            </ul>
        </div>
    );
  } else {
    return (
      <div>
          <h2 className="latest-header">Latest Posts</h2>
          <h2>...</h2>
      </div>
    )
  }
}

export default Latest;
