import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import './ApplyForm.scss';
import { CloseOutlined, ImportOutlined, UploadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const ApplyForm = ({ onClose, jobTitle, jobId }) => {
    const [introduction, setIntroduction] = useState('');
    const [cvFile, setCvFile] = useState(null);
    const userId = useSelector((state) => state.user.account.id);

    const adjustHeight = (textarea) => {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
    };

    useEffect(() => {
        const textareas = document.querySelectorAll('.auto-resize-textarea');
        textareas.forEach(textarea => {
            adjustHeight(textarea);
            const handleInput = () => adjustHeight(textarea);
            textarea.addEventListener('input', handleInput);
            return () => {
                textarea.removeEventListener('input', handleInput);
            };
        });
    }, []);

    const handleIntroductionChange = (e) => {
        setIntroduction(e.target.value);
    };

    const handleCvChange = (event) => {
        const file = event.target.files[0];
        setCvFile(file);
        const name = file ? file.name : 'Chưa có tệp nào được chọn';
        console.log(name); 
    };       

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('UserId before send to API: ', userId);

        const formData = new FormData();
        formData.append('introduction', introduction);
        formData.append('userId', userId);
        if (cvFile) {
            formData.append('cv', cvFile);
        }

        try {
            const response = await fetch(`http://localhost:8080/v1/api/users/apply?jobId=${jobId}`, { 
                method: 'POST',
                body: formData,
            });

            if (response.ok) {  
                alert('Đơn ứng tuyển đã được gửi thành công!');
                onClose();
            } else {
                alert('Đã xảy ra lỗi khi gửi đơn ứng tuyển.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Đã xảy ra lỗi khi gửi đơn ứng tuyển.');
        }
    };  

    return (
        <form className="all-form" onSubmit={handleSubmit}>
            <div className="inline-block">
                <h3>Đơn ứng tuyển <span className="green-title">{jobTitle}</span></h3>
                <h3 onClick={onClose}><CloseOutlined /></h3>
            </div>
            <br />
            <hr />
            <br />
            <br />

            <div>
                <h4><ImportOutlined /> Thư giới thiệu</h4>
                <br />
                <textarea
                    className="auto-resize-textarea"
                    name={`introduction-letter`}
                    placeholder="Một thư giới thiệu ngắn gọn, chỉn chu sẽ giúp bạn trở nên chuyên nghiệp và gây ấn tượng hơn với nhà tuyển dụng."
                    value={introduction}
                    onChange={handleIntroductionChange}
                ></textarea>
            </div>
            <br />
            <hr />
            <br />
            <br />

            <div>
                <h4><UploadOutlined /> Chọn CV để ứng tuyển</h4>
                <br />
                <div className="upload-cv">
                    <h5><UploadOutlined /> Tải lên CV từ máy tính, chọn hoặc kéo thả</h5>
                    <p>Hỗ trợ định dạng .doc, .docx, pdf có kích thước dưới 5MB</p>
                    <br />
                    <div className="cv-upload-container">
                        <input
                            type="file"
                            id="cv-upload"
                            accept=".doc,.docx,.pdf"
                            onChange={handleCvChange}
                            className="cv-upload-input"
                        />
                    </div>
                </div>
            </div>
            <br />
            <hr />
            <br />
            <br />

            <div>
                <h4 className="red-title"><ExclamationCircleOutlined /> Lưu ý:</h4>
                <br />
                <div id="note">
                    <p>JobLink khuyên tất cả các bạn hãy luôn cẩn trọng trong quá trình tìm việc và chủ động nghiên cứu về thông tin công ty, vị trí việc làm trước khi ứng tuyển.</p><br />
                    <p>Ứng viên cần có trách nhiệm với hành vi ứng tuyển của mình. Nếu bạn gặp phải tin tuyển dụng hoặc nhận được liên lạc đáng ngờ của nhà tuyển dụng, hãy <span className="red-title">báo cáo ngay</span> cho Joblink tại <strong><span className="red-title">Báo cáo tin tuyển dụng</span></strong>.</p>
                </div>
            </div>
            <br />

            <div className="submit-btn">
                <button type="submit">Gửi đơn ứng tuyển</button>
            </div>
        </form>
    );
};

export default ApplyForm;
