import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getProgramDetail } from "../redux/slices/programSlice";
import StepPlayer from "./StepPlayer";

const StartProgram = () => {
  const { programId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [programCompleted, setProgramCompleted] = useState(false);

  const { programDetail, loading } = useSelector((state) => state.program);

  // Program verilerini getir
  useEffect(() => {
    if (programId) {
      dispatch(getProgramDetail(programId));
    }
  }, [dispatch, programId]);

  // Bir günün tamamlanma işlemi
  const handleDayComplete = () => {
    // Eğer sonraki gün varsa ona geç
    if (
      programDetail &&
      programDetail.days &&
      activeDayIndex < programDetail.days.length - 1
    ) {
      setActiveDayIndex((prevIndex) => prevIndex + 1);
    } else {
      // Tüm program tamamlandı
      setProgramCompleted(true);
    }

    // Burada ilerleme kaydedilebilir (API çağrısı yapılabilir)
    // saveUserProgress(programId, activeDayIndex + 1);
  };

  // Yükleme ekranı
  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Yükleniyor...</span>
        </div>
        <p className="mt-3">Program yükleniyor...</p>
      </div>
    );
  }

  // Program bulunamadı
  if (
    !programDetail ||
    !programDetail.days ||
    programDetail.days.length === 0
  ) {
    return (
      <div className="p-4">
        <div className="alert alert-warning">
          <h4>Program bulunamadı</h4>
          <p>Program bilgisi yüklenemedi veya program günü bulunmuyor.</p>
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

  // Program tamamlandı
  if (programCompleted) {
    return (
      <div className="p-4 text-center">
        <div className="alert alert-success">
          <h2>Tebrikler!</h2>
          <p>{programDetail.title} programını başarıyla tamamladınız.</p>
          <button
            className="btn btn-primary mt-3"
            onClick={() => navigate(`/program/${programId}`)}
          >
            Program Detayına Dön
          </button>
        </div>
      </div>
    );
  }

  // Aktif gün
  const activeDay = programDetail.days[activeDayIndex];

  // Günün adımlarını StepPlayer'a uygun formata dönüştür
  const steps = activeDay.steps.map((step) => ({
    id: step._id,
    title: step.title,
    description: step.description || "",
    duration: step.duration,
    video: step.videoUrl,
  }));

  return (
    <div className="p-4">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="mb-0">{programDetail.title}</h2>
            <span className="badge bg-light text-dark">
              Gün {activeDay.dayNumber}/{programDetail.duration}
            </span>
          </div>
        </div>
        <div className="card-body">
          <h3 className="mb-3">{activeDay.title}</h3>
          <p className="lead mb-4">{activeDay.description}</p>

          <StepPlayer steps={steps} onComplete={handleDayComplete} />
        </div>
      </div>
    </div>
  );
};

export default StartProgram;
