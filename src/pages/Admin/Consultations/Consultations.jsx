import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Consultations.scss';

const Consultations = () => {
    const [consultations, setConsultations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchConsultations = async () => {
            try {
                const response = await axios.get('https://final-joblink-backend.onrender.com/v1/api/admin/consultations');
                setConsultations(response.data);
            } catch (error) {
                setError('Error fetching consultations');
                console.error("Error fetching consultations:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchConsultations();
    }, []);

    if (loading) return <div>Loading consultations...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="consultations">
            <h2>Danh sách yêu cầu hỗ trợ/tư vấn tuyển dụng</h2>
            <table>
                <thead>
                    <tr>
                        <th>Tên người dùng</th>
                        <th>Email</th>
                        <th>Số điện thoại</th>
                        <th>Địa chỉ</th>
                        <th>Yêu cầu tư vấn</th>
                    </tr>
                </thead>
                <tbody>
                    {consultations.map(consultation => (
                        <tr key={consultation._id}>
                            <td>{consultation.name}</td>
                            <td>
                                {consultation.email}
                                <a
                                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${consultation.email}&su=JobLink phản hồi yêu cầu "${consultation.requirement}"&body=Kính gửi ${consultation.email},%0D%0A%0D%0ACảm ơn bạn đã liên hệ với JobLink về yêu cầu "${consultation.requirement}".%0D%0A%0D%0AChúng tôi đã xem xét yêu cầu của bạn và dưới đây là một số ý kiến cũng như giải pháp đề xuất từ JobLink:%0D%0A%0D%0A*Người tư vấn có thể thêm thông tin phản hồi hoặc chi tiết tư vấn vào đây.*%0D%0A%0D%0ANếu bạn có bất kỳ câu hỏi nào hoặc cần thêm thông tin, xin vui lòng liên hệ lại với chúng tôi.%0D%0A%0D%0ABest regards,%0D%0A%0D%0AJobLink Team%0D%0A[Nguyễn Anh Tú]%0D%0AJobLink - Vietnam Office`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn">     
                                    <img src="data:image/png;base64,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" alt="" width="auto" height="15px" />                               
                                </a>
                            </td>
                            <td>
                                {consultation.phone}
                                <a
                                    href={`https://zalo.me/${consultation.phone}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn">
                                    <img src="data:image/png;base64,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" width="auto" height="20px" alt="Tìm trên Zalo" />
                                </a>
                            </td>
                            <td>{consultation.location}</td>
                            <td>{consultation.requirement}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Consultations;
