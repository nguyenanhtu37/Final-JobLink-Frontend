import React, { useEffect, useState } from "react";
import axios from 'axios';
import './AppliedApplication.scss';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AppliedApplication = () => {
    const userId = useSelector((state) => state.user.account.id);
    const [applications, setApplications] = useState([]);
    const navigate = useNavigate();
    const [applicationStatus, setApplicationStatus] = useState({}); // Track application acceptance/rejection status

    const fetchApplications = async () => {
        try {
            const response = await axios.get(`https://final-joblink-backend.onrender.com/v1/api/users/applications/${userId}`);
            setApplications(response.data);
        } catch (error) {
            console.error("Lỗi lấy danh sách ứng tuyển:", error);
        }
    };

    useEffect(() => {
        loadApplicationStatus(); // Load status from local storage
    }, []);

    const loadApplicationStatus = () => {
        const storedStatus = localStorage.getItem('applicationStatus');
        if (storedStatus) {
            setApplicationStatus(JSON.parse(storedStatus));
            console.log(localStorage);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchApplications();
        }
    }, [userId]);

    const handleDownloadCv = (cvBuffer, fileName) => {
        const blob = new Blob([new Uint8Array(cvBuffer)], {
            type: "application/pdf",
        });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
    };

    const viewDetailedJob = (jobId) => {
        navigate(`/job-detail/${jobId}`);
    };

    return (
        <div className="all-applications">
            <h1>DANH SÁCH CÔNG VIỆC ĐÃ ỨNG TUYỂN</h1>
            {applications.length === 0 ? (
                <p>Không có ứng tuyển nào</p>
            ) : (
                <ul className="application-list">
                    {applications.map((application) => (
                        <li key={application._id} className="application-item">
                            <div className="application-content">
                                {application.jobId && (
                                    <>
                                        <p id="jobTitle" onClick={() => { viewDetailedJob(application.jobId._id) }}>{application.jobId.title}</p>
                                    </>
                                )}

                                <div className="cover-letter">
                                    <h2>Thư giới thiệu:</h2>
                                    <p>"{application.introduction}"</p>
                                </div>

                                {application.cv && application.cv.data ? (
                                    <p>
                                        <strong>Xem lại CV tại đây:</strong>
                                        <span
                                            style={{ color: 'green', cursor: 'pointer' }}
                                            onClick={() =>
                                                handleDownloadCv(application.cv.data, `CV_${application._id}.pdf`)
                                            }
                                        >
                                            &nbsp;CV_{application._id}.pdf
                                        </span>
                                    </p>
                                ) : (
                                    <p>Không có CV</p>
                                )}

                                <h5>Trạng thái đơn ứng tuyển: </h5>
                                {applicationStatus[application._id] ? (
                                    <span>{applicationStatus[application._id]}</span>
                                ) : (
                                    <span>Chưa có trạng thái</span>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AppliedApplication;
