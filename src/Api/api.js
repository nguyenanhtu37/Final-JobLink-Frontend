import axios from "./axios.customize";

const registerUser = async (email, password, username) => {
    const URL_API = "/v1/api/send-otp-user";
    const data = { email, password, username };

    try {
        return await axios.post(URL_API, data);
    } catch (error) {
        console.error('Error in registerUser:', error);
        throw error; // Re-throw to handle in the calling function
    }
};

const verifyOtpUser = async (email, otp, password, username) => {
    const URL_API = "/v1/api/verify-otp-user";
    const data = { email, otp, password, username };

    try {
        return await axios.post(URL_API, data);
    } catch (error) {
        console.error('Error in verifyOtpUser:', error);
        throw error; // Re-throw to handle in the calling function
    }
};

const registerEmployer = async (email, password, username) => {
    const URL_API = "/v1/api/send-otp-employer";
    const data = { email, password, username };

    try {
        return await axios.post(URL_API, data);
    } catch (error) {
        console.error('Error in registerEmployer:', error);
        throw error; // Re-throw to handle in the calling function
    }
};

const verifyOtpEmployer = async (email, otp, password, username) => {
    const URL_API = "/v1/api/verify-otp-employer";
    const data = { email, otp, password, username };

    try {
        return await axios.post(URL_API, data);
    } catch (error) {
        console.error('Error in verifyOtpEmployer:', error);
        throw error; // Re-throw to handle in the calling function
    }
};

const loginUser = (email, password) => {
    const URL_API = "/v1/api/login";
    const data = { email, password };
    return axios.post(URL_API, data);
};

const updateUser = (userId, data) => {
    const URL_API = `/v1/api/users/update/${userId}`; 
    return axios.put(URL_API, data); 
};

const getCompany = (userId) => {
    const URL_API = `company/get/${userId}`;
    return axios.get(URL_API);
};

const createCompany = (companyData) => {
    const URL_API = `company/create/`;
    return axios.post(URL_API, companyData);
};

const createJob = (jobData) => {
    const URL_API = "job/create";
    return axios.post(URL_API, jobData);
};

const getJobByEmployerId = (employerId) => {
    const URL_API = `/jobs/employer/${employerId}`;
    return axios.get(URL_API);
};

const getUnacceptedJob = () => {
    const URL_API = "jobs/no-public";
    return axios.get(URL_API);
};

const getAcceptedJob = () => {
    const URL_API = "jobs/public";
    return axios.get(URL_API);
};

const acceptJob = (jobId) => {
    const URL_API = `v1/api/admin/accept-job/${jobId}`;
    return axios.put(URL_API);
};

const getJobById = (jobId) => {
    const URL_API = `job/${jobId}`;
    return axios.get(URL_API);
};

const updateJob = (jobId, values) => {
    const URL_API = `job/${jobId}`;
    return axios.put(URL_API, values);
};

const deleteJob = (jobId) => {
    const URL_API = `Job/${jobId}`;
    return axios.delete(URL_API);
};

const getApplicationByJob = (jobId) => {
    const URL_API = `/applications/job/${jobId}`;
    return axios.get(URL_API);
};

const acceptApplication = async (applicationId, data) => {
    return await axios.put(`/application/${applicationId}/accept`, data);  // Use PUT instead of POST
};

const rejectApplication = async (applicationId, data) => {
    return await axios.put(`/application/${applicationId}/reject`, data);  // Use PUT instead of POST
};

const getNoficationByUser = (userId) => {
    const URL_API = `/v1/api/users/notification/${userId}`;
    return axios.get(URL_API);
};

const updateNotificationStatus = (userId) => {
    const URL_API = `/v1/api/users/read/${userId}`;
    return axios.post(URL_API);
};

const sendOtpForForgotPassword = async (email) => {
    const URL_API = "/v1/api/send-otp-forgot";
    const data = { email };
    return await axios.post(URL_API, data);
};

const sendOtpResetPassword = async (email, password) => {
    const URL_API = "/v1/api/send-otp-reset";
    const data = { email, password };
    return await axios.post(URL_API, data);
};

const forgotPassword = async (email, otp, newPassword) => {
    const URL_API = "/v1/api/forgot-password";
    const data = { email, otp, newPassword };
    return await axios.post(URL_API, data);
};

const getAllUsers = async () => {
    const URL_API = "/v1/api/users/get-all";
    return await axios.get(URL_API)
}

const getAllEmployers = async () => {
    const URL_API = "/v1/api/users/get-all-employers";
    return await axios.get(URL_API)
}

const getUserById = async (userId) => {
    const URL_API = `/v1/api/users/get/${userId}`;
    return await axios.get(URL_API)
}

const toggleUserBlockStatus = async (userId) => {
    try {
        const URL_API = `/v1/api/users/toggle-block/${userId}`;
        const response = await axios.put(URL_API);
        return response;
    } catch (error) {
        console.error("Error in toggleUserBlockStatus:", error);
        throw error;
    }
}

const getReports = async () => {
    const URL_API = "/v1/api/admin/reports";
    return await axios.get(URL_API)
}

const getReportById = async (id) => {
    const URL_API = `/v1/api/admin/report/${id}`;
    return await axios.get(URL_API)
}

const getFeedbacks = async () => {
    const URL_API = "/v1/api/admin/feedbacks";
    return await axios.get(URL_API)
}

const getFeedbackById = async (id) => {
    const URL_API = `/v1/api/admin/feedback/${id}`;
    return await axios.get(URL_API)
}

export {
    getUserById,
    registerUser,
    registerEmployer,
    verifyOtpUser,
    verifyOtpEmployer,
    loginUser,
    updateUser,
    getCompany,
    createCompany,
    createJob,
    getJobByEmployerId,
    getUnacceptedJob,
    acceptJob,
    getAcceptedJob,
    getJobById,
    updateJob,
    deleteJob,
    getApplicationByJob,
    acceptApplication,
    rejectApplication,
    getNoficationByUser,
    updateNotificationStatus,
    sendOtpForForgotPassword,
    forgotPassword,
    sendOtpResetPassword,
    getAllUsers,
    getAllEmployers,
    toggleUserBlockStatus,
    getReports,
    getReportById,
    getFeedbacks,
    getFeedbackById
};
