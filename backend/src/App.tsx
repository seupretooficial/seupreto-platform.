function App() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-white text-center">
      <h1 className="text-6xl font-black text-amber-500 mb-2">SEUPRETO</h1>
      <p className="text-zinc-500 tracking-[0.3em] uppercase mb-12">Barber Platform</p>

      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 p-8 rounded-[2rem] shadow-2xl">
        <h2 className="text-xl font-bold mb-6">Agende seu estilo</h2>
        <button className="w-full py-4 bg-amber-600 hover:bg-amber-700 text-white font-black rounded-xl transition-all active:scale-95">
          MARCAR HORÁRIO
        </button>
      </div>
    </div>
  )
}

export default App