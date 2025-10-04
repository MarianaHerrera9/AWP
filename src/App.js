import React from 'react';
import './App.css';

function App() {
  return (
    <div className="app-root">
      <header className="app-header">
        Mi PWA Ejemplo
      </header>

      <main className="app-main">
        <div className="app-shell">
          <img src="/logo384.png" alt="mypwa" className="app-logo" />
          <h2>Home screen</h2>
          <p>Esta es la vista inicial de la PWA (App Shell).</p>
        </div>
      </main>

      <footer className="app-footer">
        © 2025 - Mariana
      </footer>
    </div>
  );
}

export default App;
