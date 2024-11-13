import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import axios from "axios";
import './HomePage.scss';
import { useEffect, useState } from "react";

const HomePage = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [profession, setProfession] = useState([]);
  const [companies, setCompanies] = useState([]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
  };

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
    const fetchFeedback = async () => {
      try {
        const response = await fetch('http://localhost:8080/v1/api/users/feedback', {
          method: 'GET',
        });
        const data = await response.json();

        console.log('Fetched data:', JSON.stringify(data, null, 2));

        if (data.feedbacks && Array.isArray(data.feedbacks)) {
          setFeedbackData(data.feedbacks);
        } else {
          console.error("Dữ liệu phản hồi không đúng cấu trúc hoặc không phải là mảng:", data);
          setFeedbackData([]);
        }
      } catch (error) {
        console.log(error);
        setFeedbackData([]);
      }
    };
    fetchFeedback();
  }, []);

  useEffect(() => {
    axios.get('http://localhost:8080/v1/api/admin/profession')
      .then(response => {
        setProfession(response.data);
        console.log("Fetched professions: ", response.data);
      })
      .catch(error => {
        console.error('Error fetching profession options', error);
      });
  }, []);

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
    <div className="home-page">
      <header className="header">
        <h1>STARTUP YOUR FUTURE<br />
          STEP UP YOUR GAME!</h1>
      </header>

      <section className="text">
        <div className="column">
          <h2>Sứ Mệnh</h2>
          <p>
            JobLink cam kết xây dựng một nền tảng tuyển dụng hiện đại, kết nối người tìm việc với nhà tuyển dụng nhanh chóng và hiệu quả. Chúng tôi tin rằng mọi ứng viên đều xứng đáng có cơ hội phát triển sự nghiệp và tìm thấy môi trường làm việc phù hợp với năng lực và ước mơ của mình. JobLink hoạt động với tinh thần tiên phong, tận tâm đồng hành cùng người lao động và doanh nghiệp để kiến tạo những giá trị bền vững trong thị trường việc làm.
          </p>
        </div>
        <div className="divider"></div>
        <div className="column">
          <h2>Tầm Nhìn</h2>
          <p>
            Trở thành nền tảng hàng đầu trong ngành tuyển dụng, JobLink định hướng thay đổi cách mọi người tìm kiếm và kết nối với cơ hội nghề nghiệp. Chúng tôi không ngừng nâng cao trải nghiệm của người dùng, tối ưu hóa quy trình tuyển dụng và cập nhật những xu hướng công nghệ tiên tiến để phục vụ nhu cầu ngày càng đa dạng của thị trường lao động. JobLink kỳ vọng trở thành cầu nối đáng tin cậy, giúp mọi người tiếp cận công việc mơ ước, góp phần tạo nên một lực lượng lao động vững mạnh và góp sức phát triển nền kinh tế.
          </p>
        </div>
      </section>

      <section className="features-section">
        <h2>Phản hồi từ người dùng</h2>
        <div className="features">
          {feedbackData.length > 0 ? (
            <div style={{ width: "100%", overflow: "hidden" }}>
              <Slider {...settings}>
                {feedbackData.map((feedback, index) => (
                  <div className="feature-item" key={index}>
                    <h3>{feedback.feedbackName}</h3>
                    <p>{`"${feedback.description}"`}</p>
                  </div>
                ))}
              </Slider>
            </div>
          ) : (
            <p>Hiện tại chưa có phản hồi nào từ người dùng.</p>
          )}
        </div>
      </section>

      <section className="team-section">
        <h2>Đội ngũ của chúng tôi</h2>
        <div className="team">
          <div className="team-member">
            <img src="blob:https://www.facebook.com/7d407e08-0a9e-43be-89c8-e6e68ea937dc" alt="John Doe" />
            <h3>Phạm Công Lê Tuấn</h3>
            <p>CEO & Người sáng lập</p>
          </div>
          <div className="team-member">
            <img src="https://scontent.fdad1-4.fna.fbcdn.net/v/t39.30808-6/465839446_1497316174303790_4852184452369956642_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHabzipcn339j37QNHVTVIwXMIub6-j0chcwi5vr6PRyIf4M6lRo95VWB2y4llWjBNS8gFXxnU-60CkvPTb6Aup&_nc_ohc=725qx4EOE1AQ7kNvgGSPSdI&_nc_zt=23&_nc_ht=scontent.fdad1-4.fna&_nc_gid=AiV9jo0gu03am7C9uN7VfNu&oh=00_AYAcTgatGGk6Dyd6HZHSF9YpWMGXrHFV7eF3eotS5uchJA&oe=673A9A24" alt="Nguyễn Anh Tú" />
            <h3>Nguyễn Anh Tú</h3>
            <p>CTO</p>
          </div>
          <div className="team-member">
            <img src="https://scontent.fsgn2-5.fna.fbcdn.net/v/t1.6435-9/168385711_100788812127465_1934890429465763290_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeHwDtmc4oO_rF9gPm-X4UjG4AkQH42cWRHgCRAfjZxZEUeYhTa6S62LMq9_nfkxWMjDjhHz4G3JwdcfnT-vt4BC&_nc_ohc=4REds-_0CssQ7kNvgFUX-ME&_nc_zt=23&_nc_ht=scontent.fsgn2-5.fna&_nc_gid=AGf15aI6p_VJ2PARU4fpZfU&oh=00_AYBmlEwLWxkNHU_rBuQ09j3ofDYjVIXINoeCi5oEBlzrTA&oe=67524B6E" alt="Robert Brown" />
            <h3>Nguyễn Thị Yến Vy</h3>
            <p>Giám đốc Marketing</p>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2>Ngành nghề & Lĩnh vực</h2>
        <div className="features">
          {profession.length > 0 ? (
            <div style={{ width: "100%", overflow: "hidden" }}>
              <Slider {...settings}>
                {profession.map((profession, index) => (
                  <div className="feature-item" key={index}>
                    <h3>{profession.name}</h3>
                  </div>
                ))}
              </Slider>
            </div>
          ) : (
            <p>Hiện tại chưa có ngành nghề/lĩnh vực nào từ người dùng.</p>
          )}
        </div>
      </section>

      <section className="company-section">
        <h2>Công ty</h2>
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
      <hr />
      <br /><br /><br />

      <div className="inline-container">
        <img src="images/ok.png" alt="alt" height="700px" />
        <div>
          <h4>
            "Bằng cách ghi lại ước mơ và mục tiêu trên giấy, bạn đã bắt đầu hành trình trở thành phiên bản tốt nhất của chính mình. Hãy nắm giữ tương lai trong bàn tay của bạn."
          </h4>
          <p>--- Mark Victor Hansen ---</p>
          <h1>Hãy để chúng tôi giúp bạn</h1>
          <h3>
            bằng cách <span className="dangerous">tải ứng dụng ngay</span>:
          </h3>
          <img src="images/qr.png" alt="alt" height="200px" className="qr-img" />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
