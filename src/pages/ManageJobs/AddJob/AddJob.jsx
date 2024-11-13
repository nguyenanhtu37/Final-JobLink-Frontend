import React, { useEffect, useState } from "react";
import { createJob, getCompany } from "../../../Api/api";
import { useSelector } from "react-redux";
import "./AddJob.scss"
import { notification } from "antd";

const AddJob = () => {
    const account = useSelector((state) => state.user.account);
    const [dataCompany, setDataCompany] = useState();
    
    // Initialize formData without companyId
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        requirement: "",
        benefit: "",
        province_city: "",
        detailed_location: "",
        working_time: "",
        due_to: "",
        salary: "",
        experience: "",
        level: "",
        quantity: "",
        working_type: "",
        sex: "",
        isPublic: false,
        professionId: account.id,
        companyId: "",  // Initially set to an empty string
        employerId: account.id,
    });

    useEffect(() => {
        fecthCompany();
    }, []);

    const fecthCompany = async () => {
        try {
            const res = await getCompany(account.id);
            setDataCompany(res);
            // Update formData with the fetched companyId
            setFormData((prevData) => ({
                ...prevData,
                companyId: res._id, // Update companyId here
            }));
        } catch (error) {
            console.error("Error fetching company:", error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const today = new Date().toISOString().split("T")[0];
        if (formData.due_to <= today) {
            notification.error({
                message: "Invalid Due Date",
                description: "The due date must be later than today.",
            });
            return;
        }

        try {
            await createJob(formData);  // Await the API call
            setFormData({
                title: "",
                description: "",
                requirement: "",
                benefit: "",
                province_city: "",
                detailed_location: "",
                working_time: "",
                due_to: "",
                salary: "",
                experience: "",
                level: "",
                quantity: "",
                working_type: "",
                sex: "",
                isPublic: false,
                professionId: account.id,
                companyId: dataCompany._id, // Set the companyId again after creation
                employerId: account.id,
            });
            notification.success({              
                message: "CREATE JOB",
                description: "Company created successfully!",
            })
            // Optionally add a success message or redirect
        } catch (error) {
            console.error("Error creating job:", error);
            // Handle error message here
        }
    };
    
    console.log(formData);

    return (
        <div className="create-job-form-container">
            <h2>Create a Job</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Job Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>

                <div>
                    <label>Requirements</label>
                    <textarea
                        name="requirement"
                        value={formData.requirement}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>

                <div>
                    <label>Benefits</label>
                    <textarea
                        name="benefit"
                        value={formData.benefit}
                        onChange={handleChange}
                    ></textarea>
                </div>

                <div>
                    <label>Location</label>
                    <input
                        type="text"
                        name="province_city"
                        value={formData.province_city}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Detailed Location</label>
                    <input
                        type="text"
                        name="detailed_location"
                        value={formData.detailed_location}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Working Time</label>
                    <input
                        type="text"
                        name="working_time"
                        value={formData.working_time}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Due Date</label>
                    <input
                        type="date"
                        name="due_to"
                        value={formData.due_to}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Salary</label>
                    <input
                        type="number"
                        name="salary"
                        value={formData.salary}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Experience</label>
                    <input
                        type="text"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Level</label>
                    <input
                        type="text"
                        name="level"
                        value={formData.level}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Quantity</label>
                    <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Working Type</label>
                    <input
                        type="text"
                        name="working_type"
                        value={formData.working_type}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Sex</label>
                    <input
                        type="text"
                        name="sex"
                        value={formData.sex}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit">Create Job</button>
            </form>
        </div>
    );
};

export default AddJob;
