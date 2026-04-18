import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Play, Square, Trash2, Settings, Type, ListMusic } from 'lucide-react';
import './App.css';

export default function App() {
  const [textToRead, setTextToRead] = useState("");
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const loadVoices = useCallback(() => {
    const availableVoices = window.speechSynthesis.getVoices();
    setVoices(availableVoices);
    if (availableVoices.length > 0 && !selectedVoice) {
      setSelectedVoice(availableVoices[0].voiceURI);
    }
  }, [selectedVoice]);

  useEffect(() => {
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [loadVoices]);

  const handleSpeak = () => {
    if (!textToRead) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToRead);
    
    const voice = voices.find(v => v.voiceURI === selectedVoice);
    if (voice) utterance.voice = voice;
    
    utterance.pitch = pitch;
    utterance.rate = rate;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const handleClear = () => {
    setTextToRead("");
    handleStop();
  };

  return (
    <div className="App">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container"
      >
        <div className="glass-card">
          <header className="header">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Volume2 size={48} color="var(--primary)" style={{ marginBottom: "10px" }} />
            </motion.div>
            <h1>VoiceMaster AI</h1>
            <p>Convert your text into professional, high-quality speech</p>
          </header>

          <main>
            <div className="textarea-wrapper">
              <textarea
                placeholder="Type or paste your text here..."
                rows="6"
                value={textToRead}
                onChange={(e) => setTextToRead(e.target.value)}
              />
              {isSpeaking && <div className="speaking-pulse" />}
            </div>

            <div className="controls-grid">
              <div className="control-group">
                <label><ListMusic size={16} /> Choose Voice</label>
                <select 
                  className="select-box"
                  value={selectedVoice || ""}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                >
                  {voices.map((voice) => (
                    <option key={voice.voiceURI} value={voice.voiceURI}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
                </select>
              </div>

              <div className="control-group">
                <label><Settings size={16} /> Pitch ({pitch})</label>
                <div className="slider-container">
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={pitch}
                    onChange={(e) => setPitch(parseFloat(e.target.value))}
                  />
                </div>
              </div>

              <div className="control-group">
                <label><Type size={16} /> Speed ({rate}x)</label>
                <div className="slider-container">
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={rate}
                    onChange={(e) => setRate(parseFloat(e.target.value))}
                  />
                </div>
              </div>

              <div className="control-group" style={{ visibility: 'hidden', height: 0 }}>
                {/* Spacer for grid consistency */}
              </div>
            </div>

            <div className="actions">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn btn-secondary"
                onClick={handleClear}
              >
                <Trash2 size={20} /> Clear
              </motion.button>

              {isSpeaking ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn btn-primary"
                  onClick={handleStop}
                  style={{ background: 'linear-gradient(135deg, #f87171, #ef4444)' }}
                >
                  <Square size={20} /> Stop
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn btn-primary"
                  onClick={handleSpeak}
                >
                  <Play size={20} /> Speak
                </motion.button>
              )}
            </div>
          </main>
        </div>
      </motion.div>
    </div>
  );
}
