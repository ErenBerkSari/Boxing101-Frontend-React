import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../css/dayPlayerByUser.css";
import VideoComponent from "./VideoComponent";

const DayPlayerByUser = ({ day, onComplete, programId }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [dayCompleted, setDayCompleted] = useState(false);

  const navigate = useNavigate();
  const videoRefs = useRef({});
  const timerRef = useRef(null);
  const timerStartTime = useRef(null);

  const currentStep = day?.steps?.[currentStepIndex];

  // Timer başlat
  const startTimer = useCallback(() => {
    if (!currentStep) return;

    if (timerRef.current) clearInterval(timerRef.current);

    const stepDuration = currentStep.duration || 0;
    const startTime = Date.now();
    timerStartTime.current = startTime;

    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(stepDuration - elapsed, 0);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        stopTimer();
        moveToNextStep();
      }
    }, 500);
  }, [currentStep]);

  // Timer durdur
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Sonraki adıma geç
  const moveToNextStep = () => {
    if (currentStepIndex < day.steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setIsPlaying(false);
    } else {
      setDayCompleted(true);
      onComplete?.(currentStepIndex);
      navigate(`/completeDay/${programId}`);
    }

    Object.values(videoRefs.current).forEach((video) => {
      video?.pause?.();
    });
  };

  // Adım değiştiğinde sıfırla
  useEffect(() => {
    if (currentStep) {
      setTimeLeft(currentStep.duration || 0);
      setIsPlaying(false);
      stopTimer();

      Object.values(videoRefs.current).forEach((video) => {
        video?.pause?.();
      });
      videoRefs.current = {};
    }
  }, [currentStep, stopTimer]);

  // Oynatma/duraklatma
  const togglePlayPause = () => {
    if (dayCompleted) return;

    if (!isPlaying) {
      startTimer();
    } else {
      stopTimer();
    }

    setIsPlaying(!isPlaying);

    Object.entries(videoRefs.current).forEach(([id, video]) => {
      if (video?.play && video?.pause) {
        if (!isPlaying) {
          video.play().catch(console.error);
        } else {
          video.pause();
        }
      }
    });
  };

  const skipToNextStep = () => {
    moveToNextStep();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (!day || !day.steps?.length) {
    return <div className="alert alert-warning">No steps found for this day.</div>;
  }

  const progress = ((currentStepIndex + (dayCompleted ? 1 : 0)) / day.steps.length) * 100;

  return (
    <div>
      <div className="day-player-by-user-card">
        <div className="day-player-by-user-header">
          Day {day.dayNumber}: {day.title}
        </div>
        <div style={{ padding: '16px' }}>
          <div className="day-player-by-user-step-title">
            <span>Step {currentStep.order}: {currentStep.title}</span>
            <span className="day-player-by-user-badge">{formatTime(timeLeft)}</span>
          </div>
          {day.description && (
            <p style={{ fontSize: '1rem', color: '#444', marginBottom: 12 }}>{day.description}</p>
          )}
          <div className="day-player-by-user-progress">
            <div
              className="day-player-by-user-progress-bar"
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

          {currentStep.movements?.length > 0 && (
            <div className="day-player-by-user-video" style={{ marginBottom: 16 }}>
              {currentStep.movements.map((movement, index) => {
                if (!movement?.firstVideoContent?.url) return null;
                const videoId = `movement-${index}`;
                return (
                  <div key={index} style={{ marginBottom: 12 }}>
                    <div className="day-player-by-user-video-wrapper">
                      <div className="day-player-by-user-movement-title-overlay">
                        {movement.movementName || `Movement ${index + 1}`}
                      </div>
                      <VideoComponent
                        ref={(el) => {
                          if (el) {
                            videoRefs.current[videoId] = el;
                          } else {
                            delete videoRefs.current[videoId];
                          }
                        }}
                        videoUrl={movement.firstVideoContent.url}
                        hideControls
                        loop
                        muted
                        autoPlay={false}
                        playsInline
                        style={{
                          width: "100%",
                          aspectRatio: "16/9",
                          objectFit: "cover",
                          backgroundColor: "#000",
                          borderRadius: "8px",
                          maxHeight: "260px",
                          display: "block"
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="day-player-by-user-timer">
            {formatTime(timeLeft)}
          </div>

          <div className="day-player-by-user-controls">
            <button
              className="day-player-by-user-btn"
              onClick={togglePlayPause}
              style={{ background: isPlaying ? '#ff8c42' : '#ed563b' }}
              disabled={dayCompleted}
            >
              {isPlaying ? "Pause" : "Start"}
            </button>
            <button
              className="day-player-by-user-btn"
              onClick={skipToNextStep}
              style={{ background: '#6c757d', marginLeft: '10px' }}
            >
              Skip Step
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayPlayerByUser;
