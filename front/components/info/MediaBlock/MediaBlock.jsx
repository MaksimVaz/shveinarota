import { Autoplay, Pagination, EffectCoverflow } from "swiper/modules";
import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import './MediaBlock.css';
import './MediaTextSlider.css';
import './MediaNumberSlider.css';
import './MediaImageSlider.css';
import './MediaSliderControll.css';
import './MediaBlockAdapt.css'

import { useLang } from '$component/Context/LangContext';
import { getData } from 'api';

// Debounce hook for resize events
function useDebouncedResize(breakpoint = 992, delay = 200) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= breakpoint : false
  );
  useEffect(() => {
    let timeout;
    const onResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const mobile = window.innerWidth <= breakpoint;
        setIsMobile(prev => (prev !== mobile ? mobile : prev));
      }, delay);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      clearTimeout(timeout);
    };
  }, [breakpoint, delay]);
  return isMobile;
}

const MediaBlock = () => {
  const { lang } = useLang();
  const isMobileView = useDebouncedResize(770);
  const [media, setMedia] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  // fetch media once
  useEffect(() => {
    getData('plots/all', data => {
      if (Array.isArray(data)) setMedia(data);
    });
  }, []);

  // derive slides, numbers, images only when `media` changes
  const mediaUrl = media.map(item => item.url || '');
  const slides = useMemo(() => media.map(item => item.title || ''), [media]);
  const numbers = useMemo(
    () => slides.map((_, idx) => String(idx + 1).padStart(2, '0')),
    [slides]
  );
  const images = useMemo(
    () =>
      media.map(item => {
        const url = item.url || '';
        const videoId = url.includes('v=')
          ? url.split('v=')[1].split('&')[0]
          : url.split('/').pop()?.split('?')[0] || '';
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      }),
    [media]
  );

  
  // refs for Swiper instances
  const swiperRefs = useRef({ text: null, numbers: null, images: null });

  const syncAll = useCallback((index, speed = 500) => {
    setIsSyncing(true);
    Object.values(swiperRefs.current).forEach(swiper => {
      if (swiper && swiper.realIndex !== index) {
        swiper.slideToLoop(index, speed);
      }
    });
    setTimeout(() => setIsSyncing(false), speed + 50);
  }, []);

  const changeSlide = useCallback(
    idx => {
      if (!slides.length || idx === activeIndex || isSyncing) return;
      setActiveIndex(idx);
      syncAll(idx);
    },
    [slides.length, activeIndex, syncAll, isSyncing]
  );

  const goPrev = useCallback(() => {
    if (!slides.length || isSyncing) return;
    const idx = (activeIndex - 1 + slides.length) % slides.length;
    changeSlide(idx);
  }, [activeIndex, slides.length, changeSlide, isSyncing]);

  const goNext = useCallback(() => {
    if (!slides.length || isSyncing) return;
    const idx = (activeIndex + 1) % slides.length;
    changeSlide(idx);
  }, [activeIndex, slides.length, changeSlide, isSyncing]);

  if (!slides.length) {
    return <div>Завантаження...</div>;
  }

  return (
    <div className="main_media_wrapper">
      <div className="media_container">
        <div className="media_title_block">
          <h2>Медіа про нас</h2>
          <div className="media_title_column" />
        </div>

        <div id="media-slider-group" className="media_slider_block">
          <div className="left_slide_mediablock">
            <Swiper
              className="media-block-swiper text-swiper"
              modules={[Autoplay, Pagination, EffectCoverflow]}
              slidesPerView={1}
              spaceBetween={30}
              loop
              onSwiper={sw => (swiperRefs.current.text = sw)}
              onSlideChange={swiper => changeSlide(swiper.realIndex)}
            >
              {slides.map((text, idx) => (
                <SwiperSlide key={idx}>
                  <div className="text-center text-xl font-semibold p-8">{text}</div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="right_slide_mediablock">
            <div className="top_slide_block">
              <button onClick={goNext} className="nav-btn" disabled={isSyncing}>
                <img
                  src="/images/pointer.png"
                  alt="Следующая"
                  className="media_prev_slider_button"
                />
              </button>
              <Swiper
                className="number-swiper"
                slidesPerView={3}
                spaceBetween={0}
                speed={600}
                loop
                centeredSlides
                onSwiper={sw => (swiperRefs.current.numbers = sw)}
                onSlideChange={swiper => changeSlide(swiper.realIndex)}
              >
                {numbers.map((num, idx) => (
                  <SwiperSlide key={idx}>
                    <div
                      className={`number-slide cursor-pointer ${activeIndex === idx ? 'active' : ''}`}
                      onClick={() => changeSlide(idx)}
                    >
                      {num}
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <button onClick={goNext} className="nav-btn" disabled={isSyncing}>
                <img
                  src="/images/pointer.png"
                  alt="Следующая"
                  className="media_next_slider_button"
                />
              </button>
            </div>

            <div className="bottom_slide_block">
            <Swiper
              className="media-block-swiper image-swiper"
              modules={[Pagination]}
              slidesPerView={isMobileView ? 1 : 2}
              spaceBetween={20}
              loop
              onSwiper={sw => (swiperRefs.current.images = sw)}
              onSlideChange={swiper => changeSlide(swiper.realIndex)}
            >
              {images.map((src, idx) => (
                <SwiperSlide key={idx}>
                  <img
                    src={src}
                    alt="media"
                    loading="lazy"
                    className="w-full h-auto object-cover rounded-lg cursor-pointer"
                    onClick={() => {
                      if (idx === activeIndex) {
                        const url = mediaUrl[idx];
                        if (url) window.open(url, '_blank');
                      } else {
                        changeSlide(idx);
                      }
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaBlock;
