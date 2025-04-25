'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useLang } from '$component/Context/LangContext';
import './SidebarSearch.css';

const SidebarSearch = ({ markers, handleZoom, disableMapInteraction, enableMapInteraction }) => {
	const [query, setQuery] = useState('');
	const { lang } = useLang();
	const [isOpen, setIsOpen] = useState(true);
	const [isSidebarBeingDragged, setIsSidebarBeingDragged] = useState(false);

	const filteredMarkers = markers.filter(marker =>
		marker.title.toLowerCase().includes(query.toLowerCase())
	);

	const sidebarListRef = useRef(null);
	const startYRef = useRef(null);
	const scrollTopRef = useRef(0);

	// Колесо миші
	const handleWheel = (e) => {
		e.stopPropagation();
		e.preventDefault();
		if (sidebarListRef.current) {
			sidebarListRef.current.scrollTop += e.deltaY;
		}
	};

	const handleStart = (y) => {
		startYRef.current = y;
		scrollTopRef.current = sidebarListRef.current.scrollTop;
	};

	const handleMove = (y) => {
		if (startYRef.current === null) return;
		const delta = startYRef.current - y;
		sidebarListRef.current.scrollTop = scrollTopRef.current + delta;
	};

	const handleTouchStart = (e) => {
		handleStart(e.touches[0].clientY);
		setIsSidebarBeingDragged(true);
		disableMapInteraction?.();
	};

	const handleTouchMove = (e) => {
		e.stopPropagation();
		e.preventDefault();
		handleMove(e.touches[0].clientY);
	};

	const handleTouchEnd = () => {
		startYRef.current = null;
		setIsSidebarBeingDragged(false);
		enableMapInteraction?.();
	};

	const handleMouseDown = (e) => {
		handleStart(e.clientY);
		setIsSidebarBeingDragged(true);
		disableMapInteraction?.();

		const handleMouseMove = (moveEvent) => {
			moveEvent.stopPropagation();
			handleMove(moveEvent.clientY);
		};

		const handleMouseUp = () => {
			startYRef.current = null;
			setIsSidebarBeingDragged(false);
			enableMapInteraction?.();
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
		};

		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
	};

	return (
		<div className="sidebar-wrapper">
			<button
                className={`sidebar__toggle ${!isOpen ? 'moved' : ''}`}  // Добавляем/удаляем класс в зависимости от состояния
                onClick={() => {
                    const nextState = !isOpen;
                    setIsOpen(nextState);
                    nextState ? disableMapInteraction?.() : enableMapInteraction?.();
                }}
            >
                {isOpen ? '<' : '>'}
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
				<div className="sidebar__line"></div>
				<ul
					className="sidebar__list"
					ref={sidebarListRef}
					onWheelCapture={handleWheel}
					onTouchStart={handleTouchStart}
					onTouchMove={handleTouchMove}
					onTouchEnd={handleTouchEnd}
					onMouseDown={handleMouseDown}
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
								{marker.title.length > 40 ? marker.title.slice(0, 40) + '…' : marker.title}
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
