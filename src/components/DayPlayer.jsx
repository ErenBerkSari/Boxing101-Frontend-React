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
      <div className="alert alert-warning">Bu gün için adım bulunamadı.</div>
    );
  }
  console.log("nerde bu amkdum", dayCompleted);
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
          style={{ width: `${progress}%`, backgroundColor: '#ed563b' }}
          aria-valuenow={progress}
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
      <>
        {/* Adım içeriği */}
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h3  className="mb-0">
              Adım {currentStep.order}: {currentStep.title}
            </h3>
            <span style={{ backgroundColor: '#ed563b' }} className="badge text-white rounded-pill">
              {formatTime(timeLeft)}
            </span>
          </div>
          <div className="card-body">
            {currentStep.description && (
              <p className="mb-4">{currentStep.description}</p>
            )}

            {/* Video içeriği */}
            {currentStep.videoUrl && (
              <div className="ratio ratio-16x9 mb-4">
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
        <div className="d-flex justify-content-center">
          <button
            className={`btn ${isPlaying ? "btn-danger" : "btn-success"} btn-lg`}
            onClick={togglePlayPause}
          >
            {isPlaying ? "Duraklat" : "Başlat"}
          </button>
        </div>
      </>
    </div>
  );
};

export default DayPlayer;
