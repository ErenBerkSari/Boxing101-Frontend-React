import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const ProgramProgressTracker = ({ programId, userId }) => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        // Kullanıcı ilerleme durumunu API'den al
        const response = await axiosInstance.get(
          `/user-progress/${userId}/${programId}`
        );
        setProgress(response.data);
        setError(null);
      } catch (err) {
        console.error("İlerleme verileri alınamadı:", err);
        setError("İlerleme durumu yüklenemedi");
      } finally {
        setLoading(false);
      }
    };

    if (programId && userId) {
      fetchProgress();
    }
  }, [programId, userId]);

  if (loading) {
    return (
      <div className="text-center p-3">
        <div className="spinner-border spinner-border-sm" role="status">
          <span className="visually-hidden">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-warning">
        <small>{error}</small>
      </div>
    );
  }

  // Kullanıcının ilerleme durumu yok
  if (!progress) {
    return (
      <div className="text-center p-3">
        <p>Henüz bu programı başlatmadınız.</p>
        <Link
          to={`/program/${programId}/start`}
          className="btn btn-primary btn-sm"
        >
          Programa Başla
        </Link>
      </div>
    );
  }

  // İlerleme durumu var
  const { currentDay, totalDays, lastCompleted, completedDays } = progress;
  const progressPercentage = Math.round((completedDays / totalDays) * 100);

  return (
    <div className="program-progress card border-0 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">Program İlerlemesi</h5>

        <div className="progress mb-3">
          <div
            className="progress-bar bg-success"
            role="progressbar"
            style={{ width: `${progressPercentage}%` }}
            aria-valuenow={progressPercentage}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            {progressPercentage}%
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <div>
            <span className="fw-bold">
              Gün {currentDay}/{totalDays}
            </span>
            <br />
            <small className="text-muted">
              Son çalışma: {new Date(lastCompleted).toLocaleDateString("tr-TR")}
            </small>
          </div>

          <Link
            to={`/program/${programId}/continue`}
            className="btn btn-success btn-sm"
          >
            Devam Et
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProgramProgressTracker;
