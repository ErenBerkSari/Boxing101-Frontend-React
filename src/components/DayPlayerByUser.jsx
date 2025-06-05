import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../css/dayPlayerByUser.css";
const DayPlayerByUser = ({ day, onComplete, programId }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [dayCompleted, setDayCompleted] = useState(false);
  const [activeVideos, setActiveVideos] = useState({});
  const [videoErrors, setVideoErrors] = useState({});
  const [testResults, setTestResults] = useState({});

  const navigate = useNavigate();
  const videoRefs = useRef({});
  const timerRef = useRef(null);

  // Gün değiştiğinde, ilk adıma dön ve zamanı ayarla
  useEffect(() => {
    if (day && day.steps && day.steps.length > 0) {
      setCurrentStepIndex(0);
      setTimeLeft(day.steps[0].duration || 0);
      setIsPlaying(false);
      setDayCompleted(false);
      setActiveVideos({});
      setVideoErrors({});
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [day]);

  // Adım değiştiğinde videoları güncelle
  useEffect(() => {
    const currentStep = day?.steps?.[currentStepIndex];
    if (currentStep) {
      console.log("Current Step:", currentStep);
      console.log("Movements:", currentStep.movements);

      // Tüm videoları durdur
      Object.values(videoRefs.current).forEach((video) => {
        if (video) {
          video.pause();
          video.currentTime = 0; // Videoyu başa sar
        }
      });

      // Yeni adımın videolarını hazırla
      const newActiveVideos = {};
      if (currentStep.movements && Array.isArray(currentStep.movements)) {
        currentStep.movements.forEach((movement) => {
          if (
            movement &&
            movement.firstVideoContent &&
            movement.firstVideoContent.url
          ) {
            console.log("Video Content:", movement.firstVideoContent);
            newActiveVideos[movement._id] = false;
          }
        });
      }
      setActiveVideos(newActiveVideos);
      setVideoErrors({}); // Hataları sıfırla
    }
  }, [currentStepIndex, day]);

  // Sayacı yönet
  useEffect(() => {
    if (!isPlaying || timeLeft <= 0) return;

    timerRef.current = setTimeout(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeLeft, isPlaying]);

  // Zaman bittiğinde sonraki adıma geç
  useEffect(() => {
    if (isPlaying && timeLeft <= 0) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      // Tüm videoları durdur
      Object.values(videoRefs.current).forEach((video) => {
        if (video) {
          video.pause();
          video.currentTime = 0;
        }
      });

      // Sonraki adıma geç
      if (currentStepIndex < day.steps.length - 1) {
        const nextIndex = currentStepIndex + 1;
        setCurrentStepIndex(nextIndex);
        setTimeLeft(day.steps[nextIndex].duration || 0);
        setIsPlaying(false);
      } else {
        // Tüm adımlar tamamlandı
        setDayCompleted(true);
        handleCompleteDay();
        navigate(`/completeDay/${programId}`);
        setIsPlaying(false);
      }
    }
  }, [timeLeft, currentStepIndex, day, isPlaying, programId, navigate]);

  // Başlat durdur işleyicisi
  const togglePlayPause = async () => {
    if (dayCompleted) return;

    const newPlayingState = !isPlaying;
    setIsPlaying(newPlayingState);
  };

  // Video oynatma durumunu güncelle
  const handleVideoPlay = (videoId) => {
    setActiveVideos((prev) => ({
      ...prev,
      [videoId]: true,
    }));
  };

  const handleVideoPause = (videoId) => {
    setActiveVideos((prev) => ({
      ...prev,
      [videoId]: false,
    }));
  };

  // Video hata işleyicisi
  const handleVideoError = (videoId, error) => {
    console.error(`Video ${videoId} yüklenirken hata:`, error);
    setVideoErrors((prev) => ({ ...prev, [videoId]: true }));
  };

  // Video yüklenme işleyicisi
  const handleVideoLoad = (videoId) => {
    console.log(`Video ${videoId} başarıyla yüklendi`);
    setVideoErrors((prev) => ({ ...prev, [videoId]: false }));
  };

  // Günü tamamla
  const handleCompleteDay = () => {
    if (onComplete) {
      onComplete(currentStepIndex);
    }
  };

  // Adımı atla fonksiyonu
  const skipToNextStep = () => {
    if (currentStepIndex < day.steps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      setTimeLeft(day.steps[nextIndex].duration || 0);
      setIsPlaying(false);

      // Tüm videoları durdur
      Object.values(videoRefs.current).forEach((video) => {
        if (video) {
          video.pause();
          video.currentTime = 0;
        }
      });
    } else {
      setDayCompleted(true);
      setIsPlaying(false);
    }
  };

  // Formatlanmış süre
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Video URL'lerini test et
  const testVideoUrls = async () => {
    const results = {};
    const currentStep = day?.steps?.[currentStepIndex];
    if (currentStep) {
      for (const movement of currentStep.movements) {
        if (movement.firstVideoContent?.url) {
          try {
            const response = await fetch(movement.firstVideoContent.url, {
              method: "HEAD",
            });
            results[movement._id] = {
              status: response.status,
              ok: response.ok,
              url: movement.firstVideoContent.url,
            };
          } catch (error) {
            results[movement._id] = {
              error: error.message,
              url: movement.firstVideoContent.url,
            };
          }
        }
      }
    }
    setTestResults(results);
    console.log("Video URL Test Results:", results);
  };

  if (!day || !day.steps || day.steps.length === 0) {
    return (
      <div className="alert alert-warning">Bu gün için adım bulunamadı.</div>
    );
  }

  const currentStep = day.steps[currentStepIndex];
  const progress =
    ((currentStepIndex + (dayCompleted ? 1 : 0)) / day.steps.length) * 100;

  return (
    <div>
      {/* Gün başlığı ve açıklama */}
      <div className="mb-4">
        <h2 className="mb-2">
          Gün {day.dayNumber}: {day.title}
        </h2>
        <p className="lead">{day.description}</p>
      </div>

      {/* İlerleme çubuğu */}
      <div className="progress mb-4" style={{ height: "10px" }}>
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: `${progress}%`, backgroundColor: "#ed563b" }}
          aria-valuenow={progress}
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>

      {/* Adım içeriği */}
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h3 className="mb-0">
            Adım {currentStep.order}: {currentStep.title}
          </h3>
          <span
            style={{ backgroundColor: "#ed563b" }}
            className="badge text-white rounded-pill"
          >
            {formatTime(timeLeft)}
          </span>
        </div>
        <div className="card-body">
          {currentStep.description && (
            <p className="mb-4">{currentStep.description}</p>
          )}

          {/* Hareket videoları */}
          {currentStep.movements &&
            Array.isArray(currentStep.movements) &&
            currentStep.movements.length > 0 && (
              <div
                className="movements-grid mb-4"
                style={{
                  display: "flex",
                  gap: "20px",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                }}
              >
                {currentStep.movements.map((movement, index) => {
                  if (
                    !movement ||
                    !movement.firstVideoContent ||
                    !movement.firstVideoContent.url
                  ) {
                    console.warn(
                      `Hareket ${index} için video bulunamadı:`,
                      movement
                    );
                    return null;
                  }

                  const videoId = movement._id || `movement-${index}`;
                  const hasError = videoErrors[videoId];
                  const testResult = testResults[videoId];

                  return (
                    <div
                      key={videoId}
                      className="movement-video-container"
                      style={{
                        border: "1px solid #ddd",
                        padding: "15px",
                        borderRadius: "8px",
                        backgroundColor: hasError ? "#fff5f5" : "#fff",
                        width: "200px",
                        height: "200px",
                      }}
                    >
                      <h5
                        style={{ textAlign: "center",fontSize:"1.4rem" }}
                        className="movement-title mb-3"
                      >
                        {movement.movementName || `Hareket ${index + 1}`}
                      </h5>

                      {hasError ? (
                        <div className="alert alert-danger">
                          <small>Video yüklenirken hata oluştu</small>
                          <br />
                          <small className="text-muted">
                            URL: {movement.firstVideoContent.url}
                          </small>
                          {testResult && (
                            <div className="mt-2">
                              <small>
                                Test Sonucu: {testResult.ok ? "✅" : "❌"}
                                {testResult.error && ` - ${testResult.error}`}
                              </small>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div
                          className="ratio ratio-16x9 mb-3"
                          style={{ backgroundColor: "#f5f5f5" }}
                        >
                          <video
                            ref={(el) => {
                              if (el) {
                                videoRefs.current[videoId] = el;
                                console.log(
                                  "Video ref set for:",
                                  videoId,
                                  movement.firstVideoContent.url
                                );
                              }
                            }}
                            className="rounded"
                            controls
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="auto"
                            style={{
                              width: "100%",
                              height: "130px",
                              objectFit: "cover",
                              backgroundColor: "#000",
                            }}
                            onPlay={() => handleVideoPlay(videoId)}
                            onPause={() => handleVideoPause(videoId)}
                            onError={(e) => handleVideoError(videoId, e)}
                            onLoadedData={() => handleVideoLoad(videoId)}
                            onLoadStart={() =>
                              console.log(`Video ${videoId} yüklenmeye başladı`)
                            }
                            onCanPlay={() => {
                              console.log(`Video ${videoId} oynatılmaya hazır`);
                              // Video hazır olduğunda otomatik başlat
                              const video = videoRefs.current[videoId];
                              if (video) {
                                video.play().catch((error) => {
                                  console.error(
                                    `Video ${videoId} başlatılamadı:`,
                                    error
                                  );
                                });
                              }
                            }}
                          >
                            <source
                              src={movement.firstVideoContent.url}
                              type="video/mp4"
                            />
                            Tarayıcınız video etiketini desteklemiyor.
                          </video>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

          {/* Zaman göstergesi */}
          <div className="text-center">
            <h2
              className={`display-1 mb-3 ${
                timeLeft <= 5 && isPlaying ? "text-danger" : ""
              }`}
            >
              {formatTime(timeLeft)}
            </h2>
          </div>
        </div>
      </div>

      {/* Kontrol düğmeleri */}
      <div className="d-flex justify-content-center gap-3">
        <button
          className={`btn ${isPlaying ? "btn-danger" : "btn-success"} btn-lg`}
          onClick={togglePlayPause}
          disabled={dayCompleted}
        >
          {isPlaying ? "Duraklat" : "Başlat"}
        </button>
        {currentStepIndex < day.steps.length - 1 && (
          <button
            className="btn btn-outline-primary btn-lg"
            onClick={skipToNextStep}
          >
            Sonraki Adım
          </button>
        )}
      </div>

    </div>
  );
};

export default DayPlayerByUser;
