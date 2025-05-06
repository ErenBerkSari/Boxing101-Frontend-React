import React, { useEffect, useState } from "react";
import "../css/movementDetail.css";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  clearMovementState,
  getMovement,
  updateMovement,
} from "../redux/slices/movementSlice";
import EditIcon from "@mui/icons-material/Edit";
import {
  Modal,
  Box,
  Button,
  TextField,
  IconButton,
  Typography,
} from "@mui/material";

function MovementDetail() {
  const { movementId } = useParams();
  const dispatch = useDispatch();
  const { movement, isLoading } = useSelector((state) => state.movement);
  const { user, authIsLoading } = useSelector((state) => state.auth);

  const [isModalOpen, setModalOpen] = useState(false);
  const [open, setOpen] = useState(false);

  // Düzenleme için state'ler
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [content, setContent] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [previewUrls, setPreviewUrls] = useState({});

  // Düzenleme modalı açıldığında movement verilerini state'e yükle
  useEffect(() => {
    if (movement) {
      setName(movement.movementName || "");
      setDesc(movement.movementDesc || "");
      setContent(movement.movementContent || []);
    }
  }, [movement, open]);

  const handleSave = () => {
    // Güncellenmiş hareket verisi
    const updatedMovement = {
      ...movement,
      movementName: name,
      movementDesc: desc,
      movementContent: content,
    };

    console.log("Kaydedilen veri:", updatedMovement);
    setOpen(false);
    dispatch(updateMovement(updatedMovement));
  };

  const handleOpen = () => {
    setOpen(true);
    // Mevcut içeriği düzenleme state'ine yükle
    if (movement) {
      setName(movement.movementName || "");
      setDesc(movement.movementDesc || "");
      setContent([...movement.movementContent] || []);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setImageFile(null);
    setVideoFile(null);
    setPreviewUrls({});
  };

  // İçerik öğesini değiştirme fonksiyonu
  const handleContentChange = (index, key, value) => {
    const updatedContent = [...content];
    updatedContent[index] = {
      ...updatedContent[index],
      [key]: value,
    };
    setContent(updatedContent);
  };

  // İçerik silme fonksiyonu
  const handleDeleteContent = (index) => {
    const updatedContent = [...content];
    updatedContent.splice(index, 1);
    setContent(updatedContent);
  };

  // Yeni içerik öğesi ekleme fonksiyonu
  const handleAddContent = (type) => {
    const newContent = {
      type: type,
      value: type === "text" ? "" : null,
      url: type !== "text" ? null : undefined,
    };
    setContent([...content, newContent]);
  };

  // Dosya yükleme işleyicisi
  const handleFileUpload = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const contentType = content[index].type;
    if (
      (contentType === "image" && !file.type.startsWith("image/")) ||
      (contentType === "video" && !file.type.startsWith("video/"))
    ) {
      alert(
        `Lütfen geçerli bir ${
          contentType === "image" ? "resim" : "video"
        } dosyası seçin!`
      );
      return;
    }

    // Dosyadan URL oluştur (önizleme için)
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrls((prev) => ({
      ...prev,
      [index]: fileUrl,
    }));

    // Gerçek uygulamada burada dosya upload API'si çağrılır
    // Şimdilik dosyayı simüle edelim
    const updatedContent = [...content];
    updatedContent[index] = {
      ...updatedContent[index],
      file: file, // Gerçek dosyayı saklayalım
      url: fileUrl, // Önizleme için URL
      name: file.name, // Dosya adını saklayalım
      fileId: `temp-${Date.now()}`, // Geçici bir ID
    };
    setContent(updatedContent);
  };

  useEffect(() => {
    if (movementId) {
      dispatch(getMovement(movementId));
    }
    return () => {
      dispatch(clearMovementState());
      // Preview URL'lerini temizle
      Object.values(previewUrls).forEach((url) => URL.revokeObjectURL(url));
      console.log("Cleared");
    };
  }, [dispatch, movementId]);

  if (isLoading || authIsLoading) {
    return "Yükleniyor, lütfen bekleyiniz.";
  }

  if (!movement) {
    return <div>Movement not found</div>;
  }

  // İçerik öğesini render etmek için helper fonksiyon
  const renderContentItem = (item, index) => {
    if (item.type === "text") {
      return <p key={index}>{item.value}</p>;
    } else if (item.type === "image") {
      // Eğer doğrudan URL varsa, onu kullan
      if (item.url) {
        return (
          <div key={index} className="content-image-container my-4">
            <img
              src={item.url}
              alt={`${movement.movementName} - Görsel ${index + 1}`}
              className="topics-detail-block-image img-fluid"
            />
          </div>
        );
      }

      // URL yoksa, media array'inden fileId veya originalName ile eşleşen medyayı bul
      const imageMedia = movement.media?.find(
        (media) =>
          media.type === "image" &&
          (media.fileId === item.fileId || media.originalName === item.name)
      );

      if (imageMedia) {
        return (
          <div key={index} className="content-image-container my-4">
            <img
              src={imageMedia.url}
              alt={`${movement.movementName} - Görsel ${index + 1}`}
              className="topics-detail-block-image img-fluid"
            />
          </div>
        );
      }

      // Bulunamazsa hata mesajı göster
      return (
        <div key={index} className="alert alert-warning my-2">
          Görsel bulunamadı: {item.name || `Görsel ${index + 1}`}
        </div>
      );
    } else if (item.type === "video") {
      // Eğer doğrudan URL varsa, onu kullan
      if (item.url) {
        return (
          <div key={index} className="content-video-container my-4">
            <video
              src={item.url}
              controls
              className="topics-detail-block-video img-fluid"
            />
          </div>
        );
      }

      // URL yoksa, media array'inden fileId veya originalName ile eşleşen medyayı bul
      const videoMedia = movement.media?.find(
        (media) =>
          media.type === "video" &&
          (media.fileId === item.fileId || media.originalName === item.name)
      );

      if (videoMedia) {
        return (
          <div key={index} className="content-video-container my-4">
            <video
              src={videoMedia.url}
              controls
              className="topics-detail-block-video img-fluid"
            />
          </div>
        );
      }

      // Bulunamazsa hata mesajı göster
      return (
        <div key={index} className="alert alert-warning my-2">
          Video bulunamadı: {item.name || `Video ${index + 1}`}
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <h3 className="mb-4 d-flex align-items-center gap-2">
        {movement.movementName}
        <button
          style={{ cursor: "pointer", color: "#007bff" }}
          onClick={() => setModalOpen(true)}
          title="Düzenle"
        >
          Düzenle
        </button>
      </h3>
      <section
        className="topics-detail-section section-padding"
        id="topics-detail"
      >
        {1 && (
          <EditIcon
            onClick={handleOpen}
            style={{
              cursor: "pointer",
              position: "absolute",
              top: "10px",
              left: "10px",
              zIndex: 10,
              transform: "scale(1.5)",
            }}
          />
        )}
        <div className="container">
          <div className="row">
            <div className="col-lg-8 col-12 m-auto">
              {/* Kapak Görseli */}
              {movement.movementImage && (
                <div className="mb-4">
                  <img
                    src={movement.movementImage}
                    alt={`${movement.movementName} - Kapak`}
                    className="img-fluid w-100 rounded"
                  />
                </div>
              )}

              {/* Başlık ve Açıklama */}
              <h3 className="mb-4">{movement.movementName}</h3>
              {movement.movementDesc && <p>{movement.movementDesc}</p>}

              {/* İçerik Öğeleri */}
              {movement.movementContent &&
              Array.isArray(movement.movementContent) ? (
                <div className="movement-content">
                  {movement.movementContent.map((item, index) =>
                    renderContentItem(item, index)
                  )}
                </div>
              ) : (
                <p>Bu hareket için içerik bulunmamaktadır.</p>
              )}
            </div>
          </div>
        </div>
      </section>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            margin: "auto",
            height: "fit-content",
            width: "90%",
            maxWidth: 500,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 3,
            borderRadius: "12px", // Daha yumuşak köşeler
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }}>
            {movement.movementName} Bölümünü Düzenle
          </Typography>

          <TextField
            fullWidth
            label="Başlık"
            name="heroTitle"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            sx={{ borderRadius: "8px" }}
          />
          <TextField
            fullWidth
            label="Açıklama"
            name="heroDesc"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            margin="normal"
            multiline
            rows={3}
            sx={{ borderRadius: "8px" }}
          />
          {/* Dinamik İçerik */}

          <h5 className="mt-4">İçerik Düzenle</h5>
          {content.map((item, index) => (
            <div key={index} className="border rounded p-3 mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <p className="mb-0">
                  <strong>Tür:</strong>{" "}
                  {item.type === "text"
                    ? "Metin"
                    : item.type === "image"
                    ? "Görsel"
                    : "Video"}
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
                  value={item.value || ""}
                  onChange={(e) =>
                    handleContentChange(index, "value", e.target.value)
                  }
                />
              )}

              {(item.type === "image" || item.type === "video") && (
                <>
                  {/* Önizleme alanı */}
                  {(previewUrls[index] || item.url) && (
                    <div className="my-2">
                      {item.type === "image" ? (
                        <img
                          src={previewUrls[index] || item.url}
                          alt="Görsel"
                          className="img-fluid"
                          style={{ maxHeight: "200px" }}
                        />
                      ) : (
                        <video
                          src={previewUrls[index] || item.url}
                          controls
                          className="img-fluid"
                          style={{ maxHeight: "200px" }}
                        />
                      )}
                    </div>
                  )}

                  {/* Dosya yükleme alanı */}
                  <div className="mt-2">
                    <label className="form-label">
                      {item.type === "image" ? "Görsel" : "Video"} Seç:
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      accept={item.type === "image" ? "image/*" : "video/*"}
                      onChange={(e) => handleFileUpload(index, e)}
                    />
                  </div>
                </>
              )}
            </div>
          ))}

          {/* Yeni İçerik Ekleme Butonları */}
          <div className="d-flex justify-content-center gap-2 my-3">
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleAddContent("text")}
            >
              + Metin Ekle
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => handleAddContent("image")}
            >
              + Görsel Ekle
            </Button>
            <Button
              variant="outlined"
              color="info"
              onClick={() => handleAddContent("video")}
            >
              + Video Ekle
            </Button>
          </div>

          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            fullWidth
            sx={{
              mt: 3,
              borderRadius: "8px",
              fontWeight: "bold",
              py: 1.5, // Butonu biraz daha büyük yap
            }}
          >
            Kaydet
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default MovementDetail;
