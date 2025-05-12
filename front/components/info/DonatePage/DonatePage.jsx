"use client";

import { useEffect, useState } from "react";
import "./DonatePage.css";

const DonatePage = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [isVisible, setIsVisible] = useState(false); // для анимации

	useEffect(() => {
		const open = () => {
			setIsOpen(true);
			setTimeout(() => setIsVisible(true), 10); // чуть позже применим .show
		};
		window.addEventListener("openDonatePopup", open);
		return () => window.removeEventListener("openDonatePopup", open);
	}, []);

	const closePopup = () => {
		setIsVisible(false); // убираем класс show
		setTimeout(() => setIsOpen(false), 400); // подождем завершения анимации
		document.body.classList.remove("popup-active");
		document.querySelector(".wrapper")?.style.removeProperty("padding-right");
		document.querySelector(".header")?.style.removeProperty("padding-right");
	};

	if (!isOpen) return null;

	return (
		<div className={`donate-overlay ${isVisible ? "show" : ""}`} onClick={closePopup}>
			<div className={`donate-modal ${isVisible ? "show" : ""}`} onClick={(e) => e.stopPropagation()}>
				<div className="donate-left">
					<img src="images/logo-rota.png" alt="Logo" />
				</div>
				<div className="donate-right">
					<h2>Способи підтримки</h2>
					<div className="wrapper_donate_line">
						<div className="donate__line"></div>
					</div>
					<div className="donate-icons">
						<a href="https://send.monobank.ua/jar/5VV7zhDJGY" target="_blank" rel="noopener noreferrer" className="donate-item">
							<img src="https://play-lh.googleusercontent.com/Y2M3HewFpm9bthitkDNaRUe11Llco97qclZh6-cpBJ6FJTfOiGHQM1eZ7eKn-rt8PQ" alt="mono" />
						</a>
						<a href="https://privat24.example.com" target="_blank" rel="noopener noreferrer" className="donate-item">
							<img src="https://upload.wikimedia.org/wikipedia/commons/e/e0/Privat24_Logo.png" alt="privat24" />
						</a>
						<a href="https://www.paypal.com" target="_blank" rel="noopener noreferrer" className="donate-item">
							<img src="https://cdn-icons-png.flaticon.com/512/888/888870.png" alt="paypal" />
						</a>
						<a href="https://mastercard.example.com" target="_blank" rel="noopener noreferrer" className="donate-item">
							<img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" alt="mastercard" />
						</a>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DonatePage;
