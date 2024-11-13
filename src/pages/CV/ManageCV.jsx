import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Modal from 'react-modal';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { EditOutlined, DeleteOutlined, DownloadOutlined, AuditOutlined, CalculatorOutlined, StarOutlined, ProjectOutlined, SolutionOutlined, TrophyOutlined, PhoneOutlined, PushpinOutlined, GoogleOutlined, LinkOutlined, VideoCameraAddOutlined, GlobalOutlined, BookOutlined, FileDoneOutlined, SaveOutlined } from '@ant-design/icons';
import './ManageCV.scss';

const ManageCV = () => {
    const [cvList, setCvList] = useState([]);
    const [selectedCV, setSelectedCV] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // State để quản lý trạng thái modal
    const [educations, setEducations] = useState([{ schoolName: '', time: '', majorName: '', description: '' }]);
    const [experiences, setExperiences] = useState([{ id: 1, jobTitle: '', company: '', year: '', description: '' }]);
    const [projects, setProjects] = useState([{ id: 1, name: '', description: '' }]);
    const [skills, setSkills] = useState([]);
    const [awards, setAwards] = useState([]);
    const [avatar, setAvatar] = useState('');
    const [languages, setLanguages] = useState(['']);
    const [isButtonVisible, setIsButtonVisible] = useState(true);
    const [base64String, setBase64String] = useState('');
    const userId = useSelector((state) => state.user.account?.id);
    const [inputField, setInputField] = useState({
        personalPhone: '',
        personalAddress: '',
        personalEmail: '',
        personalLink: '',
        personalName: '',
        personalPosition: '',
        cvName: ''
    });

    const addLanguageField = () => {
        setLanguages([...languages, { name: '', level: '' }]);
    };

    const addEducationField = () => {
        setEducations([...educations, '']);
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

    const addProject = () => {
        const newProject = {
            id: projects.length + 1,
            name: '',
            description: ''
        };
        setProjects([...projects, newProject]);
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputField(prevData => ({
            ...prevData,
            [name]: value
        }));
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

    useEffect(() => {
        const fetchCVList = async () => {
            if (!userId) return;

            try {
                const response = await axios.get(`https://final-joblink-backend.onrender.com/v1/api/users/cv/user/${userId}`);
                setCvList(response.data);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách CV:', error);
            }
        };

        fetchCVList();
    }, [userId]);

    const handleDetailedCVClick = async (cvId) => {
        try {
            const response = await axios.get(`https://final-joblink-backend.onrender.com/v1/api/users/cv/${cvId}`);
            setSelectedCV(response.data);
            // Chuyển đổi chuỗi `language` thành một mảng các đối tượng với thuộc tính `name`
            const languageArray = response.data.language.split(', ').map(lang => ({ name: lang }));
            setLanguages(languageArray);
            setSkills(response.data.skill || []);
            setIsModalOpen(true); // Mở modal khi nhấp vào CV
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết CV:', error);
        }
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

    const closeModal = () => {
        setIsModalOpen(false); // Đóng modal
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

    const removeExperience = (index) => {
        const updatedExperiences = experiences.filter((_, i) => i !== index);
        setExperiences(updatedExperiences);
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

    const handleLanguageChange = (index, key, value) => {
        const updatedLanguages = [...languages];
        updatedLanguages[index] = {
            ...updatedLanguages[index],
            [key]: value,
        };
        setLanguages(updatedLanguages);
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

    const removeLanguageField = (index) => {
        const updatedLanguages = languages.filter((_, i) => i !== index);
        setLanguages(updatedLanguages);
    };

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
            const response = await axios.post('https://final-joblink-backend.onrender.com/v1/api/users/cv', formData);
            alert(response.data.message);
        } catch (error) {
            console.error("Error saving CV:", error);
            alert("Vui lòng kiểm tra và thử lại!.");
        }
    };

    useEffect(() => {
        if (cvList?.[0]?.personalInfo?.avatar) {
            setBase64String(cvList[0].personalInfo.avatar); // Nhận chuỗi base64 từ API
        }
    }, [cvList]);

    const handleDeleteCV = async (cvId) => {
        const isConfirmed = window.confirm('Bạn có chắc chắn muốn xóa CV này?');
    
        if (isConfirmed) {
            try {
                const response = await axios.delete(`https://final-joblink-backend.onrender.com/v1/api/users/cv/${cvId}`);
                alert(response.data.message); 
            } catch (error) {
                console.error('Lỗi xóa CV:', error);
                alert('Không thể xóa CV. Vui lòng thử lại.');
            }
        } else {
            console.log('Hành động xóa bị hủy');
        }
    };    

    return (
        <div className='all-created-cv'>
            <h1>Danh Sách CV Đã Tạo Của Bạn:</h1>
            {cvList.length === 0 ? (
                <p>Không có CV nào được tạo.</p>
            ) : (
                <ul className='cv-list'>
                    {cvList.map((cv) => (
                        <li key={cv._id} className='cv-item'>
                            <div className="cv-content">
                                {cv.personalInfo.avatar && cv.personalInfo.avatar.data ? (
                                    <img
                                        // src={`data:image/jpeg;base64,${cv.personalInfo.avatar.data.toString('base64')}`}
                                        src='/images/logo.png'
                                        alt="Avatar"
                                        className='cv-avatar'
                                    />
                                ) : (
                                    <img src="/images/logo.png" alt="Default Avatar" className='cv-avatar' />
                                )}

                                <div className='cv-details'>
                                    <h3 className='cvName' onClick={() => handleDetailedCVClick(cv._id)}>
                                        {cv.cvName}
                                    </h3>
                                    <p><strong>Tên:</strong> {cv.personalInfo.personalName}</p>
                                    <p><strong>Vị trí ứng tuyển:</strong> {cv.personalInfo.personalPosition}</p>
                                </div>
                                <div>
                                    <button className='deleteButton' onClick={() => handleDeleteCV(cv._id)}>
                                        <DeleteOutlined />
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {/* Modal để hiển thị chi tiết CV */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Chi tiết CV"
                className="modal"
                overlayClassName="overlay"
            >
                {selectedCV && (
                    <div className='cv-detail'>
                        <div className="tag-container">
                            <input
                                type="text"
                                placeholder={selectedCV.cvName}
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
                                        placeholder={selectedCV.careerProfile}
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
                                                        placeholder={selectedCV.education && selectedCV.education[index]?.schoolName || "Tên trường"}
                                                        value={education.schoolName}
                                                        onChange={(e) => handleEducationChange(index, 'schoolName', e.target.value)}
                                                    />
                                                </div>
                                                <div className="two">
                                                    <input
                                                        type="text"
                                                        name={`time${index}`}
                                                        id="time"
                                                        placeholder={selectedCV.education && selectedCV.education[index]?.time || "Thời gian học"}
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
                                                        placeholder={selectedCV.education && selectedCV.education[index]?.majorName || "Tên ngành học"}
                                                        value={education.majorName}
                                                        onChange={(e) => handleEducationChange(index, 'majorName', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <textarea
                                                className="auto-resize-textarea"
                                                name={`education${index}`}
                                                placeholder={selectedCV.education && selectedCV.education[index]?.description || "Mô tả chi tiết"}
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
                                                        placeholder={selectedCV.experience && selectedCV.experience[index]?.experienceName || 'Tên kinh nghiệm'}
                                                        value={experience.jobTitle}
                                                        onChange={(e) => handleExperienceChange(index, 'jobTitle', e.target.value)}
                                                    />
                                                </div>
                                                <div className="two">
                                                    <input
                                                        type="text"
                                                        name={`time${index}`}
                                                        id="time"
                                                        placeholder={selectedCV.experience && selectedCV.experience[index]?.time || 'Thời gian'}
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
                                                        placeholder={selectedCV.experience && selectedCV.experience[index]?.companyName || 'Tên công ty'}
                                                        value={experience.company}
                                                        onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                                                    />
                                                </div>
                                                <div className="two">
                                                    <input
                                                        type="text"
                                                        name={`position${index}`}
                                                        id="position"
                                                        placeholder={selectedCV.experience && selectedCV.experience[index]?.position || 'Vị trí làm việc'}
                                                        value={experience.position || ''}
                                                        onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <textarea
                                                className="auto-resize-textarea"
                                                name={`description${index}`}
                                                placeholder={selectedCV.experience && selectedCV.experience[index]?.description || 'Mô tả kinh nghiệm làm việc của bạn'}
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
                                                        placeholder={selectedCV.project && selectedCV.project[index].projectName || 'Tên dự án'}
                                                        value={project.name}
                                                        onChange={(e) => handleProjectChange(index, 'name', e.target.value)}
                                                    />
                                                </div>
                                                <div className="two">
                                                    <input
                                                        type="text"
                                                        name={`time${index}`}
                                                        id="time"
                                                        placeholder={selectedCV.project && selectedCV.project[index].time || 'Bắt đầu - Kết thúc'}
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
                                                        placeholder={selectedCV.project && selectedCV.project[index].position || 'Vị trí làm việc'}
                                                        value={project.position || ''}
                                                        onChange={(e) => handleProjectChange(index, 'position', e.target.value)}
                                                    />
                                                </div>
                                                <div className="two">
                                                    <input
                                                        type="text"
                                                        name={`member${index}`}
                                                        id="member"
                                                        placeholder={selectedCV.project && selectedCV.project[index].memberParticipation || 'Số lượng người tham gia'}
                                                        value={project.member || ''}
                                                        onChange={(e) => handleProjectChange(index, 'member', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                            <textarea
                                                className="auto-resize-textarea"
                                                name={`description${index}`}
                                                placeholder={selectedCV.project && selectedCV.project[index].description || 'Mô tả vai trò, trách nhiệm và công nghệ bạn sử dụng trong dự án'}
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
                                                        placeholder={selectedCV.skill && selectedCV.skill[index]?.name || "Tên kĩ năng"}
                                                        value={skill.name}
                                                        onChange={(e) => {
                                                            updateSkill(index, 'name', e.target.value)
                                                            updateSkill(index, 'level', e.target.value)
                                                        }} // Cập nhật tên kỹ năng
                                                    />
                                                </div>
                                                <div className="progress-container">
                                                    <div className="progress-bar-container">
                                                        <div className="progress-bar" style={{ width: `${(selectedCV.skill && selectedCV.skill[index]?.level) || skill.level}%` }}></div>
                                                        <input
                                                            type="range"
                                                            min="0"
                                                            max="100"
                                                            value={skill.level || (selectedCV.skill && selectedCV.skill[index]?.level) || 0}
                                                            className="sliderr"
                                                            onChange={(e) => updateSkill(index, 'level', e.target.value)} // Cập nhật giá trị level khi thay đổi thanh trượt
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
                                                        placeholder={selectedCV.archivement && selectedCV.archivement[index]?.name || "Tên danh hiệu/giải thưởng"}
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
                                                    placeholder={selectedCV.archivement && selectedCV.archivement[index]?.description || "Mô tả về danh hiệu/giải thưởng"}
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
                                    <input type="text" name="personalName" id="personalName" value={inputField.personalName} className="input-field" placeholder={selectedCV.personalInfo.personalName} onChange={handleInputChange} />
                                    <input type="text" name="personalPosition" id="personalPosition" value={inputField.personalPosition} className="input-field" placeholder={selectedCV.personalInfo.personalPosition} onChange={handleInputChange} />
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
                                            placeholder={selectedCV.personalInfo.personalPhone}
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
                                            placeholder={selectedCV.personalInfo.personalAddress}
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
                                            placeholder={selectedCV.personalInfo.personalEmail}
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
                                            placeholder={selectedCV.personalInfo.personalLink}
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
                                    {languages.map((language, index) => (
                                        <div key={index} className="list" style={{ display: 'flex', alignItems: 'center' }}>
                                            <input
                                                value={language?.name || ''}
                                                type="text"
                                                id="language"
                                                placeholder={language.name}
                                                onChange={(e) => {
                                                    const updatedLanguages = [...languages];
                                                    updatedLanguages[index] = { ...updatedLanguages[index], name: e.target.value };
                                                    setLanguages(updatedLanguages);
                                                    handleLanguageChange(index, 'name', e.target.value);
                                                }}
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

                        {/* <div className="template">
                            <div className="cv-left">
                                <div className="seperated-block">
                                    <h3>Hồ sơ nghề nghiệp</h3>
                                    <p>{selectedCV.careerProfile}</p>
                                </div>
                                <div className="seperated-block">
                                    <h3>Học vấn</h3>
                                    {selectedCV.education.map((edu, index) => (
                                        <div key={index}>
                                            <strong>{edu.schoolName}</strong> - {edu.time}<br />
                                            <span>{edu.description}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="seperated-block">
                                    <h3>Kinh nghiệm làm việc</h3>
                                    {selectedCV.experience.map((exp, index) => (
                                        <div key={index}>
                                            <strong>{exp.company}</strong> - {exp.position} ({exp.time})<br />
                                            <span>{exp.description}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="seperated-block">
                                    <h3>Dự án</h3>
                                    {selectedCV.project.map((proj, index) => (
                                        <div key={index}>
                                            <strong>{proj.title}</strong> - {proj.description}<br />
                                            <span>Thời gian: {proj.time}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="seperated-block">
                                    <h3>Kỹ năng</h3>
                                    {selectedCV.skill.map((skill, index) => (
                                        <div key={index}>{skill.name} - {skill.level}</div>
                                    ))}
                                </div>
                            </div>

                            <div className="cv-right">
                                <div className="profile-container">
                                    {selectedCV.personalInfo.avatar && selectedCV.personalInfo.avatar.data ? (
                                        <img
                                            src={`data:image/jpeg;base64,${selectedCV.personalInfo.avatar.data.toString('base64')}`}
                                            alt="Avatar"
                                            className='profile'
                                        />
                                    ) : (
                                        <div className='no-avatar'>Không có ảnh đại diện.</div>
                                    )}
                                </div>
                                <div className="info">
                                    <p><strong>Ngôn ngữ:</strong> {selectedCV.language}</p>
                                    <p><strong>Địa chỉ:</strong> {selectedCV.personalInfo.personalAddress}</p>
                                    <p><strong>Email:</strong> {selectedCV.personalInfo.personalEmail}</p>
                                    <p><strong>Số điện thoại:</strong> {selectedCV.personalInfo.personalPhone}</p>
                                </div>
                            </div>
                        </div> */}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ManageCV;
