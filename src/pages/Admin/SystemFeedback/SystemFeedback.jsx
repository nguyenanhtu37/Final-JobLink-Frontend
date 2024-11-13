import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SystemFeedback.scss';

const Feedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/v1/api/users/feedback')
            .then(response => {
                setFeedbacks(response.data.feedbacks);
                console.log(response.data);
            })
            .catch(error => {
                console.error('Error fetching feedback:', error);
            });
    }, []);

    const handleFeedback = async (feedbackId) => {
        try {
            const response = await axios.put(`http://localhost:8080/v1/api/admin/feedback/${feedbackId}/handle`);
            alert(response.data.message); 
            setFeedbacks(feedbacks.map(feedback =>
                feedback._id === feedbackId ? { ...feedback, isHandled: true } : feedback
            ));
        } catch (error) {
            console.error('Error handling feedback:', error);
            alert('Error handling feedback');
        }
    };

    if (feedbacks.length === 0) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="feedback-container">
            <h2 className="feedback-title">Danh sách phản hồi từ người dùng</h2>
            {feedbacks.map((feedback) => (
                <div className="feedback-item" key={feedback._id}>
                    <div className='left'>
                        <h3 className="feedback-name">{feedback.feedbackName}</h3>
                        <p className="feedback-description"><strong>Mô tả:</strong> {feedback.description}</p>
                        <p className="feedback-date"><strong>Ngày tạo:</strong> {new Date(feedback.createdAt).toLocaleString()}</p>
                    </div>
                    <button
                        className={`handle-button ${feedback.isHandled ? 'handled' : ''}`}
                        onClick={() => handleFeedback(feedback._id)}
                        disabled={feedback.isHandled}
                    >
                        {feedback.isHandled ? 'Đã xử lý' : 'Xác nhận đã xử lý'}
                    </button>
                </div>
            ))}
        </div>
    );
};

export default Feedback;
