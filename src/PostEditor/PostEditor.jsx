import React, { useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { sendPost } from '../api/index';  // adjust the path if needed
import "../css/Michels.css"
import { useNavigate } from 'react-router-dom';

const PostEditor = () => {
  const quillRef = useRef(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [description, setDescription] = useState('');
  const history = useNavigate();
  let token = localStorage.getItem('authToken');
  const handleSubmit = async () => {
    try {
      const response = await sendPost({token, title, description, content});
      console.log(response.data);
      // Handle the response or navigate to another page
      history('/');
    } catch (error) {
      console.error('Error submitting post:', error);
      alert("An error occurred: " + error.message);
        // Reload the page
      window.location.reload();
    }
  };

  const handlePaste = async (e) => {
    const clipboard = (e.clipboardData || window.clipboardData);
    const htmlContent = clipboard.getData("text/html");
    const wrapper = document.createElement('div');
    wrapper.innerHTML = htmlContent;
    const imgElements = Array.from(wrapper.querySelectorAll('img'));

    if (imgElements.length > 0) {
        e.preventDefault();  // Prevent Quill's default paste behavior.
        for (const imgElement of imgElements) {
            if (imgElement.src) {
                fetch(imgElement.src)
                    .then(response => response.blob())
                    .then(insertImageBlob)
                    .catch(error => {
                        console.error('Error fetching the image:', error);
                    });
            }
        }
    }
};

  const insertImageBlob = (blob) => {
      const reader = new FileReader();
      reader.onload = (event) => {
          const base64 = event.target.result;
          const quillInstance = quillRef.current.getEditor();
          const range = quillInstance.getSelection(true);
          quillInstance.insertEmbed(range.index, 'image', base64);
      };
      reader.readAsDataURL(blob);
  };

  return (
    <div className='Michels'>
      <div className='Michels-text'>
        <input 
          type="text" 
          placeholder="Title" 
          value={title} 
          className="title-input"
          onChange={e => setTitle(e.target.value)}
        />
        <textarea 
          placeholder="Description" 
          value={description} 
          className="description-input"
          onChange={e => setDescription(e.target.value)}
        />
        <ReactQuill 
          value={content} 
          onChange={setContent}
          ref={quillRef}
          onPast={handlePaste} 
        />
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default PostEditor;
