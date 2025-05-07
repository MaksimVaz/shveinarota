'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useLang } from '$component/Context/LangContext';
import './SidebarSearch.css';
import './SidebarButton.css';

const SidebarSearch = ({ markers, handleZoom, disableMapInteraction, enableMapInteraction }) => {
  const [query, setQuery] = useState('');
  const { lang } = useLang();
  const [isOpen, setIsOpen] = useState(true);

  const sidebarRef = useRef(null);
  const sidebarListRef = useRef(null);

  const isDragging = useRef(false);
  const startY = useRef(0);
  const scrollTop = useRef(0);
  const velocity = useRef(0);
  const animationFrame = useRef(null);
  const lastY = useRef(0);

  const filteredMarkers = markers.filter(marker =>
    marker.title.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const sidebarList = sidebarListRef.current;
    if (!sidebarList) return;

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const handleWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const unit = e.deltaMode === 1 ? 16 : 1;
      const raw = e.deltaY * unit * 2;
      const delta = Math.abs(raw) < 1 ? Math.sign(raw) * 1 : raw;
      sidebarList.scrollTop += delta;
    };

    sidebarList.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      sidebarList.removeEventListener('wheel', handleWheel);
    };
  }, []);

  useEffect(() => {
    const wrapper = document.querySelector('.sidebar-wrapper');
    if (!wrapper) return;
    wrapper.classList.toggle('touch-block', isOpen);
  }, [isOpen]);

  const handleDragStart = (e) => {
    const isTouch = e.type.includes('touch');
    if (!isTouch && e.button !== 0) return;

    isDragging.current = true;
    startY.current = isTouch ? e.touches[0].clientY : e.clientY;
    scrollTop.current = sidebarListRef.current.scrollTop;
    velocity.current = 0;
    lastY.current = startY.current;

    sidebarListRef.current.style.cursor = 'grabbing';
    cancelAnimationFrame(animationFrame.current);

    disableMapInteraction?.();
  };

  const handleDragMove = (e) => {
    if (!isDragging.current) return;
  
    const isTouch = e.type.includes('touch');
    const currentY = isTouch ? e.touches[0].clientY : e.clientY;
    const deltaY = currentY - lastY.current;
  
    const speedMultiplier = 3; // ощущение кручения как колесо
    sidebarListRef.current.scrollTop -= deltaY * speedMultiplier;
  
    velocity.current = deltaY * speedMultiplier;
    lastY.current = currentY;
    e.preventDefault();
  };
  
  

  const handleDragEnd = () => {
    if (!isDragging.current) return;

    isDragging.current = false;
    sidebarListRef.current.style.cursor = 'grab';

    if (Math.abs(velocity.current) > 0.5) {
      animationFrame.current = requestAnimationFrame(animateInertia);
    }

    enableMapInteraction?.();
  };

  const animateInertia = () => {
  if (Math.abs(velocity.current) < 0.3) return;

  sidebarListRef.current.scrollTop -= velocity.current;
  velocity.current *= 0.95; // меньшее уменьшение — дольше крутится

  animationFrame.current = requestAnimationFrame(animateInertia);
};


  useEffect(() => {
    const onMouseMove = (e) => isDragging.current && handleDragMove(e);
    const onMouseUp = () => isDragging.current && handleDragEnd();

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return (
    <div className="sidebar-wrapper">
      <button
        className={`sidebar__toggle ${!isOpen ? 'moved' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={`sidebar_toggleicon ${isOpen ? 'rotated' : ''}`}></div>
      </button>

      <div className={`sidebar ${!isOpen ? 'closed' : ''}`} ref={sidebarRef}>
        <h3 className="sidebar__title">
          {lang === 'ua' ? 'Відділення' : 'Subdivisions'}
        </h3>
        <input
          type="text"
          className="sidebar__input"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={lang === 'ua' ? 'Знайти відділ' : 'Find subdivision'}
          aria-label="Search subdivisions"
        />
        <div className="sidebar__line"></div>
        <ul
          className="sidebar__list"
          ref={sidebarListRef}
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
          style={{
            touchAction: 'auto',
            WebkitOverflowScrolling: 'touch',
            cursor: isDragging.current ? 'grabbing' : 'grab'
          }}
        >
          {filteredMarkers.map(marker => (
            <li
              key={marker.id}
              className="sidebar__item"
              onClick={() => handleZoom(marker.lat, marker.lng)}
            >
              <Image
                src={`http://drive.google.com/uc?export=view&id=${marker.path}`}
                width={45}
                height={45}
                alt="icon"
                className="sidebar__image"
              />
              <span className="sidebar__text">
                {marker.title.length > 33
                  ? marker.title.slice(0, 33) + '...'
                  : marker.title}
              </span>
            </li>
          ))}
        </ul>
        <div className="sidebar__line"></div>
      </div>
    </div>
  );
};

export default SidebarSearch;
