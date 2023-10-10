import React, { useState, useEffect } from 'react';
import { renderPost } from '../api/index';
import { useParams } from 'react-router-dom';
import "../css/Michels.css"
import PDFUpload from './PDFUpload';
import DeletePost from './DeletePost';

const Post = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await renderPost(id);
                setPost(response.data);
            } catch (error) {
                console.error('Error fetching post:', error);
            }
        };
        
        fetchPost();
    }, [id]);

    if (!post) return <div>Loading...</div>;

    return (
        <div className='Michels'>
            <div className='Michels-text'>
                <h1 id='essayTitle'>{post.title}</h1>
                <div 
                    className="post-content"
                    dangerouslySetInnerHTML={{ __html: post.content }} 
                />
                <PDFUpload postId={id}/>
                <DeletePost postId={id}/>
            </div>
        </div>
    );
}

export default Post;
