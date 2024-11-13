import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { useSelector } from "react-redux";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import { addDoc } from 'firebase/firestore';
import './CVTemplate.scss';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import firebaseConfig from "../../firebaseConfig";
import { AuditOutlined, StarOutlined, ProjectOutlined, CalculatorOutlined, SolutionOutlined, PhoneOutlined, PushpinOutlined, TrophyOutlined, GoogleOutlined, LinkOutlined, GlobalOutlined, BookOutlined, FileDoneOutlined, VideoCameraAddOutlined, DownloadOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';

const CVTemplate = () => {
    const [avatar, setAvatar] = useState('');
    const [educations, setEducations] = useState([{ schoolName: '', time: '', majorName: '', description: '' }]);
    const [languages, setLanguages] = useState(['']);
    const [experiences, setExperiences] = useState([{ id: 1, jobTitle: '', company: '', year: '', description: '' }]);
    const [projects, setProjects] = useState([{ id: 1, name: '', description: '' }]);
    const [skillName, setSkillName] = useState('');
    const [skillLevel, setSkillLevel] = useState(50);
    const textareaRef = useRef(null);
    const [skills, setSkills] = useState([]);
    const [awards, setAwards] = useState([]);
    const [isButtonVisible, setIsButtonVisible] = useState(true);
    const [inputField, setInputField] = useState({
        personalPhone: '',
        personalAddress: '',
        personalEmail: '',
        personalLink: '',
        personalName: '',
        personalPosition: '',
        cvName: ''
    });

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    const db = getFirestore(app);

    // useEffect(() => {
    //     async function getCities(db) {
    //         try {
    //             const citiesCol = collection(db, 'cities');
    //             const citySnapshot = await getDocs(citiesCol);
    //             const cityList = citySnapshot.docs.map(doc => doc.data());
    //             console.log('City list: ', cityList);
    //             return cityList;
    //         } catch (error) {
    //             console.error('Error: ', error);
    //         }
    //     }
    //     getCities(db);
    // }, []);

    // archivement
    const addAward = () => {
        setAwards([...awards, { name: '', description: '' }]);
    };
    // archivement
    const removeAward = (index) => {
        const updatedAwards = awards.filter((_, i) => i !== index);
        setAwards(updatedAwards);
    };
    // archivement
    const handleNameChange = (index, value) => {
        const updatedAwards = [...awards];
        updatedAwards[index].name = value;
        setAwards(updatedAwards);
    };
    // archivement
    const handleDescriptionChange = (index, value) => {
        const updatedAwards = [...awards];
        updatedAwards[index].description = value;
        setAwards(updatedAwards);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputField(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const addEducationField = () => {
        setEducations([...educations, '']);
    };

    const handleEducationChange = (index, field, value) => {
        const updatedEducations = [...educations];
        updatedEducations[index] = {
            ...updatedEducations[index],
            [field]: value,
        };
        setEducations(updatedEducations);
    };

    const removeEducationField = (index) => {
        const updatedEducations = educations.filter((_, i) => i !== index);
        setEducations(updatedEducations);
    };

    const addLanguageField = () => {
        setLanguages([...languages, { name: '', level: '' }]);
    };

    const handleLanguageChange = (index, key, value) => {
        const updatedLanguages = [...languages];
        updatedLanguages[index] = {
            ...updatedLanguages[index],
            [key]: value,
        };
        setLanguages(updatedLanguages);
    };

    const removeLanguageField = (index) => {
        const updatedLanguages = languages.filter((_, i) => i !== index);
        setLanguages(updatedLanguages);
    };

    const addExperience = () => {
        const newExperience = {
            id: experiences.length + 1,
            jobTitle: '',
            company: '',
            year: '',
            description: ''
        };
        setExperiences([...experiences, newExperience]);
    };

    const handleExperienceChange = (index, field, value) => {
        const updatedExperiences = experiences.map((experience, i) => {
            if (i === index) {
                return { ...experience, [field]: value };
            }
            return experience;
        });
        setExperiences(updatedExperiences);
    };

    const removeExperience = (index) => {
        const updatedExperiences = experiences.filter((_, i) => i !== index);
        setExperiences(updatedExperiences);
    };

    const addProject = () => {
        const newProject = {
            id: projects.length + 1,
            name: '',
            description: ''
        };
        setProjects([...projects, newProject]);
    };

    const handleProjectChange = (index, field, value) => {
        const updatedProjects = projects.map((project, i) => {
            if (i === index) {
                return { ...project, [field]: value };
            }
            return project;
        });
        setProjects(updatedProjects);
    };

    const removeLastProject = () => {
        const updatedProjects = projects.slice(0, -1);
        setProjects(updatedProjects);
    };

    const updateOutput = (value) => {
        const outputElement = document.getElementById('level-output');
        outputElement.textContent = `${value}%`;
    };

    const handleSkillNameChange = (e) => {
        setSkillName(e.target.value);
    };

    const handleSkillLevelChange = (e) => {
        setSkillLevel(e.target.value);
        updateOutput(e.target.value);
    };

    const removeLastSkill = () => {
        if (skills.length > 0) {
            setSkills(skills.slice(0, -1));
        }
    };

    const handleDownloadPDF = () => {
        setIsButtonVisible(false); // Ẩn nút delete
        console.log("Nút delete đang ẩn:", !isButtonVisible); // Kiểm tra trạng thái trong console

        const element = document.querySelector('.template');
        const top_left_margin = 15;
        const pdf = new jsPDF('p', 'pt', 'a4'); // Định dạng A4
        const pdfWidth = pdf.internal.pageSize.getWidth() - (top_left_margin * 2);
        const pdfHeight = pdf.internal.pageSize.getHeight() - (top_left_margin * 2);

        const HTML_Width = element.offsetWidth;
        const HTML_Height = element.offsetHeight;

        setTimeout(() => { // Timeout để thiết lập trạng thái
            html2canvas(element).then((canvas) => {
                const imgData = canvas.toDataURL('image/jpeg', 1.0);
                const imgWidth = canvas.width;
                const imgHeight = canvas.height;

                const ratio = imgWidth / imgHeight;
                const scaledWidth = pdfWidth;
                const scaledHeight = pdfWidth / ratio;

                const totalPDFPages = Math.ceil(HTML_Height / pdfHeight);
                for (let i = 0; i < totalPDFPages; i++) {
                    if (i > 0) {
                        pdf.addPage();
                    }

                    const yPosition = -(pdfHeight * i) + top_left_margin;

                    pdf.addImage(imgData, 'JPEG', top_left_margin, yPosition, scaledWidth, scaledHeight);
                }

                pdf.save('JobLink_CV.pdf');
                setIsButtonVisible(true);
                console.log("Nút delete đã hiển thị lại:", isButtonVisible);
            }).catch(error => {
                console.error('Error creating PDF:', error);
                setIsButtonVisible(true);
            });
        }, 0);
    };

    const handleAvatarUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            setAvatar(event.target.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const addSkill = () => {
        setSkills([...skills, { name: '', level: 50 }]);
    };
    const removeSkill = (index) => {
        setSkills(skills.filter((_, i) => i !== index));
    };
    const updateSkill = (index, key, value) => {
        const updatedSkills = [...skills];
        updatedSkills[index][key] = value;
        setSkills(updatedSkills);
    };

    const adjustHeight = (textarea) => {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
    };

    useEffect(() => {
        const textareas = document.querySelectorAll('.auto-resize-textarea');
        textareas.forEach(textarea => {
            adjustHeight(textarea);
            const handleInput = () => adjustHeight(textarea);
            textarea.addEventListener('input', handleInput);
            return () => {
                textarea.removeEventListener('input', handleInput);
            };
        });
    }, [educations, experiences, projects, skills, awards]);

    const userId = useSelector((state) => state.user.account.id);
    const handleSaveCV = async () => {
        try {
            const formData = {
                cvName: inputField.cvName,
                userId: userId,
                personalInfo: {
                    avatar: avatar,
                    personalName: inputField.personalName,
                    personalPosition: inputField.personalPosition,
                    personalPhone: inputField.personalPhone,
                    personalAddress: inputField.personalAddress,
                    personalEmail: inputField.personalEmail,
                    personalLink: inputField.personalLink,
                },
                language: languages.map(language => language.name).join(', '),
                careerProfile: document.getElementById('career-profile').value,
                education: educations.map(education => ({
                    schoolName: education.schoolName,
                    time: education.time,
                    majorName: education.majorName,
                    description: education.description,
                })),
                experience: experiences.map(exp => ({
                    experienceName: exp.jobTitle,
                    time: exp.year,
                    companyName: exp.company,
                    position: exp.position,
                    description: exp.description,
                })),
                project: projects.map(proj => ({
                    projectName: proj.name,
                    time: proj.time,
                    position: proj.position,
                    memberParticipation: proj.member,
                    description: proj.description,
                })),
                skill: skills.map(skill => ({
                    name: skill.name,
                    level: skill.level,
                })),
                archivement: awards.map(award => ({
                    name: award.name,
                    description: award.description,
                })),
            };
            console.log(formData);
            const response = await axios.post('http://localhost:8080/v1/api/users/cv', formData);
            alert(response.data.message);
        } catch (error) {
            console.error("Error saving CV:", error);
            alert("Vui lòng kiểm tra và thử lại!.");
        }
    };

    return (
        <div className="all-cv">
            <div className="tag-container">
                <input
                    type="text"
                    placeholder="Enter CV name"
                    className="cv-name"
                    id="cvName"
                    name="cvName"
                    value={inputField.cvName || ''}
                    onChange={handleInputChange}
                />
                <label className="upload-tag">
                    <input
                        type="file"
                        accept="image/*"
                        id="avatar-upload"
                        className="upload-input"
                        onChange={handleAvatarUpload}
                    />
                    <span>
                        <VideoCameraAddOutlined /> Tải ảnh lên
                    </span>
                </label>
                <div className="tag" onClick={addLanguageField}>
                    <GlobalOutlined /> Thêm ngôn ngữ
                </div>
                <div className="tag" onClick={addEducationField}>
                    <BookOutlined /> Thêm học vấn
                </div>
                <div className="tag" onClick={addExperience}>
                    <FileDoneOutlined /> Thêm kinh nghiệm làm việc
                </div>
                <div className="tag" onClick={addProject}>
                    <ProjectOutlined /> Thêm dự án
                </div>
                <div className="tag" onClick={addSkill}>
                    <StarOutlined /> Thêm kỹ năng/năng lực
                </div>
                <div className="tag" onClick={addAward}>
                    <TrophyOutlined /> Thêm danh hiệu/giải thưởng
                </div>
                <div className="download-btn" onClick={handleDownloadPDF}>
                    <DownloadOutlined /> Tải xuống PDF file
                </div>
                <div className="download-btn" onClick={handleSaveCV}>
                    <SaveOutlined /> Lưu CV
                </div>
            </div>

            <div className="template">
                <div className="cv-left">
                    <div className="seperated-block">
                        <h3>
                            <AuditOutlined /> HỒ SƠ NGHỀ NGHIỆP
                        </h3>
                        <textarea
                            className="auto-resize-textarea"
                            name="career-profile"
                            id="career-profile"
                            placeholder="Giới thiệu tổng quan về bản thân, định hướng sự nghiệp, kỹ năng, và cách bạn mong muốn đóng góp vào sự phát triển của công ty. Việc thể hiện rõ ràng và ấn tượng sẽ khiến hồ sơ của bạn thu hút hơn trong mắt nhà tuyển dụng..."
                        ></textarea>
                    </div>

                    <div className="seperated-block">
                        <h3>
                            <CalculatorOutlined /> HỌC VẤN
                        </h3>
                        {educations.map((education, index) => (
                            <div key={index} className="list">
                                <div className="two-part">
                                    <div className="one">
                                        <input
                                            type="text"
                                            name={`school${index}`}
                                            id="education"
                                            placeholder="Tên trường học"
                                            value={education.schoolName}
                                            onChange={(e) => handleEducationChange(index, 'schoolName', e.target.value)}
                                        />
                                    </div>
                                    <div className="two">
                                        <input
                                            type="text"
                                            name={`time${index}`}
                                            id="time"
                                            placeholder="Bắt đầu - Kết thúc"
                                            value={education.time}
                                            onChange={(e) => handleEducationChange(index, 'time', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="two-part">
                                    <div className="one">
                                        <input
                                            type="text"
                                            name={`subject${index}`}
                                            id="subject"
                                            placeholder="Ngành học/Môn học"
                                            value={education.majorName}
                                            onChange={(e) => handleEducationChange(index, 'majorName', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <textarea
                                    className="auto-resize-textarea"
                                    name={`education${index}`}
                                    placeholder="Nêu rõ trình độ học vấn, trường học, chuyên ngành đã học, và các thành tích nổi bật trong quá trình học tập của bạn."
                                    value={education.description}
                                    onChange={(e) => handleEducationChange(index, 'description', e.target.value)}
                                ></textarea>
                                {isButtonVisible && (
                                    <button type="button" onClick={() => removeEducationField(index)} className="deleteButton"><DeleteOutlined /></button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="seperated-block">
                        <h3>
                            <StarOutlined /> KINH NGHỆM LÀM VIỆC
                        </h3>
                        {experiences.map((experience, index) => (
                            <div key={index} className="list">
                                <div className="two-part">
                                    <div className="one">
                                        <input
                                            type="text"
                                            name={`experience${index}`}
                                            id="experience"
                                            placeholder="Tên kinh nghiệm"
                                            value={experience.jobTitle}
                                            onChange={(e) => handleExperienceChange(index, 'jobTitle', e.target.value)}
                                        />
                                    </div>
                                    <div className="two">
                                        <input
                                            type="text"
                                            name={`time${index}`}
                                            id="time"
                                            placeholder="Bắt đầu - Kết thúc"
                                            value={experience.year}
                                            onChange={(e) => handleExperienceChange(index, 'year', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="two-part">
                                    <div className="one">
                                        <input
                                            type="text"
                                            name={`company${index}`}
                                            id="company"
                                            placeholder="Tên công ty"
                                            value={experience.company}
                                            onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                                        />
                                    </div>
                                    <div className="two">
                                        <input
                                            type="text"
                                            name={`position${index}`}
                                            id="position"
                                            placeholder="Vị trí làm việc"
                                            value={experience.position || ''}
                                            onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <textarea
                                    className="auto-resize-textarea"
                                    name={`description${index}`}
                                    placeholder="Mô tả kinh nghiệm làm việc của bạn"
                                    value={experience.description}
                                    onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                                ></textarea>
                                {isButtonVisible && (
                                    <button type="button" onClick={() => removeExperience(index)} className="deleteButton"><DeleteOutlined /></button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="seperated-block">
                        <h3>
                            <ProjectOutlined /> DỰ ÁN
                        </h3>
                        {projects.map((project, index) => (
                            <div key={index} className="listt">
                                <div className="two-part">
                                    <div className="one">
                                        <input
                                            type="text"
                                            name={`project${index}`}
                                            id="project"
                                            placeholder="Tên dự án"
                                            value={project.name}
                                            onChange={(e) => handleProjectChange(index, 'name', e.target.value)}
                                        />
                                    </div>
                                    <div className="two">
                                        <input
                                            type="text"
                                            name={`time${index}`}
                                            id="time"
                                            placeholder="Bắt đầu - Kết thúc"
                                            value={project.time || ''}
                                            onChange={(e) => handleProjectChange(index, 'time', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="two-part">
                                    <div className="one">
                                        <input
                                            type="text"
                                            name={`position${index}`}
                                            id="position"
                                            placeholder="Vị trí làm việc"
                                            value={project.position || ''}
                                            onChange={(e) => handleProjectChange(index, 'position', e.target.value)}
                                        />
                                    </div>
                                    <div className="two">
                                        <input
                                            type="text"
                                            name={`member${index}`}
                                            id="member"
                                            placeholder="Số lượng người tham gia"
                                            value={project.member || ''}
                                            onChange={(e) => handleProjectChange(index, 'member', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <textarea
                                    className="auto-resize-textarea"
                                    name={`description${index}`}
                                    placeholder="Mô tả vai trò, trách nhiệm và công nghệ bạn sử dụng trong dự án"
                                    value={project.description}
                                    onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                                ></textarea>
                                {isButtonVisible && (
                                    <button type="button" onClick={() => removeLastProject(index)} className="deleteButton"><DeleteOutlined /></button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="seperated-block">
                        <h3>
                            <SolutionOutlined /> KỸ NĂNG & NĂNG LỰC
                        </h3>
                        <div className="template-skills">
                            {skills.map((skill, index) => (
                                <div key={index} className="skill-item">
                                    <div className="skill-name">
                                        <input
                                            type="text"
                                            placeholder="Kỹ năng"
                                            value={skill.name}
                                            onChange={(e) => updateSkill(index, 'name', e.target.value)}
                                        />
                                    </div>
                                    <div className="progress-container">
                                        <div className="progress-bar-container">
                                            <div className="progress-bar" style={{ width: `${skill.level}%` }}></div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={skill.level}
                                                className="sliderr"
                                                onChange={(e) => updateSkill(index, 'level', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    {isButtonVisible && (
                                        <button className='deleteButton' onClick={() => removeSkill(index)}><DeleteOutlined /></button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="seperated-block">
                        <h3>
                            <TrophyOutlined /> DANH HIỆU VÀ GIẢI THƯỞNG
                        </h3>
                        <div className="archivement-block">
                            {awards.map((award, index) => (
                                <div key={index} className="list">
                                    <div className="one">
                                        <input
                                            type="text"
                                            name="name"
                                            id={`name-${index}`}
                                            placeholder="Tên danh hiệu/giải thưởng"
                                            value={award.name}
                                            onChange={(e) => handleNameChange(index, e.target.value)}
                                            className="archivement"
                                            style={{
                                                textAlign: 'left',
                                                border: 'none',
                                                padding: '5px 10px',
                                                backgroundColor: '#f9f9f9',
                                                width: '98%',
                                                fontSize: '1rem',
                                            }}
                                        />
                                    </div>
                                    <textarea
                                        className="auto-resize-textarea"
                                        name="description"
                                        id={`description-${index}`}
                                        placeholder="Chi tiết về danh hiệu/giải thưởng"
                                        value={award.description}
                                        onChange={(e) => handleDescriptionChange(index, e.target.value)}
                                    ></textarea>
                                    {isButtonVisible && (
                                        <button className="deleteButton" onClick={() => removeAward(index)}><DeleteOutlined /></button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="cv-right">
                    <div className="center">
                        <img
                            className="profile"
                            id="avatar"
                            src={avatar ? avatar : '/images/logo.png'}
                            alt="Avatar"
                        />
                        <input type="text" name="personalName" id="personalName" value={inputField.personalName} className="input-field" placeholder="Họ tên" onChange={handleInputChange} />
                        <input type="text" name="personalPosition" id="personalPosition" value={inputField.personalPosition} className="input-field" placeholder="Vị trí ứng tuyển" onChange={handleInputChange} />
                    </div>
                    <br />
                    <hr />
                    <br />
                    <br />
                    <div className="info">
                        <div className="input-group">
                            <PhoneOutlined className="icon" />
                            <input
                                className="input-field"
                                name="personalPhone"
                                id="personalPhone"
                                value={inputField.personalPhone}
                                type="text"
                                placeholder="Số điện thoại"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="input-group">
                            <PushpinOutlined className="icon" />
                            <input
                                className="input-field"
                                name="personalAddress"
                                id="personalAddress"
                                value={inputField.personalAddress}
                                type="text"
                                placeholder="Địa chỉ"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="input-group">
                            <GoogleOutlined className="icon" />
                            <input
                                className="input-field"
                                name="personalEmail"
                                id="personalEmail"
                                value={inputField.personalEmail}
                                type="text"
                                placeholder="Địa chỉ email"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="input-group">
                            <LinkOutlined className="icon" />
                            <input
                                className="input-field"
                                name="personalLink"
                                id="personalLink"
                                value={inputField.ink}
                                type="text"
                                placeholder="Liên kết khác"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <br />
                    <hr />
                    <br />
                    <br />
                    <br />

                    <div className="languages-block">
                        <h2 id="language-title">NGÔN NGỮ</h2>
                        {languages?.map((language, index) => (
                            <div key={index} className="list" style={{ display: 'flex', alignItems: 'center' }}>
                                <input
                                    value={language?.name || ''} // Sử dụng `language?.name || ''` để tránh lỗi uncontrolled
                                    type="text"
                                    id="language"
                                    placeholder="Ngôn ngữ: Trình độ"
                                    onChange={(e) => handleLanguageChange(index, 'name', e.target.value)}
                                    style={{ flex: 1, marginRight: '10px' }}
                                />
                                {isButtonVisible && (
                                    <button type="button" onClick={() => removeLanguageField(index)} className="deleteButton">
                                        <DeleteOutlined />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CVTemplate;