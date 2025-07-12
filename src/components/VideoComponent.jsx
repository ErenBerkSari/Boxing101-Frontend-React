import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import '../css/videoComponent.css';

const VideoComponent = forwardRef(({ videoUrl, size, hideControls = false, autoPlay = false, loop = false, muted = false, ...rest }, ref) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(true);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLooping, setIsLooping] = useState(loop); // loop state

    // Gelen ref'i kullanarak parent bileşenin video elementine erişmesini sağla
    useImperativeHandle(ref, () => ({
      play: () => {
        return videoRef.current.play();
      },
      pause: () => {
        videoRef.current.pause();
      },
      load: () => {
        videoRef.current.load();
      },
      setLoop: (val) => {
        setIsLooping(val);
      }
    }));

    // autoPlay prop'u değiştiğinde videoyu kontrol et
    useEffect(() => {
      if (videoRef.current) {
        if (autoPlay) {
          videoRef.current.play().catch(error => {
            console.warn("Video auto-play interrupted or failed:", error.name);
          });
        } else {
          videoRef.current.pause();
        }
      }
    }, [autoPlay, videoUrl]);

    useEffect(() => {
      if (videoRef.current) {
        videoRef.current.loop = isLooping;
      }
    }, [isLooping]);

    useEffect(() => {
      if (videoRef.current) {
        videoRef.current.loop = isLooping;
      }
    }, [videoUrl]);

  // Eğer videoUrl prop'u sağlanmazsa, bir hata veya bekleme durumu göster
  if (!videoUrl) {
    return <div>Video source is loading or not found...</div>;
  }

  const togglePlay = () => {
    const video = videoRef.current;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (isMuted) {
      video.muted = false;
      setIsMuted(false);
      // If unmuting when volume is 0, set it to a default value
      if (video.volume === 0) {
        const defaultVolume = 0.5;
        video.volume = defaultVolume;
        setVolume(defaultVolume);
      }
    } else {
      video.muted = true;
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    const video = videoRef.current;
    video.volume = newVolume;
    setVolume(newVolume);
    
    // If volume is set to 0, mute the video
    if (newVolume === 0) {
      video.muted = true;
      setIsMuted(true);
    } else if (isMuted) {
      video.muted = false;
      setIsMuted(false);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      // Enter fullscreen
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      } else if (containerRef.current.msRequestFullscreen) {
        containerRef.current.msRequestFullscreen();
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  const toggleLoop = () => {
    setIsLooping((prev) => !prev);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const container = containerRef.current;

    const handlePlay = () => {
      setIsPlaying(true);
      setShowPlayButton(false);
    };

    const handlePause = () => {
      setIsPlaying(false);
      setShowPlayButton(true);
    };

    const handleTimeUpdate = () => {
      if (!video.duration) return;
      const percent = (video.currentTime / video.duration) * 100;
      setProgress(percent);
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    // Set initial volume
    video.volume = volume;

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('timeupdate', handleTimeUpdate);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      if (video) {
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
        video.removeEventListener('timeupdate', handleTimeUpdate);
      }
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleSeek = (e) => {
    const rect = e.target.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percent = clickX / width;
    videoRef.current.currentTime = percent * videoRef.current.duration;
  };

  return (
    <div className={`video-component ${size || ''} ${isFullscreen ? 'fullscreen' : ''}`} ref={containerRef}>
      <div className="video-wrapper">
        {showPlayButton && !hideControls && (
          <img
            src="/assets/images/play-button-icon.png"
            alt="Play"
            className="custom-play-image"
            onClick={togglePlay}
          />
        )}
        <video
          ref={videoRef}
          controls={false}
          onClick={!hideControls ? togglePlay : undefined}
          key={videoUrl}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          {...rest}
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {!hideControls && (
          <div className="custom-controls" onClick={(e) => e.stopPropagation()}>
            <button className="control-btn" onClick={togglePlay}>
              <img src={isPlaying ? "/assets/images/pause.png" : "/assets/images/play-button-control.png"} alt={isPlaying ? "Pause" : "Play"} />
            </button>
            <div 
              className="volume-container" 
            >
              <button className="control-btn volume-btn" onClick={toggleMute}>
                <img src={isMuted || volume === 0 ? "/assets/images/volume-mute.png" : "/assets/images/volume-control.png"} alt="Toggle Mute" />
              </button>
              <div className="volume-slider-wrapper">
                <input
                  type="range"
                  orient="vertical"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="volume-slider"
                />
              </div>
            </div>
            <button className={`control-btn loop-btn${isLooping ? ' active' : ''}`} onClick={toggleLoop} title="Loop">
              <img src="/assets/images/loop.png" alt="Loop" style={isLooping ? {filter: 'brightness(1.2)'} : {}} />
            </button>
            <div className="progress-bar" onClick={handleSeek}>
              <div className="progress-filled" style={{ width: `${progress}%` }} />
            </div>
            <button className={`control-btn fullscreen-btn ${isFullscreen ? 'is-fullscreen' : ''}`} onClick={toggleFullscreen}>
              <img src="/assets/images/expand.png" alt="Toggle Fullscreen" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

export default VideoComponent;
