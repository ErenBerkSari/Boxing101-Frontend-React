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
import LockIcon from "@mui/icons-material/Lock";
import "../css/BoxingProgramDetailByUser.css";

const BoxingProgramDetail = () => {
  const [activeDay, setActiveDay] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);
  const [timeOffset, setTimeOffset] = useState(0);

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
        navigate(`/program/user/${programId}/starts`);
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

  // Test fonksiyonu - sadece development ortamında kullanılacak
  const getTestDate = () => {
    if (process.env.NODE_ENV === 'development') {
      // Test için serverDate'i manipüle et
      // 1. Normal durum (kilitli)
      //return new Date('2025-06-17T21:00:00.000Z');
      
      // 2. Kilit açılmış durum (lockedToDate'den sonra)
      //return new Date('2025-06-19T00:00:00.000Z');
      
      // 3. Tam kilit açılma anı
      //return new Date('2025-06-18T23:07:15.575Z');

      // 4. Test için 30 saniyelik kilit
      const now = new Date();
      const thirtySecondsAgo = new Date(now.getTime() - 30000); // 30 saniye önce
      return thirtySecondsAgo;
    }
    return new Date(serverDate);
  };

  const destructProgress = progress.progress;
  console.log("progress", destructProgress);
  
  // Son tamamlanan günü bul
  const lastCompleted = Array.isArray(destructProgress)
    ? [...destructProgress]
        .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))[0]
    : null;
  console.log("lastCompleted", lastCompleted);

  const lockedToDate = lastCompleted?.newDayLockedToDate;
  
  // Program tamamlanma durumunu kontrol et
  const programIsCompleted = progress.isCompleted && progress.programId === programId;
  
  // Test date kullanımı
  const currentServerDate = getTestDate();
  console.log("Original serverDate:", serverDate);
  console.log("Test serverDate:", currentServerDate);
  console.log("lockedToDate:", lockedToDate);
  
  // Detailed date comparison logging
  if (lockedToDate && currentServerDate) {
    const serverDateObj = new Date(currentServerDate);
    const lockedDateObj = new Date(lockedToDate);
    console.log("Date Comparison Details:");
    console.log("Server Date (ISO):", serverDateObj.toISOString());
    console.log("Locked Date (ISO):", lockedDateObj.toISOString());
    console.log("Server Date (Local):", serverDateObj.toString());
    console.log("Locked Date (Local):", lockedDateObj.toString());
    console.log("Server Date Timestamp:", serverDateObj.getTime());
    console.log("Locked Date Timestamp:", lockedDateObj.getTime());
    
    // Daha detaylı zaman farkı analizi
    const timeDiff = lockedDateObj.getTime() - serverDateObj.getTime();
    console.log("Time Difference (ms):", timeDiff);
    console.log("Time Difference (seconds):", timeDiff / 1000);
    console.log("Time Difference (minutes):", timeDiff / (1000 * 60));
    console.log("Time Difference (hours):", timeDiff / (1000 * 60 * 60));
    
    // Tam kilit açılma anı kontrolü
    if (timeDiff === 0) {
      console.log("🔓 TAM KİLİT AÇILMA ANI - Zaman farkı 0 milisaniye");
    } else if (timeDiff > 0) {
      console.log("🔒 HENÜZ KİLİTLİ - Kilit açılmasına kalan süre:", {
        milliseconds: timeDiff,
        seconds: Math.floor(timeDiff / 1000),
        minutes: Math.floor(timeDiff / (1000 * 60)),
        hours: Math.floor(timeDiff / (1000 * 60 * 60))
      });
    } else {
      console.log("🔓 KİLİT AÇILMIŞ - Kilit açılalı geçen süre:", {
        milliseconds: Math.abs(timeDiff),
        seconds: Math.floor(Math.abs(timeDiff) / 1000),
        minutes: Math.floor(Math.abs(timeDiff) / (1000 * 60)),
        hours: Math.floor(Math.abs(timeDiff) / (1000 * 60 * 60))
      });
    }
  }

  // Program için özel kontroller
  const isCurrentProgramProgress = progress.programId === programId;
  
  // Kilit durumunu kontrol et
  const isLocked =
    isCurrentProgramProgress &&
    lockedToDate &&
    currentServerDate < new Date(lockedToDate);

  // Tamamlanan gün sayısını kontrol et
  const completedDaysCount = completedDays?.length || 0;
  const totalDays = programDetail?.days?.length || 0;
  const isAllDaysCompleted = completedDaysCount === totalDays;

  useEffect(() => {
    if (serverDate) {
      const offset = new Date(serverDate).getTime() - new Date().getTime();
      setTimeOffset(offset);
    }
  }, [serverDate]);

  useEffect(() => {
    if (!lockedToDate) return;

    const lockedTime = new Date(lockedToDate).getTime();

    const updateRemainingTime = () => {
      const now = new Date().getTime();
      const diff = lockedTime - (now + timeOffset);
      setRemainingTime(diff > 0 ? diff : 0);
    };

    updateRemainingTime();

    const interval = setInterval(updateRemainingTime, 1000);

    return () => clearInterval(interval);
  }, [lockedToDate, timeOffset]);

  const formatRemainingTime = (ms) => {
    if (ms <= 0) return "Süre doldu";

    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours} sa ${minutes} dk ${seconds} sn`;
  };

  console.log("programDetail", programDetail);
  console.log("serverDate", serverDate);
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
            onClick={() => navigate("/usersPrograms")}
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
      <a href="/" className="home-icon">
        <i className="mdi mdi-home"></i>
      </a>
      {/* Program Başlığı ve Genel Bilgiler */}
      <div className="program-header-card">
        <div className="program-header-info-mobile">
          <div className="program-header-title">
            {programDetail.title || "Program Detayı"}
          </div>
          <div className="program-header-desc">
            {programDetail.description || "Açıklama bulunmuyor."}
          </div>
          <div className="program-header-badges">
            <span className="badge bg-light text-dark rounded-pill fs-6">
              {programDetail.duration} Gün
            </span>
            <span className="badge bg-secondary text-dark  fs-6">
              Toplam:{" "}
              {formatDuration(
                calculateProgramTotalDuration(programDetail.days)
              )}
            </span>
          </div>

          <div className="program-header-actions-user">
            {user && (
              <div className="main-button">
                {isCurrentProgramProgress && programIsCompleted ? (
                  <button disabled>Program Tamamlandı 🏆</button>
                ) : !isLocked ? (
                  isRegisteredProgram?.isRegistered ? (
                    <Link
                      id="continue-program-button"
                      to={`/program/user/${programId}/starts`}
                    >
                      {isAllDaysCompleted ? "Son Günü Tekrarla" : "Devam Et"}
                    </Link>
                  ) : (
                    <button
                      onClick={handleRegisterProgram}
                      className="start-program-button"
                    >
                      Programa Başla
                    </button>
                  )
                ) : (
                  <button value={formatRemainingTime(remainingTime)} disabled>
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
                  Ana Sayfa
                </a>
              </div>
            )}
          </div>
        </div>
        {programDetail.coverImage && (
          <div className="program-header-cover-mobile">
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
            <div className="card-header">Program Günleri</div>
            <div className="list-group list-group-flush">
              {Array.isArray(programDetail.days) &&
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
                      <div className="user-program-day-list">
                        <strong>Gün {day.dayNumber}</strong>: {day.title}
                        {isCompleted && (
                          <span className="ms-2 text-success"> ✅</span>
                        )}
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
                <span>
                  Gün {activeDayData.dayNumber}: {activeDayData.title}
                </span>
                <span className="badge bg-white border border-gray text-dark step-duration-badge">
                  {formatDuration(calculateTotalDuration(activeDayData.steps))}
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
                  <div className="timeline mt-4 program-mobile">
                    {activeDayData.steps.map((step, index) => (
                      <div
                        key={`step-${step._id}-${index}`}
                        className="timeline-item"
                      >
                        <div className="card-header d-flex justify-content-between align-items-center bg-light w-100">
                          <h5 className="mb-0">
                            {step.order}. {step.title}
                          </h5>

                          <span className="badge border border-gray text-dark step-duration-badge">
                            {formatDuration(step.duration)}
                          </span>
                        </div>
                        <div className="row g-0 mb-4">
                          {step.movements && step.movements.length > 0 && (
                            <div className="col-12 col-md-8">
                              <div className="movements-container">
                                {step.movements.map((movement, index) => (
                                  <div
                                    key={`movement-${step._id}-${movement._id}-${index}`}
                                    className="movement-item mb-3 mt-3"
                                  >
                                    <h6 className="movement-title">
                                      {index + 1}. {movement.movementName}
                                    </h6>
                                    {movement.firstVideoContent && (
                                      <div className="movement-video">
                                        <video
                                          className="img-fluid rounded"
                                          controls
                                        >
                                          <source
                                            src={movement.firstVideoContent.url}
                                            type="video/mp4"
                                          />
                                          Tarayıcınız video etiketini
                                          desteklemiyor.
                                        </video>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {/* <div className="col-12 col-md-8">
                            <div className="card h-100">
                              <div className="card-body">
                                <p className="mb-0">
                                  {step.description ||
                                    "Bu adım için açıklama bulunmuyor."}
                                </p>
                              </div>
                            </div>
                          </div> */}
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
  );
};

export default BoxingProgramDetail;
