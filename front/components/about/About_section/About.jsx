"use client";

import { useRef } from "react";
import { useScroll } from "../../../src/app/about/page"; // Импортируем контекст
import "./About.css";
import Image from "next/image";

const AboutSection = () => {
  const sectionRef = useRef(null);
  const { scrollToSection, currentIndex } = useScroll(); // Используем общий метод

  const handleScrollClick = () => {
    scrollToSection(currentIndex + 1);
  };

  return (
    <div ref={sectionRef} className="About_section">
      <div className="About_image_box">
        <button className="About_scroll_button" onClick={handleScrollClick}>
          Наша історія
        </button>
        <Image
          src="/images/about/icons/sign.png"
          alt="Scroll Down"
          width={150}
          height={125}
          className="About_scroll_image"
          onClick={handleScrollClick}
        />
      </div>
    </div>
  );
};

export default AboutSection;
