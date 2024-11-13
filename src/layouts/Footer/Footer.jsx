import React from 'react';
import './Footer.scss';
import { FacebookOutlined, TwitterOutlined, InstagramOutlined, LinkedinOutlined } from '@ant-design/icons';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section about">
                    <h2>Về chúng tôi</h2>
                    <p>Chúng tôi cam kết mang lại giải pháp tốt nhất để giúp bạn phát triển sự nghiệp của mình. Hãy cùng chúng tôi tiến về tương lai tươi sáng!</p>
                </div>
                
                <div className="footer-section links">
                    <h2>Liên kết nhanh</h2>
                    <ul>
                        <li><a href="#about">Giới thiệu</a></li>
                        <li><a href="#careers">Nghề nghiệp</a></li>
                        <li><a href="#contact">Liên hệ</a></li>
                        <li><a href="#support">Hỗ trợ</a></li>
                    </ul>
                </div>

                <div className="footer-section contact">
                    <h2>Liên hệ</h2>
                    <p>Email: info@joblink.com</p>
                    <p>Hotline: +84 123 456 789</p>
                    <div className="social-icons">
                        <FacebookOutlined />
                        <TwitterOutlined />
                        <InstagramOutlined />
                        <LinkedinOutlined />
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2024 JobLink. Tất cả các quyền được bảo lưu.</p>
            </div>
        </footer>
    );
}

export default Footer;
