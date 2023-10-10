import axios from 'axios';

const uri = process.env.REACT_APP_API_URL;

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

export const sendPost = (props) => axios.post(`${uri}/newPost`, props);

export const getPosts = () => axios.get(`${uri}/getPosts`);

export const renderPost = (id) => axios.get(`${uri}/post/${id}`);

export const checkPDF = (id) => axios.get(`${uri}/checkPDF/${id}`);

export const uploadPDF = (props) => axios.post(`${uri}/uploadPDF`, props);

export const downloadPDF = (id) => axios.get(`${uri}/downloadPDF/${id}`);

export const deletePost = (props) => axios.post(`${uri}/deletePost`, props);

export const updatePost = (props) => axios.post(`${uri}/updatePost`, props);