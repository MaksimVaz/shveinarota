"use client";

import { useEffect, useRef, useState, createContext, useContext } from "react";
import AboutTextSection from "$component/about/About_text/About_text";
import About_section from "../../../components/about/About_section/About";
import Team_Section from "../../../components/about/Team_section/Team";
import "../../../style/about/About.css"

const ScrollContext = createContext();

export const useScroll = () => useContext(ScrollContext);

export default function AboutPage() {
  const sectionsRef = useRef([]);
  const [index, setIndex] = useState(0);
  const isScrolling = useRef(false);

  const scrollToSection = (newIndex) => {
    if (newIndex >= 0 && newIndex < sectionsRef.current.length) {
      setIndex(newIndex);
      isScrolling.current = true;

      sectionsRef.current[newIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      setTimeout(() => {
        isScrolling.current = false;
      }, 500);
    }
  };

  useEffect(() => {
    const handleScroll = (event) => {
      if (isScrolling.current) return;

      const sensitivity = 0;

      if (event.deltaY > sensitivity) {
        scrollToSection(index + 1);
      } else if (event.deltaY < -sensitivity) {
        scrollToSection(index - 1);
      }
    };

    window.addEventListener("wheel", handleScroll);
    return () => window.removeEventListener("wheel", handleScroll);
  }, [index]);

  return (
    <ScrollContext.Provider value={{ scrollToSection, currentIndex: index }}>
      <main className="main">
        {/* Фиксированное меню навигации */}
        <div className="About_page_scroll_menu">
          {[0, 1, 2].map((i) => (
            <button
              key={i}
              className={index === i ? "active" : ""}
              onClick={() => scrollToSection(i)}
            ></button>
          ))}
        </div>

        <section ref={(el) => el && (sectionsRef.current[0] = el)}>
          <About_section />
        </section>
        <section ref={(el) => el && (sectionsRef.current[1] = el)}>
          <AboutTextSection />
        </section>
        <section ref={(el) => el && (sectionsRef.current[2] = el)}>
          <Team_Section />
        </section>
      </main>
    </ScrollContext.Provider>
  );
}
