import React, { useEffect, useState } from 'react';
import './JobSuggestion.scss';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const JobSuggestion = () => {
    const userId = useSelector((state) => state.user.account.id);
    const [user, setUser] = useState(null);
    const [professionId, setProfessionId] = useState(null);
    // const [currentJobs, setCurrentJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [jobListings, setJobListings] = useState([]);
    const [title, setTitle] = useState();
    const [titleList, setTitleList] = useState();
    const navigate = useNavigate();
    const jobsPerPage = 12;
    // tinh toan slg trang:
    const totalPages = Math.ceil(jobListings.length / jobsPerPage);
    //lay danh sach cviec cho current page:
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = jobListings.slice(indexOfFirstJob, indexOfLastJob);
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:8080/v1/api/users/users/profession/${userId}`);
                setUser(response.data);
                setProfessionId(response.data.professionId.name);
                setTitle(response.data.jobInput);
            } catch (err) {
                console.error("Error fetching user data:", err);
                setError(err.message || "Error fetching user data");
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [userId]);

    useEffect(() => {
        if (professionId && title) {
            fetJobsByProfession();
            handleSearch();
        }
    }, [professionId, title]);

    const fetJobsByProfession = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/filterByProfession?selectedProfession=${professionId}`);
            const jobs = response.data;
            setJobListings(jobs);
            console.log('Suggestion: ', response.data);
        } catch (error) {
            console.log('Error fetching jobs by profession', error);
        }
    };

    const viewDetailedJob = (jobId) => {
        navigate(`/job-detail/${jobId}`);
    };

    const viewDetailedComapy = (jobId) => {
        navigate(`/company-detail/${jobId}`);
    };

    const handleSearch = async () => {
        const position = title;

        const requestData = {
            position: position || null,
        };

        try {
            const response = await fetch('http://localhost:8080/jobs/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setTitleList(data);
            console.log('Position search: ', data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    return (
        <div className='all-suggestions'>
            <div className='profession-suggest'>
                <h2>Danh sách công việc đề xuất cho <span id='orange-text'>{professionId}</span></h2>
                <div className="job-listing">
                    {currentJobs.length > 0 ? (
                        currentJobs.map(job => (
                            <div key={job._id} className="job-card">
                                <div className="logo">
                                    <img src={job.companyDetails.logo} alt={job.companyDetails.name} className="company-logo" />
                                </div>
                                <div className="job-details">
                                    <h3 className="job-title" onClick={() => viewDetailedJob(job._id)}>{job.title}</h3>
                                    <p className="company-title" onClick={() => viewDetailedComapy(job._id)}>{job.companyDetails.name}</p>
                                    <div className="location-salary">
                                        <p className="job-location">{job.province_city || 'N/A'}</p>
                                        <p className="job-salary">{job.salary.toLocaleString('vi-VN')} VND</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Không có công việc đề xuất nào phù hợp với ngành nghề của bạn.</p>
                    )}

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>

            <div className='job-suggestion'>
                <h2>Danh sách công việc đề xuất cho <span id='orange-text'>{title}</span></h2>
                <div className="job-listing">
                    {titleList && titleList.length > 0 ? (  // Sử dụng titleList ở đây
                        titleList.map(job => (
                            <div key={job._id} className="job-card">
                                <div className="logo">
                                    <img src={job.companyDetails.logo} alt={job.companyDetails.name} className="company-logo" />
                                </div>
                                <div className="job-details">
                                    <h3 className="job-title" onClick={() => viewDetailedJob(job._id)}>{job.title}</h3>
                                    <p className="company-title" onClick={() => viewDetailedComapy(job._id)}>{job.companyDetails.name}</p>
                                    <div className="location-salary">
                                        <p className="job-location">{job.province_city || 'N/A'}</p>
                                        <p className="job-salary">{job.salary.toLocaleString('vi-VN')} VND</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Không có công việc đề xuất nào phù hợp với vị trí của bạn.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

// Component phân trang
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pages = [...Array(totalPages).keys()].map(i => i + 1); // Tạo mảng các số trang

    return (
        <div className="pagination">
            {pages.map(page => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={currentPage === page ? 'active' : ''}
                >
                    {page}
                </button>
            ))}
        </div>
    );
};

export default JobSuggestion;
