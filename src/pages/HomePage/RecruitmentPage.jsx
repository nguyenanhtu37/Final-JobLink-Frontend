import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './RecruitmentPage.scss';
import Spinner from '../../layouts/Animation/Spinner';
import TopCompany from "../../layouts/TopCompany/TopCompany";
import JobSuggestion from "../../layouts/SuggestJob/JobSuggestion";

const RecruitmentPage = () => {
    const [filterOption, setFilterOptions] = useState([]);
    const [jobListings, setJobListings] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedSalary, setSelectedSalary] = useState('');
    const [selectedExperience, setSelectedExperience] = useState('');
    const [selectedProfession, setSelectedProfession] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedFilter, setSelectedFilter] = useState('All recruitments');
    const [locationOptions, setLocationOptions] = useState([]);
    const [salaryOptions] = useState(['Under 5M', '5-10M', '10-20M', '20-30M', '30-50M', 'Above 50M']);
    const [experienceOptions] = useState(['No experience', '1 year', '2 years', '3 years', '4 years', '>5 years']);
    const [professionOptions, setProfessionOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);
    const [jobResults, setJobResults] = useState([]);
    const [searchParams, setSearchParams] = useState({
        position: '',
        city: 'All provinces/cities',
        category: 'All professions'
    });
    const [jobStats, setJobStats] = useState({
        positions: 0,
        updateAt: '',
    });
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

    const handleSearch = async () => {
        const { position, city, category } = searchParams;

        const requestData = {
            position: position || null, // nneu k co thi null
            city: city !== 'All provinces/cities' ? city : null,
            category: category !== 'All professions' ? category : null
        };

        try {
            const response = await fetch('https://final-joblink-backend.onrender.com/jobs/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData) // chuyen data thanh chuoi json
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json(); // chuyen response thanh json
            setJobListings(data); // luu kq vo state jobResults
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    // Ham cap nhat gia tri cua input va select vao state:
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams({
            ...searchParams,
            [name]: value
        });
    };

    // ham goi api khi change filter option:
    const handleFilterChange = (e) => {
        const selectedValue = e.target.value;
        setSelectedFilter(selectedValue);

        // Reset giá trị khi chọn filter mới
        setSelectedLocation('');
        setSelectedSalary('');
        setSelectedExperience('');
        setSelectedProfession('');

        if (selectedValue === 'All recruitments') {
        }
    };

    const getAllRecruitments = async () => {
        axios.get('https://final-joblink-backend.onrender.com/job-company')
            .then(response => {
                setJobListings(response.data);
                console.log('Fetched job listings: ', response.data);
            })
            .catch(error => {
                console.error('Error fetching job reference company listings', error);
            });
    };

    // filter by location:
    const fetchJobsByLocation = async () => {
        const encodeSelectedLocation = encodeURIComponent(selectedLocation);
        console.log('Encoded location before sending to server: ', encodeSelectedLocation);
        try {
            const response = await fetch(`https://final-joblink-backend.onrender.com/filterByLocation?selectedLocation=${encodeSelectedLocation}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const jobs = await response.json();
            setJobListings(jobs);
            console.log(jobs);
        } catch (error) {
            console.error('Error fetching jobs by location:', error);
        }
    };

    //filter by salary:
    const fetchJobsBySalary = async () => {
        try {
            const response = await fetch(`https://final-joblink-backend.onrender.com/filterBySalary?selectedSalary=${selectedSalary}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const jobs = await response.json();
            setJobListings(jobs);
            console.log(jobs);
        } catch (error) {
            console.error('Error fetching jobs by salary', error);
        }
    };

    // filter theo experience:
    const fetJobsByExperience = async () => {
        try {
            const response = await fetch(`https://final-joblink-backend.onrender.com/filterByExperience?selectedExperience=${selectedExperience}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const jobs = await response.json();
            setJobListings(jobs);
            console.log(jobs);
        } catch (error) {
            console.log("Error fetching jobs by experience", error);
        }
    };

    // filter theo profession (chuyen nganh)
    const fetJobsByProfession = async () => {
        try {
            const response = await fetch(`https://final-joblink-backend.onrender.com/filterByProfession?selectedProfession=${selectedProfession}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const jobs = await response.json();
            setJobListings(jobs);
            console.log(jobs);
        } catch (error) {
            console.log('Error fetching jobs by profession', error);
        }
    }

    const handleRefresh = () => {
        console.log("Selected filter option: ", selectedFilter);
        console.log('Selected location: ', selectedLocation || 'N/A');
        console.log('Selected salary: ', selectedSalary || "N/A");
        console.log('Selected experience: ', selectedExperience || 'N/A');
        console.log('Selected profession: ', selectedProfession || "N/A");
        // const query = {
        //     ...(selectedLocation && { location: selectedLocation }),
        //     ...(selectedSalary && { salary: selectedSalary }),
        //     ...(selectedExperience && { experience: selectedExperience }),
        //     ...(selectedProfession && { profession: selectedProfession }),
        // };
        if (selectedFilter === 'All recruitments') {
            getAllRecruitments();
        }
        if (selectedFilter === 'Location') {
            fetchJobsByLocation();
        }
        if (selectedFilter === 'Salary') {
            fetchJobsBySalary();
        }
        if (selectedFilter === 'Experience') {
            fetJobsByExperience();
        }
        if (selectedFilter === 'Profession') {
            fetJobsByProfession();
        }
        // fetchJobs(query);
    };

    const viewDetailedJob = (jobId) => {
        navigate(`/job-detail/${jobId}`);
    };

    const viewDetailedComapy = (jobId) => {
        navigate(`/company-detail/${jobId}`);
    };

    useEffect(() => {
        //animation:
        const timer = setTimeout(() => {
            setFadeOut(true);
            setTimeout(() => {
                setLoading(false);
            }, 1000)
        }, 1200);

        // Fetch cities data
        axios.get('https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json')
            .then((response) => {
                setLocationOptions(response.data.map(x => ({ id: x.Id, name: x.Name })));
            })
            .catch((error) => {
                console.error("Error fetching cities data: ", error);
            });

        // Fetch filter options (API/static):
        const filters = ['All recruitments', 'Location', 'Salary', 'Experience', 'Profession'];
        setFilterOptions(filters);

        // Fetch job x company listings:
        getAllRecruitments();

        // Fetch profession options
        axios.get('https://final-joblink-backend.onrender.com/v1/api/admin/profession')
            .then(response => {
                setProfessionOptions(response.data);
            })
            .catch(error => {
                console.error('Error fetching profession options', error);
            });

        return () => clearTimeout(timer);
    }, []);

    const fetchJobStats = async () => {
        try {
            const response = await axios.get('https://final-joblink-backend.onrender.com/v1/api/users/job-stats');
            setJobStats(response.data);
        } catch (error) {
            console.error('Error fetching job stats:', error);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    useEffect(() => {
        fetchJobStats();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            fetchJobStats();
        }, 300000); // 5 phút = 300000ms

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="all">
            <div className={`blurred-content ${loading ? '' : 'visible'}`}>
                <div className="recruitmentpage-container">
                    {/*Header */}
                    <header className="header">
                        <h1>Startup your future, step up your game!</h1>
                    </header>

                    {/*Search section */}
                    <div className="search-section">
                        <input
                            type="text"
                            name="position"
                            placeholder="Recruitment position"
                            className="search-input"
                            onChange={handleInputChange}
                        />
                        <select className="location-select" id="city" name="city" onChange={handleInputChange}>
                            <option>All provinces/cities</option>
                            {locationOptions.map(loc => (
                                <option key={loc.id} value={loc.name}>{loc.name}</option>
                            ))}
                        </select>
                        <select className="category-select" name="category" onChange={handleInputChange}>
                            <option>All professions</option>
                            {professionOptions.map((profession) => (
                                <option key={profession._id} value={profession.name}>{profession.name}</option>
                            ))}
                        </select>
                        <button className="search-button" onClick={handleSearch}>Search</button>
                    </div>

                    {/*Job stats */}
                    <div className="job-stats">
                        <span>Positions waiting for you to discover: <strong>{jobStats.positions}</strong></span>
                        <span id="update-time">Updated at: <strong>{formatDate(jobStats.updatedAt)}</strong></span>
                    </div>

                    {/* Banner section */}
                    <div className="banner-section">
                        <img src="https://smarttrain.edu.vn/assets/uploads/2022/08/Banner-Internship-Program-2023.png" alt="Banner" className="banner-image" />
                    </div>
                </div>

                <div className="content">
                    <div className="job-suggestion">
                        <JobSuggestion />
                    </div>

                    {/* Job list title */}
                    <div className="job-list-title">
                        <h1>Recruitment Listing</h1>
                    </div>

                    <div className="filter">
                        {/* Filter section */}
                        <div className="filter-section">
                            <p>Filter by:</p>
                            <select className="filter-select" value={selectedFilter} onChange={handleFilterChange}>
                                {filterOption.map((filter, index) => (
                                    <option key={index} value={filter}>{filter}</option>
                                ))}
                            </select>
                        </div>

                        {/* Conditional rendering for filter options */}
                        <div className="filter-option-render">
                            {selectedFilter === 'Location' && (
                                <div className="filter-option">
                                    <select className="location-filter-select" value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
                                        <option value="">Select province/city</option>
                                        {locationOptions.map(loc => (
                                            <option key={loc.id} value={loc.name}>{loc.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {selectedFilter === 'Salary' && (
                                <div className="filter-option">
                                    <select className="salary-filter-select" value={selectedSalary} onChange={(e) => setSelectedSalary(e.target.value)}>
                                        <option value="">Select expected salary</option>
                                        {salaryOptions.map((salary, index) => (
                                            <option key={index} value={salary}>{salary}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {selectedFilter === 'Experience' && (
                                <div className="filter-option">
                                    <select className="experience-filter-select" value={selectedExperience} onChange={(e) => setSelectedExperience(e.target.value)}>
                                        <option value="">Select your working experience</option>
                                        {experienceOptions.map((experience, index) => (
                                            <option key={index} value={experience}>{experience}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {selectedFilter === 'Profession' && (
                                <div className="filter-option">
                                    <select className="profession-filter-select" value={selectedProfession} onChange={(e) => setSelectedProfession(e.target.value)}>
                                        <option value="">Select profession</option>
                                        {professionOptions.map((profession) => (
                                            <option key={profession._id} value={profession.name}>{profession.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                        <button className="refresh-button" onClick={handleRefresh}>Refresh</button>
                    </div>

                    {/* View recruitment listing */}
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
                                        {/* <p className="job-requirement">{job.requirement}</p> */}
                                        {/* <p className="job-description">{job.description}</p> */}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No jobs found that match your requirements!</p>
                        )}
                    </div>


                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
            {loading && (
                <div className={`spinner-overlay ${loading ? 'visible' : 'hidden'}`}>
                    <Spinner />
                </div>
            )}

            {/* Top cty */}
            <div className="top-company">
                <TopCompany />
            </div>

            <div className="inline-container">
                <img src="images/ok.png" alt="alt" height="700px" />
                <div>
                    <h4>
                        "Bằng cách ghi lại ước mơ và mục tiêu trên giấy, bạn đã bắt đầu hành trình trở thành phiên bản tốt nhất của chính mình. Hãy nắm giữ tương lai trong bàn tay của bạn."
                    </h4>
                    <p>--- Mark Victor Hansen ---</p>
                    <h1>Hãy để chúng tôi giúp bạn</h1>
                    <h3>
                        bằng cách <span className="dangerous">tải ứng dụng ngay</span>:
                    </h3>
                    <img src="images/qr.png" alt="alt" height="200px" className="qr-img" />
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

export default RecruitmentPage;