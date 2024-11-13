import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './Company.scss';
import TopCompany from '../../layouts/TopCompany/TopCompany';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const Company = () => {
    const [companies, setCompanies] = useState([]);

    const settingsForCompany = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        autoplay: true,
        autoplaySpeed: 2000,
    };

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await fetch('http://localhost:8080/company-list');
                const data = await response.json();

                console.log('Fetched companies: ', JSON.stringify(data, null, 2));

                if (data && Array.isArray(data)) {
                    setCompanies(data);
                } else {
                    console.error("Dữ liệu công ty không đúng cấu trúc hoặc không phải là mảng:", data);
                    setCompanies([]);
                }
            } catch (error) {
                console.error('Error fetching companies:', error);
                setCompanies([]);
            }
        };
        fetchCompanies();
    }, []);

    return (
        <div className='company-page'>
            <div className='top-company'>
                <TopCompany />
            </div>

            <section className="company-section">
                <div className="company">
                    {companies.length > 0 ? (
                        <div style={{ width: "100%", overflow: "hidden" }}>
                            <Slider {...settingsForCompany}>
                                {companies.map((company, index) => (
                                    <div className="company-member" key={index}>
                                        <img src={company.logo} alt={company.name} />
                                        <h3>{company.name}</h3>
                                    </div>
                                ))}
                            </Slider>
                        </div>
                    ) : (
                        <p>Hiện tại chưa có thông tin công ty nào.</p>
                    )}
                </div>
            </section>

            <div className='all-companies'>
                <h2>DANH SÁCH CÁC CÔNG TY NỔI BẬT</h2>
                <div className="filter-sections">
                    <p>Tìm kiếm công ty theo tên: </p>
                    <input
                        type="text"
                        name="position"
                        placeholder="Tên công ty"
                        className="search-inputs"
                    // onChange={handleInputChange}
                    />
                </div>

                <div className='company-content'>
                    {companies.map((company) => (
                        <div key={company.id} className="company-item">
                            <div className="company-logo-container">
                                <img src={company.logo} alt={company.name} className="company-logoo" />
                            </div>
                            <div className="company-details">
                                <h3>{company.name}</h3>
                                <p>"{company.introduction}"</p>
                                <p><strong>Địa chỉ: </strong>{company.location}</p>
                                <p><strong>Quy mô công ty: </strong>{company.number_of_employee} nhân viên</p>
                                <p><strong>Website: </strong><a href={company.website} target="_blank" rel="noopener noreferrer">{company.website}</a></p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Company;