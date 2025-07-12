import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserCreatedAllPrograms } from "../redux/slices/programSlice";
import { deleteUserCreatedProgram, clearDeleteProgramStatus } from "../redux/slices/userSlice";
import { Link } from "react-router-dom";
import "../css/usersPrograms.css";
import AnimatedClock from "./AnimatedClock";
import AnimatedCheck from "./AnimatedCheck";
import Loader from "./Loader";
function UsersPrograms() {
  const dispatch = useDispatch();
  const { usersPrograms, loading } = useSelector((state) => state.program);
  const { deleteProgramLoading, deleteProgramSuccess, deleteProgramError } = useSelector((state) => state.user);
  
  // Silme modal state'leri
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [programToDelete, setProgramToDelete] = useState(null);

  useEffect(() => {
    dispatch(getUserCreatedAllPrograms());
  }, [dispatch]);

  // Silme işlemi başarılı olduğunda programları yeniden yükle
  useEffect(() => {
    if (deleteProgramSuccess) {
      dispatch(getUserCreatedAllPrograms());
      dispatch(clearDeleteProgramStatus());
      setShowDeleteModal(false);
      setProgramToDelete(null);
    }
  }, [deleteProgramSuccess, dispatch]);

  // Silme işlemi başlat
  const handleDeleteClick = (program) => {
    setProgramToDelete(program);
    setShowDeleteModal(true);
  };

  // Silme işlemini onayla
  const confirmDelete = async () => {
    if (programToDelete) {
      try {
        await dispatch(deleteUserCreatedProgram(programToDelete._id)).unwrap();
      } catch (error) {
        console.error('Program silme hatası:', error);
      }
    }
  };

  // Modal'ı kapat
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setProgramToDelete(null);
  };

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
                  <div  className="position-relative">
                    <img
                      src={program.coverImage || "/assets/images/default-program.jpg"}
                      className="card-img-top rounded-top-4"
                      alt={program.title}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <button id="program-dlt"
                      onClick={() => handleDeleteClick(program)}
                      className="btn btn-danger btn-sm"
                      style={{
                        backgroundColor: "rgba(220, 53, 69, 0.9)",
                        border: "none",
                        borderRadius: "50%",
                        width: "35px",
                        height: "35px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "14px",
                        position: "absolute",
                        top: 12,
                        right: 12,
                        zIndex: 2,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                        transition: "background 0.2s"
                      }}
                      title="Delete Program"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
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
                              <AnimatedClock id="clock-icon" className="animated-clock-icon-large" />
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

      {/* Silme Onay Modal'ı */}
      {showDeleteModal && (
        <>
          {/* Karartılmış arka plan */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.08)",
              zIndex: 9998
            }}
            onClick={closeDeleteModal}
          />
          {/* Modal kutusu */}
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "#fff",
              borderRadius: "12px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
              padding: "32px 24px",
              zIndex: 9999,
              minWidth: 340,
              maxWidth: "90vw",
              textAlign: "center"
            }}
          >
            <p style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>
              <span style={{ color: "#222" }}>
                <b>"{programToDelete?.title}"</b>
              </span>{" "}
              Are you sure you want to delete this program?
            </p>
            <p style={{ color: "#888", fontSize: 14, marginBottom: 24 }}>
              This action cannot be undone. The program and all its days will be permanently deleted.
            </p>
            <hr style={{ margin: "24px 0" }} />
            <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
              <button
                type="button"
                className="btn"
                style={{
                  background: "#f6f6f8",
                  color: "#555",
                  borderRadius: 8,
                  padding: "8px 20px",
                  border: "none"
                }}
                onClick={closeDeleteModal}
                disabled={deleteProgramLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn"
                style={{
                  background: "#ff3b2f",
                  color: "#fff",
                  borderRadius: 8,
                  padding: "8px 20px",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 6
                }}
                onClick={confirmDelete}
                disabled={deleteProgramLoading}
              >
                <i className="bi bi-trash"></i>
                Delete Program
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default UsersPrograms;
