'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { useLang } from '$component/Context/LangContext';
import './SidebarSearch.css';
import './SidebarButton.css';

const SidebarSearch = ({ markers, handleZoom }) => {
  const { lang } = useLang();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(true);

  const sidebarListRef = useRef(null);
  const filteredMarkers = markers.filter(marker =>
    marker.title.toLowerCase().includes(query.toLowerCase())
  );

  // ✅ Drag-scroll без дерганий (мышь и touch)
  useEffect(() => {
    const el = sidebarListRef.current;
    if (!el) return;
  
    let isDown = false;
    let startY;
    let scrollTop;
  
    const onPointerDown = (e) => {
      e.preventDefault();
      e.stopPropagation();
      isDown = true;
      startY = e.pageY || e.touches?.[0]?.pageY;
      scrollTop = el.scrollTop;
      el.style.cursor = 'grabbing';
    };
  
    const onPointerMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      e.stopPropagation();
      const y = e.pageY || e.touches?.[0]?.pageY;
      const walk = (y - startY);
      el.scrollTop = scrollTop - walk;
    };
  
    const end = () => {
      isDown = false;
      el.style.cursor = 'grab';
    };
  
    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerup', end);
    el.addEventListener('pointerleave', end);
    el.addEventListener('pointercancel', end);
    el.addEventListener('touchend', end);
  
    // 💡 Отключаем прокрутку карты при свайпе по списку
    el.addEventListener('touchmove', (e) => {
      if (isDown) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, { passive: false });
  
    return () => {
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerup', end);
      el.removeEventListener('pointerleave', end);
      el.removeEventListener('pointercancel', end);
      el.removeEventListener('touchend', end);
      el.removeEventListener('touchmove', () => {});
    };
  }, []);
  

  // ✅ Wheel-скролл мышью с отключением карты
  useEffect(() => {
    const sidebarList = sidebarListRef.current;
    if (!sidebarList) return;

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

  return (
    <div className="sidebar-wrapper">
      <button
        className={`sidebar__toggle ${!isOpen ? 'moved' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={`sidebar_toggleicon ${isOpen ? 'rotated' : ''}`} />
      </button>

      <div className={`sidebar ${!isOpen ? 'closed' : ''}`}>
        <h3 className="sidebar__title">
          {lang === 'ua' ? 'Відділення' : 'Subdivisions'}
        </h3>
        <input
          type="text"
          className="sidebar__input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={lang === 'ua' ? 'Знайти відділ' : 'Find subdivision'}
        />
        <div className="sidebar__line" />
        <ul
          ref={sidebarListRef}
          className="sidebar__list"
          style={{
            cursor: 'grab',
            userSelect: 'none',
            WebkitOverflowScrolling: 'touch',
            overflowY: 'auto',
            scrollBehavior: 'smooth',
          }}
        >
          {filteredMarkers.map((marker) => (
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
        <div className="sidebar__line" />
      </div>
    </div>
  );
};

export default SidebarSearch;
