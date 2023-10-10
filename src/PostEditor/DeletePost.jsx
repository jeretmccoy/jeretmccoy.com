import React from 'react';
import { deletePost } from '../api/index';
import { useNavigate } from 'react-router-dom';

export default function DeletePost({ postId }) {
    const admin = localStorage.getItem('admin');
    const nav = useNavigate();
    const editStr = `/editPost/${postId}`;
    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            const stuff = {
                'token': localStorage.getItem('authToken'),
                'postID': postId,
            }
            try {
                await deletePost(stuff);
                nav('/');
            } catch (error) {
                console.error("Error deleting post:", error);
                alert('Failed to delete post. Please try again.');
            }
        }
    };

    return (
        <div>
            { admin ? (
                <div>
                    <button className="button delete-button" onClick={handleDelete}>
                        Delete
                    </button>
                    <br></br>
                    <button className="button edit-button">
                        <a className="plain-href" href={editStr}>Edit Post</a>
                    </button>
                </div>
            ) : (
                <div></div>
            )
            }
        </div>
    );
};