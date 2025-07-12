import React, { useEffect } from "react";
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getProgramProgress } from "../redux/slices/userSlice";
import Loader from "./Loader";
import "../css/completeDay.css"
function CompleteDay() {
  const [width, height] = useWindowSize();
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
  const destructProgress = progress.progress;
  const lastCompleted = Array.isArray(destructProgress)
    ? [...destructProgress].reverse().find((item) => item.isCompleted)
    : null;

  const lockedToDate = lastCompleted?.newDayLockedToDate;
  
  // Program tamamlanma durumunu kontrol et
  const isCompleted = progress.isCompleted;
  const isLastDay = completedDays.length === progress.totalDays;

  if (userIsLoading || isProgressLoading) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "20px",
        }}
      >
        <Loader />
      </div>
    );
  }
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <Confetti width={width} height={height} />
      <div className="card shadow-lg border-0 rounded-5 p-4" style={{ maxWidth: "440px", width: "100%", background: "linear-gradient(135deg, #fff 80%, #ffe5d0 100%)",borderRadius: "5px" }}>
        <div className="card-body text-center p-0">
          <div className="mb-3" style={{ fontSize: 64, lineHeight: 1 }}>🎉</div>
          <h2 className="fw-bold mb-2 d-flex justify-content-center align-items-center" style={{ color: '#ed563b', fontSize: '2.3rem' }}>Congratulations!</h2>
          <p className="lead mb-3" style={{ color: '#333' }}>
            {isCompleted || isLastDay ? (
              "The program has been successfully completed! 🏆"
            ) : (
              <>Day <strong style={{ color: '#ed563b' }}>{completedDays.length}</strong> completed successfully.</>
            )}
          </p>
          {!isCompleted && !isLastDay && lockedToDate && (
            <div className="mb-4 px-3 py-2 rounded-3" style={{ background: '#fff6ea', color: '#b85c1c', fontWeight: 500, fontSize: '1rem', display: 'inline-block' }}>
              <span className="d-block">New day unlock time:</span>
              <span style={{ fontWeight: 700 }}>{new Date(lockedToDate).toLocaleString("en-US")}</span>
            </div>
          )}
          <div className="main-button mt-3">
            <a
              style={{
                cursor: "pointer",
                color: "#fff",
                borderRadius: "3px",
                display: "block",
                width: "100%",
                padding: "12px 0",
                background: "#ed563b",
                textAlign: "center",
                fontWeight: 600,
                fontSize: "1.1rem"
              }}
              href="/"
            >
              Back to Home
            </a>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default CompleteDay;
