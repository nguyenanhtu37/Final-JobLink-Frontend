import React from "react";
import ReactDOM from "react-dom/client";
import {
    createBrowserRouter,
    RouterProvider,
    Navigate,
} from "react-router-dom";
import App from "./App.jsx";
import RegisterUserPage from "./pages/Register/RegisterUserPage.jsx";
import LoginUserPage from "./pages/Login/LoginUserPage.jsx";
import "./styles/global.scss";
import AdminPage from "./pages/Admin/AdminPage.jsx";
import HomePage from "./pages/HomePage/HomePage.jsx";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./redux/store.js";
import HomeEmployerPage from "./pages/HomePage/RecruitmentConsulting.jsx";
import RegisterEmployer from "./pages/Register/RegisterEmployerPage.jsx";
import LoginEmployerPage from "./pages/Login/LoginEmployerPage.jsx";
import PostJob from "./pages/PostJob/PostJob.jsx";
import Profile from "./pages/ProfileUser/Profile.jsx";
import RecruitmentConsulting from "./pages/HomePage/RecruitmentConsulting.jsx";
import RecruitmentPage from "./pages/HomePage/RecruitmentPage.jsx";
import JobDetail from "./pages/HomePage/JobDetail.jsx";
import CVTemplate from "./pages/CV/CVTemplate.jsx";
import CompanyDetail from "./pages/HomePage/CompanyDetail.jsx";
import Favorite from "./pages/Favorite/Favorite.jsx";
import { useSelector } from "react-redux";
import AppliedApplication from "./pages/Application/AppliedApplication.jsx";

// Protected route component
const ProtectedRoute = ({ children }) => {
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    return isAuthenticated ? children : <Navigate to="/login-user" />;
};
import ManageCompany from "./pages/ManagerCompany/ManageCompany.jsx";
import AddJob from "./pages/ManageJobs/AddJob/AddJob.jsx";
import ListJob from "./pages/ManageJobs/ListJob/ListJob.jsx";
import ListUnacceptedJobs from "./pages/Admin/ManageJobs/ListUnacceptedJobs/ListUnacceptedJobs.jsx";
import ListAcceptedJobs from "./pages/Admin/ManageJobs/ListAcceptedJobs/ListAcceptedJobs.jsx";
import ViewDetailJob from "./pages/ManageJobs/ListJob/ViewDetailJob.jsx";
import VideoCall from "./pages/VideoCall/VideoCall.jsx";
import ListApplication from "./pages/ManageJobs/ListApplication/ListApplication.jsx";
import ManageCV from "./pages/CV/ManageCV.jsx";
import VerifyOtpUser from "./pages/VerifyOtp/VerifyOtpUserPage.jsx";
import VerifyOtpEmployer from "./pages/VerifyOtp/VerifyOtpEmployerPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPassword/ForgotPasswordPage.jsx";
import VerifyOtpForgotPage from "./pages/VerifyOtp/VerifyOtpForgotPasswordPage.jsx";
import ForgotPasswordEmployerPage from "./pages/ForgotPassword/ForgotPasswordEmployerPage.jsx";
import VerifyOtpForgotEmployerPage from "./pages/VerifyOtp/VerifyOtpForgotPasswordEmployerPage.jsx";
import DashBoardEmployer from "./pages/PostJob/DashBoardEmployer.jsx";
import ResetPasswordUserPage from "./pages/ResetPassword/ResetPasswordUserPage.jsx";
import VerifyResetPasswordUserPage from "./pages/VerifyOtp/VerifyResetPasswordUserPage.jsx";
import ProfileEmployer from "./pages/ProfileUser/ProfileEmployer.jsx";
import DashBoardAdmin from "./pages/Admin/DashBoardAdmin.jsx";
import ListUsers from "./pages/Admin/ListAccounts/ListUsers.jsx";
import ListEmployers from "./pages/Admin/ListAccounts/ListEmployers.jsx";
import FeedbackForm from "./layouts/Feedback/FeedbackForm.jsx";
import Company from "./pages/CompanyList/Company.jsx";
import Consultations from "./pages/Admin/Consultations/Consultations.jsx";
import SystemFeedback from "./pages/Admin/SystemFeedback/SystemFeedback.jsx";
import EmployerVideoCall from "./pages/VideoCall/EmployerVideoCall.jsx";
import ListReport from "./pages/Admin/ManageReport/ListReport/ListReport.jsx";
import ListFeedbacks from "./pages/Admin/ManageJobs/ManageFeedback/ListFeedback.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: "/profile/:id",
                element: <Profile />,
            },
            {
                path: "/favorite",
                element: (
                    <ProtectedRoute>
                        <Favorite />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/cv_profile",
                element: (
                    <ProtectedRoute>
                        <CVTemplate />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'manage_cv',
                element: <ManageCV />,
            },
            {
                path: 'companies',
                element: <Company />
            },
            {
                path: "/reset-password-user",
                element: (
                    <ProtectedRoute>
                        <ResetPasswordUserPage />
                    </ProtectedRoute>
                )
            },
            {
                path: "/verify-reset-password-user",
                element: (
                    <ProtectedRoute>
                        <VerifyResetPasswordUserPage />
                    </ProtectedRoute>
                )
            },
            {
                path: "recruitment-consulting",
                element: <RecruitmentConsulting />,
            },
            {
                path: "login-user",
                element: <LoginUserPage />,
            },
            {
                path: "register-user",
                element: <RegisterUserPage />,
            },
            {
                path: "verify-otp-user",
                element: <VerifyOtpUser />
            },
            {
                path: "recruitments",
                element: <RecruitmentPage />,
            },
            {
                path: "job-detail/:jobId",
                element: <JobDetail />,
            },
            {
                path: "company-detail/:jobId",
                element: <CompanyDetail />,
            },
            {
                path: "/applied-recruitments",
                element: <AppliedApplication />,
            },
            {
                path: '/interview',
                element: <VideoCall />
            },
            {
                element: <FeedbackForm />
            }
        ],
    },
    {
        path: "register-employer",
        element: <RegisterEmployer />,
    },
    {
        path: "forgot-password",
        element: <ForgotPasswordPage />
    },
    {
        path: "verify-otp-forgot",
        element: <VerifyOtpForgotPage />
    },
    {
        path: "forgot-password-employer",
        element: <ForgotPasswordEmployerPage />
    },
    {
        path: "verify-otp-forgot-employer",
        element: <VerifyOtpForgotEmployerPage />
    },
    {
        path: "verify-otp-employer",
        element: <VerifyOtpEmployer />
    },
    {
        path: "login-employer",
        element: <LoginEmployerPage />,
    },
    {
        path: "admin",
        element: <AdminPage />,
        children: [
            {
                index: true,
                element: <DashBoardAdmin />
            },
            {
                path: "list-users",
                element: <ListUsers />,
            },
            {
                path: "list-employers",
                element: <ListEmployers />,
            },
            {
                path: "list-employers",
                element: <ListUnacceptedJobs />,
            },
            {
                path: "list-no-public-job",
                element: <ListUnacceptedJobs />,
            },
            {
                path: "list-public-job",
                element: <ListAcceptedJobs />,
            },
            {
                path: '/admin/consultations',
                element: <Consultations />
            },
            {
                path: '/admin/system-feedbacks',
                element: <SystemFeedback />
            },
            {
                path: "list-reports",
                element: <ListReport />,
            },
            {
                path: "list-feedbacks",
                element: <ListFeedbacks />,
            },
        ],
    },
    {
        path: "homepostjob",
        element: <HomeEmployerPage />,
    },
    {
        path: '/employer-interview',
        element: <EmployerVideoCall />
    },
    {
        path: "postjob",
        element: <PostJob />,
        children: [
            {
                index: true,
                element: <DashBoardEmployer />
            },
            {
                path: "manage-company",
                element: <ManageCompany />,
            },
            {
                path: "add-job",
                element: <AddJob />,
            },
            {
                path: "list-jobs",
                element: <ListJob />,
            },
            {
                path: "job-detail/:id",
                element: <ViewDetailJob />,
            },
            {
                path: "list-application/:id",
                element: <ListApplication />
            },
            {
                path: "profile-employer",
                element: <ProfileEmployer />
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <React.StrictMode>
                <RouterProvider router={router} />
            </React.StrictMode>
        </PersistGate>
    </Provider>
);
