import { useState, useEffect, useRef } from "react";

const DayPlayer = ({ day, onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [dayCompleted, setDayCompleted] = useState(false);

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
  }, [day]);

  // Sayacı yönet
  useEffect(() => {
    if (!isPlaying || timeLeft <= 0) return;

    timerRef.current = setTimeout(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearTimeout(timerRef.current);
  }, [timeLeft, isPlaying]);

  // Zaman bittiğinde sonraki adıma geç
  useEffect(() => {
    if (isPlaying && timeLeft <= 0) {
      clearTimeout(timerRef.current);

      // Sonraki adıma geç
      if (currentStepIndex < day.steps.length - 1) {
        const nextIndex = currentStepIndex + 1;
        setCurrentStepIndex(nextIndex);
        setTimeLeft(day.steps[nextIndex].duration || 0);

        // Video otomatik oynat (varsa)
        if (videoRef.current) {
          videoRef.current.load();
          videoRef.current
            .play()
            .catch((e) => console.log("Video otomatik başlatılamadı:", e));
        }
      } else {
        // Tüm adımlar tamamlandı
        setDayCompleted(true);
        setIsPlaying(false);
      }
    }
  }, [timeLeft, currentStepIndex, day, isPlaying]);

  // Başlat durdur işleyicisi
  const togglePlayPause = () => {
    if (dayCompleted) return;

    setIsPlaying((prev) => !prev);

    // Video kontrolü
    if (videoRef.current) {
      if (!isPlaying) {
        videoRef.current
          .play()
          .catch((e) => console.log("Video başlatılamadı:", e));
      } else {
        videoRef.current.pause();
      }
    }
  };

  // Sonraki adıma geç
  const handleNextStep = () => {
    if (currentStepIndex < day.steps.length - 1) {
      setIsPlaying(false);
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      setTimeLeft(day.steps[nextIndex].duration || 0);
    } else {
      setDayCompleted(true);
    }
  };

  // Önceki adıma dön
  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setIsPlaying(false);
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      setTimeLeft(day.steps[prevIndex].duration || 0);
    }
  };

  // Günü tamamla
  const handleCompleteDay = () => {
    if (onComplete) onComplete();
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

  const currentStep = day.steps[currentStepIndex];
  const progress = (currentStepIndex / day.steps.length) * 100;

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
          style={{ width: `${progress}%` }}
          aria-valuenow={progress}
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>

      {dayCompleted ? (
        <div className="text-center my-5">
          <div className="alert alert-success">
            <h3>Tebrikler!</h3>
            <p className="lead">Gün {day.dayNumber} tamamlandı.</p>
          </div>
          <button
            className="btn btn-primary btn-lg mt-3"
            onClick={handleCompleteDay}
          >
            Sonraki Güne Geç
          </button>
        </div>
      ) : (
        <>
          {/* Adım içeriği */}
          <div className="card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h3 className="mb-0">
                Adım {currentStep.order}: {currentStep.title}
              </h3>
              <span className="badge bg-primary rounded-pill">
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
                  <video
                    ref={videoRef}
                    className="rounded"
                    controls={!isPlaying}
                  >
                    <source src={currentStep.videoUrl} type="video/mp4" />
                    Tarayıcınız video etiketini desteklemiyor.
                  </video>
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
          <div className="d-flex justify-content-between">
            <button
              className="btn btn-outline-secondary"
              onClick={handlePrevStep}
              disabled={currentStepIndex === 0}
            >
              Önceki Adım
            </button>

            <button
              className={`btn ${
                isPlaying ? "btn-danger" : "btn-success"
              } btn-lg`}
              onClick={togglePlayPause}
            >
              {isPlaying ? "Duraklat" : "Başlat"}
            </button>

            <button
              className="btn btn-outline-primary"
              onClick={handleNextStep}
              disabled={currentStepIndex === day.steps.length - 1}
            >
              Sonraki Adım
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DayPlayer;
