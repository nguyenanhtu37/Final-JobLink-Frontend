import { Outlet } from "react-router-dom";
import Header from "./layouts/Header/Header";
import PluginMessenger from "./layouts/Plugin/PluginMessenger";
import FeedbackForm from "./layouts/Feedback/FeedbackForm";
import Footer from "./layouts/Footer/Footer";
import './App.scss';

function App() {
  return (
    <div className="app-wrapper">
      <Header />
      <FeedbackForm />
      <PluginMessenger />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;