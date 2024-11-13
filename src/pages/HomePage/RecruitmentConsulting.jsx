import React from "react";
import EmployerHeader from "../../layouts/Header/Header";
import { Outlet } from "react-router-dom";
import { Header } from "antd/es/layout/layout";
import { useState } from "react";
import "./RecruitmentConsulting.scss";

const RecruitmentConsulting = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    requirement: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form data before sending:", formData);
    try {
      const response = await fetch('https://final-joblink-backend.onrender.com/create/consultation', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)
      });

      // Kiem tra neu request thanh cong:
      if (response.ok) {
        const result = await response.json();
        console.log("Data is sent successfully", result);
        alert("Your request has been successfully submitted. Our customer service team will contact you shortly. Thank you for your patience!");
      } else {
        const errorResponse = await response.json();
        console.error("Error details:", errorResponse);
        console.error("Sent data failed!", response.statusText);
      }
    } catch (error) {
      console.error(`Cannot connect to api endpoint ${error}`);
    }
    // console.log(formData);
  };

  return (
    <div>
      <div className="container">
        <div className="title-container">
          <h1>Đâu là giải pháp phù hợp cho doanh nghiệp của bạn?</h1>
          <h5>Hãy để lại thông tin và các chuyên viên tư vấn tuyển dụng của JobLink sẽ liên hệ ngay với bạn</h5>
        </div>

        <div className="sub-container">
          <img src="images/logo.png" width="200" height="200" alt="Logo" />
          <form onSubmit={handleSubmit} className="form-container">
            <h3 style={{ color: "#66BC46", paddingTop: "20px", marginBottom: "40px" }}>Đăng ký nhận tư vấn</h3>
            <label htmlFor="name" style={{ fontWeight: "bold", margin: "0px" }}>Họ và tên</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder="Họ và tên"
              onChange={handleChange}
            />

            <label htmlFor="email" style={{ fontWeight: "bold", margin: "0px" }}>Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="Email"
              onChange={handleChange}
            />

            <label htmlFor="phone" style={{ fontWeight: "bold", margin: "0px" }}>Số điện thoại</label>
            <input
              type="text"
              id="phone"
              name="phone"
              required
              placeholder="Số điện thoại"
              onChange={handleChange}
            />

            <label htmlFor="location" style={{ fontWeight: "bold", margin: "0px" }}>Tỉnh/Thành phố</label>
            <input
              type="text"
              id="location"
              name="location"
              required
              placeholder="Tỉnh/Thành phố"
              onChange={handleChange}
            />

            <label htmlFor="requirement" style={{ fontWeight: "bold", margin: "0px" }}>Nhu cầu tư vấn</label>
            <input
              type="text"
              id="requirement"
              name="requirement"
              required
              placeholder="Bạn cần hỗ trợ gì?"
              onChange={handleChange}
            />

            <input
              style={{ margin: "0px", backgroundColor: "#66BC46" }}
              type="submit"
              value="Đăng ký"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default RecruitmentConsulting;
