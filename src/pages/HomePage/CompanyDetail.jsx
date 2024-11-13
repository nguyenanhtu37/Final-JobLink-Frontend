import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../../layouts/Animation/Spinner';
import './CompanyDetail.scss';

const CompanyDetail = () => {
    const { jobId } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await axios.get('https://final-joblink-backend.onrender.com/job-company');
                const foundJob = response.data.find(job => job._id === jobId);
                setJob(foundJob);
            } catch (error) {
                setError('Error fetching job details.');
            } finally {
                setLoading(false);
            }
        };
        fetchJobDetails();
    }, [jobId]);

    if (loading) return <Spinner />;
    if (error) return <p>{error}</p>;
    if (!job) return <p>Job not found!</p>;

    return (
        <div className='all-page'>
            <div className='top-block'>
                <img src={job.companyDetails.logo} alt={job.companyDetails.name} className='company-logo' />
                <div className='company-info'>
                    <h2 className='company-name'>{job.companyDetails.name}</h2>
                    <p className='number-of-employee'>
                        <img src="/images/teamwork.png" alt="" className='small-icon' /> 
                        Quy mô: <strong>{job.companyDetails.number_of_employee}</strong> nhân viên
                    </p>
                    <p className='website'>
                        <img src="https://cdn-icons-png.flaticon.com/512/10001/10001600.png" alt="" className='small-icon' /> 
                        Website: <a href={job.companyDetails.website} target="_blank" rel="noopener noreferrer">{job.companyDetails.website}</a>
                    </p>
                </div>
            </div>

            <div className='seperate-part'>
                <div className='left'>
                    <div className='left-top'>
                        <h3>Giới thiệu công ty</h3>
                    </div>
                    <div className='left-bottom'>
                        <p className='introduction'>{job.companyDetails.introduction}</p>
                    </div>
                </div>

                <div className='right'>
                    <div className='right-top'>
                        <h3>Thông tin liên hệ</h3>
                    </div>
                    <div className='right-bottom'>
                        <p>
                            <img src="/images/location.png" alt="" className='small-icon' />
                            <strong> Địa chỉ công ty</strong>
                        </p>
                        <p className='location'>{job.companyDetails.location}</p>
                        <div className='map-container'>
                            <iframe 
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1917.8364573791866!2d108.26081390658798!3d15.978448574740487!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314210f2d038af0f%3A0x51c64b1130497f99!2zRlBUIENvbXBsZXggxJDDoCBO4bq1bmc!5e0!3m2!1svi!2s!4v1729010911827!5m2!1svi!2s" 
                                width="400" 
                                height="300" 
                                style={{ border: 0 }} 
                                allowFullScreen 
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade">
                            </iframe>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyDetail;
