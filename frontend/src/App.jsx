import React from 'react';
import Rutas from './rutas/index';
import Navbar from './shared/componentes/Navbar';
import Footer from './shared/componentes/Footer';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
      <Navbar />
      <main className="flex-grow">
        <Rutas />
      </main>
      <Footer />
    </div>
  );
}

export default App;
