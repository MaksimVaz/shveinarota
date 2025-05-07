import Image from "next/image";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import "$style/Footer.css"
import "$style/FooterColors.css"
import { useLang } from "./Context/LangContext";
import { useEffect, useState } from "react";
import { getData } from "api";
import { Button } from "react-bootstrap";
import { useScrollbarWidth } from "$hooks/useScrollbarWidth";

const Footer = () => {
	const [mediaLinks, setMediaLinks] = useState([]);
	const [categories, setCategories] = useState([]);
	const { lang } = useLang();

	const scrollbarWidth = useScrollbarWidth();

	// Функція для стабілазіцї попапа
	function openPopup() {
		document.body.classList.add("popup-active");
		document.querySelector(".wrapper").style.paddingRight = scrollbarWidth + "px";
		document.querySelector(".header").style.paddingRight = scrollbarWidth + "px";
	}

	useEffect(() => {
		getData("medialinks", setMediaLinks)

		getData("categories/all", setCategories)
	}, [])

	const pathname = usePathname();
	
	let colorClass = '';
	if (pathname.startsWith('/about')) colorClass = 'footer--about';
	else if (pathname.startsWith('/guides')) colorClass = 'footer--guides';
	else colorClass = 'footer--default';

	return (
		<footer className={`footer ${colorClass}`}>
			<div className="_background"></div>
			<div className="footer__wrapper">
				<div className="footer__container">
					<div className="footer__title">
						<Image
							src="/images/headerlogo.png"
							alt="logo"
							width={220}
							height={220}
							className="footer_title_logo"
						/>
						{lang == "ua" ? "Швейна рота" : "Shveina rota"}
					</div>
					<div className="footer__columns">
						<div className="footer__column column-footer">
							<div className="column-footer__title">{lang == "ua" ? "Соц мережі" : "Social media"}</div>
							<div className="column-footer__body">
								{mediaLinks.map(link =>
									<div key={link.id} className="column-footer__row">
										<Link target="_blank" className="column-footer__link" href={link.url}>
											<Image
												src={'http://drive.google.com/uc?export=view&id=' + link.path}
												alt="logo"
												width={35}
												height={35}
												className="footer__icons"
											/>
											{link.title}
										</Link>
									</div>
								)}
							</div>
						</div>
						<div className="footer__column column-footer">
							<div className="column-footer__title">{lang == "ua" ? "Категорії одягу" : "Categories"}</div>
							<div className="column-footer__body">
								{categories.length > 0 &&
									<>
										{categories.map(cat =>
											<div key={cat.id}>
												{cat.subcategories.length > 0 &&
													<div className="column-footer__row">
														<Link className="column-footer__link" href={`/guides/${cat.subcategories[0].subcategory.toLowerCase()}/${cat.subcategories[0].id}`}>
															{lang == "ua" ? <>{cat.category}</> : <>{cat.category_en}</>}
														</Link>
													</div>
												}
											</div>
										)}
									</>
								}
							</div>
						</div>
						<div className="footer__column column-footer">
							<div className="column-footer__title">{lang == "ua" ? "Спільнота" : "Community"}</div>
							<div className="column-footer__body">
								<div className="column-footer__row">
									<Link className="column-footer__link" href="/guides">
										{lang == "ua" ? "Навчальні матеріали" : "Training center"}
									</Link>
								</div>
								<div className="column-footer__row">
									<Link className="column-footer__link" href="/about">
										{lang == "ua" ? "Про нас" : "About us"}
									</Link>
								</div>
								<div className="column-footer__row">
									<Link className="column-footer__link" href="/questions">
										{lang == "ua" ? "Відповіді на питання" : "Answers to questions"}
									</Link>
								</div>
								<div className="column-footer__row">
									<Button onClick={openPopup} className="column-footer__link">
										{lang == "ua" ? "Підтримати донатом" : "Support with a donation"}
									</Button>
								</div>
								<div className="column-footer__row">
									<Link className="column-footer__link" href="/dashboard">
										{lang == "ua" ? "Вхід для адміністрації" : "Login for administration"}
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;