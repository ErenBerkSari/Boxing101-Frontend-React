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
                <h2 id="movement-list-title">
                  BASIC <em>MOVEMENTS</em>
                </h2>
                <img src="assets/images/line-dec.png" alt="" />
                <p>
                Master the essential boxing movements to build a strong foundation, improve your technique, and boost your confidence in the ring. Explore each movement to unlock your full potential and take your boxing skills to the next level.
                </p>
              </div>
            </div>
          </div>

          <div className="movements-list-row" id="movements-list-row">
            {movements.map((movement) => (
              <div key={movement._id} className="movements-list-card">
                {user !== null && user.role === "admin" && (
                  <button
                  id="delete-btn"
                    onClick={() => handleDelete(movement._id)}
                    className="delete-btn"
                    title="Delete"
                  >
                    <img src="/assets/images/trash.png" alt="Delete" style={{ width: 18, height: 18, marginBottom: 2 }} /> Delete
                  </button>
                )}

                <Link to={`/movements/${movement._id}`}>
                  <div className="movements-list-thumb">
                    <img
                      src={
                        movement.movementImage || "assets/images/default.jpg"
                      }
                      alt={movement.movementName}
                    />
                  </div>
                  <div className="movements-list-content">
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