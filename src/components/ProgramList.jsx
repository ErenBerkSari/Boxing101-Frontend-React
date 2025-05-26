import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPrograms } from "../redux/slices/programSlice";
import { Link } from "react-router-dom";
import Header from "./Header";


function ProgramList() {
    const [activeTab, setActiveTab] = useState(null);
const dispatch = useDispatch();

  // Burada programs'ın default değeri olarak boş dizi atayalım
  const { programs = [], loading } = useSelector((store) => {
    // Güvenli bir şekilde store.program'a erişelim
    return store.program || { programs: [], loading: true };
  });
  const { user, authIsLoading } = useSelector((store) => store.auth || {});


  useEffect(() => {
    dispatch(getAllPrograms());
  }, [dispatch]);

  useEffect(() => {
    if (programs) {
      console.log("Programs:", programs);
    }
  }, [programs]);

  // Programs değerini kontrol edelim
  if (!Array.isArray(programs)) {
    console.error("Programs is not an array:", programs);
    return (
      <div>Veri formatında bir sorun oluştu. Lütfen sayfayı yenileyin.</div>
    );
  }

  if (loading) {
    return <div>Yükleniyor, lütfen bekleyin..</div>;
  }

 
  return (
    <div>
        <Header/>
        <section className="section" id="programList">
    <div className="container">
      <div className="row">
        <div className="col-lg-6 offset-lg-3">
          <div className="section-heading">
            <h2>
              TÜM <em>PROGRAMLARIMIZ</em>
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

      <div style={{marginBottom: "100px"}} className="movement-cards-row">
        {programs.map((program) => (
          <div key={program._id} className="movement-card">
            <Link to={`/program/${program._id}`}>
              <div className="image-thumb">
                <img
                  src={
                    program.coverImage || "assets/images/default.jpg"
                  }
                  alt={program.title}
                />
              </div>
              <div className="down-content">
                <h4 style={{ textAlign: "center" }}>
                  {program.title}
                </h4>
                <p>
                  {program?.description?.length > 120
                    ? program?.description?.substring(0, 120) + "..."
                    : program?.description}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div> 
    </div>
  </section></div>
      
    
  );
}

export default ProgramList;
