"use client";

import '$style/globals.css';
import Header from '$component/Header';
import { usePathname } from 'next/navigation';
import Footer from '$component/Footer';
import { LangProvider } from '$component/Context/LangContext';
import { useEffect, useRef } from 'react';
import PopupLink from '$component/en/ConBlockEn/PopupLink/PopupLink';

export default function RootLayout({ children }) {
  const path = usePathname();
  const previousPath = useRef(path);
  const popup = useRef();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [path]);

  useEffect(() => {
    if (previousPath.current.startsWith("/dashboard") && !path.startsWith("/dashboard")) {
      window.location.reload();
    }
    previousPath.current = path;
  }, [path]);

  function closePopup() {
    document.body.classList.remove("popup-active");
    document.querySelector(".wrapper").style.paddingRight = "0px";
    document.querySelector(".header").style.paddingRight = "0px";
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("click", (event) => {
        if (event.target === popup.current) {
          document.body.classList.remove("popup-active");
          document.querySelector(".wrapper").style.paddingRight = "0px";
          document.querySelector(".header").style.paddingRight = "0px";
        }
      });
    }
  }, []);

  return (
    <html lang="uk">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <link rel="icon" href="/favicon.ico"/>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Neucha&family=Unbounded:wght@200..900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <LangProvider>
          <div ref={popup} id="popup" className="popup">
            <div className="popup-content">
              <span onClick={closePopup} id="closeBtn" className="popup__close">
                &times;
              </span>
              <PopupLink href="https://www.paypal.com" text="marishka.polo@gmail.com" img="/images/paypal.jpg" />
              <PopupLink href="https://send.monobank.ua/jar/5VV7zhDJGY" text="5375 4112 0381 7304" img="/images/mono.jpg" />
            </div>
          </div>
          <div className="wrapper">
            {!path.includes('dashboard') && <Header />}
            {children}
            {!path.includes('dashboard')  && !path.includes('auth') && <Footer />}
          </div>
        </LangProvider>
      </body>
    </html>
  );
}