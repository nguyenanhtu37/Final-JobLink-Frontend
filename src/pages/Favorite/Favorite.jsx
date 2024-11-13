import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import './Favorite.scss';
import { DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";

const Favorite = () => {
    const userId = useSelector((state) => state.user.account.id);
    const [favorites, setFavorites] = useState([]);
    const navigate = useNavigate();

    const viewDetailedJob = (jobId) => {
        navigate(`/job-detail/${jobId._id}`);
    };

    const viewDetailedComapy = (jobId) => {
        navigate(`/company-detail/${jobId}`);
    };

    useEffect(() => {
        const fetchFavorite = async () => {
            try {
                const response = await axios.get('https://final-joblink-backend.onrender.com/v1/api/users/favorite/', {
                    params: { userId },
                });
                setFavorites(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchFavorite();
    }, [userId]);

    const handleRemoveFavorite = async (favoriteId) => {
        const result = confirm(`Xóa ${favoriteId.jobId.title} khỏi danh sách yêu thích?`);
        if (result === true) {
            try {
                console.log(favoriteId._id);
                await axios.delete(`https://final-joblink-backend.onrender.com/v1/api/users/favorite/${favoriteId._id}`);
                setFavorites(favorites.filter(favorite => favorite._id !== favoriteId._id));
            } catch (error) {
                console.log(error);
            }
        }
    };

    return (
        <div className="all-favorite">
            <div className="filter-container">
                <h1>Danh sách việc làm đã lưu</h1>
                <div className="filter-options">
                    <div className="filter-item">Cập nhật mới nhất</div>
                    <div className="filter-item">Ưu tiên hiển thị</div>
                </div>
            </div>

            {favorites.length === 0 ? (
                <p>Không có việc làm nào được lưu.</p>
            ) : (
                favorites.map(favorite => (
                    <div key={favorite._id} className="favorite-item">
                        <div className="favorite-item-content">
                            <img
                                src={favorite.jobId.companyId.logo}
                                alt={favorite.jobId.companyId.name}
                                className="company-logo"
                                onClick={() => viewDetailedComapy(favorite.jobId._id)}
                            />
                            <div className="favorite-details">
                                <h2 onClick={() => viewDetailedJob(favorite.jobId)}>{favorite.jobId.title}</h2>
                                <p><strong>Công ty:</strong> {favorite.jobId.companyId.name}</p>
                                <p><strong>Mức lương:</strong> {favorite.jobId.salary.toLocaleString()} VND</p>
                                <p><strong>Địa điểm:</strong> {favorite.jobId.detailed_location}</p>
                                <p className="gray-background"><strong>Thời gian lưu:</strong> {new Date(favorite.createdAt).toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="action-buttons">
                            <button
                                onClick={() => handleRemoveFavorite(favorite)}
                                className="remove-button"
                            >
                                <DeleteOutlined className="delete-icon" />
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default Favorite;