import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../css/dayPlayerByUser.css";
import VideoComponent from "./VideoComponent";

const DayPlayerByUser = ({ day, onComplete, programId }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [dayCompleted, setDayCompleted] = useState(false);
  const [activeVideos, setActiveVideos] = useState({});
  const [videoErrors, setVideoErrors] = useState({});
  const [testResults, setTestResults] = useState({});
  const [videoReady, setVideoReady] = useState({});

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
      // Tüm videoları durdur ve referansları temizle
      Object.values(videoRefs.current).forEach((video) => {
        if (video) {
          video.pause();
        }
      });
      videoRefs.current = {};

      // Yeni adımın videolarını hazırla
      const newActiveVideos = {};
      if (currentStep.movements && Array.isArray(currentStep.movements)) {
        currentStep.movements.forEach((movement) => {
          if (
            movement &&
            movement.firstVideoContent &&
            movement.firstVideoContent.url
          ) {
            newActiveVideos[movement._id] = false;
          }
        });
      }
      setActiveVideos(newActiveVideos);
      setVideoErrors({}); // Hataları sıfırla
      setVideoReady({});
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
          try {
            video.pause();
          } catch (error) {
            console.error("Video pause error:", error);
          }
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

    // Videoları da başlat/duraklat
    Object.entries(videoRefs.current).forEach(([videoId, video]) => {
      if (video) {
        try {
          if (newPlayingState) {
            if (videoReady[videoId]) {
              video.play().catch((error) => {
                console.error("Video could not be started:", error);
              });
            }
          } else {
            video.pause();
          }
        } catch (error) {
          console.error("Video control error:", error);
        }
      }
    });
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
    console.error(`Video ${videoId} loading error:`, error);
    setVideoErrors((prev) => ({ ...prev, [videoId]: true }));
  };

  // Video yüklenme işleyicisi
  const handleVideoLoad = (videoId) => {
    setVideoErrors((prev) => ({ ...prev, [videoId]: false }));
    setVideoReady((prev) => ({ ...prev, [videoId]: true }));
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
          try {
            video.pause();
          } catch (error) {
            console.error("Video pause error:", error);
          }
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
  };

  if (!day || !day.steps || day.steps.length === 0) {
    return (
      <div className="alert alert-warning">No steps found for this day.</div>
    );
  }

  const currentStep = day.steps[currentStepIndex];
  const progress =
    ((currentStepIndex + (dayCompleted ? 1 : 0)) / day.steps.length) * 100;

  return (
    <div>
      <div className="day-player-card">
        <div className="day-player-header">
          Day {day.dayNumber}: {day.title}
        </div>
        <div style={{ padding: '16px' }}>
          <div className="day-player-step-title">
            <span>Step {currentStep.order}: {currentStep.title}</span>
            <span className="day-player-badge">{formatTime(timeLeft)}</span>
          </div>
          {day.description && (
            <p style={{ fontSize: '1rem', color: '#444', marginBottom: 12 }}>{day.description}</p>
          )}
          <div className="day-player-progress">
            <div
              className="day-player-progress-bar"
              role="progressbar"
              style={{ width: `${progress}%` }}
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
          {currentStep.description && (
            <p style={{ fontSize: '0.98rem', color: '#666', marginBottom: 10 }}>{currentStep.description}</p>
          )}
          {/* Hareket videoları */}
          {currentStep.movements &&
            Array.isArray(currentStep.movements) &&
            currentStep.movements.length > 0 && (
              <div className="day-player-video" style={{ marginBottom: 16 }}>
                {currentStep.movements.map((movement, index) => {
                  if (
                    !movement ||
                    !movement.firstVideoContent ||
                    !movement.firstVideoContent.url
                  ) {
                    return null;
                  }
                  const videoId = movement._id || `movement-${index}`;
                  const hasError = videoErrors[videoId];
                  const testResult = testResults[videoId];
                  return (
                    <div  key={videoId} style={{ marginBottom: 12 }}>
                      <h5 style={{ textAlign: "center",justifyContent:"center", fontSize: "1.1rem", marginBottom: 6 }}>
                        {movement.movementName || `Movement ${index + 1}`}
                      </h5>
                      {hasError ? (
                        <div className="alert alert-danger">
                          <small>Error occurred while loading video</small>
                          <br />
                          <small className="text-muted">
                            URL: {movement.firstVideoContent.url}
                          </small>
                          {testResult && (
                            <div className="mt-2">
                              <small>
                                Test Result: {testResult.ok ? "✅" : "❌"}
                                {testResult.error && ` - ${testResult.error}`}
                              </small>
                            </div>
                          )}
                        </div>
                      ) : (
                        <VideoComponent
                          ref={(el) => {
                            if (el) {
                              videoRefs.current[videoId] = el;
                            }
                          }}
                          videoUrl={movement.firstVideoContent.url}
                          hideControls={true}
                          loop={true}
                          muted={true}
                          autoPlay={false}
                          playsInline
                          onPlay={() => handleVideoPlay(videoId)}
                          onPause={() => handleVideoPause(videoId)}
                          onError={(e) => handleVideoError(videoId, e)}
                          onLoadedData={() => handleVideoLoad(videoId)}
                          style={{
                            width: "100%",
                            height: "180px",
                            objectFit: "cover",
                            backgroundColor: "#000",
                            borderRadius: 8,
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          <div className="day-player-timer">
            {formatTime(timeLeft)}
          </div>
          <div className="day-player-controls">
            <button
              className="day-player-btn"
              onClick={togglePlayPause}
              style={{ background: isPlaying ? '#ff8c42' : '#ed563b' }}
              disabled={dayCompleted}
            >
              {isPlaying ? "Pause" : "Start"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayPlayerByUser;
