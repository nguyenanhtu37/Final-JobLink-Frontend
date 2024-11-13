import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './TopCompany.scss';

const TopCompany = () => {
    const [companies, setCompanies] = useState([]);
    const [careers, setCareer] = useState([]);
    const companySliderRef = useRef(null);
    const careerSliderRef = useRef(null);
    const cardsToShow = 3; 

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await fetch('https://final-joblink-backend.onrender.com/top-companies');
                const data = await response.json();
                setCompanies(data);
            } catch (error) {
                console.error('Error fetching companies:', error);
            }
        };

        fetchCompanies();
    }, []);

    useEffect(() => {
        const fetchCareers = async () => {
            try {
                const response = await axios.get('https://final-joblink-backend.onrender.com/v1/api/admin/profession');
                setCareer(response.data);
                console.log('Fetch profession:', response.data);
            } catch (error) {
                console.error('Error fetching profession options', error);
            }
        };

        fetchCareers();
    }, []);

    const handleNext = (sliderRef) => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({
                left: sliderRef.current.clientWidth / cardsToShow, 
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            handleNext(companySliderRef);  
            handleNext(careerSliderRef);   
        }, 5000); 

        return () => clearInterval(interval); 
    }, []);

    return (
        <div className="top-companies">
        <h2>Danh sách ngành nghề nổi bật & Công ty hàng đầu</h2>
        <p id='top-desc'>Cập nhật thông tin các lĩnh vực tiềm năng cùng các công ty uy tín hàng đầu, dựa trên các tiêu chí như <strong>quy mô doanh nghiệp</strong>, <strong>số lượng vị trí tuyển dụng</strong>, <strong>lượng ứng tuyển</strong> và <strong>môi trường làm việc</strong>. Hạng mục này giúp ứng viên dễ dàng tiếp cận những cơ hội nghề nghiệp phù hợp với năng lực và mục tiêu phát triển.</p>
            <div className="slider-container" id='career'>
                <div className="slider" ref={careerSliderRef}>
                    {careers.map((career, index) => (
                        <div key={index} className="card">
                            <h3>{career.name}</h3>
                        </div>
                    ))}
                </div>
            </div>

            <div className="slider-container">
                <div className="slider" ref={companySliderRef}>
                    {companies.map((company) => (
                        <div key={company.companyId} className="card">
                            <img src={company.logo} alt={company.name} />
                            <h3>{company.name}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TopCompany;
