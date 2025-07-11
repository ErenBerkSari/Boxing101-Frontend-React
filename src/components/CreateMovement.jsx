import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createMovement } from "../redux/slices/movementSlice";
import Loader from "./Loader";
import "../css/createMovement.css";

// Modern FileInput component
function FileInput({ label, accept, onChange, file, preview, onRemove }) {
  return (
    <div className="file-input-container">
      <label className="file-input-label">
        <div className="file-input-icon">
          <i className="bi bi-cloud-arrow-up-fill"></i>
        </div>
        <div className="file-input-title">{label}</div>
        <div className="file-input-subtitle">Drag and drop or click</div>
        <input
          type="file"
          accept={accept}
          className="file-input-hidden"
          onChange={onChange}
        />
      </label>
      {file && (
        <div className="file-preview">
          <div className="file-info">
            <span className="file-name">{file.name}</span>
            <button type="button" onClick={onRemove} className="file-remove-btn">
              <i className="bi bi-x-circle-fill"></i>
            </button>
          </div>
          {preview && (
            <div className="file-preview-media">
              {file.type && file.type.startsWith('image') ? (
                <img src={preview} alt="preview" className="preview-image" />
              ) : file.type && file.type.startsWith('video') ? (
                <video src={preview} controls className="preview-video" />
              ) : null}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CreateMovement() {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.movement);
  const [movementName, setMovementName] = useState("");
  const [movementDesc, setMovementDesc] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [contentItems, setContentItems] = useState([]);

  const handleAddContent = (type) => {
    const newItem =
      type === "text"
        ? { type, value: "" }
        : { type, file: null, preview: null };
    setContentItems([...contentItems, newItem]);
  };

  const handleContentChange = (index, key, value) => {
    const updated = [...contentItems];
    updated[index][key] = value;
    if (key === "file") {
      updated[index]["preview"] = URL.createObjectURL(value);
    }
    setContentItems(updated);
  };

  const handleRemoveContent = (index) => {
    const updated = contentItems.filter((_, i) => i !== index);
    setContentItems(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("movementName", movementName);
    formData.append("movementDesc", movementDesc);
    formData.append("cover", imageFile);

    if (imageFile) {
      formData.append("files", imageFile);
    }

    const contentData = contentItems.map((item) => {
      if (item.type === "text") {
        return { type: "text", value: item.value };
      } else {
        return {
          type: item.type,
          name: item.file.name,
        };
      }
    });

    formData.append("movementContent", JSON.stringify(contentData));

    contentItems.forEach((item) => {
      if (item.type !== "text" && item.file) {
        formData.append("files", item.file);
      }
    });

    dispatch(createMovement(formData));
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <Loader />
        <div className="loading-text">Loading, please wait...</div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @media (max-width: 576px) {
          .movement-btn-mobile {
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
          .movement-btn-row {
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
                <h2 className="movement-title">Create New Movement</h2>

                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Movement Name</label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      value={movementName}
                      onChange={(e) => setMovementName(e.target.value)}
                      required
                      placeholder="Give your movement a name"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold">Description</label>
                    <textarea
                      className="form-control"
                      value={movementDesc}
                      onChange={(e) => setMovementDesc(e.target.value)}
                      rows="3"
                      placeholder="Briefly describe your movement"
                    />
                  </div>

                  <div className="mb-4">
                    <FileInput
                      label="Upload Cover Image"
                      accept="image/*"
                      onChange={e => setImageFile(e.target.files[0])}
                      file={imageFile}
                      preview={imageFile ? URL.createObjectURL(imageFile) : null}
                      onRemove={() => setImageFile(null)}
                    />
                    <small className="text-muted">Recommended size: 1200x630 pixels</small>
                  </div>

                  <hr className="my-4" />
                  
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="mb-0">Content ({contentItems.length})</h4>
                    <div className="content-buttons">
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm me-2"
                        onClick={() => handleAddContent("text")}
                      >
                        <i className="bi bi-text-paragraph me-2"></i>Text
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-success btn-sm me-2"
                        onClick={() => handleAddContent("image")}
                      >
                        <i className="bi bi-image me-2"></i>Image
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-warning btn-sm"
                        onClick={() => handleAddContent("video")}
                      >
                        <i className="bi bi-camera-video me-2"></i>Video
                      </button>
                    </div>
                  </div>

                  {contentItems.length === 0 && (
                    <div className="alert alert-info d-flex align-items-center">
                      <i className="bi bi-info-circle-fill me-2"></i>
                      Please add at least one content item for the movement.
                    </div>
                  )}

                  {contentItems.map((item, index) => (
                    <div key={index} className="content-item-card">
                      <div className="content-item-header">
                        <h6 className="mb-0">
                          <i className={`bi bi-${item.type === 'text' ? 'text-paragraph' : item.type === 'image' ? 'image' : 'camera-video'} me-2`}></i>
                          {item.type === 'text' ? 'Text' : item.type === 'image' ? 'Image' : 'Video'} {index + 1}
                        </h6>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleRemoveContent(index)}
                        >
                          <img src="/assets/images/trash.png" alt="Delete" className="trash-icon" />
                        </button>
                      </div>

                      <div className="content-item-body">
                        {item.type === "text" && (
                          <textarea
                            className="form-control"
                            placeholder="Write detailed information about the movement..."
                            value={item.value}
                            onChange={(e) =>
                              handleContentChange(index, "value", e.target.value)
                            }
                            rows="4"
                          />
                        )}
                        {(item.type === "image" || item.type === "video") && (
                          <FileInput
                            label={`Upload ${item.type === 'image' ? 'Image' : 'Video'}`}
                            accept={item.type + "/*"}
                            onChange={e => handleContentChange(index, 'file', e.target.files[0])}
                            file={item.file}
                            preview={item.preview}
                            onRemove={() => handleContentChange(index, 'file', null)}
                          />
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="d-flex justify-content-center mt-4 movement-btn-row">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg px-5 movement-btn-mobile"
                      disabled={isLoading || contentItems.length === 0}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Creating Movement...
                        </>
                      ) : (
                        "Create Movement"
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

export default CreateMovement;
