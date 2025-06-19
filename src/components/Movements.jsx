import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteMovement, getAllMovements } from "../redux/slices/movementSlice";
import { Link } from "react-router-dom";
import "../css/movement.css";
import Loader from "./Loader";
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
    return (
      <div>
        <Loader />
        <div>Loading, please wait...</div>
      </div>
    );
  }

  return (
    <div>
      <section className="section" id="movements">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 offset-lg-3">
              <div className="section-heading">
                <h2>
                  BASIC <em>MOVEMENTS</em>
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

          <div className="movement-cards-row">
            {movements.map((movement) => (
              <div key={movement._id} className="movement-card">
                {user !== null && user.role === "admin" && (
                  <button
                    onClick={() => handleDelete(movement._id)}
                    className="delete-btn"
                    title="Sil"
                  >
                    <i className="bi bi-trash"></i> Sil
                  </button>
                )}

                <Link to={`/movements/${movement._id}`}>
                  <div className="image-thumb">
                    <img
                      src={
                        movement.movementImage || "assets/images/default.jpg"
                      }
                      alt={movement.movementName}
                    />
                  </div>
                  <div className="down-content">
                    <h4 style={{ textAlign: "center" }}>
                      {movement.movementName}
                    </h4>
                    <p>
                      {movement.movementDesc.length > 120
                        ? movement.movementDesc.substring(0, 120) + "..."
                        : movement.movementDesc}
                    </p>
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