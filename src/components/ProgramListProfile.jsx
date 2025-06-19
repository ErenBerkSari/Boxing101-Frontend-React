import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserRegisteredPrograms } from "../redux/slices/userSlice";
import { Link } from "react-router-dom";
import "../css/usersPrograms.css";
import AnimatedClock from "./AnimatedClock";
import AnimatedCheck from "./AnimatedCheck";
import Loader from "./Loader";
function ProgramListProfile() {
  const dispatch = useDispatch();
  const { userRegisteredPrograms, userRegisteredProgramsLoading } = useSelector(
    (state) => state.user
  );

  const [serverDate, setServerDate] = useState(null);
  const [lockedToDate, setLockedToDate] = useState(null);
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    dispatch(getUserRegisteredPrograms());
  }, [dispatch]);

  useEffect(() => {
    if (!serverDate || !lockedToDate) return;

    const serverTime = new Date(serverDate).getTime();
    const lockedTime = new Date(lockedToDate).getTime();

    setRemainingTime(lockedTime - serverTime);

    let currentServerTime = serverTime;
    const interval = setInterval(() => {
      currentServerTime += 1000;
      setRemainingTime(lockedTime - currentServerTime);
    }, 1000);

    return () => clearInterval(interval);
  }, [serverDate, lockedToDate]);

  const programs = userRegisteredPrograms.programs || [];
  console.log("reg pro", programs);
  if (userRegisteredProgramsLoading) {
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

  const formatRemainingTime = (ms) => {
    if (ms <= 0) return "Süre doldu";
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours} sa ${minutes} dk ${seconds} sn`;
  };

  return (
    <div className="container py-5">
      {programs.length > 0 ? (
        <div className="row">
          {programs.map((program) => (
            <div
              key={program._id}
              className="col-md-6 col-lg-4 mb-4 card-container"
            >
              <div className="user-program-card h-100 shadow-sm border-0 rounded-4">
                <div className="position-relative">
                  <img
                    src={
                      program.coverImage || "/assets/images/default-program.jpg"
                    }
                    className="card-img-top rounded-top-4"
                    alt={program.title}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                </div>
                <div className="card-body">
                  <h5
                    style={{ fontSize: "1.2rem", textAlign: "center" }}
                    className="card-title fw-bold mb-3"
                    title={program.title}
                  >
                    {program.title}
                  </h5>
                  <p className="card-text text-muted mb-4 text-justify">
                    {program.description
                      ? program.description
                      : "Açıklama bulunmuyor."}
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <Link
                      to={`/program/${program._id}`}
                      className="btn btn-primary"
                      style={{
                        backgroundColor: "#ed563b",
                        borderColor: "#ed563b",
                      }}
                    >
                      Programı Görüntüle
                    </Link>
                    <div className="text-muted">
                      <small>
                        {program.userProgramData?.isCompleted ? (
                          <span className="text-success">
                            <AnimatedCheck />
                          </span>
                        ) : (
                          <span
                            className="text-warning"
                            title="Programa devam ediyorsunuz.."
                          >
                            <AnimatedClock className="animated-clock-icon-large" />
                          </span>
                        )}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <div className="mb-3">
            <i
              className="bi bi-journal-x"
              style={{ fontSize: "4rem", color: "#ed563b" }}
            ></i>
          </div>
          <h4 className="text-muted">Kayıtlı olduğunuz bir kurs yok</h4>
          <p className="text-muted">
            Programlara katılmak için ana sayfadan bir program seçebilirsiniz.
          </p>
        </div>
      )}
    </div>
  );
}

export default ProgramListProfile;
