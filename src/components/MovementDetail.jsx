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
import Header from "./Header";
import Loader from "./Loader";
import VideoComponent from './VideoComponent';

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
  const [contentFiles, setContentFiles] = useState({}); // Dosyaları saklamak için
  const [coverFile, setCoverFile] = useState(null); // Kapak resmi için
  const [previewUrls, setPreviewUrls] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Düzenleme modalı açıldığında movement verilerini state'e yükle
  useEffect(() => {
    if (movement) {
      setName(movement.movementName || "");
      setDesc(movement.movementDesc || "");
      setContent(movement.movementContent || []);
    }
  }, [movement, open]);

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // FormData oluştur
      const formData = new FormData();

      // Temel bilgileri ekle
      formData.append("movementName", name);
      formData.append("movementDesc", desc);

      // Kapak resmi varsa ekle
      if (coverFile) {
        formData.append("cover", coverFile);
      }

      // İçerik dosyalarını ekle
      Object.keys(contentFiles).forEach((key) => {
        if (contentFiles[key]) {
          formData.append("files", contentFiles[key]);
        }
      });

      // Güncellenmiş içerik yapısını hazırla
      const updatedContent = content.map((item) => {
        if (item.type === "text") {
          return item;
        } else {
          // Eğer yeni bir dosya yüklenmişse
          if (contentFiles[item.contentId]) {
            return {
              ...item,
              name: contentFiles[item.contentId].name,
              fileId: item.contentId,
            };
          }
          // Eğer mevcut bir dosya ise
          return item;
        }
      });

      // İçeriği JSON formatında ekle
      formData.append("movementContent", JSON.stringify(updatedContent));

      // Redux action ile gönder (updateMovement fonksiyonunu FormData destekli hale getirmeniz gerekecek)
      await dispatch(updateMovement({ id: movementId, formData }));

      setOpen(false);

      // State'leri temizle
      setContentFiles({});
      setCoverFile(null);

      // Önizleme URL'lerini temizle
      Object.values(previewUrls).forEach((url) => URL.revokeObjectURL(url));
      setPreviewUrls({});
    } catch (error) {
      console.error("Kaydetme hatası:", error);
      alert("Kaydetme sırasında bir hata oluştu!");
    } finally {
      setIsSaving(false);
    }
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
    setContentFiles({});
    setCoverFile(null);

    // Önizleme URL'lerini temizle
    Object.values(previewUrls).forEach((url) => URL.revokeObjectURL(url));
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

    // Eğer silinen öğe medya dosyasıysa ve contentId varsa contentFiles'dan da sil
    const item = updatedContent[index];
    if (
      item.type !== "text" &&
      item.contentId &&
      contentFiles[item.contentId]
    ) {
      const newContentFiles = { ...contentFiles };
      delete newContentFiles[item.contentId];
      setContentFiles(newContentFiles);

      // Önizleme URL'sini de temizle
      if (previewUrls[index]) {
        URL.revokeObjectURL(previewUrls[index]);
        const newPreviewUrls = { ...previewUrls };
        delete newPreviewUrls[index];
        setPreviewUrls(newPreviewUrls);
      }
    }

    updatedContent.splice(index, 1);
    setContent(updatedContent);
  };

  // Yeni içerik öğesi ekleme fonksiyonu
  const handleAddContent = (type) => {
    const contentId = `${type}-${Date.now()}`;
    const newContent = {
      type: type,
      value: type === "text" ? "" : null,
      contentId: contentId,
    };
    setContent([...content, newContent]);
  };

  // Kapak resmi yükleme işleyicisi
  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Lütfen geçerli bir resim dosyası seçin!");
      return;
    }

    // Dosyayı sakla
    setCoverFile(file);

    // Önizleme URL'i oluştur
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrls((prev) => ({
      ...prev,
      cover: fileUrl,
    }));
  };

  // Dosya yükleme işleyicisi
  const handleFileUpload = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const contentItem = content[index];
    if (
      (contentItem.type === "image" && !file.type.startsWith("image/")) ||
      (contentItem.type === "video" && !file.type.startsWith("video/"))
    ) {
      alert(
        `Lütfen geçerli bir ${
          contentItem.type === "image" ? "resim" : "video"
        } dosyası seçin!`
      );
      return;
    }

    // Eğer contentId yoksa oluştur
    if (!contentItem.contentId) {
      const contentId = `${contentItem.type}-${Date.now()}`;
      const updatedContent = [...content];
      updatedContent[index] = {
        ...updatedContent[index],
        contentId: contentId,
      };
      setContent(updatedContent);

      // Dosyayı contentFiles'a ekle
      setContentFiles((prev) => ({
        ...prev,
        [contentId]: file,
      }));
    } else {
      // Dosyayı contentFiles'a ekle
      setContentFiles((prev) => ({
        ...prev,
        [contentItem.contentId]: file,
      }));
    }

    // Önizleme URL'i oluştur
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrls((prev) => ({
      ...prev,
      [index]: fileUrl,
    }));
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
    return (
      <div>
        <Loader />
        <div>Loading, please wait...</div>
      </div>
    );
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
      // URL'yi bulmak için bir değişken
      let finalVideoUrl = null;

      // Önce doğrudan 'url' alanını kontrol et
      if (item.url) {
        finalVideoUrl = item.url;
      } else {
        // 'url' yoksa, media dizisinden eşleşen medyayı bul
      const videoMedia = movement.media?.find(
        (media) =>
          media.type === "video" &&
          (media.fileId === item.fileId || media.originalName === item.name)
      );
      if (videoMedia) {
          finalVideoUrl = videoMedia.url;
        }
      }

      // Eğer bir URL bulunduysa, VideoComponent'i render et
      if (finalVideoUrl) {
        return (
          <div key={index} className="content-video-container my-4">
            <VideoComponent videoUrl={finalVideoUrl} />
          </div>
        );
      }

      // Hiçbir URL bulunamazsa hata mesajı göster
      return (
        <div key={index} className="alert alert-warning my-2">
          Video bulunamadı: {item.name || `Video ${index + 1}`}
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <Header />
      <div style={{ marginTop: "50px" }} className="movement-detail-container">
        <div
          id="header-main"
          style={{
            width: "100vw",
            backgroundColor: "aliceblue",
            paddingTop: "32px",
            paddingBottom: "32px",
            marginLeft: "calc(50% - 50vw)",
            marginRight: "calc(50% - 50vw)",
          }}
        >
          <div
            className="movement-header-card"
            style={{ maxWidth: "900px", margin: "0 auto" }}
          >
            {user?.role === "admin" && (
              <button className="edit-button" onClick={handleOpen}>
                <EditIcon style={{ marginRight: 6 }} /> Düzenle
              </button>
            )}
            {/* Kapak Görseli */}
            {movement.movementImage && (
              <img
                src={movement.movementImage}
                alt={`${movement.movementName} - Kapak`}
                className="movement-cover-image"
              />
            )}
            <h2 className="movement-title">{movement.movementName}</h2>
            {movement.movementDesc && (
              <p className="movement-description">{movement.movementDesc}</p>
            )}
          </div>
        </div>

        {/* İçerik Öğeleri */}
        {movement.movementContent && Array.isArray(movement.movementContent) ? (
          <div className="movement-content">
            {movement.movementContent.map((item, index) =>
              renderContentItem(item, index)
            )}
          </div>
        ) : (
          <p>Bu hareket için içerik bulunmamaktadır.</p>
        )}
        <Modal open={open} onClose={handleClose}>
          <Box
            className="modal-content"
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
              borderRadius: "12px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <Typography
              variant="h6"
              className="modal-title"
              sx={{ textAlign: "center", mb: 2 }}
            >
              {movement.movementName} Bölümünü Düzenle
            </Typography>

            <div className="form-group">
              <label className="form-label">Başlık</label>
              <TextField
                fullWidth
                name="heroTitle"
                value={name}
                onChange={(e) => setName(e.target.value)}
                margin="normal"
                sx={{ borderRadius: "8px" }}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Açıklama</label>
              <TextField
                fullWidth
                name="heroDesc"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                margin="normal"
                multiline
                rows={3}
                sx={{ borderRadius: "8px" }}
              />
            </div>

            {/* Kapak Resmi Yükleme */}
            <div className="form-group">
              <label className="form-label">Kapak Resmi</label>
              {(previewUrls.cover || movement.movementImage) && (
                <img
                  src={previewUrls.cover || movement.movementImage}
                  alt="Kapak Resmi"
                  className="preview-image"
                />
              )}
              <input
                type="file"
                className="form-control mt-2"
                accept="image/*"
                onChange={handleCoverUpload}
              />
            </div>

            {/* Dinamik İçerik */}
            <h5 className="modal-title mt-4">İçerik Düzenle</h5>
            {content.map((item, index) => (
              <div key={index} className="content-item">
                <div className="content-item-header">
                  <span className="content-type-badge">
                    {item.type === "text"
                      ? "Metin"
                      : item.type === "image"
                      ? "Görsel"
                      : "Video"}
                  </span>
                  <button
                    className="delete-content-btn"
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
                    {(previewUrls[index] || item.url) && (
                      <div className="my-2">
                        {item.type === "image" ? (
                          <img
                            src={previewUrls[index] || item.url}
                            alt="Görsel"
                            className="preview-image"
                          />
                        ) : (
                          <VideoComponent videoUrl={previewUrls[index] || item.url} />
                        )}
                      </div>
                    )}
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
            <div className="add-content-buttons">
              <button
                className="add-content-btn text"
                onClick={() => handleAddContent("text")}
              >
                + Metin Ekle
              </button>
              <button
                className="add-content-btn image"
                onClick={() => handleAddContent("image")}
              >
                + Görsel Ekle
              </button>
              <button
                className="add-content-btn video"
                onClick={() => handleAddContent("video")}
              >
                + Video Ekle
              </button>
            </div>

            <button
              className="save-button"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </Box>
        </Modal>
      </div>
    </>
  );
}

export default MovementDetail;
