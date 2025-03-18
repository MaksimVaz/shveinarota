"use client";
import "./About_text.css";
import Link from "next/link";
import Image from "next/image";

const AboutTextSection = () => {
  return (
    <div>
      <div className="About_text_box">
        <div className="About_text_left">
        <h1>Історія роти</h1>
        <div className="About_Left_column"></div>
        <p className="about-text">
          Ми - Марина Пальченко та Ксенія Самойлич, засновниці “Швейної роти”, яка пошила 100 000+ одиниць адаптивного
          одягу для поранених захисників у 90+ госпіталів України та об’єднала навколо себе 700+ волонтерів в усіх
          частинах світу.
          <br />
          <br />
          28-го лютого 2022 року принесли в звичайний офіс дніпровської ІТ-компанії власні швейні машинки і оверлоки та
          запустили <span className="highlight">“Швейну роту”</span>, аби робити балаклави та термобілизну, яку
          безкоштовно роздавали Захисникам. Рекорд - 498 балаклав за день!
          <br />
          <br />
          А у травні прийшов запит із госпіталю на <span className="highlight">“кіберодяг”</span> - це спеціальний
          адаптивний одяг на липучках/кнопках, який швидко одягається, не травмує і не вимагає піднімати руки/ноги
          пораненому воїнові.
          <br />
          <br />
          Так, з часом навколо “Швейної роти” зібралась крута команда дуже активних і талановитих майстринь і майстрів
          зі всієї України.
          <br />
          <br />
          Майстрині ініціативи знімають детальні покрокові відео майстер-класи з пошиття всіх виробів та оцифровані
          лекала, аби навіть новачки могли долучатись до ініціативи з будь-якого міста. Саме вони опубліковані в{" "}
          <Link className="about-link" style={{ color: "#4682B4" }} href={"/guides"}>
            “Навчальний центр”
          </Link>
          .
        </p>
        </div>
        <div className="About_text_right">
        <div className="About_text_right_top">
          <Link href="/" className="home-button">
          <div className="About_home_icon">
              <Image
                  src="/images/about/icons/home.png"
                  width={250}
                  height={250}
                  alt="Home"
                  
              />
          </div>
          </Link>

          <Link href="/guides" className="guides-button">
              <div className="About_guide_icon">
                  <Image
                      src="/images/about/icons/guides.png"
                      width={250}
                      height={250}
                      alt="Guides"
                      priority
                  />
              </div>
          </Link>
        </div>
          
        <div className="About_text_right_bot">
          <div className="About_right_column"></div>
          <h1>Цікаве</h1>
        </div>
        </div>
      </div>
      
    </div>
  );
};

export default AboutTextSection;
