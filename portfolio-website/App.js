import React from 'react';
import { Header, Skills, Education, Projects, Section, Footer } from './components';
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  return (
    <Router basename="/Portfolio-Website">
      <div className="App">
        <Header />
        <main>
          <Section id="summary">
            <h2>Professional Summary</h2>
            <p>A versatile Computer Science professional with expertise in full-stack web development, natural language processing, health monitoring applications, and computer vision. Skilled in building intelligent applications using modern frameworks and machine learning techniques. Experienced in Python, JavaScript, TypeScript, React, Next.js, Express.js, Flask, and various ML/NLP libraries. Passionate about creating innovative solutions that combine cutting-edge technologies with intuitive user experiences.</p>
          </Section>
          <Skills />
          <Education />
          <Projects />
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;