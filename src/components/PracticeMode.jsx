// src/components/PracticeMode.jsx
import React, { useState, useEffect } from 'react';
import { taskDependencies } from '../utils/taskDependencies';
import CountingTask from './CountingTask';
import SliderTask from './SliderTask';
import TypingTask from './TypingTask';
import './PracticeMode.css';

export default function PracticeMode({ rulesData }) {
  const [currentPractice, setCurrentPractice] = useState(null);
  const [completedPractice, setCompletedPractice] = useState({});
  
  useEffect(() => {
    // Update visual indicators when tasks are completed
    Object.keys(completedPractice).forEach(taskId => {
      if (taskId.startsWith('g2')) {
        // Slider completed - highlight counting cards
        const countingCards = document.querySelectorAll('.practice-card.counting');
        countingCards.forEach(card => card.classList.add('enhanced-task'));
      } else if (taskId.startsWith('g3')) {
        // Typing completed - enhance slider cards
        const sliderCards = document.querySelectorAll('.practice-card.slider');
        sliderCards.forEach(card => card.classList.add('enhanced-task'));
      } else if (taskId.startsWith('g1')) {
        // Counting completed - simplify typing cards
        const typingCards = document.querySelectorAll('.practice-card.typing');
        typingCards.forEach(card => card.classList.add('enhanced-task'));
      }
    });
  }, [completedPractice]);
  
  const handlePracticeComplete = (taskId) => {
    setCompletedPractice(prev => ({ ...prev, [taskId]: true }));
    // Activate dependencies with 100% probability in practice mode
    taskDependencies.checkDependencies(taskId, true);
    setCurrentPractice(null);
  };
  
  const renderPracticeMenu = () => (
    <div className="practice-menu">
      <h2>Practice Mode</h2>
      <p className="practice-hint">
        Try completing tasks in different orders to see how they affect each other!
      </p>
      
      <div className="practice-cards">
        <div className="practice-card counting">
          <h3>🔢 Counting Game</h3>
          <p>Count words or letters in text passages</p>
          <div className="practice-buttons">
            {[1, 2, 3].map(n => (
              <button
                key={n}
                onClick={() => setCurrentPractice(`g1t${n}`)}
                className={completedPractice[`g1t${n}`] ? 'completed' : ''}
              >
                Task {n} {completedPractice[`g1t${n}`] && '✓'}
              </button>
            ))}
          </div>
        </div>
        
        <div className="practice-card slider">
          <h3>🎯 Slider Game</h3>
          <p>Match target values with precision</p>
          <div className="practice-buttons">
            {[1, 2, 3].map(n => (
              <button
                key={n}
                onClick={() => setCurrentPractice(`g2t${n}`)}
                className={completedPractice[`g2t${n}`] ? 'completed' : ''}
              >
                Task {n} {completedPractice[`g2t${n}`] && '✓'}
              </button>
            ))}
          </div>
        </div>
        
        <div className="practice-card typing">
          <h3>⌨️ Typing Game</h3>
          <p>Type patterns exactly as shown</p>
          <div className="practice-buttons">
            {[1, 2, 3].map(n => (
              <button
                key={n}
                onClick={() => setCurrentPractice(`g3t${n}`)}
                className={completedPractice[`g3t${n}`] ? 'completed' : ''}
              >
                Task {n} {completedPractice[`g3t${n}`] && '✓'}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <button className="back-btn" onClick={() => window.location.reload()}>
        Done Practicing - Start Main Game
      </button>
    </div>
  );
  
  if (!currentPractice) {
    return renderPracticeMenu();
  }
  
  const game = currentPractice[1];
  const taskNum = Number(currentPractice[3]);
  
  return (
    <div className="practice-container">
      <button 
        className="back-to-menu"
        onClick={() => setCurrentPractice(null)}
      >
        ← Back to Practice Menu
      </button>
      
      {game === '1' && (
        <CountingTask
          taskNum={taskNum}
          textSections={rulesData.textSections || ['Practice text for counting...']}
          onComplete={handlePracticeComplete}
        />
      )}
      
      {game === '2' && (
        <SliderTask
          taskNum={taskNum}
          onComplete={handlePracticeComplete}
        />
      )}
      
      {game === '3' && (
        <TypingTask
          taskNum={taskNum}
          onComplete={handlePracticeComplete}
        />
      )}
    </div>
  );
}