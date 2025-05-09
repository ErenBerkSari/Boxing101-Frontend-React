import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createProgram,
  clearProgramMessages,
} from "../redux/slices/programSlice";

function CreateProgram() {
  const dispatch = useDispatch();
  const { loading, successMessage, errorMessage } = useSelector(
    (state) => state.program
  );

  const [programName, setProgramName] = useState("");
  const [programDesc, setProgramDesc] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [days, setDays] = useState([]);

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
    dispatch(createProgram(formData));
  };

  return (
    <div className="container mt-5">
      <h2>Yeni Boks Programı Oluştur</h2>

      {/* Başarı veya hata mesajları */}
      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label className="form-label">Program Adı</label>
          <input
            type="text"
            className="form-control"
            value={programName}
            onChange={(e) => setProgramName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Açıklama</label>
          <textarea
            className="form-control"
            value={programDesc}
            onChange={(e) => setProgramDesc(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Kapak Görseli</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={(e) => setCoverImage(e.target.files[0])}
          />
        </div>

        <hr />
        <h4>Günler ({days.length})</h4>
        {days.length === 0 && (
          <div className="alert alert-info">
            Lütfen programa en az bir gün ekleyiniz.
          </div>
        )}

        {days.map((day, dayIndex) => (
          <div key={dayIndex} className="mb-4 border p-3 rounded">
            <h5>Gün {dayIndex + 1}</h5>
            <div className="mb-3">
              <label className="form-label">Gün Başlığı</label>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Gün başlığı"
                value={day.title || ""}
                onChange={(e) =>
                  handleDayChange(dayIndex, "title", e.target.value)
                }
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Gün Açıklaması</label>
              <textarea
                className="form-control mb-2"
                placeholder="Gün açıklaması"
                value={day.description || ""}
                onChange={(e) =>
                  handleDayChange(dayIndex, "description", e.target.value)
                }
              />
            </div>

            <h6>Adımlar ({day.steps.length})</h6>
            {day.steps.length === 0 && (
              <div className="alert alert-info mb-3">
                Bu gün için henüz adım eklenmedi.
              </div>
            )}

            {day.steps.map((step, stepIndex) => (
              <div key={stepIndex} className="mb-3 border-top pt-3">
                <h6>Adım {stepIndex + 1}</h6>

                <div className="mb-2">
                  <label className="form-label">Adım Başlığı</label>
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

                <div className="mb-2">
                  <label className="form-label">Süre (saniye)</label>
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

                <div className="mb-2">
                  <label className="form-label">Video veya Görsel</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*,video/*"
                    onChange={(e) =>
                      handleStepChange(
                        dayIndex,
                        stepIndex,
                        "file",
                        e.target.files[0]
                      )
                    }
                  />
                  {step.preview && (
                    <div className="mt-2">
                      {step.file.type.startsWith("image") ? (
                        <img
                          src={step.preview}
                          alt="preview"
                          className="img-thumbnail"
                          style={{ maxWidth: "200px" }}
                        />
                      ) : (
                        <video
                          src={step.preview}
                          controls
                          className="img-thumbnail"
                          style={{ maxWidth: "200px" }}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-outline-success"
              onClick={() => addStep(dayIndex)}
            >
              + Adım Ekle
            </button>
          </div>
        ))}

        <button
          type="button"
          className="btn btn-outline-primary mb-3"
          onClick={addDay}
        >
          + Gün Ekle
        </button>

        <div className="mt-4">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || days.length === 0}
          >
            {loading ? "Program Oluşturuluyor..." : "Program Oluştur"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateProgram;
