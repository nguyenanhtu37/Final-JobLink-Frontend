import React, { useState } from "react";
import './ReportForm.scss';

const ReportForm = ({ jobId, jobTitle }) => { // Thêm jobId vào props
    const [report, setReport] = useState({
        name: '',
        phone: '',
        email: '',
        description: '',
        jobTitle: jobTitle || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setReport(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleReportSubmit = async (e) => {
        e.preventDefault(); // Ngăn chặn hành động mặc định của form

        try {
            const response = await fetch(`http://localhost:8080/v1/api/users/report/create`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jobId, // Sử dụng jobId từ props
                    username: report.name,
                    phone: report.phone,
                    email: report.email,
                    description: report.description
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Something went wrong');
            }

            const result = await response.json();
            alert(`Your report is sent successfully. Thanks for your contribution!`);
            console.log(result);

            setReport({ name: '', phone: '', email: '', description: '', jobTitle: '' });
        } catch (error) {
            console.error('Cannot add report', error);
            alert(`Error: ${error.message}`);
        }
    };

    const renderInputField = (labelText, inputName, inputId, type = "text", isReadOnly = false) => (
        <div className="form-group">
            <label htmlFor={inputId}>{labelText}</label>
            <input
                type={type}
                id={inputId}
                name={inputName}
                value={report[inputName]}
                onChange={handleChange}
                readOnly={isReadOnly}
            />
        </div>
    );

    return (
        <form className="report-form" onSubmit={handleReportSubmit}>
            <h3>Báo cáo tin tuyển dụng</h3>
            <p>
                Hãy tìm hiểu kỹ về nhà tuyển dụng và công việc bạn ứng tuyển. Bạn nên cẩn trọng với những công việc yêu cầu nộp phí, hoặc những hợp đồng mập mờ, không rõ ràng.
                Nếu bạn thấy rằng tin tuyển dụng này không đúng, hãy phản ánh với chúng tôi.
            </p>
            {renderInputField("Tin tuyển dụng:", "jobTitle", "jobTitle", "text", true)}
            {renderInputField("Họ và tên:", "name", "name")}
            {renderInputField("Số điện thoại:", "phone", "phone")}
            {renderInputField("Email:", "email", "email", "email")}
            <div className="form-group">
                <label htmlFor="description">Mô tả: <span style={{ color: 'red' }}>*</span></label>
                <textarea
                    id="description"
                    name="description"
                    value={report.description}
                    onChange={handleChange}
                    required
                ></textarea>
            </div>
            <button type="submit">Gửi báo cáo</button>
        </form>
    );
};

export default ReportForm;
