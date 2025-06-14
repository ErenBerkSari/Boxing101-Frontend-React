import React from 'react';
import './animatedClock.css';

const AnimatedClock = () => (
  <svg width="32" height="32" viewBox="0 0 32 32">
    <circle cx="16" cy="16" r="15" fill="#fffbe6" stroke="#ed563b" strokeWidth="2"/>
    {/* Akrep */}
    <rect x="15.5" y="8" width="1" height="7" fill="#ed563b" className="hour-hand"/>
    {/* Yelkovan */}
    <rect x="15.8" y="5" width="0.4" height="11" fill="#333" className="minute-hand"/>
    <circle cx="16" cy="16" r="1" fill="#ed563b"/>
  </svg>
);

export default AnimatedClock; 