"use client";

import { getData } from "api";
import "./PartnersBlock.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";
import { useLang } from "$component/Context/LangContext";

const PartnersBlock = () => {
  const [partners, setPartners] = useState([]);
  const [chunkSize, setChunkSize] = useState(5);
  const { lang } = useLang();

  useEffect(() => {
    getData("partners", (data) => {
      const updatedPartners = [
        { id: "0", path: "1Xwod7WUZZ61bLoJSvFvl2_oi2jlm4WHv", link: "https://hyperhost.ua/uk" },
        ...data
      ];
      setPartners(updatedPartners);
    });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 480) setChunkSize(2);
      else if (width < 768) setChunkSize(3);
      else if (width < 1024) setChunkSize(4);
      else setChunkSize(5);
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
    arrows: false,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipe: true,
    draggable: true,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "ease",
    customPaging: (i) => <button className="custom-dot">{i + 1}</button>,
    appendDots: (dots) => <ul className="slick-dots">{dots}</ul>,
  };

  return (
    <div className="partners">
      <h1 className="partners__title _main-title">
        {lang === 'ua' ? "Наші партнери" : "Our partners"}
      </h1>
      <div className="wrapper_partner_line">
      <div className="partners__line"></div>
      </div>
      <div className="partners__wrapper">
        <div className="partners__container">
          <div className="partners__slider-wrapper">
            <Slider {...settings} className="partners__slider">
              {groupedPartners.map((group, index) => (
                <div className="partners__block" key={index}>
                  <div
                    className="partners__row"
                    style={{ gridTemplateColumns: `repeat(${group.length}, 1fr)` }}
                  >
                    {group.map((partner) => (
                      <div className="partners__partner" key={partner.id}>
                        {partner.link ? (
                          <Link
                            target="_blank"
                            href={partner.link}
                            className="partner__img-wrapper"
                          >
                            <Image
                              src={`http://drive.google.com/uc?export=view&id=${partner.path}`}
                              width={130}
                              height={130}
                              alt="partner logo"
                            />
                          </Link>
                        ) : (
                          <div className="partner__img-wrapper">
                            <Image
                              src={`http://drive.google.com/uc?export=view&id=${partner.path}`}
                              width={130}
                              height={130}
                              alt="partner logo"
                            />
                          </div>
                        )}
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
