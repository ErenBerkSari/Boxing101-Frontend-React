import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getProgramDetail } from "../redux/slices/programSlice";
import {
  getProgramProgress,
  programIsRegistered,
  registerProgram,
  setCurrentProgram,
  clearProgress,
} from "../redux/slices/userSlice";
import { getServerDate } from "../redux/slices/authSlice";
import "../css/programDetail.css";
import LockIcon from "@mui/icons-material/Lock";
import "../css/boxingProgramDetailByUser.css";
import Loader from "./Loader";
import VideoComponent from "./VideoComponent";

const BoxingProgramDetail = () => {
  const [activeDay, setActiveDay] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);
  const [timeOffset, setTimeOffset] = useState(0);
  // const [initialLoadComplete, setInitialLoadComplete] = useState(false); // KALDIRILDI
  const [videoLoading, setVideoLoading] = useState({}); 

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { programId } = useParams();

  const { programDetail, loading } = useSelector(
    (state) => state.program || {}
  );
  const {
    isRegisteredProgram,
    userIsLoading,
    isProgressLoading,
    progress,
    completedDays,
  } = useSelector((store) => store.user);

  const { user, authIsLoading, serverDate } = useSelector(
    (store) => store.auth
  );

  // DEBUG: Redux state logları
  console.log("🔴 [REDUX STATE]", JSON.stringify({
    programId,
    loading,
    userIsLoading,
    isProgressLoading,
    authIsLoading,
    programDetail,
    progress,
    completedDays,
    serverDate
  }, null, 2));

  // Program registration process
  const handleRegisterProgram = async () => {
    console.log("🟡 [REGISTER] Starting registration for program:", programId);
    if (!user) {
      console.log("🔴 [REGISTER] No user session.");
      return;
    }

    try {
      const resultAction = await dispatch(registerProgram(programId));
      if (registerProgram.fulfilled.match(resultAction)) {
        console.log("🟢 [REGISTER] Program registration successful:", resultAction.payload);
        navigate(`/program/user/${programId}/starts`);
      } else {
        console.warn("🔴 [REGISTER] Program registration failed:", resultAction.payload);
      }
    } catch (err) {
      console.error("🔴 [REGISTER] Unexpected error:", err);
    }
  };

  // Load program details and user progress information
  const loadProgramData = useCallback(async () => {
    console.log("🟡 [LOAD] Starting loadProgramData for programId:", programId);
    
    if (programId) {
      try {
        console.log("🟡 [LOAD] Step 1: Setting current program");
        dispatch(setCurrentProgram(programId));

        console.log("🟡 [LOAD] Step 2: Getting program detail");
        const programResult = await dispatch(getProgramDetail(programId)).unwrap();
        console.log("🟢 [LOAD] Program detail loaded:", programResult ? "success" : "failed");

        console.log("🟡 [LOAD] Step 3: Checking program registration");
        const registrationResult = await dispatch(programIsRegistered(programId)).unwrap();
        console.log("🟢 [LOAD] Registration check:", registrationResult);

        console.log("🟡 [LOAD] Step 4: Getting program progress");
        const progressResult = await dispatch(getProgramProgress(programId)).unwrap();
        console.log("🟢 [LOAD] Progress loaded:", progressResult);

        console.log("🟡 [LOAD] Step 5: Getting server date");
        const serverDateResult = await dispatch(getServerDate()).unwrap();
        console.log("🟢 [LOAD] Server date loaded:", serverDateResult);

        console.log("🟢 [LOAD] All data loaded successfully");
        // setInitialLoadComplete(true); // KALDIRILDI
      } catch (err) {
        console.error("🔴 [LOAD] Error loading program data:", err);
        // setInitialLoadComplete(true); // KALDIRILDI
      }
    } else {
      console.log("🔴 [LOAD] No programId provided");
    }
  }, [programId]); // dispatch çıkarıldı

  useEffect(() => {
    console.log("🟡 [EFFECT] loadProgramData effect triggered");
    loadProgramData();

    // return () => {
    //   console.log("🟡 [EFFECT] Component unmounting, clearing progress");
    //   dispatch(clearProgress());
    // };
  }, [loadProgramData]);

  useEffect(() => {
    console.log('MOUNT BoxingProgramDetailByUser');
    return () => console.log('UNMOUNT BoxingProgramDetailByUser');
  }, []);

  // Function to determine active day based on user progress status
  const determineActiveDay = useCallback(() => {
    console.log("🟡 [ACTIVE_DAY] Determining active day", {
      programDetailDays: programDetail?.days?.length || 0,
      completedDaysCount: completedDays?.length || 0,
      currentActiveDay: activeDay
    });

    if (!programDetail?.days?.length || !completedDays) {
      console.log("🔴 [ACTIVE_DAY] Missing program details or completed days");
      return;
    }

    try {
      // If no active day is selected yet, perform determination
      if (
        !activeDay ||
        !programDetail.days.some((day) => day._id === activeDay)
      ) {
        console.log("🟡 [ACTIVE_DAY] No active day selected or invalid active day");
        
        // Check completed days
        if (completedDays?.length > 0) {
          console.log("🟡 [ACTIVE_DAY] Found completed days:", completedDays.length);
          
          // Sort completed days (last completed at the end)
          const sortedCompletedDays = [...completedDays].sort((a, b) => {
            return new Date(a.completedAt) - new Date(b.completedAt);
          });

          // ID of the last completed day
          const lastCompletedDayId =
            sortedCompletedDays[sortedCompletedDays.length - 1]?.dayId;

          if (lastCompletedDayId) {
            console.log("🟡 [ACTIVE_DAY] Last completed day ID:", lastCompletedDayId);
            
            // Find the object of the last completed day in the program
            const lastCompletedDayObj = programDetail.days.find(
              (day) => day._id === lastCompletedDayId
            );

            if (lastCompletedDayObj) {
              console.log("🟡 [ACTIVE_DAY] Last completed day object found:", lastCompletedDayObj.dayNumber);
              
              // Try to find the next day
              const nextDayNumber = lastCompletedDayObj.dayNumber + 1;
              const nextDay = programDetail.days.find(
                (day) => day.dayNumber === nextDayNumber
              );

              if (nextDay) {
                console.log("🟢 [ACTIVE_DAY] Next day activated:", nextDay.dayNumber);
                setActiveDay(nextDay._id);
              } else {
                console.log("🟢 [ACTIVE_DAY] Last completed day active:", lastCompletedDayObj.dayNumber);
                setActiveDay(lastCompletedDayId);
              }
            } else {
              console.log("🟡 [ACTIVE_DAY] Last completed day object not found, using first day");
              setActiveDay(programDetail.days[0]._id);
            }
          } else {
            console.log("🟡 [ACTIVE_DAY] No last completed day ID, using first day");
            setActiveDay(programDetail.days[0]._id);
          }
        } else {
          console.log("🟡 [ACTIVE_DAY] No completed days, showing first day");
          setActiveDay(programDetail.days[0]._id);
        }
      } else {
        console.log("🟢 [ACTIVE_DAY] Active day already set:", activeDay);
      }
    } catch (error) {
      console.error("🔴 [ACTIVE_DAY] Active day determination error:", error);
      // Show first day in case of error
      if (programDetail?.days?.length > 0) {
        console.log("🟡 [ACTIVE_DAY] Using first day due to error");
        setActiveDay(programDetail.days[0]._id);
      }
    }
  }, [programDetail, completedDays, activeDay]);

  // Update active day based on completed days and program details
  useEffect(() => {
    console.log("🟡 [EFFECT] determineActiveDay effect triggered");
    determineActiveDay();
  }, [determineActiveDay]);

  // Duration formatting helper function
  const formatDuration = (seconds) => {
    if (!seconds) return "0 min";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes === 0) {
      return `${remainingSeconds} sec`;
    } else if (remainingSeconds === 0) {
      return `${minutes} min`;
    } else {
      return `${minutes} min ${remainingSeconds} sec`;
    }
  };

  // Total duration calculation functions
  const calculateTotalDuration = (steps) => {
    if (!Array.isArray(steps)) return 0;
    return steps.reduce((total, step) => total + (step.duration || 0), 0);
  };

  const calculateProgramTotalDuration = (days) => {
    if (!Array.isArray(days)) return 0;
    return days.reduce((total, day) => {
      const dayDuration = calculateTotalDuration(day.steps || []);
      return total + dayDuration;
    }, 0);
  };

  const destructProgress = progress.progress;
  
  // Find last completed day
  const lastCompleted = Array.isArray(destructProgress)
    ? [...destructProgress]
        .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))[0]
    : null;

  const lockedToDate = lastCompleted?.newDayLockedToDate;
  
  // Check program completion status
  const programIsCompleted = progress.isCompleted && progress.programId === programId;
  
  // Calculate timeOffset
  useEffect(() => {
    console.log("🟡 [EFFECT] timeOffset effect triggered", { serverDate });
    if (serverDate) {
      const clientNow = Date.now();
      const serverNow = new Date(serverDate).getTime();
      const offset = serverNow - clientNow;
      console.log("🟢 [TIME_OFFSET] Calculated offset:", offset);
      setTimeOffset(offset);
    }
  }, [serverDate]);

  // Calculate remaining time with client now + offset
  useEffect(() => {
    console.log("🟡 [EFFECT] remainingTime effect triggered", { lockedToDate, serverDate });
    if (!lockedToDate || !serverDate) return;

    const lockedTime = new Date(lockedToDate).getTime();

    const updateRemaining = () => {
      const now = Date.now();
      const adjustedNow = now + timeOffset;
      const remaining = lockedTime - adjustedNow;
      console.log("🟡 [REMAINING_TIME] Updated:", remaining);
      setRemainingTime(remaining);
    };

    updateRemaining();

    const interval = setInterval(updateRemaining, 1000);

    return () => {
      console.log("🟡 [REMAINING_TIME] Clearing interval");
      clearInterval(interval);
    };
  }, [lockedToDate, serverDate, timeOffset]);

  // isLocked will only be calculated based on remainingTime
  const isLocked = remainingTime > 0;

  // Special checks for program
  const isCurrentProgramProgress = progress.programId === programId;
  
  // Check completed day count
  const completedDaysCount = completedDays?.length || 0;
  const totalDays = programDetail?.days?.length || 0;
  const isAllDaysCompleted = completedDaysCount === totalDays;

  // Formatter function
  const formatRemainingTime = (ms) => {
    if (!ms || ms <= 0) return "Time expired";
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h} hr ${m} min ${s} sec`;
  };
  
  useEffect(() => {
    console.log("🟡 [EFFECT] Scroll to top effect triggered");
    window.scrollTo(0, 0);
  }, []);

  // Loading durumu kontrolü
  const isLoading = loading || authIsLoading || userIsLoading || isProgressLoading; // sadeleştirildi

  console.log("🟡 [LOADING_CHECK]", JSON.stringify({
    loading,
    authIsLoading,
    userIsLoading,
    isProgressLoading,
    finalIsLoading: isLoading
  }, null, 2));

  // Loading durumunda loader göster
  if (isLoading) {
    console.log("🔴 [RENDER] Showing loader");
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

  // İlk yükleme tamamlandı ama program bulunamadı
  if (!programDetail) {
    console.log("🔴 [RENDER] Program not found");
    return (
      <div className="container my-5">
        <div className="alert alert-warning">
          <h4>Program not found</h4>
          <p>The program you are looking for was not found or you don't have access permission.</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/usersPrograms")}
          >
            Back to Programs
          </button>
        </div>
      </div>
    );
  }

  // Find active day data
  const activeDayData = programDetail.days?.find(
    (day) => day._id === activeDay
  );

  console.log("🟢 [RENDER] Rendering main component", JSON.stringify({
    activeDay,
    activeDayData: activeDayData ? "found" : "not found"
  }, null, 2));

  return (
    <div className="program-detail-container">
      <a href="/" className="home-icon">
        <i className="mdi mdi-home"></i>
      </a>
      {/* Program Title and General Information */}
      <div className="program-header-card">
        <div className="program-header-info-mobile">
          <div className="program-header-title">
            {programDetail.title || "Program Details"}
          </div>
          <div className="program-header-desc">
            {programDetail.description || "No description available."}
          </div>
          <div className="program-header-badges">
            <span className="badge bg-light text-dark rounded-pill fs-6">
              {programDetail.duration} Days
            </span>
            <span className="badge bg-secondary text-dark  fs-6">
              Total:{" "}
              {formatDuration(
                calculateProgramTotalDuration(programDetail.days)
              )}
            </span>
          </div>

          <div className="program-header-actions-user">
            {user && (
              <div className="main-button">
                {isCurrentProgramProgress && programIsCompleted ? (
                  <button disabled className="program-completed-btn">Program Completed 🏆</button>
                ) : !isLocked ? (
                  isRegisteredProgram?.isRegistered ? (
                    <Link
                      id="continue-program-button"
                      to={`/program/user/${programId}/starts`}
                      className="solid-main-button"
                    >
                      {isAllDaysCompleted ? "Repeat Last Day" : "Continue"}
                    </Link>
                  ) : (
                    <button
                      onClick={handleRegisterProgram}
                      className="start-program-button solid-main-button"
                    >
                      Start Program
                    </button>
                  )
                ) : (
                  <>
                    {console.log("[LOCKED BUTTON]", { programId, remainingTime, progress, completedDays })}
                    <button disabled>
                      <LockIcon style={{ fontSize: 32, color: "#ed563b" }} />
                      {formatRemainingTime(remainingTime)}
                    </button>
                  </>
                )}
                <a
                  style={{
                    border: "none",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0",
                  }}
                  href="/"
                  className="form-home-link"
                >
                  Home
                </a>
              </div>
            )}
          </div>
        </div>
        {programDetail.coverImage && (
          <div className="program-header-cover-mobile">
            <img
              width={200}
              height={210}
              style={{ objectFit: "cover" }}
              src={programDetail.coverImage}
              alt={programDetail.title}
            />
          </div>
        )}
      </div>
      <div className="program-main-row">
        {/* Days List */}
        <div className="program-days-list">
          <div className="program-days-card">
            <div className="card-header">Program Days</div>
            <div id="program-days-list-ByUser" className="list-group list-group-flush">
              {Array.isArray(programDetail.days) &&
                programDetail.days.map((day) => {
                  const isCompleted = completedDays?.some(
                    (completed) => completed.dayId === day._id
                  );
                  return (
                    <button
                      key={day._id}
                      className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center${
                        activeDay === day._id ? " active" : ""
                      }`}
                      onClick={() => setActiveDay(day._id)}
                    >
                      <div className="user-program-day-list">
                        <strong>Day {day.dayNumber}</strong>: {day.title}
                        {isCompleted && (
                          <span className="ms-2 text-success"> ✅</span>
                        )}
                      </div>
                      <span id="program-detail-list-badge" className="badge bg-info ">
                        {formatDuration(calculateTotalDuration(day.steps))}
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
        {/* Selected Day's Steps */}
        <div className="program-day-content">
          {activeDayData ? (
            <div className="program-day-card">
              <div id="program-day-card-user" className="card-header">
                <span style={{color: "#2c3e50"}}>
                  Day {activeDayData.dayNumber}: {activeDayData.title}
                </span>
                <span className="badge bg-white border border-gray text-dark step-duration-badge">
                  {formatDuration(calculateTotalDuration(activeDayData.steps))}
                </span>
              </div>
              <div className="card-body">
                <p className="lead">
                  {activeDayData.description ||
                    "No description available for this day."}
                </p>
                {/* Steps List */}
                {Array.isArray(activeDayData.steps) &&
                activeDayData.steps.length > 0 ? (
                  <div className="timeline mt-4 program-mobile">
                    {activeDayData.steps.map((step, index) => (
                      <div
                        key={`step-${step._id}-${index}`}
                        className="timeline-item timeline-item-box"
                      >
                        <div id="day-content-user" className="card-header d-flex justify-content-between align-items-center  w-100">
                          <h5 className="mb-0">
                            {step.order}. Step: {step.title}
                          </h5>

                          <span className="badge border border-gray text-dark step-duration-badge">
                          {formatDuration(step.duration)}
                          </span>
                        </div>
                        <div className="row g-0 mb-4">
                          {step.movements && step.movements.length > 0 && (
                            <div className="col-12 col-md-8">
                              <div className="movements-container">
                                {step.movements.map((movement, index) => (
                                  <div
                                    key={`movement-${step._id}-${movement._id}-${index}`}
                                    className="movement-item mb-3 mt-3"
                                  >
                                    
                                    {movement.firstVideoContent && (
                                      <div className="movement-video">
                                        <div className="video-wrapper">
                                          <div className="movement-title-overlay">
                                            {videoLoading[movement._id] !== false
                                              ? "Loading..."
                                              : `${index + 1}. ${movement.movementName}`}
                                          </div>
                                          <VideoComponent
                                            videoUrl={movement.firstVideoContent.url}
                                            size="medium"
                                            onLoadedData={() =>
                                              setVideoLoading((prev) => ({ ...prev, [movement._id]: false }))
                                            }
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {/* <div className="col-12 col-md-8">
                            <div className="card h-100">
                              <div className="card-body">
                                <p className="mb-0">
                                  {step.description ||
                                    "Bu adım için açıklama bulunmuyor."}
                                </p>
                              </div>
                            </div>
                          </div> */}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="alert alert-info">
                    No steps available for this day.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="alert alert-warning">
              Please select a day to view
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BoxingProgramDetail;