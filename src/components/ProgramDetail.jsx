import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getProgramDetail } from "../redux/slices/programSlice"; // Bu fonksiyonu Redux slice'ınıza eklemeniz gerekebilir

const BoxingProgramDetail = () => {
  const [activeDay, setActiveDay] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { programId } = useParams();

  const { programDetail, loading } = useSelector(
    (state) => state.program || {}
  );

  useEffect(() => {
    if (programId) {
      dispatch(getProgramDetail(programId));
    }
  }, [dispatch, programId]);

  useEffect(() => {
    if (
      programDetail &&
      programDetail.days &&
      programDetail.days.length > 0 &&
      !activeDay
    ) {
      setActiveDay(programDetail.days[0]._id);
    }
  }, [programDetail, activeDay]);

  // Güvenli erişim fonksiyonları
  const formatDuration = (seconds) => {
    if (!seconds) return "0 dk";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes === 0) {
      return `${remainingSeconds} sn`;
    } else if (remainingSeconds === 0) {
      return `${minutes} dk`;
    } else {
      return `${minutes} dk ${remainingSeconds} sn`;
    }
  };

  const calculateTotalDuration = (steps) => {
    if (!Array.isArray(steps)) return 0;
    return steps.reduce((total, step) => total + (step.duration || 0), 0);
  };

  const calculateProgramTotalDuration = (days) => {
    if (!Array.isArray(days)) return 0;

    return days.reduce((total, day) => {
      const dayDuration = calculateTotalDuration(day.steps || []);
      return total + dayDuration;
    }, 0);
  };

  if (loading) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
          <p className="mt-3">Program detayları yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!programDetail) {
    return (
      <div className="container my-5">
        <div className="alert alert-warning">
          <h4>Program bulunamadı</h4>
          <p>Aradığınız program bulunamadı veya erişim izniniz yok.</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/programs")}
          >
            Programlara Dön
          </button>
        </div>
      </div>
    );
  }

  const activeDayData =
    programDetail.days &&
    programDetail.days.find((day) => day._id === activeDay);

  return (
    <div className="section" id="program-detail">
      <div className="container">
        {/* Program Başlığı ve Genel Bilgiler */}
        <div className="row mb-4">
          <div className="col-lg-8">
            <h2 className="mb-3">{programDetail.title || "Program Detayı"}</h2>
            <p className="lead">
              {programDetail.description || "Açıklama bulunmuyor."}
            </p>
            <div className="d-flex align-items-center mb-4">
              <div className="me-4">
                <span className="badge bg-primary rounded-pill fs-6">
                  {programDetail.duration} Gün
                </span>
              </div>
              <div>
                <span className="badge bg-secondary rounded-pill fs-6">
                  Toplam:{" "}
                  {formatDuration(
                    calculateProgramTotalDuration(programDetail.days)
                  )}
                </span>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            {programDetail.coverImage && (
              <img
                src={programDetail.coverImage}
                alt={programDetail.title}
                className="img-fluid rounded shadow"
              />
            )}
          </div>
        </div>

        <div className="row">
          {/* Günlerin Listesi */}
          <div className="col-lg-4 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-dark text-white">
                <h5 className="mb-0">Program Günleri</h5>
              </div>
              <div className="list-group list-group-flush">
                {Array.isArray(programDetail.days) &&
                  programDetail.days.map((day) => (
                    <button
                      key={day._id}
                      className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${
                        activeDay === day._id ? "active" : ""
                      }`}
                      onClick={() => setActiveDay(day._id)}
                    >
                      <div>
                        <strong>Gün {day.dayNumber}</strong>: {day.title}
                      </div>
                      <span className="badge bg-info rounded-pill">
                        {formatDuration(calculateTotalDuration(day.steps))}
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          </div>

          {/* Seçili Günün Adımları */}
          <div className="col-lg-8">
            {activeDayData ? (
              <div className="card shadow-sm">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    Gün {activeDayData.dayNumber}: {activeDayData.title}
                  </h5>
                  <span className="badge bg-light text-dark">
                    {formatDuration(
                      calculateTotalDuration(activeDayData.steps)
                    )}
                  </span>
                </div>
                <div className="card-body">
                  <p className="lead">
                    {activeDayData.description ||
                      "Bu gün için açıklama bulunmuyor."}
                  </p>

                  {/* Adımlar Listesi */}
                  {Array.isArray(activeDayData.steps) &&
                  activeDayData.steps.length > 0 ? (
                    <div className="timeline mt-4">
                      {activeDayData.steps.map((step, index) => (
                        <div key={step._id} className="timeline-item">
                          <div className="row g-0 mb-4">
                            <div className="col-12 col-md-4 mb-3 mb-md-0">
                              {step.videoUrl && (
                                <div className="position-relative">
                                  <video className="img-fluid rounded" controls>
                                    <source
                                      src={step.videoUrl}
                                      type="video/mp4"
                                    />
                                    Tarayıcınız video etiketini desteklemiyor.
                                  </video>
                                </div>
                              )}
                            </div>
                            <div className="col-12 col-md-8">
                              <div className="card h-100">
                                <div className="card-header d-flex justify-content-between">
                                  <h5 className="mb-0">
                                    {step.order}. {step.title}
                                  </h5>
                                  <span className="badge bg-warning text-dark">
                                    {formatDuration(step.duration)}
                                  </span>
                                </div>
                                <div className="card-body">
                                  <p className="mb-0">
                                    {step.description ||
                                      "Bu adım için açıklama bulunmuyor."}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="alert alert-info">
                      Bu gün için adım bulunmuyor.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="alert alert-warning">
                Lütfen görüntülemek için bir gün seçin
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoxingProgramDetail;
