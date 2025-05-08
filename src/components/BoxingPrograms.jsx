import { useState } from "react";

const tabsData = [
  {
    id: "tabs-1",
    title: "First Training Class",
    img: "assets/images/training-image-01.jpg",
    description:
      "Phasellus convallis mauris sed elementum vulputate. Donec posuere leo sed dui eleifend hendrerit...",
  },
  {
    id: "tabs-2",
    title: "Second Training Class",
    img: "assets/images/training-image-02.jpg",
    description:
      "Integer dapibus, est vel dapibus mattis, sem mauris luctus leo...",
  },
  {
    id: "tabs-3",
    title: "Third Training Class",
    img: "assets/images/training-image-03.jpg",
    description:
      "Fusce laoreet malesuada rhoncus. Donec ultricies diam tortor...",
  },
  {
    id: "tabs-4",
    title: "Fourth Training Class",
    img: "assets/images/training-image-04.jpg",
    description:
      "Pellentesque habitant morbi tristique senectus et netus et malesuada...",
  },
];

const BoxingPrograms = () => {
  const [activeTab, setActiveTab] = useState("tabs-1");

  return (
    <section className="section" id="our-classes">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 offset-lg-3">
            <div className="section-heading">
              <h2>
                Our <em>Classes</em>
              </h2>
              <img src="assets/images/line-dec.png" alt="" />
              <p>
                Nunc urna sem, laoreet ut metus id, aliquet consequat magna. Sed
                viverra ipsum dolor, ultricies fermentum massa consequat eu.
              </p>
            </div>
          </div>
        </div>
        <div className="row" id="tabs">
          <div className="col-lg-4">
            <ul>
              {tabsData.map((tab) => (
                <li key={tab.id}>
                  <a
                    href="#!"
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      fontWeight: activeTab === tab.id ? "bold" : "normal",
                    }}
                  >
                    <img src="assets/images/tabs-first-icon.png" alt="" />
                    {tab.title}
                  </a>
                </li>
              ))}
              <div className="main-rounded-button">
                <a href="#">View All Schedules</a>
              </div>
            </ul>
          </div>
          <div className="col-lg-8">
            <section className="tabs-content">
              {tabsData
                .filter((tab) => tab.id === activeTab)
                .map((tab) => (
                  <article id={tab.id} key={tab.id}>
                    <img src={tab.img} alt={tab.title} />
                    <h4>{tab.title}</h4>
                    <p>{tab.description}</p>
                    <div className="main-button">
                      <a href="#">View Schedule</a>
                    </div>
                  </article>
                ))}
            </section>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BoxingPrograms;
