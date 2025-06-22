import React, { useRef, useState, useEffect } from 'react';
import './videoComponent.css';

const VideoComponent = ({ videoUrl }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(true);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Eğer videoUrl prop'u sağlanmazsa, bir hata veya bekleme durumu göster
  if (!videoUrl) {
    return <div>Video kaynağı yükleniyor veya bulunamadı...</div>;
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

  useEffect(() => {
    const video = videoRef.current;
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
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('timeupdate', handleTimeUpdate);
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
    <div className={`video-component ${isFullscreen ? 'fullscreen' : ''}`} ref={containerRef}>
      <div className="video-wrapper">
        {showPlayButton && (
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
          onClick={togglePlay}
          key={videoUrl}
        >
          <source src={videoUrl} type="video/mp4" />
          Tarayıcınız video etiketini desteklemiyor.
        </video>

        {/* Özel Kontroller */}
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
          <div className="progress-bar" onClick={handleSeek}>
            <div className="progress-filled" style={{ width: `${progress}%` }} />
          </div>
          <button className={`control-btn fullscreen-btn ${isFullscreen ? 'is-fullscreen' : ''}`} onClick={toggleFullscreen}>
            <img src="/assets/images/expand.png" alt="Toggle Fullscreen" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoComponent;
