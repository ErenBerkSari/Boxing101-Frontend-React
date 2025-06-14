import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserRegisteredPrograms } from "../redux/slices/userSlice";
import { Link } from "react-router-dom";
import "../css/usersPrograms.css";
import AnimatedClock from "./AnimatedClock";

function ProgramListProfile() {
  const dispatch = useDispatch();
  const { userRegisteredPrograms, userRegisteredProgramsLoading } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getUserRegisteredPrograms());
  }, [dispatch]);

  if (userRegisteredProgramsLoading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  const programs = userRegisteredPrograms || [];

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
                    style={{ fontSize: "1.2rem" }}
                    className="card-title fw-bold mb-3"
                  >
                    {program.title}
                  </h5>
                  <p className="card-text text-muted mb-4">
                    {program.description || "Açıklama bulunmuyor."}
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <Link
                      to={`/program/user/${program._id}`}
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
                            <i className="bi bi-check-circle-fill me-1"></i>
                            Tamamlandı
                          </span>
                        ) : (
                          <span className="text-warning">
                            <AnimatedClock />
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
