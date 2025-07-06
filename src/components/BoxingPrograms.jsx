import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPrograms } from "../redux/slices/programSlice";
import { Link, useNavigate } from "react-router-dom";
import Loader from "./Loader";

const BoxingPrograms = () => {
  const [activeTab, setActiveTab] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  useEffect(() => {
    if (Array.isArray(programs) && programs.length > 0 && !activeTab) {
      const firstNonUserCreated = programs.find(
        (p) => p.isUserCreated === false
      );
      if (firstNonUserCreated) {
        setActiveTab(firstNonUserCreated._id);
      }
    }
  }, [programs, activeTab]);

  // Programs değerini kontrol edelim
  if (!Array.isArray(programs)) {
    console.error("Programs is not an array:", programs);
    return (
      <div>Veri formatında bir sorun oluştu. Lütfen sayfayı yenileyin.</div>
    );
  }
  console.log("programlar", programs);
  if (loading) {
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

  // Güvenli render için programı bulalım
  const activeProgram = activeTab
    ? programs.find((p) => p._id === activeTab)
    : null;

  return (
    <section className="section" id="our-programs">
      <div id="boxing-programs-list" className="container">
        <div className="row">
          <div className="col-lg-6 offset-lg-3">
            <div className="section-heading">
              <h2 id="our-programs-title">
                Our <em>Programs</em>
              </h2>
              <img src="assets/images/line-dec.png" alt="" />
              <p>
                Yeni başlayanlardan ileri düzeye kadar boks programlarımızı
                keşfedin.
              </p>
            </div>
          </div>
        </div>

        <div className="row" id="tabs">
          <div className="col-lg-4">
            <ul>
              {loading ? (
                <div>
                  <Loader />
                  <div>Loading, please wait...</div>
                </div>
              ) : (
                programs
                  .slice(-3)
                  .map((program) => (
                    <li key={program._id}>
                      <a
                        href="#!"
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveTab(program._id);
                        }}
                        style={{
                          fontWeight:
                            activeTab === program._id ? "bold" : "normal",
                        }}
                      >
                        <img src="assets/images/tabs-first-icon.png" alt="" />
                        {program.title || "İsimsiz Program"}
                      </a>
                    </li>
                  ))
              )}
              <div className="main-rounded-button">
                <a href="/program/programList">Tüm Programları Gör</a>
              </div>
            </ul>
          </div>

          <div className="col-lg-8">
            <section id="boxing-program-content" className="tabs-content">
              {loading ? (
                <div>
                  <Loader />
                  <div>Loading, please wait...</div>
                </div>
              ) : activeProgram ? (
                <article id={activeProgram._id} key={activeProgram._id}>
                  {activeProgram.coverImage && (
                    <img
                      src={activeProgram.coverImage}
                      alt={activeProgram.title || ""}
                    />
                  )}
                  <h4>{activeProgram.title || "İsimsiz Program"}</h4>
                  <p>{activeProgram.description || "Açıklama bulunmuyor."}</p>
                  <div className="main-button">
                    <Link to={`/program/${activeProgram._id}`}>
                      Detayları Gör
                    </Link>
                  </div>
                </article>
              ) : (
                <p>Lütfen bir program seçin</p>
              )}
            </section>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BoxingPrograms;
