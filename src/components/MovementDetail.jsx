import React, { useEffect, useState } from "react";
import "../css/movementDetail.css";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  clearMovementState,
  getMovement,
  updateMovement,
} from "../redux/slices/movementSlice";
import MovementEditModal from "./MovementEditModal";

function MovementDetail() {
  const { movementId } = useParams();
  const dispatch = useDispatch();
  const { movement, isLoading } = useSelector((state) => state.movement);
  const [isModalOpen, setModalOpen] = useState(false);

  const handleSave = (updatedMovement) => {
    console.log("Kaydedilen veri:", updatedMovement);
    setModalOpen(false);
    dispatch(updateMovement(updatedMovement));
  };

  useEffect(() => {
    if (movementId) {
      dispatch(getMovement(movementId));
    }
    return () => {
      dispatch(clearMovementState());
      console.log("Cleared");
    };
  }, [dispatch, movementId]);

  if (isLoading) {
    return "Yükleniyor, lütfen bekleyiniz.";
  }

  if (!movement) {
    return <div>Movement not found</div>;
  }

  // İçerik öğesini render etmek için helper fonksiyon
  const renderContentItem = (item, index) => {
    // Eğer içerik öğesinde doğrudan url varsa, onu kullan
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
        <MovementEditModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          movement={movement}
          onSave={handleSave}
        />
      </section>
    </div>
  );
}

export default MovementDetail;
