// import { useEffect, useState, useRef } from "react";

// const StepPlayer = ({ steps, onComplete }) => {
//   const [currentStepIndex, setCurrentStepIndex] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(steps[0]?.duration || 0);
//   const timerRef = useRef(null);

//   useEffect(() => {
//     if (timeLeft === 0) {
//       // Sonraki adıma geç
//       if (currentStepIndex < steps.length - 1) {
//         const nextIndex = currentStepIndex + 1;
//         setCurrentStepIndex(nextIndex);
//         setTimeLeft(steps[nextIndex].duration);
//       } else {
//         // Tüm adımlar bitti
//         if (onComplete) onComplete();
//       }
//       return;
//     }

//     // Sayaç başlat
//     timerRef.current = setTimeout(() => {
//       setTimeLeft((prev) => prev - 1);
//     }, 1000);

//     // Temizlik
//     return () => clearTimeout(timerRef.current);
//   }, [timeLeft, currentStepIndex, steps, onComplete]);

//   if (!steps[currentStepIndex]) return <div>Adım bulunamadı.</div>;

//   const currentStep = steps[currentStepIndex];

//   return (
//     <div className="text-center">
//       <h2 className="text-2xl font-bold mb-2">{currentStep.title}</h2>
//       <p className="text-lg mb-4">{currentStep.description}</p>

//       {currentStep.video && (
//         <video width="400" controls autoPlay>
//           <source src={currentStep.video} type="video/mp4" />
//           Tarayıcınız video etiketini desteklemiyor.
//         </video>
//       )}

//       <div className="text-4xl mt-4 text-red-600">{timeLeft}s</div>
//     </div>
//   );
// };

// export default StepPlayer;
import { useEffect, useState, useRef } from "react";

const StepPlayer = ({ steps, onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(steps[0]?.duration || 0);
  const [isPlaying, setIsPlaying] = useState(false);

  const videoRef = useRef(null);
  const timerRef = useRef(null);

  // Adımlar değiştiğinde zamanı sıfırla
  useEffect(() => {
    if (steps && steps.length > 0) {
      setCurrentStepIndex(0);
      setTimeLeft(steps[0].duration || 0);
      setIsPlaying(false);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [steps]);

  // Sayaç yönetimi
  useEffect(() => {
    if (!isPlaying) return;

    if (timeLeft <= 0) {
      // Sonraki adıma geç
      if (currentStepIndex < steps.length - 1) {
        const nextIndex = currentStepIndex + 1;
        setCurrentStepIndex(nextIndex);
        setTimeLeft(steps[nextIndex].duration);

        // Video otomatik oynat (varsa)
        if (videoRef.current) {
          videoRef.current.load();
          videoRef.current
            .play()
            .catch((e) => console.log("Video otomatik başlatılamadı:", e));
        }
      } else {
        // Tüm adımlar bitti
        setIsPlaying(false);
        if (onComplete) onComplete();
      }
      return;
    }

    // Zamanı azalt
    timerRef.current = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    // Temizlik
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, currentStepIndex, steps, onComplete, isPlaying]);

  // Başlat/Duraklat fonksiyonu
  const togglePlay = () => {
    setIsPlaying(!isPlaying);

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

  // Önceki adıma git
  const goToPrevStep = () => {
    if (currentStepIndex > 0) {
      setIsPlaying(false);
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      setTimeLeft(steps[prevIndex].duration);
    }
  };

  // Sonraki adıma git
  const goToNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setIsPlaying(false);
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      setTimeLeft(steps[nextIndex].duration);
    } else if (onComplete) {
      onComplete();
    }
  };

  // Formatlanmış süre
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (!steps || !steps.length || !steps[currentStepIndex]) {
    return <div className="alert alert-warning">Adım bulunamadı.</div>;
  }

  const currentStep = steps[currentStepIndex];
  const progress = (currentStepIndex / steps.length) * 100;

  return (
    <div className="step-player">
      {/* İlerleme çubuğu */}
      <div className="progress mb-3">
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: `${progress}%` }}
          aria-valuenow={progress}
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>

      {/* Adım başlığı */}
      <h2 className="text-2xl font-bold mb-2">
        {currentStepIndex + 1}/{steps.length}: {currentStep.title}
      </h2>

      {/* Adım açıklaması */}
      <p className="text-lg mb-4">{currentStep.description}</p>

      {/* Video gösterimi */}
      {currentStep.video && (
        <div className="mb-4">
          <video
            ref={videoRef}
            className="w-100 rounded shadow"
            controls={!isPlaying}
          >
            <source src={currentStep.video} type="video/mp4" />
            Tarayıcınız video etiketini desteklemiyor.
          </video>
        </div>
      )}

      {/* Zaman göstergesi */}
      <div
        className={`text-4xl mt-4 ${
          timeLeft <= 5 && isPlaying ? "text-danger" : ""
        }`}
      >
        {formatTime(timeLeft)}
      </div>

      {/* Kontrol düğmeleri */}
      <div className="d-flex justify-content-between mt-4">
        <button
          className="btn btn-outline-secondary"
          onClick={goToPrevStep}
          disabled={currentStepIndex === 0}
        >
          Önceki
        </button>

        <button
          className={`btn ${isPlaying ? "btn-danger" : "btn-success"} btn-lg`}
          onClick={togglePlay}
        >
          {isPlaying ? "Duraklat" : "Başlat"}
        </button>

        <button className="btn btn-outline-primary" onClick={goToNextStep}>
          {currentStepIndex < steps.length - 1 ? "Sonraki" : "Tamamla"}
        </button>
      </div>
    </div>
  );
};

export default StepPlayer;
