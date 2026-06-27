import { useState } from 'react'

function App() {
  const [tela, setTela] = useState('inicio')

  const servicos = [
    { id: 1, nome: 'Corte Degradê', preco: '50', tempo: '45 min' },
    { id: 2, nome: 'Barba Premium', preco: '35', tempo: '30 min' },
    { id: 3, nome: 'Combo SeuPreto', preco: '75', tempo: '1h 15min' },
    { id: 4, nome: 'Sobrancelha', preco: '15', tempo: '15 min' }
  ]

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center p-6">
      {/* Logo Transparente e Chique */}
      <div className="mt-12 text-center">
        <h1 className="text-6xl font-black text-amber-500 tracking-tighter mb-1">SEUPRETO</h1>
        <p className="text-zinc-500 text-[10px] tracking-[0.6em] uppercase">Luxury Barber System</p>
      </div>

      {/* TELA INICIAL */}
      {tela === 'inicio' && (
        <div className="mt-20 w-full max-w-sm bg-zinc-900/50 border border-zinc-800 p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-md">
          <h2 className="text-2xl font-bold text-center mb-8">E aí, vamos dar um trato no visual?</h2>
          <button 
            onClick={() => setTela('servicos')}
            className="w-full py-5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-2xl transition-all shadow-lg active:scale-95 text-lg"
          >
            AGENDAR HORÁRIO
          </button>
          <button className="w-full py-5 mt-4 bg-zinc-800/50 text-zinc-400 font-bold rounded-2xl hover:bg-zinc-800 transition-all">
            MEUS AGENDAMENTOS
          </button>
        </div>
      )}

      {/* TELA DE SERVIÇOS */}
      {tela === 'servicos' && (
        <div className="mt-10 w-full max-w-md">
          <div className="flex items-center mb-8">
            <button onClick={() => setTela('inicio')} className="text-amber-500 text-sm font-bold flex items-center">
              ← VOLTAR
            </button>
            <h2 className="ml-4 text-xl font-bold">O que vamos fazer hoje?</h2>
          </div>

          <div className="grid gap-4">
            {servicos.map((s) => (
              <div key={s.id} className="bg-zinc-900/80 border border-zinc-800 p-5 rounded-2xl flex justify-between items-center hover:border-amber-500 transition-colors cursor-pointer group">
                <div>
                  <h3 className="font-bold text-lg group-hover:text-amber-500 transition-colors">{s.nome}</h3>
                  <p className="text-zinc-500 text-sm">{s.tempo}</p>
                </div>
                <div className="text-right">
                  <p className="text-amber-500 font-bold text-xl">R$ {s.preco}</p>
                  <span className="text-[9px] uppercase tracking-tighter text-zinc-600">Selecionar</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <footer className="mt-auto py-8 text-neutral-800 text-[9px] tracking-[0.4em] font-mono">
        © 2026 SEUPRETO TECH • V1.0.4
      </footer>
    </div>
  )
}

export default App