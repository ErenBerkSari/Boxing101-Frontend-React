import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getProgramProgress } from "../redux/slices/userSlice";

function CompleteDay() {
  const { programId } = useParams();
  const { completedDays, userIsLoading, isProgressLoading, progress } =
    useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    if (programId) {
      dispatch(getProgramProgress(programId));
    }
  }, [dispatch, programId]);
  const day = completedDays[completedDays.length - 1];
  console.log("completedDay:", completedDays);
  console.log("day", day);
  const destructProgress = progress.progress;
  console.log("progress", destructProgress);
  const lastCompleted = Array.isArray(destructProgress)
    ? [...destructProgress].reverse().find((item) => item.isCompleted)
    : null;

  const lockedToDate = lastCompleted?.newDayLockedToDate;

  if (userIsLoading || isProgressLoading) {
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
  return (
    <div>
      <div className="text-center my-5">
        <div className="alert alert-success">
          <h3>Tebrikler!</h3>
          <p className="lead">Gün {completedDays.length} tamamlandı.</p>
          {lockedToDate && (
            <p className="mt-2">
              Yeni gün açılma zamanı:{" "}
              {new Date(lockedToDate).toLocaleString("tr-TR")}
            </p>
          )}
        </div>
        <button
          onClick={() => navigate("/")}
          className="btn btn-primary btn-lg mt-3"
        >
          Anasayfaya Dön
        </button>
      </div>
    </div>
  );
}

export default CompleteDay;
