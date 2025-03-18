"use client";

import { getData } from "api";
import "./PartnersBlock.css";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const PartnersBlock = () => {
  const [partners, setPartners] = useState([]);
  const [chunkSize, setChunkSize] = useState(5);
  const sliderRef = useRef(null);
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const dragStartY = useRef(null);
  const baseOffset = useRef(0);
  const currentDelta = useRef(0);

  useEffect(() => {
    getData("partners", setPartners);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 480) {
        setChunkSize(2);
      } else if (width < 768) {
        setChunkSize(3);
      } else if (width < 1024) {
        setChunkSize(4);
      } else {
        setChunkSize(5);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const chunkArray = (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  };

  const groupedPartners = chunkArray(partners, chunkSize);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    vertical: true,
    verticalSwiping: true,
    swipe: false,
    draggable: false,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "ease",
    customPaging: (i) => <button className="custom-dot">{i + 1}</button>,
    appendDots: (dots) => <ul className="slick-dots">{dots}</ul>,
  };

  const handleStart = (startY) => {
    sliderRef.current?.slickPause();
    dragStartY.current = startY;
    currentDelta.current = 0;
    const track = document.querySelector(".slick-track");
    trackRef.current = track;
    if (track) {
      const computed = window.getComputedStyle(track);
      const transform = computed.transform;
      let translateY = 0;
      if (transform && transform !== "none") {
        const match = transform.match(/matrix.*\((.+)\)/);
        if (match) {
          const values = match[1].split(",").map((val) => parseFloat(val.trim()));
          translateY = values[5];
        }
      }
      baseOffset.current = translateY;
    }
  };

  const handleMove = (currentY) => {
    if (dragStartY.current === null || !trackRef.current) return;
    const deltaY = currentY - dragStartY.current;
    currentDelta.current = deltaY;
    trackRef.current.style.transition = "none";
    trackRef.current.style.transform = `translate3d(0, ${baseOffset.current + deltaY}px, 0)`;
  };

  const handleEnd = () => {
    const threshold = 50;
    if (currentDelta.current < -threshold) {
      sliderRef.current?.slickNext();
    } else if (currentDelta.current > threshold) {
      sliderRef.current?.slickPrev();
    } else if (trackRef.current) {
      trackRef.current.style.transition = "transform 0.3s ease";
      trackRef.current.style.transform = `translate3d(0, ${baseOffset.current}px, 0)`;
      setTimeout(() => {
        if (trackRef.current) trackRef.current.style.transition = "";
      }, 300);
    }
    dragStartY.current = null;
    currentDelta.current = 0;
    sliderRef.current?.slickPlay();
  };

  useEffect(() => {
    const container = containerRef.current;

    const onTouchStart = (e) => {
      handleStart(e.touches[0].clientY);
    };

    const onTouchMove = (e) => {
      handleMove(e.touches[0].clientY);
      e.preventDefault(); // Чтобы страница не прокручивалась
    };

    const onTouchEnd = () => {
      handleEnd();
    };

    if (container) {
      container.addEventListener("touchstart", onTouchStart, { passive: false });
      container.addEventListener("touchmove", onTouchMove, { passive: false });
      container.addEventListener("touchend", onTouchEnd, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener("touchstart", onTouchStart);
        container.removeEventListener("touchmove", onTouchMove);
        container.removeEventListener("touchend", onTouchEnd);
      }
    };
  }, []);

  return (
    <div className="partners">
      <h1 className="partners__title _main-title">Наші партнери</h1>
      <div className="partners__line"></div>
      <div
        className="partners__wrapper"
        ref={containerRef}
        onMouseDown={(e) => handleStart(e.clientY)}
        onMouseMove={(e) => handleMove(e.clientY)}
        onMouseUp={handleEnd}
        onMouseLeave={() => dragStartY.current !== null && handleEnd()}
      >
        <div className="partners__container">
          <div className="partners__slider-wrapper">
            <Slider ref={sliderRef} {...settings} className="partners__slider">
              {groupedPartners.map((group, index) => (
                <div className="partners__block" key={index}>
                  <div
                    className="partners__row"
                    style={{
                      gridTemplateColumns: `repeat(${group.length}, 1fr)`,
                    }}
                  >
                    {group.map((partner) => (
                      <div className="partners__partner" key={partner.id}>
                        <div className="partner__img-wrapper">
                          <Image
                            src={
                              "http://drive.google.com/uc?export=view&id=" +
                              partner.path
                            }
                            width={130}
                            height={130}
                            alt="img"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnersBlock;
