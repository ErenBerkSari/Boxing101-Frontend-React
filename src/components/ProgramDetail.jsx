import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getProgramDetail } from "../redux/slices/programSlice";
import {
  getProgramProgress,
  programIsRegistered,
  registerProgram,
  setCurrentProgram,
} from "../redux/slices/userSlice";
import { getServerDate } from "../redux/slices/authSlice";
import "../css/programDetail.css";
import LockIcon from '@mui/icons-material/Lock';

const BoxingProgramDetail = () => {
  const [activeDay, setActiveDay] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);

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

  // Program kayıt işlemi
  const handleRegisterProgram = async () => {
    if (!user) {
      console.log("Kullanıcı oturumu yok.");
      return;
    }

    try {
      const resultAction = await dispatch(registerProgram(programId));
      if (registerProgram.fulfilled.match(resultAction)) {
        // Başarıyla kayıt olundu
        console.log("Program kaydı başarılı:", resultAction.payload);
        navigate(`/program/${programId}/starts`);
      } else {
        // Hata oluştu
        console.warn("Program kaydı başarısız:", resultAction.payload);
      }
    } catch (err) {
      console.error("Beklenmeyen hata:", err);
    }
  };

  // Program detaylarını ve kullanıcı ilerleme bilgisini yükle
  const loadProgramData = useCallback(() => {
    if (programId) {
      // Güncel programı Redux'ta güncelle
      dispatch(setCurrentProgram(programId));

      // Program detayını yükle
      dispatch(getProgramDetail(programId))
        .unwrap()
        .catch((err) => console.error("Program detayı alınamadı:", err));

      // Programa kayıt durumunu kontrol et
      dispatch(programIsRegistered(programId))
        .unwrap()
        .catch((err) => console.error("Kayıt durumu alınamadı:", err));

      // İlerleme bilgisini yükle
      dispatch(getProgramProgress(programId))
        .unwrap()
        .catch((err) => console.error("İlerleme bilgisi alınamadı:", err));

      // Program detayını yükle
      dispatch(getServerDate())
        .unwrap()
        .catch((err) => console.error("Gün detayı alınamadı:", err));
    }
  }, [dispatch, programId]);

  useEffect(() => {
    loadProgramData();

    // Component unmount olduğunda abortları tetikle
    return () => {
      // İlgili abort controller'lar varsa burada kullanılabilir
    };
  }, [loadProgramData]);

  // Kullanıcı ilerleme durumuna göre aktif günü belirleme fonksiyonu
  const determineActiveDay = useCallback(() => {
    if (!programDetail?.days?.length || !completedDays) return;

    try {
      // Henüz aktif gün seçilmemişse belirleme işlemi yap
      if (
        !activeDay ||
        !programDetail.days.some((day) => day._id === activeDay)
      ) {
        // Tamamlanan günleri kontrol et
        if (completedDays?.length > 0) {
          // Tamamlanan günleri sırala (son tamamlanan en sonda)
          const sortedCompletedDays = [...completedDays].sort((a, b) => {
            return new Date(a.completedAt) - new Date(b.completedAt);
          });

          // Son tamamlanan günün ID'si
          const lastCompletedDayId =
            sortedCompletedDays[sortedCompletedDays.length - 1]?.dayId;

          if (lastCompletedDayId) {
            // Son tamamlanan günün programdaki objesini bul
            const lastCompletedDayObj = programDetail.days.find(
              (day) => day._id === lastCompletedDayId
            );

            if (lastCompletedDayObj) {
              // Sonraki günü bulmaya çalış
              const nextDayNumber = lastCompletedDayObj.dayNumber + 1;
              const nextDay = programDetail.days.find(
                (day) => day.dayNumber === nextDayNumber
              );

              if (nextDay) {
                // Sonraki gün varsa onu aktif et
                console.log("Sonraki gün aktif edildi:", nextDay.dayNumber);
                setActiveDay(nextDay._id);
              } else {
                // Sonraki gün yoksa son tamamlanan günü aktif et
                console.log(
                  "Son tamamlanan gün aktif:",
                  lastCompletedDayObj.dayNumber
                );
                setActiveDay(lastCompletedDayId);
              }
            } else {
              setActiveDay(programDetail.days[0]._id);
            }
          } else {
            setActiveDay(programDetail.days[0]._id);
          }
        } else {
          // Hiç tamamlanan gün yoksa ilk günü göster
          console.log("Tamamlanan gün yok, ilk gün gösteriliyor");
          setActiveDay(programDetail.days[0]._id);
        }
      }
    } catch (error) {
      console.error("Aktif gün belirleme hatası:", error);
      // Hata durumunda ilk günü göster
      if (programDetail?.days?.length > 0) {
        setActiveDay(programDetail.days[0]._id);
      }
    }
  }, [programDetail, completedDays, activeDay]);

  // Tamamlanan günlere ve program detaylarına göre aktif günü güncelle
  useEffect(() => {
    determineActiveDay();
  }, [determineActiveDay]);

  // Süre formatlama yardımcı fonksiyonu
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
  console.log("progress", destructProgress);
  const lastCompleted = Array.isArray(destructProgress)
    ? [...destructProgress].reverse().find((item) => item.isCompleted)
    : null;

  const lockedToDate = lastCompleted?.newDayLockedToDate;
  // Yükleme durumu kontrolü
  const programIsCompleted = progress.isCompleted;
  console.log("serverDate:", serverDate);
  console.log("lockedToDate:", lockedToDate);
  const isLocked =
    lockedToDate && new Date(serverDate) < new Date(lockedToDate);
  console.log("isLocked", isLocked);
  useEffect(() => {
    if (!lockedToDate || !serverDate) return;

    const lockedTime = new Date(lockedToDate).getTime();
    const serverTime = new Date(serverDate).getTime();

    const updateRemainingTime = () => {
      const now = new Date().getTime();
      const diff = lockedTime - now;

      if (diff <= 0) {
        setRemainingTime(0); // Süre dolduysa
      } else {
        setRemainingTime(diff);
      }
    };

    updateRemainingTime(); // İlk başta ayarla

    const interval = setInterval(updateRemainingTime, 1000); // Her saniye güncelle

    return () => clearInterval(interval); // Temizle
  }, [lockedToDate, serverDate]);
  const formatRemainingTime = (ms) => {
    if (ms <= 0) return "Süre doldu";

    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours} sa ${minutes} dk ${seconds} sn`;
  };

  const isLoading =
    loading || authIsLoading || userIsLoading || isProgressLoading;
console.log("program tamamlandı mı", progress.isCompleted);
  if (isLoading) {
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

  // Program bulunamadı durumu
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

  // Aktif günün verisini bul
  const activeDayData = programDetail.days?.find(
    (day) => day._id === activeDay
  );

  return (
    <div className="program-detail-container">
      {/* Program Başlığı ve Genel Bilgiler */}
      <div className="program-header-card">
        <div className="program-header-info">
          <div className="program-header-title">{programDetail.title || "Program Detayı"}</div>
          <div className="program-header-desc">{programDetail.description || "Açıklama bulunmuyor."}</div>
          <div className="program-header-badges">
            
           
            
            <span className="badge bg-light text-dark rounded-pill fs-6">
              {programDetail.duration} Gün
            </span>
            <span className="badge bg-secondary text-dark  fs-6">
              Toplam: {formatDuration(calculateProgramTotalDuration(programDetail.days))}
            </span>
          </div>

          


            <div className="program-header-actions">
            {user && (
              <div className="main-button">
                {programIsCompleted ? (
                  <button disabled>Tamamlandı</button>
                ) : !isLocked ? (
                  isRegisteredProgram?.isRegistered ? (
                    <Link id="continue-program-button" to={`/program/${programId}/starts`}>Devam Et</Link>
                  ) : (
                    <button onClick={handleRegisterProgram}>Programa Başla</button>
                  )
                ) : (
                  <button value={formatRemainingTime(remainingTime)} disabled><LockIcon style={{ fontSize: 32, color: '#ed563b' }} />{formatRemainingTime(remainingTime)}</button>
                )}
              </div>
            )}
            
          </div>
          
          
          
          
        </div>
        {programDetail.coverImage && (
          <div className="program-header-cover">
            <img src={programDetail.coverImage} alt={programDetail.title} />
          </div>
        )}
      </div>
      <div className="program-main-row">
        {/* Günlerin Listesi */}
        <div className="program-days-list">
          <div className="program-days-card">
            <div className="card-header">Program Günleri</div>
            <div className="list-group list-group-flush">
              {Array.isArray(programDetail.days) &&
                programDetail.days.map((day) => {
                  const isCompleted = completedDays?.some((completed) => completed.dayId === day._id);
                  return (
                    <button
                      key={day._id}
                      className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center${activeDay === day._id ? " active" : ""}`}
                      onClick={() => setActiveDay(day._id)}
                    >
                      <div >
                        <strong>Gün {day.dayNumber}</strong>: {day.title}
                        {isCompleted && <span className="ms-2 text-success"> ✅</span>}
                      </div>
                      <span className="badge bg-info ">
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
              <div className="card-header">
                <span>Gün {activeDayData.dayNumber}: {activeDayData.title}</span>
                <span className="badge bg-white border border-gray text-dark step-duration-badge">
                  {formatDuration(calculateTotalDuration(activeDayData.steps))}
                </span>
              </div>
              <div className="card-body">
                <p className="lead">{activeDayData.description || "Bu gün için açıklama bulunmuyor."}</p>
                {/* Adımlar Listesi */}
                {Array.isArray(activeDayData.steps) && activeDayData.steps.length > 0 ? (
                  <div className="timeline mt-4">
                    {activeDayData.steps.map((step, index) => (
                      <div key={step._id} className="timeline-item">
                        <div className="row g-0 mb-4">
                          <div className="col-12 col-md-4 mb-3 mb-md-0">
                            {step.videoUrl && (
                              <div className="position-relative">
                                <video className="img-fluid rounded" controls>
                                  <source src={step.videoUrl} type="video/mp4" />
                                  Tarayıcınız video etiketini desteklemiyor.
                                </video>
                              </div>
                            )}
                          </div>
                          <div className="col-12 col-md-8">
                            <div className="card h-100">
                              <div className="card-header d-flex justify-content-between">
                                <h5 className="mb-0">{step.order}. {step.title}</h5>

                                
                                <span  className="badge bg-white border border-gray text-dark step-duration-badge">{formatDuration(step.duration)}</span>
                              </div>
                              <div className="card-body">
                                <p className="mb-0">{step.description || "Bu adım için açıklama bulunmuyor."}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="alert alert-info">Bu gün için adım bulunmuyor.</div>
                )}
              </div>
            </div>
          ) : (
            <div className="alert alert-warning">Lütfen görüntülemek için bir gün seçin</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BoxingProgramDetail;
