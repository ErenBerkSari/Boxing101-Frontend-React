import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createMovement } from "../redux/slices/movementSlice";
import Loader from "./Loader";

function CreateMovement() {
  const dispatch = useDispatch();
  const {  isLoading } = useSelector((state) => state.movement);
  const [movementName, setMovementName] = useState("");
  const [movementDesc, setMovementDesc] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [contentItems, setContentItems] = useState([]); // içerikler: text, image, video

  const handleAddContent = (type) => {
    const newItem =
      type === "text"
        ? { type, value: "" }
        : { type, file: null, preview: null };
    setContentItems([...contentItems, newItem]);
  };

  const handleContentChange = (index, key, value) => {
    const updated = [...contentItems];
    updated[index][key] = value;
    if (key === "file") {
      updated[index]["preview"] = URL.createObjectURL(value);
    }
    setContentItems(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("movementName", movementName);
    formData.append("movementDesc", movementDesc);
    formData.append("cover", imageFile);

    if (imageFile) {
      formData.append("files", imageFile); // kapak görselini de aynı key ile
    }

    const contentData = contentItems.map((item) => {
      if (item.type === "text") {
        return { type: "text", value: item.value };
      } else {
        return {
          type: item.type,
          name: item.file.name,
        };
      }
    });

    formData.append("movementContent", JSON.stringify(contentData));

    // Medya dosyalarını "files" anahtarıyla gönder
    contentItems.forEach((item) => {
      if (item.type !== "text" && item.file) {
        formData.append("files", item.file); // Tüm medya dosyaları için aynı key
      }
    });

    dispatch(createMovement(formData));
  };

  if (isLoading) {
    return (
      <div>
        <Loader />
        <div>Loading, please wait...</div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2>Yeni Hareket Oluştur</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label className="form-label">Hareket Adı</label>
          <input
            type="text"
            className="form-control"
            value={movementName}
            onChange={(e) => setMovementName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Açıklama</label>
          <textarea
            className="form-control"
            value={movementDesc}
            onChange={(e) => setMovementDesc(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Kapak Görseli</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => setImageFile(e.target.files[0])}
            accept="image/*"
          />
        </div>

        <hr />
        <h5>İçerik</h5>
        {contentItems.map((item, index) => (
          <div key={index} className="mb-3">
            {item.type === "text" && (
              <textarea
                className="form-control"
                placeholder="Paragraf yazınız"
                value={item.value}
                onChange={(e) =>
                  handleContentChange(index, "value", e.target.value)
                }
              />
            )}
            {(item.type === "image" || item.type === "video") && (
              <div>
                <input
                  type="file"
                  className="form-control"
                  accept={item.type + "/*"}
                  onChange={(e) =>
                    handleContentChange(index, "file", e.target.files[0])
                  }
                />
                {item.preview && (
                  <>
                    {item.type === "image" ? (
                      <img
                        src={item.preview}
                        alt="preview"
                        style={{ maxWidth: "200px", marginTop: "10px" }}
                      />
                    ) : (
                      <video
                        src={item.preview}
                        controls
                        style={{ maxWidth: "200px", marginTop: "10px" }}
                      />
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        ))}

        <div className="mb-3">
          <button
            type="button"
            className="btn btn-outline-primary me-2"
            onClick={() => handleAddContent("text")}
          >
            + Paragraf
          </button>
          <button
            type="button"
            className="btn btn-outline-success me-2"
            onClick={() => handleAddContent("image")}
          >
            + Görsel
          </button>
          <button
            type="button"
            className="btn btn-outline-warning"
            onClick={() => handleAddContent("video")}
          >
            + Video
          </button>
        </div>

        <button type="submit" className="btn btn-primary">
          Oluştur
        </button>
      </form>
    </div>
  );
}

export default CreateMovement;
