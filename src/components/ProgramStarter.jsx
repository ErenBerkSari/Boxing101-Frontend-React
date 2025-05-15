import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getProgramDetail } from "../redux/slices/programSlice";
import { completeProgramDay } from "../redux/slices/userSlice"; // completeProgramDay eklendi
import DayPlayer from "./DayPlayer";

const ProgramStarter = () => {
  const { programId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Kullanıcının program içindeki ilerlemesini takip etmek için state
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [programCompleted, setProgramCompleted] = useState(false);

  // Redux'tan program detaylarını ve kullanıcı durumunu al
  const { programDetail, loading, errorMessage } = useSelector(
    (state) => state.program
  );

  const { userIsLoading, error: userError } = useSelector(
    (state) => state.user
  );

  // Program detaylarını yükle
  useEffect(() => {
    if (programId) {
      dispatch(getProgramDetail(programId));
    }
  }, [dispatch, programId]);

  // Program gününü tamamlama işleyicisi
  const handleDayComplete = async (lastCompletedStep = 0) => {
    if (
      !programDetail ||
      !programDetail.days ||
      !programDetail.days[currentDayIndex]
    ) {
      return;
    }

    const currentDay = programDetail.days[currentDayIndex];

    try {
      // Redux action'ını dispatch et
      await dispatch(
        completeProgramDay({
          programId,
          dayId: currentDay._id, // Gün ID'si
          lastCompletedStep,
        })
      ).unwrap(); // unwrap ile promise'ı çöz ve hataları yakala

      // İşlem başarılı olduktan sonra
      // Eğer başka gün varsa, sonraki güne geç
      if (currentDayIndex < programDetail.days.length - 1) {
        setCurrentDayIndex((prevIndex) => prevIndex + 1);
      } else {
        // Program tamamlandı
        setProgramCompleted(true);
      }
    } catch (error) {
      console.error("Gün tamamlama hatası:", error);
      // Hata durumunu Redux'tan userError olarak alacağız
    }
  };

  // Yükleme durumu
  if (loading || userIsLoading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Yükleniyor...</span>
        </div>
        <p className="mt-3">
          {userIsLoading
            ? "İlerlemeniz kaydediliyor..."
            : "Program yükleniyor..."}
        </p>
      </div>
    );
  }

  // Hata durumu
  if (errorMessage || !programDetail) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger">
          <h4>Program yüklenemedi</h4>
          <p>{errorMessage || "Program bulunamadı veya erişim izniniz yok."}</p>
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

  // Kullanıcı hatası varsa göster
  if (userError) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger">
          <h4>İşlem hatası</h4>
          <p>{userError}</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/program/${programId}`)}
          >
            Program Detayına Dön
          </button>
        </div>
      </div>
    );
  }

  // Program tamamlandı
  if (programCompleted) {
    return (
      <div className="container my-5 text-center">
        <div className="alert alert-success">
          <h2>Tebrikler!</h2>
          <p className="lead">
            {programDetail.title} programını başarıyla tamamladınız.
          </p>
          <div className="mt-4">
            <button
              className="btn btn-primary me-3"
              onClick={() => navigate(`/program/${programId}`)}
            >
              Program Detayına Dön
            </button>
            <button
              className="btn btn-outline-primary"
              onClick={() => {
                setCurrentDayIndex(0);
                setProgramCompleted(false);
              }}
            >
              Programı Tekrar Başlat
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Geçerli gün
  const currentDay = programDetail.days?.[currentDayIndex];

  if (!currentDay) {
    return (
      <div className="container my-5">
        <div className="alert alert-warning">
          <h4>Gün bulunamadı</h4>
          <p>Bu program için gün bilgisi bulunamadı.</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/program/${programId}`)}
          >
            Program Detayına Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="mb-0">{programDetail.title}</h3>
                <span className="badge bg-light text-dark">
                  Gün {currentDay.dayNumber}/{programDetail.duration}
                </span>
              </div>
            </div>
            <div className="card-body">
              <DayPlayer day={currentDay} onComplete={handleDayComplete} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramStarter;
