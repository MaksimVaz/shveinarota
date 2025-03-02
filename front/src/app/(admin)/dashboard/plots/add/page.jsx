"use client";

import { useState } from "react";
import "$style/bootstrap.min.css";
import "$style/admin/Admin.css";
import dynamic from 'next/dynamic';
const Bootstrap = dynamic(() => import('$component/guides/Bootstrap/Bootstrap'), { ssr: false });
import Alert from "$component/dashboard/Alert/Alert";
import { postData } from "api";
import FileInput from "$component/dashboard/FileInput/FileInput";
import ImageInput from "$component/dashboard/ImageInput/ImageInput";

export default function ChangePage() {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [title_en, setTitleEn] = useState("");
  const [file, setFile] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Будь ласка, оберіть файл");
      return;
    }

    if (!title || !title_en) {
      alert("Будь ласка, заповніть всі поля");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("path", file);
    formData.append("url", url);
    formData.append("title_en", title_en);

    postData("plots", formData, setShowAlert)
  };


  return (
    <main className="main">
      {showAlert && (
        <Alert
          message="Слайд був доданий успішно!"
          onClose={() => setShowAlert(false)}
        />
      )}
      <div className="main__form container-lg mt-5">
        <h1 className="form-title admin-title mb-4">Додати сюжет</h1>
        <form className="form needs-validation" onSubmit={handleSubmit}>
          <div className="ua">
            <ImageInput placeholder="Посиланн на логотип каналу з Google Drive" image={file} setImage={setFile} />
            <div className="input-group mb-3">
              <span className="input-group-text" id="inputGroup-sizing-default">Заголовок:</span>
              <input
                required
                type="text"
                className="form-control"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-default"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="en">
              <div className="input-group mb-3">
                <span className="input-group-text" id="inputGroup-sizing-default">Назва каналу:</span>
                <input
                  required
                  type="text"
                  className="form-control"
                  aria-label="Sizing example input"
                  aria-describedby="inputGroup-sizing-default"
                  value={title_en}
                  onChange={(e) => setTitleEn(e.target.value)}
                />
              </div>
            </div>
            <div className="input-group mb-3">
              <span className="input-group-text" id="inputGroup-sizing-default">Посилання на відео</span>
              <input
                required
                type="text"
                className="form-control"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-default"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Save</button>
        </form>
      </div>
      <Bootstrap />
    </main>
  );
}
