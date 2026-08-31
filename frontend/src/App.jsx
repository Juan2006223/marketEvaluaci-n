import React from 'react';
import Rutas from './rutas/index';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800 font-sans">
      <Navbar />
      <main className="flex-grow">
        <Rutas />
      </main>
      <Footer />
    </div>
  );
}

export default App;
