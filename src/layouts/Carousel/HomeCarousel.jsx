import React from "react";
import { Carousel } from "antd";
import 'react-responsive-carousel/lib/styles/carousel.min.css'

const HomeCarousel = () => {
    return (
        <Carousel showThumbs={false} autoPlay={true} infiniteLoop={true}>
            <div>
                <img src="images/slide1.png" alt="Slide 1" />
                <p className="legend">Caption for Slide 1</p>
            </div>
            <div>
                <img src="/images/slide1.png" alt="Slide 2" />
                <p className="legend">Caption for Slide 2</p>
            </div>
            <div>
                <img src="/images/slide3.jpg" alt="Slide 3" />
                <p className="legend">Caption for Slide 3</p>
            </div>
        </Carousel>
    );
};

export default HomeCarousel;