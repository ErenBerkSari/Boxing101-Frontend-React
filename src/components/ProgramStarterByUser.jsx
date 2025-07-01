import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getProgramDetail } from "../redux/slices/programSlice";
import {
  getProgramProgress,
  completeProgram,
  completeUserCreatedProgramDay,
} from "../redux/slices/userSlice";
import { getUserCreatedAllPrograms } from "../redux/slices/programSlice";
import DayPlayerByUser from "./DayPlayerByUser";
import Loader from "./Loader";
const ProgramStarterByUser = () => {
  const { programId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux'tan program detaylarını ve kullanıcı durumunu al
  const { programDetail, loading, errorMessage } = useSelector(
    (state) => state.program
  );

  const {
    userIsLoading,
    error: userError,
    completedDays,
    isProgressLoading,
    progress,
  } = useSelector((state) => state.user);

  const [programCompleted, setProgramCompleted] = useState(false);

  // Program detaylarını yükle
  useEffect(() => {
    if (programId) {
      dispatch(getProgramDetail(programId));
      dispatch(getProgramProgress(programId));
    }
  }, [dispatch, programId]);

  // Program gününü tamamlama işleyicisi
  const handleDayComplete = async (lastCompletedStep = 0) => {
    if (!programDetail || !programDetail.days || completedDays === undefined) {
      return;
    }

    // Bir sonraki tamamlanması gereken günü bul
    const currentDay = programDetail.days[completedDays.length];

    if (!currentDay) {
      // Tüm günler tamamlanmış olabilir
      setProgramCompleted(true);
      return;
    }

    try {
      // Redux action'ını dispatch et
      await dispatch(
        completeUserCreatedProgramDay({
          programId,
          dayId: currentDay._id,
          lastCompletedStep,
        })
      ).unwrap();

      // Tamamlanan gün, son gün mü kontrol et
      if (completedDays.length + 1 >= programDetail.days.length) {
        setProgramCompleted(true);
        // Programı tamamla
        await dispatch(completeProgram(programId)).unwrap();
        // Kullanıcı programlarını güncelle
        await dispatch(getUserCreatedAllPrograms());
      }

      // İlerleme bilgilerini yeniden yükle
      dispatch(getProgramProgress(programId));
    } catch (error) {
      console.error("Gün tamamlama hatası:", error);
    }
  };

  // Programı yeniden başlat
  const handleRestartProgram = () => {
    setProgramCompleted(false);
    // Program detaylarını ve ilerlemeyi yeniden yükle
    dispatch(getProgramDetail(programId));
    dispatch(getProgramProgress(programId));
  };

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

  // Yükleme durumu
  if (loading || userIsLoading || isProgressLoading) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "20px",
        }}
      >
        <Loader />
        <div>Loading, please wait...</div>
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
              onClick={handleRestartProgram}
            >
              Programı Tekrar Başlat
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Bir sonraki yapılacak günü bul
  const currentDay = programDetail.days?.[completedDays?.length || 0];

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
    <div className="container pt-3">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="card shadow">
            <div
              style={{ backgroundColor: "#ed563b" }}
              className="card-header text-white"
            >
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="mb-0 text-white">{programDetail.title}</h3>
                <span className="badge bg-light text-dark">
                  Gün {currentDay.dayNumber}/{programDetail.duration}
                </span>
              </div>
            </div>
            <div className="card-body">
              <DayPlayerByUser
                day={currentDay}
                onComplete={handleDayComplete}
                programId={programId}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramStarterByUser;
