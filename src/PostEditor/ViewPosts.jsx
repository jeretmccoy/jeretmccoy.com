import React, { useState, useEffect } from 'react';
import { getPosts } from '../api/index';  // adjust the path if needed

const ViewPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getPosts();
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="Recent">
    <div className='Writings'>
    <div className='Writings-text'>
     <h1 id='Alpha'>RECENT</h1>
      {posts.map(post => (
        <div key={post.id} className='LinkAndSummary'>
            <h1 id='myh1'>{post.date}</h1>
            <p id='p1'> <a href={`/post/${post.id}`}>{post.title}</a> </p>
            <br></br>
            <p id='p1'>{post.description}</p>
            <br></br>
    
        </div>
      ))}
    </div>
    </div>
    </div>
  );
};

export default ViewPosts;
