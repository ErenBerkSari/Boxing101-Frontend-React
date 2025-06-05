import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserCreatedAllPrograms } from "../redux/slices/programSlice";
import { Link } from "react-router-dom";
import "../css/usersPrograms.css";

function UsersPrograms() {
  const dispatch = useDispatch();
  const { usersPrograms, loading } = useSelector((state) => state.program);

  useEffect(() => {
    dispatch(getUserCreatedAllPrograms());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  // Veri yapısını kontrol et ve düzelt
  const programs = usersPrograms?.programs || [];

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12 mb-4">
          <h2 style={{ color: "#ed563b" }} className="fw-bold">
            Oluşturduğum Programlar
          </h2>
        </div>
      </div>

      {programs.length > 0 ? (
        <div className="row">
          {programs.map((program) => (
            <div key={program._id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 shadow-sm border-0 rounded-4">
                <div className="position-relative">
                  <img
                    src={
                      program.coverImage || "/assets/images/default-program.jpg"
                    }
                    className="card-img-top rounded-top-4"
                    alt={program.title}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="position-absolute top-0 end-0 p-2">
                    <span className="badge bg-primary">
                      {program.duration} Gün
                    </span>
                  </div>
                </div>
                <div className="card-body">
                  <h5 className="card-title fw-bold mb-3">{program.title}</h5>
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
                            <i className="bi bi-clock-fill me-1"></i>
                            Devam Ediyor
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
          <h4 className="text-muted">Henüz program oluşturmadınız</h4>
          <p className="text-muted">
            Yeni bir program oluşturmak için aşağıdaki butonu kullanabilirsiniz.
          </p>
          <Link
            to="/create-program"
            className="btn btn-primary mt-3"
            style={{ backgroundColor: "#ed563b", borderColor: "#ed563b" }}
          >
            <i className="bi bi-plus-lg me-2"></i>
            Yeni Program Oluştur
          </Link>
        </div>
      )}
    </div>
  );
}

export default UsersPrograms;
