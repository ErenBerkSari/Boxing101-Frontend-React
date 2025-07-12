import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import VideoComponent from "./VideoComponent";

const DayPlayer = ({ day, onComplete, programId }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [dayCompleted, setDayCompleted] = useState(false);

  const navigate = useNavigate();
  const videoRef = useRef(null);
  const timerRef = useRef(null);

  // Gün değiştiğinde, ilk adıma dön ve zamanı ayarla
  useEffect(() => {
    if (day && day.steps && day.steps.length > 0) {
      setCurrentStepIndex(0);
      setTimeLeft(day.steps[0].duration || 0);
      setIsPlaying(false);
      setDayCompleted(false);
    }

    return () => {
      // Component unmount olduğunda timer'ı temizle
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [day]);

  // Adım değiştiğinde videoyu güncelle
  useEffect(() => {
    if (day?.steps?.[currentStepIndex]?.videoUrl && videoRef.current) {
      // videoRef.current.load(); // Bu satıra artık gerek yok, video key değişince yeniden yükleniyor
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

  // Günü tamamla - Son tamamlanan adımı da gönder
  const handleCompleteDay = useCallback(() => {
    if (onComplete) {
      onComplete(currentStepIndex);
    }
  }, [onComplete, currentStepIndex]);

  // Zaman bittiğinde sonraki adıma geç
  useEffect(() => {
    if (isPlaying && timeLeft <= 0) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      // Sonraki adıma geç
      if (currentStepIndex < day.steps.length - 1) {
        const nextIndex = currentStepIndex + 1;
        setCurrentStepIndex(nextIndex);
        setTimeLeft(day.steps[nextIndex].duration || 0);
        // isPlaying true kaldığı için yeni video otomatik başlayacak
      } else {
        // Tüm adımlar tamamlandı
        setDayCompleted(true);
        handleCompleteDay();
        navigate(`/completeDay/${programId}`);
        setIsPlaying(false);
      }
    }
  }, [timeLeft, isPlaying, currentStepIndex, day, navigate, programId, handleCompleteDay]);

  // Başlat durdur işleyicisi
  const togglePlayPause = () => {
    if (dayCompleted) return;
    setIsPlaying((prev) => !prev);
    // Artık doğrudan video kontrolü yok, sadece state güncelleniyor
  };

  // Adımı atla fonksiyonu
  const skipToNextStep = () => {
    if (currentStepIndex < day.steps.length - 1) {
      // Sonraki adıma geç
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      setTimeLeft(day.steps[nextIndex].duration || 0);
      setIsPlaying(false);
    } else {
      // Son adım, günü tamamla
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
      {/* Gün başlığı ve açıklama */}
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
          {currentStep.videoUrl && (
            <div className="day-player-video">
              <VideoComponent
                ref={videoRef}
                videoUrl={currentStep.videoUrl}
                hideControls={true}
                loop={true}
                muted={true}
                autoPlay={isPlaying}
                key={`video-${currentStepIndex}`}
              />
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
            >
              {isPlaying ? "Pause" : "Start"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayPlayer;
