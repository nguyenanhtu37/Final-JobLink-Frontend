import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './FeedbackForm.scss';

const FeedbackForm = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [feedbackName, setFeedbackName] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');
    const toggleForm = () => {
        setIsOpen(!isOpen);
    };

    const userId = useSelector((state) => state.user.account.id);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/v1/api/users/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, feedbackName, description }),
            });

            if (response.ok) {
                setMessage('Feedback đã được gửi thành công!');
                setFeedbackName('');
                setDescription('');
                setIsOpen(false);
                alert('Cảm ơn bạn đã đóng góp. Ý kiến của bạn đã được chúng tôi lưu lại.');
            } else {
                const errorData = await response.json();
                setMessage(`Đã xảy ra lỗi khi gửi feedback: ${errorData.message || 'Lỗi không xác định.'}`);
            }
        } catch (error) {
            setMessage('Lỗi kết nối với máy chủ. Vui lòng thử lại sau.');
        }
    };

    return (
        <div>
            <div className="feedback-icon" onClick={toggleForm}>
                <img src="/images/feedback.png" alt="Feedback form" />
            </div>

            {isOpen && (
                <div className="feedback-form">
                    <form onSubmit={handleSubmit}>
                        <h3>Góp ý về hệ thống</h3>
                        <p>Phản hồi của bạn rất quan trọng, JobLink mong nhận được nhiều góp ý từ bạn để cải thiện sản phẩm tốt hơn.</p>
                        <input
                            type="text"
                            placeholder='Chủ đề cần góp ý'
                            value={feedbackName}
                            onChange={(e) => setFeedbackName(e.target.value)}
                            required
                        />
                        <textarea
                            placeholder="Mô tả góp ý của bạn giúp JobLink cải tiến sản phẩm, hỗ trợ bạn tốt hơn."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        ></textarea>
                        <div className='button'>
                            <button type="submit">Gửi</button>
                            <button type="button" onClick={toggleForm}>Đóng</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default FeedbackForm;
