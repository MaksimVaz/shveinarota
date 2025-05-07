import { useEffect, useRef } from "react";
import "./ConBlock.css";
import Link from "next/link";
import { useScrollbarWidth } from "$hooks/useScrollbarWidth";
import PopupLink from "../DonatePage/DonatePage";
import { useLang } from "$component/Context/LangContext";

const ConBlock = () => {
    
    const scrollbarWidth = useScrollbarWidth();
    
    // Открытие окна
    function openPopup() {
        document.body.classList.add("popup-active");
        document.querySelector(".wrapper").style.paddingRight = scrollbarWidth + "px";
        document.querySelector(".header").style.paddingRight = scrollbarWidth + "px";
    }

    return (
        <div className="conboxcontainer">

            <div className="conbox">
                <Link href="/guides" className="left">
                    <h1>Доєднатися до пошиття</h1>
                </Link>
                <div className="column"></div>
                <button onClick={openPopup} id="openBtn1" className="right1">
                    <span>Підтримуй нас Донатом</span>
                </button>
            </div>
        </div>
    );
};

export default ConBlock;
