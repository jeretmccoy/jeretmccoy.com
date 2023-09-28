import axios from 'axios';

const uri = 'http://localhost:5000';

const getAccessToken = localStorage.getItem('authToken') !== undefined ? localStorage.getItem('authToken') : localStorage.clear();

const token = getAccessToken;

const headers = {
  Authorization: `Bearer ${token}`,  // Getting the token from local storage
  'Content-Type': 'application/json',
};

//All API calls to the backend 

export const helloWorld = () => axios.get(`${uri}/`);

export const registerUser = (props) => axios.post(`${uri}/register`, props);

export const signInUser = (props) => axios.post(`${uri}/signin`, props );

export const getPosts = () => axios.get(`${uri}/api/v1/blog/getAllPosts`);

export const signUp = (props) => axios.post(`${uri}/api/v1/user/signup`, props );

export const logIn = (props) => axios.post(`${uri}/api/v1/user/signin`, props );

export const createPost = (props) => axios.post(`${uri}/api/v1/blog/createPost`, props, { headers });

export const getUserPosts = (author) => axios.get(`${uri}/api/v1/blog/user/${author}`, { headers });

export const getSubbedPosts = () => axios.get(`${uri}/api/v1/blog/subscribedPosts`, { headers });

export const getBlogDetails = (postId) => axios.get(`${uri}/api/v1/blog/getBlogDetails?postId=${postId}`, { headers });

export const deleteBlog = (postId) => axios.delete(`${uri}/api/v1/blog/delete?postId=${postId}`, { headers });

export const editBlog = (props) => axios.post(`${uri}/api/v1/blog/edit`, props, { headers } );

export const privatePost = (postId) => axios.get(`${uri}/api/v1/blog/private?postId=${postId}`, { headers });

export const handleLike = (postId) => axios.get(`${uri}/api/v1/blog/likes/${postId}`, { headers });

export const handleUnlike = (postId) => axios.get(`${uri}/api/v1/blog/unlike/${postId}`, { headers });

export const addComment = (props) => axios.post(`${uri}/api/v1/blog/addComments`, props, { headers });

export const handleSub = (props) => axios.post(`${uri}/api/v1/blog/subscribe`, props, { headers });

export const checkSub = (props) => axios.post(`${uri}/api/v1/blog/checksub`, props, { headers });

export const handleUnsub = (props) => axios.post(`${uri}/api/v1/blog/unsub`, props, { headers });

export const getMySubs = () => axios.get(`${uri}/api/v1/blog/getMySubs`, { headers });

export const deleteComment = (props) => axios.post(`${uri}/api/v1/blog/deleteComment`, props, { headers });