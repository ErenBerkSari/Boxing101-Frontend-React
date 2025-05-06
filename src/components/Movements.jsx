import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteMovement, getAllMovements } from "../redux/slices/movementSlice";
import { Link } from "react-router-dom";

function Movements() {
  const dispatch = useDispatch();
  const { user, authIsLoading } = useSelector((store) => store.auth);
  const { movements, isLoading } = useSelector((store) => store.movement);

  useEffect(() => {
    dispatch(getAllMovements());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteMovement(id));
  };

  if (isLoading || authIsLoading) {
    return <div>Yükleniyor, lütfen bekleyin..</div>;
  }

  return (
    <div>
      <section className="section" id="trainers">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 offset-lg-3">
              <div className="section-heading">
                <h2>
                  Expert <em>Trainers</em>
                </h2>
                <img src="assets/images/line-dec.png" alt="" />
                <p>
                  Nunc urna sem, laoreet ut metus id, aliquet consequat magna.
                  Sed viverra ipsum dolor, ultricies fermentum massa consequat
                  eu.
                </p>
              </div>
            </div>
          </div>

          <div className="row">
            {movements.map((movement) => (
              <div
                style={{ cursor: "pointer" }}
                key={movement._id}
                className="col-lg-4 mb-4"
              >
                {1 && (
                  <button
                    onClick={() => handleDelete(movement._id)}
                    className="btn btn-danger btn-sm position-absolute"
                    style={{
                      opacity: "0.8",
                      transition: "opacity 0.3s",
                    }}
                    title="Sil"
                  >
                    <i className="bi bi-trash"></i> Sil
                  </button>
                )}
                <Link to={`/movements/${movement._id}`}>
                  <div className="trainer-item">
                    <div className="image-thumb">
                      <img
                        src={
                          movement.movementImage || "assets/images/default.jpg"
                        }
                        alt={movement.movementName}
                        style={{
                          width: "100%",
                          height: "250px",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <div className="down-content">
                      <h4>{movement.movementName}</h4>
                      <p>{movement.movementDesc}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Movements;
