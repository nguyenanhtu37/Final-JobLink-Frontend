import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../../layouts/Animation/Spinner';
import './JobDetail.scss';
import TopCompany from '../../layouts/TopCompany/TopCompany';
import ReportForm from '../../layouts/Report/ReportForm';
import ApplyForm from '../../layouts/ApplyForJob/ApplyForm';
import { CheckCircleOutlined } from '@ant-design/icons';

const JobDetail = () => {
    const navigate = useNavigate();
    const { jobId } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [title, setTitle] = useState();
    const [isApplyFormVisible, setIsApplyFormVisible] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const userId = useSelector((state) => state.user.account.id);
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    };

    const handleApplyClick = () => {
        setIsApplyFormVisible(true);
    };

    const handleCloseApplyFormForm = () => {
        setIsApplyFormVisible(false);
    };

    const openPopup = () => {
        setIsPopupOpen(true);
        document.body.classList.add("no-scroll"); // Vô hiệu hóa cuộn
    };

    const closePopup = () => {
        setIsPopupOpen(false);
        document.body.classList.remove("no-scroll"); // Khôi phục cuộn
    };

    // Hàm gửi yêu cầu lưu tin yêu thích
    const handleSaveJob = async () => {
        if (!isAuthenticated) {
            navigate('/login-user');
            return;
        }
        setIsSaved((prev) => !prev);
        try {
            console.log(`UserId: ${userId}`);
            console.log(`JobId: ${jobId}`);

            const response = await fetch('http://localhost:8080/v1/api/users/favorite', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, jobId }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
            } else {
                setIsSaved((prev) => !prev);
                alert('Lỗi: ' + data.message);
            }
        } catch (error) {
            setIsSaved((prev) => !prev);
            console.error('Error saving job:', error);
            alert('Có lỗi xảy ra, vui lòng thử lại sau.');
        };
    };

    useEffect(() => {
        console.log(`Đã lưu: ${isSaved}`);
    }, [isSaved]);

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await axios.get('http://localhost:8080/job-company');
                const foundJob = response.data.find(job => job._id === jobId);
                setJob(foundJob);
                setTitle(foundJob.title);
            } catch (error) {
                setError('Error fetching job details.');
            } finally {
                setLoading(false);
            }
        };
        fetchJobDetails();
    }, [jobId]);

    useEffect(() => {
        if (isApplyFormVisible) {
            document.body.classList.add("no-scroll"); // Vô hiệu hóa cuộn
        } else {
            document.body.classList.remove("no-scroll"); // Khôi phục cuộn
        }

        return () => {
            document.body.classList.remove("no-scroll"); // Đảm bảo cuộn được kích hoạt lại khi component bị hủy
        };
    }, [isApplyFormVisible]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!job) return <p>Job not found!</p>;

    return (
        <div className="left-right">
            <div className="left">
                <div className='generalDetail'>
                    <h1 className="job-title">{job.title}</h1>
                    <div className="job-summary">
                        <div className="job-detail-item">
                            <div className='icon'>
                                <img className='img' src="/images/money.png" alt="Money icon" />
                            </div>
                            <div className='key-value'>
                                <p>Mức lương</p>
                                <strong>{job.salary.toLocaleString('vi-VN')} VND</strong>
                            </div>
                        </div>
                        <div className="job-detail-item">
                            <div className='icon'>
                                <img className='img' src="/images/customer-experience.png" alt="Experience icon" />
                            </div>
                            <div className='key-value'>
                                <p>Kinh nghiệm</p>
                                <strong>{job.experience}</strong>
                            </div>
                        </div>
                        <div className="job-detail-item">
                            <div className='icon'>
                                <img className='img' src="/images/location.png" alt="Location icon" />
                            </div>
                            <div className='key-value'>
                                <p>Địa điểm</p>
                                <strong>{job.province_city}</strong>
                            </div>
                        </div>
                    </div>
                    <p className="due-date">Hạn nộp hồ sơ: {formatDate(job.due_to)}</p>
                    <div className="apply-buttons">
                        <button className="apply-now-btn" onClick={handleApplyClick}>
                            <img className='send' src="/images/send.png" alt="" /> Ứng tuyển ngay
                        </button>

                        {isApplyFormVisible && (
                            <div className="popup-overlay">
                                <div className="popup-content">
                                    <ApplyForm jobTitle={title} jobId={jobId} onClose={handleCloseApplyFormForm} />
                                </div>
                            </div>
                        )}
                        <button className="save-job-btn" onClick={handleSaveJob}>
                            {isSaved ? (
                                <>
                                    <CheckCircleOutlined style={{ marginRight: '4px' }} />
                                    Đã lưu
                                </>
                            ) : (
                                'Lưu tin'
                            )}
                        </button>
                    </div>
                </div>

                <div className='specific-detail'>
                    <h2>Chi tiết tin tuyển dụng</h2>

                    <strong className='job--title'>Mô tả công việc</strong>
                    <p className='job--content'>{job.description}</p>

                    <strong className='job--title'>Yêu cầu ứng viên</strong>
                    <p className='job--content'>{job.requirement}</p>

                    <strong className='job--title'>Quyền lợi</strong>
                    <p className='job--content'>{job.benefit}</p>

                    <strong className='job--title'>Địa điểm làm việc</strong>
                    <p className='job--content'>{job.detailed_location}</p>

                    <strong className='job--title'>Thời gian làm việc</strong>
                    <p className='job--content'>{job.working_time}</p>

                    <strong className='job--title'>Cách thức ứng tyển</strong>
                    <p className='job--content'>Ứng viên nộp hồ sơ trực tuyến bằng cách bấm <strong>Ứng tuyển ngay</strong> dưới đây.</p>

                    <p className="due-date">Hạn nộp hồ sơ: {formatDate(job.due_to)}</p>
                    <div className="apply-buttons">
                        <button className="apply-now-btn" onClick={handleApplyClick}>
                            <img className='send' src="/images/send.png" alt="" /> Ứng tuyển ngay
                        </button>

                        {isApplyFormVisible && (
                            <div className="popup-overlay">
                                <div className="popup-content">
                                    <ApplyForm jobTitle={title} jobId={jobId} onClose={handleCloseApplyFormForm} />
                                </div>
                            </div>
                        )}
                        <button className="save-job-btn" onClick={handleSaveJob}>
                            {isSaved ? (
                                <>
                                    <CheckCircleOutlined style={{ marginRight: '4px' }} />
                                    Đã lưu
                                </>
                            ) : (
                                'Lưu tin'
                            )}
                        </button>
                    </div>
                </div>

                {/* Report */}
                <ReportForm jobId={jobId} jobTitle={title} />
            </div>

            <div className="right">
                <div className="main-content">
                    <div className="sidebar">
                        <div className="company-info">
                            <div className="company-images">
                                <img src={job.companyDetails.logo} alt={job.companyDetails.name} className='company-logo' />
                            </div>
                            <h3>{job.companyDetails.name}</h3>
                            <div className='text-text'>
                                <p><img src="/images/people.png" alt="" className='small-icon' /> Quy mô: {job.companyDetails.number_of_employee} nhân viên</p>
                            </div>
                            <div className='text-text'>
                                <p><img src="/images/internet.png" alt="" className='small-icon' /> Website: <a href={job.companyDetails.website}>{job.companyDetails.website}</a></p>
                            </div>
                            <div className='text-text'>
                                <p><img src="/images/placeholder.png" alt="" className='small-icon' /> Location: {job.companyDetails.location}</p>
                            </div>
                            {/* <div className='text-text'>
                                <p><strong>Introduction:</strong> {job.companyDetails.introduction}</p>
                            </div> */}
                        </div>

                        <div className='general-info'>
                            <h3>Thông tin chung</h3>
                            <div className='block'>
                                <div className='icon'>
                                    <img src="/images/star.png" alt="" className='small-icon' /> Cấp bậc: <strong>{job.level}</strong>
                                </div>
                            </div>
                            <div className='block'>
                                <div className='icon'>
                                    <img src="/images/customer-experience.png" alt="" className='small-icon' /> Kinh nghiệm: <strong>{job.experience}</strong>
                                </div>
                            </div>
                            <div className='block'>
                                <div className='icon'>
                                    <img src="/images/teamwork.png" alt="" className='small-icon' /> Số lượng tuyển: <strong>{job.quantity} người</strong>
                                </div>
                            </div>
                            <div className='block'>
                                <div className='icon'>
                                    <img src="/images/distributed.png" alt="" className='small-icon' /> Hình thức làm việc: <strong>{job.working_type}</strong>
                                </div>
                            </div>
                            <div className='block'>
                                <div className='icon'>
                                    <img src="/images/sex.png" alt="" className='small-icon' /> Giới tính: <strong>{job.sex}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {loading && (
                <div className="spinner-overlay">
                    <Spinner />
                </div>
            )}
        </div>
    );
};

export default JobDetail;
