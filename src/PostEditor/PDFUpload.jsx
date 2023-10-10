import React, { useState, useEffect } from 'react';
import { downloadPDF, uploadPDF, checkPDF } from '../api/index';

export default function PDFUploader({ postId }) {
    const uri = process.env.REACT_APP_API_URL;
    const downloadURL = `${uri}/downloadPDF/${postId}`;
    const [file, setFile] = useState(null);
    const [pdfUrl, setPdfUrl] = useState(false);
    const admin = localStorage.getItem('admin');

    useEffect(() => {
        const fetchPDF = async () => {
            try {
                const response = await checkPDF(postId);
                console.log(response);
                if (response.data.message == 'PDF exists') {
                    setPdfUrl(true);
                }
            } catch (error) {
                console.error("Error fetching PDF:", error);
            }
        };

        fetchPDF();
    }, [postId]);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('pdf', file);
        formData.append('postId', postId);
        const token = localStorage.getItem('authToken'); // or wherever you store your token
        formData.append('token', token);

        try {
            const response = await uploadPDF(formData);
            setPdfUrl(true);
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    return (
        <div>
            {pdfUrl ? (
                <div>
                    <a href={downloadURL} download>Download PDF</a>
                </div>
            ) : (<div></div>)}
            {admin ? (
                <>
                    <input type="file" accept=".pdf" onChange={handleFileChange} />
                    <button onClick={handleUpload}>Upload PDF</button>
                </>
            ) : (<div></div>)}
        </div>
    );
}
