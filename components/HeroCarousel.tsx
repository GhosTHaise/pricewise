"use client"

import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { heroImages } from "@/constants";
import Image from "next/image";

const HeroCarousel = () => {
  return (
    <div className="hero-carousel">
        <Carousel
            showThumbs={false}
            autoPlay
            infiniteLoop 
            interval={2000}
            showArrows={false}
            showStatus={false}
        >
        {
            heroImages.map(image => (
                <Image 
                    key={image.alt}
                    src={image.imgUrl}
                    alt={image.alt}
                    width={484}
                    height={484}
                    className="object-contain"
                />
            ))
        }
        </Carousel>
        <Image
            src="assets/icons/hand-drawn-arrow.svg"
            alt="arrow"
            width={175}
            height={175}
            className="max-xl:hidden absolute -left-[15%] bottom-0 z-0"
        />
    </div>
  )
}

export default HeroCarousel