import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearProgramMessages,
  createProgramByUser,
  getUserCreatedAllPrograms,
} from "../redux/slices/programSlice";
import { getAllMovements } from "../redux/slices/movementSlice";
import { Link } from "react-router-dom";
import "../css/createProgramByUser.css";

// Modern FileInput bileşeni
function FileInput({ label, accept, onChange, file, preview, onRemove }) {
  return (
    <div
      style={{
        border: "2px dashed #ed563b",
        borderRadius: 12,
        padding: 20,
        background: "#fff",
        textAlign: "center",
        position: "relative",
        marginBottom: 10,
      }}
    >
      <label style={{ cursor: "pointer", width: "100%" }}>
        <div style={{ color: "#ed563b", fontSize: 32, marginBottom: 8 }}>
          <i className="bi bi-cloud-arrow-up-fill"></i>
        </div>
        <div style={{ fontWeight: 600, color: "#333" }}>{label}</div>
        <div style={{ fontSize: 13, color: "#888", marginBottom: 8 }}>
          Sürükleyip bırak veya tıkla
        </div>
        <input
          type="file"
          accept={accept}
          style={{ display: "none" }}
          onChange={onChange}
        />
      </label>
      {file && (
        <div style={{ marginTop: 12 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 15, color: "#333" }}>{file.name}</span>
            <button
              type="button"
              onClick={onRemove}
              style={{
                border: "none",
                background: "none",
                color: "#ed563b",
                fontSize: 18,
                cursor: "pointer",
              }}
            >
              <i className="bi bi-x-circle-fill"></i>
            </button>
          </div>
          {preview && (
            <div style={{ marginTop: 8 }}>
              {file.type && file.type.startsWith("image") ? (
                <img
                  src={preview}
                  alt="preview"
                  style={{ maxWidth: 120, borderRadius: 8 }}
                />
              ) : file.type && file.type.startsWith("video") ? (
                <video
                  src={preview}
                  controls
                  style={{ maxWidth: 120, borderRadius: 8 }}
                />
              ) : null}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CreateProgramByUser() {
  const dispatch = useDispatch();
  const { loading, successMessage, errorMessage, usersPrograms } = useSelector(
    (state) => state.program
  );
  const { movements, isLoading } = useSelector((store) => store.movement);

  useEffect(() => {
    dispatch(getAllMovements());
    dispatch(getUserCreatedAllPrograms());
  }, [dispatch]);

  const [programName, setProgramName] = useState("");
  const [programDesc, setProgramDesc] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [days, setDays] = useState([]);
  const [expandedDays, setExpandedDays] = useState({});

  // Form başarılı olduğunda form alanlarını temizle
  useEffect(() => {
    if (successMessage) {
      setProgramName("");
      setProgramDesc("");
      setCoverImage(null);
      setDays([]);

      // 3 saniye sonra başarı mesajını temizle
      const timer = setTimeout(() => {
        dispatch(clearProgramMessages());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch]);

  // Her yeni gün eklendiğinde o gün otomatik açık olsun
  useEffect(() => {
    if (days.length > 0) {
      setExpandedDays((prev) => ({ ...prev, [days.length - 1]: true }));
    }
  }, [days.length]);

  const addDay = () => {
    setDays([...days, { title: "", description: "", steps: [] }]);
  };

  const addStep = (dayIndex) => {
    const newDays = [...days];
    newDays[dayIndex].steps.push({
      title: "",
      duration: 30,
      file: null,
      preview: null,
      selectedMovements: [], // Her adım için ayrı selectedMovements
    });
    setDays(newDays);
  };

  const handleStepChange = (dayIndex, stepIndex, key, value) => {
    const updatedDays = [...days];
    if (key === "file") {
      updatedDays[dayIndex].steps[stepIndex].file = value;
      updatedDays[dayIndex].steps[stepIndex].preview =
        URL.createObjectURL(value);
    } else {
      updatedDays[dayIndex].steps[stepIndex][key] = value;
    }
    setDays(updatedDays);
  };

  const handleDayChange = (dayIndex, key, value) => {
    const updatedDays = [...days];
    updatedDays[dayIndex][key] = value;
    setDays(updatedDays);
  };

  // Hareket ekleme fonksiyonu - her adım için ayrı
  const addMovementToStep = (dayIndex, stepIndex, movementId) => {
    const updatedDays = [...days];
    const currentMovements =
      updatedDays[dayIndex].steps[stepIndex].selectedMovements || [];

    updatedDays[dayIndex].steps[stepIndex].selectedMovements = [
      ...currentMovements,
      movementId,
    ];
    setDays(updatedDays);
  };
  // Adım hareket kombinasyonunu temizleme
  const clearStepMovements = (dayIndex, stepIndex) => {
    const updatedDays = [...days];
    updatedDays[dayIndex].steps[stepIndex].selectedMovements = [];
    setDays(updatedDays);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Program verisini JSON olarak ekliyoruz
    const programData = {
      title: programName,
      description: programDesc,
      duration: days.length,
      days: days.map((day, dayIndex) => ({
        dayNumber: dayIndex + 1,
        title: day.title || `Gün ${dayIndex + 1}`,
        description: day.description || "",
        steps: day.steps.map((step, stepIndex) => ({
          title: step.title || `Adım ${stepIndex + 1}`,
          duration: step.duration,
          videoName: step.file ? step.file.name : null,
          selectedMovements: step.selectedMovements || [], // Hareket kombinasyonlarını da gönder
        })),
      })),
    };

    formData.append("data", JSON.stringify(programData));

    // Kapak görselini ekliyoruz
    if (coverImage) {
      formData.append("cover", coverImage);
    }

    // Step dosyalarını ekliyoruz
    days.forEach((day) => {
      day.steps.forEach((step) => {
        if (step.file) {
          formData.append("files", step.file);
        }
      });
    });

    // Redux aracılığıyla veriyi gönderiyoruz
    dispatch(createProgramByUser(formData));
  };

  const toggleDay = (dayIndex) => {
    setExpandedDays((prev) => ({
      ...prev,
      [dayIndex]: !prev[dayIndex],
    }));
  };
  console.log("usersProgram", usersPrograms);
  console.log("success", successMessage);
  console.log("battın biladerim", errorMessage);

  console.log("movements", movements);
  if (isLoading) {
    return <div>Yükleniyor, lütfen bekleyin..</div>;
  }

  return (
    <>
      <div className="container py-5">
        <a href="/" className="home-icon">
          <i className="mdi mdi-home"></i>
        </a>
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-body p-5">
                <h2 style={{ color: "#ed563b" }} className="mb-4 fw-bold">
                  Yeni Boks Programı Oluştur
                </h2>

                {/* {successMessage && (
                  <div
                    className="alert alert-success d-flex align-items-center"
                    role="alert"
                  >
                    <i className="bi bi-check-circle-fill me-2"></i>
                    {successMessage}
                  </div>
                )}

                {errorMessage && (
                  <div
                    className="alert alert-danger d-flex align-items-center"
                    role="alert"
                  >
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {errorMessage}
                  </div>
                )} */}

                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      Program Adı
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      value={programName}
                      onChange={(e) => setProgramName(e.target.value)}
                      required
                      placeholder="Programınıza bir isim verin"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold">Açıklama</label>
                    <textarea
                      className="form-control"
                      value={programDesc}
                      onChange={(e) => setProgramDesc(e.target.value)}
                      rows="3"
                      placeholder="Programınızı kısaca tanıtın"
                    />
                  </div>

                  <div className="mb-4">
                    <FileInput
                      label="Kapak Görseli Yükle"
                      accept="image/*"
                      onChange={(e) => setCoverImage(e.target.files[0])}
                      file={coverImage}
                      preview={
                        coverImage ? URL.createObjectURL(coverImage) : null
                      }
                      onRemove={() => setCoverImage(null)}
                    />
                    <small className="text-muted">
                      Önerilen boyut: 1200x630 piksel
                    </small>
                  </div>

                  <hr className="my-4" />

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="mb-0">Günler ({days.length})</h4>
                    <button
                      style={{
                        backgroundColor: "#ed563b",
                        borderColor: "#ed563b",
                      }}
                      type="button"
                      className="btn btn-primary"
                      onClick={addDay}
                    >
                      <i className="bi bi-plus-lg me-2"></i>Gün Ekle
                    </button>
                  </div>

                  {days.length === 0 && (
                    <div className="alert alert-info d-flex align-items-center">
                      <i className="bi bi-info-circle-fill me-2"></i>
                      Lütfen programa en az bir gün ekleyiniz.
                    </div>
                  )}

                  {days.map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      className="card border-0 bg-light shadow-sm rounded-4 mb-3"
                      style={{
                        marginBottom:
                          dayIndex === days.length - 1 ? 0 : "1.5rem",
                      }}
                    >
                      <div className="card-body p-4">
                        <div
                          className="d-flex justify-content-between align-items-center mb-0 cursor-pointer"
                          onClick={() => toggleDay(dayIndex)}
                          style={{ cursor: "pointer" }}
                        >
                          <h5 className="mb-0 d-flex align-items-center">
                            <i
                              className={`bi bi-chevron-${
                                expandedDays[dayIndex] ? "down" : "right"
                              } me-2`}
                              style={{
                                color: "#ed563b",
                                fontWeight: 700,
                                fontSize: 24,
                                textShadow: "0 0 1px #ed563b",
                              }}
                            ></i>
                            Gün {dayIndex + 1}
                          </h5>
                          <button
                            type="button"
                            style={{ border: "2px solid #ed563b" }}
                            className="btn btn-outline-danger btn-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              const newDays = [...days];
                              newDays.splice(dayIndex, 1);
                              setDays(newDays);
                            }}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>

                        <div
                          className={`collapse ${
                            expandedDays[dayIndex] ? "show" : ""
                          }`}
                        >
                          <div className="mb-3">
                            <label className="form-label fw-semibold">
                              Gün Başlığı
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Gün başlığı"
                              value={day.title || ""}
                              onChange={(e) =>
                                handleDayChange(
                                  dayIndex,
                                  "title",
                                  e.target.value
                                )
                              }
                            />
                          </div>

                          <div className="mb-4">
                            <label className="form-label fw-semibold">
                              Gün Açıklaması
                            </label>
                            <textarea
                              className="form-control"
                              placeholder="Gün açıklaması"
                              value={day.description || ""}
                              onChange={(e) =>
                                handleDayChange(
                                  dayIndex,
                                  "description",
                                  e.target.value
                                )
                              }
                              rows="2"
                            />
                          </div>

                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="mb-0">
                              Adımlar ({day.steps.length})
                            </h6>
                            <button
                              type="button"
                              style={{
                                backgroundColor: "#ed563b",
                                borderColor: "#ed563b",
                              }}
                              className="btn btn-success btn-sm"
                              onClick={() => addStep(dayIndex)}
                            >
                              <i className="bi bi-plus-lg me-2"></i>Adım Ekle
                            </button>
                          </div>

                          {day.steps.length === 0 && (
                            <div className="alert alert-info d-flex align-items-center">
                              <i className="bi bi-info-circle-fill me-2"></i>
                              Bu gün için henüz adım eklenmedi.
                            </div>
                          )}

                          {day.steps.map((step, stepIndex) => (
                            <div
                              key={stepIndex}
                              className="card mb-3 border-0 bg-white shadow-sm rounded-3"
                            >
                              <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                  <h6 className="mb-0">Adım {stepIndex + 1}</h6>
                                  <button
                                    type="button"
                                    style={{ border: "2px solid #ed563b" }}
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const newDays = [...days];
                                      newDays[dayIndex].steps.splice(
                                        stepIndex,
                                        1
                                      );
                                      setDays(newDays);
                                    }}
                                  >
                                    <i className="bi bi-trash"></i>
                                  </button>
                                </div>

                                <div className="mb-3">
                                  <label className="form-label fw-semibold">
                                    Adım Başlığı
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Örn: Isınma, Gölge Boksu, Jab-Cross..."
                                    value={step.title || ""}
                                    onChange={(e) =>
                                      handleStepChange(
                                        dayIndex,
                                        stepIndex,
                                        "title",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>

                                <div className="mb-3">
                                  <label className="form-label fw-semibold">
                                    Süre (saniye)
                                  </label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    value={step.duration}
                                    min="5"
                                    onChange={(e) =>
                                      handleStepChange(
                                        dayIndex,
                                        stepIndex,
                                        "duration",
                                        parseInt(e.target.value)
                                      )
                                    }
                                  />
                                </div>

                                <div className="movement-cards-row">
                                  {movements.map((movement) => (
                                    <div
                                      style={{
                                        width: "100px",
                                        height: "100px",
                                        cursor: "pointer",
                                        position: "relative",
                                        opacity: (
                                          step.selectedMovements || []
                                        ).includes(movement._id)
                                          ? "0.7"
                                          : "1",
                                      }}
                                      key={movement._id}
                                      className="movement-card"
                                      onClick={() => {
                                        addMovementToStep(
                                          dayIndex,
                                          stepIndex,
                                          movement._id
                                        );
                                      }}
                                    >
                                      <div
                                        style={{
                                          width: "100%",
                                          height: "30px",
                                        }}
                                        className="image-thumb"
                                      >
                                        <img
                                          src={
                                            movement.movementImage ||
                                            "assets/images/default.jpg"
                                          }
                                          alt={movement.movementName}
                                        />
                                      </div>
                                      <div className="down-content">
                                        <h4
                                          style={{
                                            textAlign: "center",
                                            color: "#fff",
                                          }}
                                        >
                                          {movement.movementName}
                                        </h4>
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                {(step.selectedMovements || []).length > 0 && (
                                  <div className="selected-movements mt-3">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                      <h6 className="mb-0">
                                        Seçilen Hareket Kombinasyonu:
                                      </h6>
                                      <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() =>
                                          clearStepMovements(
                                            dayIndex,
                                            stepIndex
                                          )
                                        }
                                      >
                                        <i className="bi bi-x-lg"></i> Temizle
                                      </button>
                                    </div>
                                    <div
                                      style={{ justifyContent: "center" }}
                                      className="d-flex flex-wrap gap-2 align-items-center"
                                    >
                                      {(step.selectedMovements || []).map(
                                        (movementId, index) => {
                                          const movement = movements.find(
                                            (m) => m._id === movementId
                                          );
                                          return (
                                            <React.Fragment key={movementId}>
                                              <div
                                                className="badge p-2"
                                                style={{
                                                  backgroundColor: "#ed563b",
                                                  color: "#fff",
                                                }}
                                              >
                                                {movement?.movementName}
                                              </div>
                                              {index <
                                                (step.selectedMovements || [])
                                                  .length -
                                                  1 && (
                                                <i className="bi bi-arrow-right text-muted"></i>
                                              )}
                                            </React.Fragment>
                                          );
                                        }
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="d-flex justify-content-center mt-4 program-btn-row">
                    <button
                      type="submit"
                      style={{
                        backgroundColor: "#ed563b",
                        borderColor: "#ed563b",
                      }}
                      className="btn btn-primary btn-lg px-5 program-btn-mobile"
                      disabled={loading || days.length === 0}
                    >
                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Program Oluşturuluyor...
                        </>
                      ) : (
                        "Program Oluştur"
                      )}
                    </button>
                    <a href="/" className="form-home-link">
                      <i className="mdi mdi-home"></i> Ana Sayfa
                    </a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateProgramByUser;
