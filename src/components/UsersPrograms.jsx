import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserCreatedAllPrograms } from "../redux/slices/programSlice";
import { Link } from "react-router-dom";
import "../css/usersPrograms.css";
import AnimatedClock from "./AnimatedClock";
import AnimatedCheck from "./AnimatedCheck";
import Loader from "./Loader";
function UsersPrograms() {
  const dispatch = useDispatch();
  const { usersPrograms, loading } = useSelector((state) => state.program);

  useEffect(() => {
    dispatch(getUserCreatedAllPrograms());
  }, [dispatch]);

  // Veri yapısını kontrol et ve düzelt
  const programs = usersPrograms?.programs || [];

  // Benzersiz program ID'lerini kontrol et
  const uniqueProgramIds = new Set(programs.map(p => p._id));
  
  // Yinelenen programları filtrele
  const uniquePrograms = programs.filter((program, index, self) =>
    index === self.findIndex((p) => p._id === program._id)
  );

  // Yinelenen programları bul ve logla
  const duplicates = programs.filter((program, index, self) =>
    index !== self.findIndex((p) => p._id === program._id)
  );
  
  if (loading) {
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
    <div className="container py-5">
      <div className="row">
        <div className="col-12 mb-4"></div>
      </div>

      {uniquePrograms.length > 0 ? (
        <div className="row">
          {uniquePrograms.map((program) => {
            // Program tamamlanma durumunu kontrol et
            const isProgramCompleted = program.userProgramData?.isCompleted === true;
            const completedDaysCount = program.userProgramData?.completedDays?.length || 0;
            const totalDays = program.days?.length || 0;
            const isAllDaysCompleted = completedDaysCount === totalDays;

            return (
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
                    <div className="position-absolute top-0 end-0 p-2"></div>
                  </div>
                  <div id="card-body-profile" className="card-body">
                    <h5
                      style={{ fontSize: "1.2rem" }}
                      className="card-title fw-bold mb-3"
                      title={program.title}

                      >
                      {program.title}
                    </h5>
                    <p  className="card-text text-muted mb-4 text-justify">
                    {program.description || "No description available."}
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
                        View Program
                      </Link>
                      <div className="text-muted">
                        <small>
                          {isProgramCompleted || isAllDaysCompleted ? (
                            <span className="text-success">
                              <AnimatedCheck  />
                            </span>
                          ) : (
                            <span className="text-warning" title="You are continuing the program..">
                              <AnimatedClock className="animated-clock-icon-large" />
                            </span>
                          )}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-5">
          <div className="mb-3">
            <i
              className="bi bi-journal-x"
              style={{ fontSize: "4rem", color: "#ed563b" }}
            ></i>
          </div>
          <h4 className="text-muted">You haven't created any programs yet</h4>
          <p className="text-muted">
            You can use the button below to create a new program.
          </p>
          <Link
            to="/create-program"
            className="btn btn-primary mt-3"
            style={{ backgroundColor: "#ed563b", borderColor: "#ed563b" }}
          >
            <i className="bi bi-plus-lg me-2"></i>
            Create New Program
          </Link>
        </div>
      )}
    </div>
  );
}

export default UsersPrograms;
