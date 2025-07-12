import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createProgram,
  clearProgramMessages,
} from "../redux/slices/programSlice";
import Loader from "./Loader";

// Modern FileInput component
function FileInput({ label, accept, onChange, file, preview, onRemove }) {
  return (
    <div style={{
      border: '2px dashed #ed563b',
      borderRadius: 12,
      padding: 20,
      background: '#fff',
      textAlign: 'center',
      position: 'relative',
      marginBottom: 10
    }}>
      <label style={{ cursor: 'pointer', width: '100%' }}>
        <div style={{ color: '#ed563b', fontSize: 32, marginBottom: 8 }}>
          <i className="bi bi-cloud-arrow-up-fill"></i>
        </div>
        <div style={{ fontWeight: 600, color: '#333' }}>{label}</div>
        <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>Drag and drop or click</div>
        <input
          type="file"
          accept={accept}
          style={{ display: 'none' }}
          onChange={onChange}
        />
      </label>
      {file && (
        <div style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <span style={{ fontSize: 15, color: '#333' }}>{file.name}</span>
            <button type="button" onClick={onRemove} style={{ border: 'none', background: 'none', color: '#ed563b', fontSize: 18, cursor: 'pointer' }}>
              <i className="bi bi-x-circle-fill"></i>
            </button>
          </div>
          {preview && (
            <div style={{ marginTop: 8 }}>
              {file.type && file.type.startsWith('image') ? (
                <img src={preview} alt="preview" style={{ maxWidth: 120, borderRadius: 8 }} />
              ) : file.type && file.type.startsWith('video') ? (
                <video src={preview} controls style={{ maxWidth: 120, borderRadius: 8 }} />
              ) : null}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CreateProgram() {
  const dispatch = useDispatch();
  const { loading, successMessage, errorMessage } = useSelector(
    (state) => state.program
  );

  const [programName, setProgramName] = useState("");
  const [programDesc, setProgramDesc] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [days, setDays] = useState([]);
  const [expandedDays, setExpandedDays] = useState({});

  // Clear form fields when form is successful
  useEffect(() => {
    if (successMessage) {
      setProgramName("");
      setProgramDesc("");
      setCoverImage(null);
      setDays([]);

      // Clear success message after 3 seconds
      const timer = setTimeout(() => {
        dispatch(clearProgramMessages());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch]);

  // Automatically expand each new day when added
  useEffect(() => {
    if (days.length > 0) {
      setExpandedDays(prev => ({ ...prev, [days.length - 1]: true }));
    }
  }, [days.length]);

  const addDay = () => {
    setDays([...days, { title: "", description: "", steps: [] }]);
  };

  const addStep = (dayIndex) => {
    const newDays = [...days];
    newDays[dayIndex].steps.push({
      title: "",
      description: "",
      duration: 30,
      file: null,
      preview: null,
    });
    setDays(newDays);
  };

  const handleStepChange = (dayIndex, stepIndex, key, value) => {
    const updatedDays = [...days];
    if (key === "file") {
      updatedDays[dayIndex].steps[stepIndex].file = value;
      updatedDays[dayIndex].steps[stepIndex].preview =
        URL.createObjectURL(value);
    } else {
      updatedDays[dayIndex].steps[stepIndex][key] = value;
    }
    setDays(updatedDays);
  };

  const handleDayChange = (dayIndex, key, value) => {
    const updatedDays = [...days];
    updatedDays[dayIndex][key] = value;
    setDays(updatedDays);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Add program data as JSON
    const programData = {
      title: programName,
      description: programDesc,
      duration: days.length,
      days: days.map((day, dayIndex) => ({
        dayNumber: dayIndex + 1,
        title: day.title || `Day ${dayIndex + 1}`,
        description: day.description || "",
        steps: day.steps.map((step, stepIndex) => ({
          title: step.title || `Step ${stepIndex + 1}`,
          description: step.description || "",
          duration: step.duration,
          videoName: step.file ? step.file.name : null,
        })),
      })),
    };

    formData.append("data", JSON.stringify(programData));

    // Add cover image
    if (coverImage) {
      formData.append("cover", coverImage);
    }

    // Add step files
    days.forEach((day) => {
      day.steps.forEach((step) => {
        if (step.file) {
          formData.append("files", step.file);
        }
      });
    });

    // Send data via Redux
    dispatch(createProgram(formData));
  };

  const toggleDay = (dayIndex) => {
    setExpandedDays(prev => ({
      ...prev,
      [dayIndex]: !prev[dayIndex]
    }));
  };

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <>
      <style>{`
        @media (max-width: 576px) {
          .program-btn-mobile {
            width: 100% !important;
            font-size: 1.1rem;
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
          .form-home-link {
            display: block;
            margin: 16px auto 0 auto;
            text-align: center;
            font-size: 1rem;
          }
          .program-btn-row {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 0.5rem;
          }
        }
      `}</style>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-body p-5">
                <h2 style={{ color: "#ed563b" }} className="mb-4 fw-bold">Create New Boxing Program</h2>

                {successMessage && (
                  <div className="alert alert-success d-flex align-items-center" role="alert">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    {successMessage}
                  </div>
                )}

                {errorMessage && (
                  <div className="alert alert-danger d-flex align-items-center" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Program Name</label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      value={programName}
                      onChange={(e) => setProgramName(e.target.value)}
                      required
                      placeholder="Give your program a name"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold">Description</label>
                    <textarea
                      className="form-control"
                      value={programDesc}
                      onChange={(e) => setProgramDesc(e.target.value)}
                      rows="3"
                      placeholder="Briefly describe your program"
                    />
                  </div>

                  <div className="mb-4">
                    {/* Modern file upload area for Cover Image */}
                    <FileInput
                      label="Upload Cover Image"
                      accept="image/*"
                      onChange={e => setCoverImage(e.target.files[0])}
                      file={coverImage}
                      preview={coverImage ? URL.createObjectURL(coverImage) : null}
                      onRemove={() => setCoverImage(null)}
                    />
                    <small className="text-muted">Recommended size: 1200x630 pixels</small>
                  </div>

                  <hr className="my-4" />
                  
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="mb-0">Days ({days.length})</h4>
                    <button
                      style={{ backgroundColor: "#ed563b", borderColor: "#ed563b" }}
                      type="button"
                      className="btn btn-primary"
                      onClick={addDay}
                    >
                      <i className="bi bi-plus-lg me-2"></i>Add Day
                    </button>
                  </div>

                  {days.length === 0 && (
                    <div className="alert alert-info d-flex align-items-center">
                      <i className="bi bi-info-circle-fill me-2"></i>
                      Please add at least one day to your program.
                    </div>
                  )}

                  {days.map((day, dayIndex) => (
                    <div key={dayIndex} className="card border-0 bg-light shadow-sm rounded-4 mb-3" style={{marginBottom: dayIndex === days.length - 1 ? 0 : '1.5rem'}}>
                      <div className="card-body p-4">
                        <div 
                          className="d-flex justify-content-between align-items-center mb-0 cursor-pointer"
                          onClick={() => toggleDay(dayIndex)}
                          style={{ cursor: 'pointer' }}
                        >
                          <h5 className="mb-0 d-flex align-items-center">
                            <i 
                              className={`bi bi-chevron-${expandedDays[dayIndex] ? 'down' : 'right'} me-2`}
                              style={{ color: "#ed563b", fontWeight: 700, fontSize: 24, textShadow: '0 0 1px #ed563b' }}
                            ></i>
                            Day {dayIndex + 1}
                          </h5>
                          <button
                            type="button"
                            style={{border: "2px solid #ed563b"}}
                            className="btn btn-outline-danger btn-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              const newDays = [...days];
                              newDays.splice(dayIndex, 1);
                              setDays(newDays);
                            }}
                          >
                            <img src="/assets/images/trash.png" alt="Delete" style={{ width: 18, height: 18, marginBottom: 2 }} />
                          </button>
                        </div>

                        <div className={`collapse ${expandedDays[dayIndex] ? 'show' : ''}`}>
                          <div className="mb-3">
                            <label className="form-label fw-semibold">Day Title</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Day title"
                              value={day.title || ""}
                              onChange={(e) =>
                                handleDayChange(dayIndex, "title", e.target.value)
                              }
                            />
                          </div>

                          <div className="mb-4">
                            <label className="form-label fw-semibold">Day Description</label>
                            <textarea
                              className="form-control"
                              placeholder="Day description"
                              value={day.description || ""}
                              onChange={(e) =>
                                handleDayChange(dayIndex, "description", e.target.value)
                              }
                              rows="2"
                            />
                          </div>

                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="mb-0">Steps ({day.steps.length})</h6>
                            <button
                              type="button"
                              style={{ backgroundColor: "#ed563b", borderColor: "#ed563b" }}
                              className="btn btn-success btn-sm"
                              onClick={() => addStep(dayIndex)}
                            >
                              <i className="bi bi-plus-lg me-2"></i>Add Step
                            </button>
                          </div>

                          {day.steps.length === 0 && (
                            <div className="alert alert-info d-flex align-items-center">
                              <i className="bi bi-info-circle-fill me-2"></i>
                              No steps have been added for this day yet.
                            </div>
                          )}

                          {day.steps.map((step, stepIndex) => (
                            <div key={stepIndex} className="card mb-3 border-0 bg-white shadow-sm rounded-3">
                              <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                  <h6 className="mb-0">Step {stepIndex + 1}</h6>
                                  <button
                                    type="button"
                                    style={{border: "2px solid #ed563b"}}
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const newDays = [...days];
                                      newDays[dayIndex].steps.splice(stepIndex, 1);
                                      setDays(newDays);
                                    }}
                                  >
                                    <img src="/assets/images/trash.png" alt="Delete" style={{ width: 18, height: 18, marginBottom: 2 }} />
                                  </button>
                                </div>

                                <div className="mb-3">
                                  <label className="form-label fw-semibold">Step Title</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="e.g., Warm-up, Shadow Boxing, Jab-Cross..."
                                    value={step.title || ""}
                                    onChange={(e) =>
                                      handleStepChange(
                                        dayIndex,
                                        stepIndex,
                                        "title",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>

                                <div className="mb-3">
                                  <label className="form-label fw-semibold">Duration (seconds)</label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    value={step.duration}
                                    min="5"
                                    onChange={(e) =>
                                      handleStepChange(
                                        dayIndex,
                                        stepIndex,
                                        "duration",
                                        parseInt(e.target.value)
                                      )
                                    }
                                  />
                                </div>

                                <div className="mb-3">
                                  <label className="form-label fw-semibold">Step Description</label>
                                  <textarea
                                    className="form-control"
                                    placeholder="Explain what will be done in this step..."
                                    value={step.description || ""}
                                    onChange={(e) =>
                                      handleStepChange(
                                        dayIndex,
                                        stepIndex,
                                        "description",
                                        e.target.value
                                      )
                                    }
                                    rows="2"
                                  />
                                </div>

                                <div className="mb-3">
                                  {/* Modern file upload area for step */}
                                  <FileInput
                                    label="Upload Video or Image"
                                    accept="image/*,video/*"
                                    onChange={e => handleStepChange(dayIndex, stepIndex, 'file', e.target.files[0])}
                                    file={step.file}
                                    preview={step.preview}
                                    onRemove={() => handleStepChange(dayIndex, stepIndex, 'file', null)}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="d-flex justify-content-center mt-4 program-btn-row">
                    <button
                      type="submit"
                      style={{ backgroundColor: "#ed563b", borderColor: "#ed563b" }}
                      className="btn btn-primary btn-lg px-5 program-btn-mobile"
                      disabled={loading || days.length === 0}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Creating Program...
                        </>
                      ) : (
                        "Create Program"
                      )}
                    </button>
                    <a href="/" className="form-home-link">
                      <i className="mdi mdi-home"></i> Home
                    </a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateProgram;
