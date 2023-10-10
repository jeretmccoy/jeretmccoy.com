import React, { useState, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { updatePost, renderPost } from '../api'; // Assuming you're using axios for HTTP requests
import "../css/Michels.css";
import { useNavigate, useParams } from 'react-router-dom';

const EditPost = () => {
  const { postId } = useParams();
  const quillRef = useRef(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();
  let token = localStorage.getItem('authToken');

  useEffect(() => {
    if (postId) {
      renderPost(postId)
        .then(response => {
          setTitle(response.data.title);
          setDescription(response.data.description);
          setContent(response.data.content);
        });
    }
  }, [postId]);

  const handleSubmit = async () => {
    try {
      const payload = { token, title, description, content, postId };
      let response;
      if (postId) {
        response = await updatePost(payload);
      } 
      console.log(response.data);
      navigate('/');
    } catch (error) {
      console.error('Error submitting post:', error);
      alert("An error occurred: " + error.message);
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

export default EditPost;
