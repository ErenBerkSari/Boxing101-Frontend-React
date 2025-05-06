import React, { useState, useEffect } from "react";

function MovementEditModal({ isOpen, onClose, movement, onSave }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [content, setContent] = useState([]);

  useEffect(() => {
    if (movement) {
      setName(movement.movementName || "");
      setDesc(movement.movementDesc || "");
      setContent(movement.movementContent || []);
    }
  }, [movement]);

  const handleContentChange = (index, key, value) => {
    const updated = [...content];
    updated[index] = { ...updated[index], [key]: value };
    setContent(updated);
  };

  const handleAddContent = (type) => {
    const newItem = { type };
    if (type === "text") {
      newItem.value = "";
    } else {
      newItem.url = "";
    }
    setContent([...content, newItem]);
  };

  const handleDeleteContent = (index) => {
    const updated = content.filter((_, i) => i !== index);
    setContent(updated);
  };

  const handleSave = () => {
    const updatedMovement = {
      ...movement,
      movementName: name,
      movementDesc: desc,
      movementContent: content,
    };
    onSave(updatedMovement);
  };

  if (!isOpen || !movement) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content p-4">
        <button className="btn-close" onClick={onClose}>
          ×
        </button>
        <h4>Hareketi Güncelle</h4>

        <div className="form-group my-2">
          <label>Hareket Adı</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group my-2">
          <label>Açıklama</label>
          <textarea
            className="form-control"
            rows="3"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          ></textarea>
        </div>

        <h5 className="mt-4">İçerik Düzenle</h5>
        {content.map((item, index) => (
          <div key={index} className="border rounded p-3 mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <p className="mb-0">
                <strong>Tür:</strong> {item.type}
              </p>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDeleteContent(index)}
              >
                🗑 Sil
              </button>
            </div>

            {item.type === "text" && (
              <textarea
                className="form-control"
                rows="2"
                value={item.value}
                onChange={(e) =>
                  handleContentChange(index, "value", e.target.value)
                }
              />
            )}

            {(item.type === "image" || item.type === "video") && (
              <>
                {item.url && (
                  <div className="my-2">
                    {item.type === "image" ? (
                      <img src={item.url} alt="Görsel" className="img-fluid" />
                    ) : (
                      <video src={item.url} controls className="img-fluid" />
                    )}
                  </div>
                )}
                <input
                  type="text"
                  className="form-control mt-2"
                  value={item.url || ""}
                  onChange={(e) =>
                    handleContentChange(index, "url", e.target.value)
                  }
                  placeholder={`${
                    item.type === "image" ? "Görsel" : "Video"
                  } URL'si`}
                />
              </>
            )}
          </div>
        ))}

        {/* İçerik ekleme butonları */}
        <div className="my-3">
          <button
            className="btn btn-outline-secondary me-2"
            onClick={() => handleAddContent("text")}
          >
            + Yazı Ekle
          </button>
          <button
            className="btn btn-outline-secondary me-2"
            onClick={() => handleAddContent("image")}
          >
            + Görsel Ekle
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={() => handleAddContent("video")}
          >
            + Video Ekle
          </button>
        </div>

        <button className="btn btn-primary mt-3" onClick={handleSave}>
          Kaydet
        </button>
      </div>
    </div>
  );
}

export default MovementEditModal;
