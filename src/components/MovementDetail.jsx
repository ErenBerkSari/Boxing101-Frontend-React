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

          {/* Kapak Resmi Yükleme */}
          <div className="mt-3 mb-4">
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Kapak Resmi
            </Typography>
            {(previewUrls.cover || movement.movementImage) && (
              <div className="my-2">
                <img
                  src={previewUrls.cover || movement.movementImage}
                  alt="Kapak Resmi"
                  className="img-fluid rounded"
                  style={{ maxHeight: "200px" }}
                />
              </div>
            )}
            <input
              type="file"
              className="form-control mt-2"
              accept="image/*"
              onChange={handleCoverUpload}
            />
          </div>

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
            disabled={isSaving}
            fullWidth
            sx={{
              mt: 3,
              borderRadius: "8px",
              fontWeight: "bold",
              py: 1.5,
            }}
          >
            {isSaving ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default MovementDetail;
