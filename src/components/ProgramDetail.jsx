import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getProgramDetail } from "../redux/slices/programSlice";
import {
  getProgramProgress,
  programIsRegistered,
  registerProgram,
  setCurrentProgram,
  resetUserState,
} from "../redux/slices/userSlice";
import { getServerDate } from "../redux/slices/authSlice";
import "../css/programDetail.css";
import LockIcon from "@mui/icons-material/Lock";
import Loader from "./Loader";
import VideoComponent from './VideoComponent';

const ProgramDetail = () => {
  const [activeDay, setActiveDay] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);
  const [timeOffset, setTimeOffset] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true); // Yeni state ekledik
  const [programNotFound, setProgramNotFound] = useState(false); // Program bulunamadı durumu için

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { programId } = useParams();

  const { programDetail, loading } = useSelector(
    (state) => state.program || {}
  );
  const {
    isRegisteredProgram,
    userIsLoading,
    isProgressLoading,
    progress,
    completedDays,
  } = useSelector((store) => store.user);

  const { user, authIsLoading, serverDate } = useSelector(
    (store) => store.auth
  );

  // Test fonksiyonu - sadece development ortamında kullanılacak
  const getTestDate = () => {
    if (process.env.NODE_ENV === 'development') {
      const now = new Date();
      const thirtySecondsAgo = new Date(now.getTime() - 30000);
      return thirtySecondsAgo;
    }
    return new Date(serverDate);
  };

  // Program kayıt işlemi
  const handleRegisterProgram = async () => {
    if (!user) {
      console.log("User session not found.");
      return;
    }

    try {
      const resultAction = await dispatch(registerProgram(programId));
      if (registerProgram.fulfilled.match(resultAction)) {
        console.log("Program registration successful:", resultAction.payload);
        navigate(`/program/${programId}/starts`);
      } else {
        console.warn("Program registration failed:", resultAction.payload);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  // Program detaylarını ve kullanıcı ilerleme bilgisini yükle
  const loadProgramData = useCallback(async () => {
    if (programId) {
      try {
        setInitialLoading(true);
        setProgramNotFound(false);
        
        // Güncel programı Redux'ta güncelle
        dispatch(setCurrentProgram(programId));

        // Tüm async işlemleri paralel olarak başlat
        const promises = [
          dispatch(getProgramDetail(programId)).unwrap(),
          dispatch(programIsRegistered(programId)).unwrap(),
          dispatch(getProgramProgress(programId)).unwrap(),
          dispatch(getServerDate()).unwrap()
        ];

        // Tüm işlemlerin tamamlanmasını bekle
        await Promise.allSettled(promises);
        
      } catch (err) {
        console.error("Data loading error:", err);
        // Eğer program detayı alınamadıysa, program bulunamadı olarak işaretle
        if (err.message?.includes('Program') || err.status === 404) {
          setProgramNotFound(true);
        }
      } finally {
        setInitialLoading(false);
      }
    }
  }, [dispatch, programId]);

  useEffect(() => {
    loadProgramData();

    return () => {
      dispatch(resetUserState());
    };
  }, [loadProgramData, dispatch]);

  // Program detayı yüklendikten sonra kontrol et
  useEffect(() => {
    if (!initialLoading && !loading && !programDetail && programId) {
      setProgramNotFound(true);
    }
  }, [initialLoading, loading, programDetail, programId]);

  // Kullanıcı ilerleme durumuna göre aktif günü belirleme fonksiyonu
  const determineActiveDay = useCallback(() => {
    if (!programDetail?.days?.length || !completedDays) return;

    try {
      if (
        !activeDay ||
        !programDetail.days.some((day) => day._id === activeDay)
      ) {
        if (completedDays?.length > 0) {
          const sortedCompletedDays = [...completedDays].sort((a, b) => {
            return new Date(a.completedAt) - new Date(b.completedAt);
          });

          const lastCompletedDayId =
            sortedCompletedDays[sortedCompletedDays.length - 1]?.dayId;

          if (lastCompletedDayId) {
            const lastCompletedDayObj = programDetail.days.find(
              (day) => day._id === lastCompletedDayId
            );

            if (lastCompletedDayObj) {
              const nextDayNumber = lastCompletedDayObj.dayNumber + 1;
              const nextDay = programDetail.days.find(
                (day) => day.dayNumber === nextDayNumber
              );

              if (nextDay) {
                setActiveDay(nextDay._id);
              } else {
                setActiveDay(lastCompletedDayId);
              }
            } else {
              setActiveDay(programDetail.days[0]._id);
            }
          } else {
            setActiveDay(programDetail.days[0]._id);
          }
        } else {
          setActiveDay(programDetail.days[0]._id);
        }
      }
    } catch (error) {
      console.error("Active day determination error:", error);
      if (programDetail?.days?.length > 0) {
        setActiveDay(programDetail.days[0]._id);
      }
    }
  }, [programDetail, completedDays, activeDay]);

  useEffect(() => {
    determineActiveDay();
  }, [determineActiveDay]);

  // Süre formatlama yardımcı fonksiyonu
  const formatDuration = (seconds) => {
    if (!seconds) return "0 min";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes === 0) {
      return `${remainingSeconds} sec`;
    } else if (remainingSeconds === 0) {
      return `${minutes} min`;
    } else {
      return `${minutes} min ${remainingSeconds} sec`;
    }
  };

  // Toplam süre hesaplama fonksiyonları
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

  const destructProgress = progress.progress;
  const lastCompleted = Array.isArray(destructProgress)
    ? [...destructProgress].reverse().find((item) => item.isCompleted)
    : null;

  const lockedToDate = lastCompleted?.newDayLockedToDate;
  const programIsCompleted = progress.isCompleted;
  
  const currentServerDate = getTestDate();
  
  // timeOffset'i hesapla
  useEffect(() => {
    if (serverDate) {
      const clientNow = Date.now();
      const serverNow = new Date(serverDate).getTime();
      setTimeOffset(serverNow - clientNow);
    }
  }, [serverDate]);

  // Kalan süreyi client now + offset ile hesapla
  useEffect(() => {
    if (!lockedToDate || !serverDate) return;

    const lockedTime = new Date(lockedToDate).getTime();

    const updateRemaining = () => {
      const now = Date.now();
      const adjustedNow = now + timeOffset;
      setRemainingTime(lockedTime - adjustedNow);
    };

    updateRemaining();

    const interval = setInterval(updateRemaining, 1000);

    return () => clearInterval(interval);
  }, [lockedToDate, serverDate, timeOffset]);

  const isLocked = remainingTime > 0;

  const formatRemainingTime = (ms) => {
    if (!ms || ms <= 0) return "Time expired";
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h} hr ${m} min ${s} sec`;
  };

  // Loading durumunu güncelle
  const isLoading = initialLoading || loading || authIsLoading || userIsLoading || isProgressLoading;

  // Loading durumunda göster
  if (isLoading) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "20px",
        }}
      >
        <Loader />
      </div>
    );
  }

  // Program bulunamadı durumu - sadece loading tamamlandıktan sonra göster
  if (programNotFound || (!programDetail && !isLoading)) {
    return (
      <div className="container my-5">
        <div className="alert alert-warning">
          <h4>Program not found</h4>
          <p>The program you are looking for was not found or you don't have access.</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/programs")}
          >
            Back to Programs
          </button>
        </div>
      </div>
    );
  }

  // Aktif günün verisini bul
  const activeDayData = programDetail?.days?.find(
    (day) => day._id === activeDay
  );

  return (
    <div className="program-detail-container">
      <a href="/" className="home-icon" id="home-icon">
        <i className="mdi mdi-home"></i>
      </a>
      {/* Program Başlığı ve Genel Bilgiler */}
      <div className="program-header-card">
        <div className="program-header-info">
          <div className="program-header-title">
            {programDetail?.title || "Program Detail"}
          </div>
          <div className="program-header-desc">
            {programDetail?.description || "No description available."}
          </div>
          <div className="program-header-badges">
            <span className="badge bg-light text-dark rounded-pill fs-6">
              {programDetail?.duration} Days
            </span>
            <span className="badge bg-secondary text-dark  fs-6">
              Total:{" "}
              {formatDuration(
                calculateProgramTotalDuration(programDetail?.days || [])
              )}
            </span>
          </div>

          <div className="program-header-actions">
            {user && (
              <div className="main-button">
                {programIsCompleted ? (
                  <button disabled>Completed</button>
                ) : !isLocked ? (
                  isRegisteredProgram?.isRegistered ? (
                    <Link
                      id="continue-program-button"
                      to={`/program/${programId}/starts`}
                    >
                      Continue
                    </Link>
                  ) : (
                    <button
                      className="start-program-button"
                      onClick={handleRegisterProgram}
                    >
                      Start Program
                    </button>
                  )
                ) : (
                  <button id="lock-btn-detail" value={formatRemainingTime(remainingTime)} disabled>
                    <LockIcon style={{ fontSize: 32, color: "#ed563b" }} />
                    {formatRemainingTime(remainingTime)}
                  </button>
                )}
                <a
                  style={{
                    border: "none",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0",
                  }}
                  href="/"
                  className="form-home-link"
                >
                  Home
                </a>
              </div>
            )}
          </div>
        </div>
        {programDetail?.coverImage && (
          <div className="program-header-cover">
            <img
              width={200}
              height={210}
              style={{ objectFit: "cover" }}
              src={programDetail.coverImage}
              alt={programDetail.title}
            />
          </div>
        )}
      </div>
      <div className="program-main-row">
        {/* Günlerin Listesi */}
        <div className="program-days-list">
          <div className="program-days-card">
            <div className="card-header">Program Days</div>
            <div id="program-days-list-ByUser" className="list-group list-group-flush">
              {Array.isArray(programDetail?.days) &&
                programDetail.days.map((day) => {
                  const isCompleted = completedDays?.some(
                    (completed) => completed.dayId === day._id
                  );
                  return (
                    <button
                      key={day._id}
                      className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center${
                        activeDay === day._id ? " active" : ""
                      }`}
                      onClick={() => setActiveDay(day._id)}
                    >
                      <div>
                        <strong>Day {day.dayNumber}</strong>: {day.title}
                        {isCompleted && (
                          <span className="ms-2 text-success"> ✅</span>
                        )}
                      </div>
                      <span id="program-detail-list-badge" className="badge bg-info ">
                        {formatDuration(calculateTotalDuration(day.steps))}
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
        {/* Seçili Günün Adımları */}
        <div className="program-day-content">
          {activeDayData ? (
            <div className="program-day-card">
              <div id="program-day-card-user" className="card-header">
                <span>
                  Day {activeDayData.dayNumber}: {activeDayData.title}
                </span>
                <span className="badge bg-white border border-gray text-dark step-duration-badge">
                  {formatDuration(calculateTotalDuration(activeDayData.steps))}
                </span>
              </div>
              <div className="card-body">
                <p className="lead">
                  {activeDayData.description ||
                    "No description available for this day."}
                </p>
                {/* Adımlar Listesi */}
                {Array.isArray(activeDayData.steps) &&
                activeDayData.steps.length > 0 ? (
                  <div className="timeline mt-4">
                    {activeDayData.steps.map((step, index) => (
                      <div key={step._id} className="timeline-item">
                        <div className="row g-0 mb-4">
                          <div className="col-12 col-md-8">
                            <div className="card h-100">
                              <div id="day-content-user" className="card-header d-flex justify-content-between">
                                <h5 className="mb-0">
                                  {step.order}. {step.title}
                                </h5>
                                <span className="badge bg-white border border-gray text-dark step-duration-badge">
                                  {formatDuration(step.duration)}
                                </span>
                              </div>
                              <div className="card-body">
                                <p className="mb-0">
                                  {step.description || "No description available for this step."}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="col-12 col-md-4 mb-3 mb-md-0">
                            {step.videoUrl && (
                              <div className="position-relative">
                                <VideoComponent videoUrl={step.videoUrl} size="small" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="alert alert-info">
                    No steps available for this day.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="alert alert-warning">
              Please select a day to view
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgramDetail;