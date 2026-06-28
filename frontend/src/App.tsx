import { useState, useEffect } from 'react'
import { supabase } from './supabase'

const servicos = [
  { id: 1, nome: 'Corte', preco: 70, tempo: '~45 min', categoria: 'corte' },
  { id: 2, nome: 'Corte + Barba', preco: 90, tempo: '~1h 15min', categoria: 'corte' },
  { id: 3, nome: 'Corte + Freestyle', preco: 90, tempo: '~1h', categoria: 'corte' },
  { id: 4, nome: 'Corte + Pigmentação', preco: 80, tempo: '~1h', categoria: 'corte' },
  { id: 5, nome: 'Corte + Sobrancelhas', preco: 90, tempo: '~1h', categoria: 'corte' },
  { id: 6, nome: 'Corte + Limpeza de Pele', preco: 90, tempo: '~1h', categoria: 'corte' },
  { id: 7, nome: 'Corte + Barba + Sobrancelhas', preco: 110, tempo: '~1h 30min', categoria: 'combo' },
  { id: 8, nome: 'Corte + Barba + Limpeza de Pele', preco: 120, tempo: '~1h 30min', categoria: 'combo' },
  { id: 9, nome: 'Corte + Barba + Sobrancelhas + Limpeza', preco: 140, tempo: '~2h', categoria: 'combo' },
  { id: 10, nome: 'Barba', preco: 50, tempo: '~30 min', categoria: 'barba' },
  { id: 11, nome: 'Barba + Pezinho', preco: 70, tempo: '~45 min', categoria: 'barba' },
  { id: 12, nome: 'Barba + Sobrancelhas', preco: 70, tempo: '~45 min', categoria: 'barba' },
  { id: 13, nome: 'Barba + Pezinho + Sobrancelhas', preco: 90, tempo: '~1h', categoria: 'barba' },
  { id: 14, nome: 'Barba + Limpeza de Pele', preco: 70, tempo: '~1h', categoria: 'barba' },
  { id: 15, nome: 'Barba + Pigmentação', preco: 60, tempo: '~45 min', categoria: 'barba' },
  { id: 16, nome: 'Freestyle', preco: 30, tempo: '~20 min', categoria: 'avulso' },
  { id: 17, nome: 'Pezinho', preco: 30, tempo: '~15 min', categoria: 'avulso' },
  { id: 18, nome: 'Sobrancelhas', preco: 30, tempo: '~15 min', categoria: 'avulso' },
  { id: 19, nome: 'Limpeza de Pele', preco: 30, tempo: '~20 min', categoria: 'avulso' },
  { id: 20, nome: 'Limpeza de Pele + Pezinho', preco: 50, tempo: '~30 min', categoria: 'avulso' },
  { id: 21, nome: 'Limpeza de Pele + Sobrancelhas', preco: 50, tempo: '~30 min', categoria: 'avulso' },
  { id: 22, nome: 'Pigmentação', preco: 20, tempo: '~15 min', categoria: 'avulso' },
]

const horariosDisponiveis = ['08:00','09:00','10:00','11:00','13:00','14:00','15:00','16:00','17:00','18:00']

const hojeDate = new Date()
const diasAgenda = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(hojeDate)
  d.setDate(hojeDate.getDate() + i)
  return {
    dia: d.getDate().toString().padStart(2, '0'),
    mes: (d.getMonth() + 1).toString().padStart(2, '0'),
    semana: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'][d.getDay()],
    desabilitado: d.getDay() === 0
  }
})

function App() {
  const [tela, setTela] = useState('inicio')
  const [servicoSelecionado, setServicoSelecionado] = useState<any>(null)
  const [diaSelecionado, setDiaSelecionado] = useState('')
  const [mesSelecionado, setMesSelecionado] = useState('')
  const [horarioSelecionado, setHorarioSelecionado] = useState('')
  const [nomeCliente, setNomeCliente] = useState('')
  const [agendamentos, setAgendamentos] = useState<any[]>([])
  const [loginUsuario, setLoginUsuario] = useState('')
  const [loginSenha, setLoginSenha] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('todos')// const [filtroStatus, setFiltroStatus] = useState('todos')

  const [modalRemarcar, setModalRemarcar] = useState<any>(null)
  const [novoHorario, setNovoHorario] = useState('')
  const [novoDia, setNovoDia] = useState('')
  const [novoMes, setNovoMes] = useState('')

  useEffect(() => {
    if (tela === 'painel') buscarAgendamentos()
  }, [tela])

  async function buscarAgendamentos() {
    const { data } = await supabase
      .from('agendamentos')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setAgendamentos(data)
  }

  async function confirmarAgendamento() {
    if (!nomeCliente) { alert('Digite seu nome!'); return }
    const { error } = await supabase.from('agendamentos').insert([{
      cliente: nomeCliente,
      servico: servicoSelecionado.nome,
      data: `${diaSelecionado}/${mesSelecionado}`,
      horario: horarioSelecionado,
      valor: servicoSelecionado.preco,
      status: 'pendente'
    }])
    if (error) alert('Erro: ' + error.message)
    else setTela('confirmado')
  }

  async function atualizarStatus(id: number, novoStatus: string) {
    await supabase.from('agendamentos').update({ status: novoStatus }).eq('id', id)
    buscarAgendamentos()
  }

  async function excluirAgendamento(id: number) {// async function excluirAgendamento(id: number) { ... }
    if (!confirm('Remover este agendamento?')) return
    await supabase.from('agendamentos').delete().eq('id', id)
    buscarAgendamentos()
  }

  async function salvarRemarcacao() {
    if (!novoDia || !novoHorario) { alert('Escolha dia e horário!'); return }
    await supabase.from('agendamentos').update({
      data: `${novoDia}/${novoMes}`,
      horario: novoHorario,
      status: 'remarcado'
    }).eq('id', modalRemarcar.id)
    setModalRemarcar(null)
    setNovoDia(''); setNovoHorario('')
    buscarAgendamentos()
  }

  const agendamentosFiltrados = filtroStatus === 'todos'
    ? agendamentos
    : agendamentos.filter(a => a.status === filtroStatus)

  const totalFaturado = agendamentos
    .filter(a => a.status === 'confirmado')
    .reduce((acc, a) => acc + a.valor, 0)

  const statusConfig: any = {
    pendente: { cor: 'text-yellow-400 bg-yellow-900/30 border-yellow-500/30', label: '⏳ Pendente' },
    confirmado: { cor: 'text-green-400 bg-green-900/30 border-green-500/30', label: '✅ Confirmado' },
    cancelado: { cor: 'text-red-400 bg-red-900/30 border-red-500/30', label: '❌ Cancelado' },
    remarcado: { cor: 'text-blue-400 bg-blue-900/30 border-blue-500/30', label: '🔄 Remarcado' },
  }

  const Header = () => (
    <div className="mt-10 text-center mb-8">
      <p className="text-amber-600 text-[9px] tracking-[0.5em] uppercase mb-1">barbeiro delivery</p>
      <h1 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-7xl font-black text-white leading-none">
        SEU<span className="text-amber-500">PRETO</span>
      </h1>
      <p className="text-zinc-500 text-[10px] tracking-[0.4em] uppercase mt-1">a barbearia que vai até você</p>
    </div>
  )

  return (
    <div style={{ fontFamily: "'Playfair Display', serif" }} className="min-h-screen bg-neutral-950 text-white flex flex-col items-center p-5">

      {tela === 'inicio' && (
        <div className="w-full max-w-sm">
          <Header />
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-2xl mb-4 text-center">
            <button onClick={() => setTela('servicos')} className="w-full py-5 bg-amber-600 hover:bg-amber-500 text-white font-black rounded-2xl mb-3 text-lg transition-all active:scale-95">AGENDAR AGORA</button>
            <button onClick={() => setTela('login')} className="w-full py-4 bg-zinc-800 text-zinc-400 rounded-2xl text-sm hover:bg-zinc-700">ÁREA DO BARBEIRO 💈</button>
          </div>
        </div>
      )}

      {tela === 'servicos' && (
        <div className="w-full max-w-md">
          <Header />
          <button onClick={() => setTela('inicio')} className="text-amber-500 text-sm font-bold mb-4 block">← VOLTAR</button>
          <div className="grid gap-3 max-h-[65vh] overflow-y-auto">
            {servicos.map(s => (
              <div key={s.id} onClick={() => { setServicoSelecionado(s); setTela('agenda') }}
                className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex justify-between cursor-pointer hover:border-amber-500 transition-colors">
                <div><p className="font-bold">{s.nome}</p><p className="text-zinc-500 text-xs">{s.tempo}</p></div>
                <p className="text-amber-500 font-black text-lg">R$ {s.preco}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tela === 'agenda' && (
        <div className="w-full max-w-md">
          <Header />
          <button onClick={() => setTela('servicos')} className="text-amber-500 text-sm font-bold mb-4 block">← VOLTAR</button>
          <input type="text" placeholder="Seu Nome Completo" value={nomeCliente} onChange={e => setNomeCliente(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 outline-none p-4 rounded-xl mb-5" />
          <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
            {diasAgenda.map(d => (
              <button key={d.dia} disabled={d.desabilitado} onClick={() => { setDiaSelecionado(d.dia); setMesSelecionado(d.mes) }}
                className={`p-3 min-w-[60px] rounded-xl border font-bold ${diaSelecionado === d.dia ? 'bg-amber-600 border-amber-500' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}>
                <div className="text-[10px]">{d.semana}</div><div className="text-lg">{d.dia}</div>
              </button>
            ))}
          </div>
          {diaSelecionado && (
            <div className="grid grid-cols-4 gap-2 mb-6">
              {horariosDisponiveis.map(h => (
                <button key={h} onClick={() => setHorarioSelecionado(h)}
                  className={`p-3 rounded-xl border text-sm font-bold ${horarioSelecionado === h ? 'bg-amber-600 border-amber-500' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}>{h}</button>
              ))}
            </div>
          )}
          {horarioSelecionado && <button onClick={confirmarAgendamento} className="w-full py-5 bg-amber-600 font-black rounded-2xl text-lg">CONFIRMAR</button>}
        </div>
      )}

      {tela === 'confirmado' && (
        <div className="text-center mt-20 w-full max-w-sm">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-4xl font-black text-amber-500">AGENDADO!</h2>
          <button onClick={() => setTela('inicio')} className="w-full py-4 mt-6 bg-zinc-800 rounded-2xl">VOLTAR</button>
        </div>
      )}

      {tela === 'login' && (
        <div className="w-full max-w-sm mt-10">
          <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800">
            <h2 className="text-2xl font-black mb-6 text-center">Área do Barbeiro</h2>
            <input type="text" placeholder="Usuário" value={loginUsuario} onChange={e => setLoginUsuario(e.target.value)} className="w-full bg-zinc-800 p-4 rounded-xl mb-3 outline-none" />
            <input type="password" placeholder="Senha" value={loginSenha} onChange={e => setLoginSenha(e.target.value)} className="w-full bg-zinc-800 p-4 rounded-xl mb-5 outline-none" />
            <button onClick={() => { if (loginUsuario === 'junio' && loginSenha === '1234') setTela('painel'); else alert('Erro!'); }}
              className="w-full py-4 bg-amber-600 font-black rounded-xl">ENTRAR</button>
          </div>
        </div>
      )}

      {tela === 'painel' && (
        <div className="w-full max-w-md">
          <div className="flex justify-between items-center mt-10 mb-6">
            <h1 className="text-3xl font-black">JUNIO Rodrigues💈</h1>
            <button onClick={() => setTela('inicio')} className="text-zinc-500 text-xs">SAIR</button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
              <p className="text-amber-500 text-2xl font-black">R${totalFaturado}</p>
              <p className="text-zinc-500 text-[9px] uppercase">Faturado (Confirmados)</p>
            </div>
            <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
              <p className="text-white text-2xl font-black">{agendamentos.length}</p>
              <p className="text-zinc-500 text-[9px] uppercase">Total Cortes</p>
            </div>
          </div>

          <div className="space-y-4">
            {agendamentosFiltrados.map(ag => (
              <div key={ag.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-black text-lg">{ag.cliente}</p>
                    <p className="text-zinc-400 text-xs">{ag.servico} - {ag.data} às {ag.horario}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${statusConfig[ag.status]?.cor}`}>
                    {statusConfig[ag.status]?.label}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-zinc-800">
                  <button onClick={() => atualizarStatus(ag.id, 'confirmado')} className="py-2 bg-green-900/30 text-green-400 text-[10px] font-bold rounded-lg border border-green-500/20">CONFIRMAR</button>
                  <button onClick={() => setModalRemarcar(ag)} className="py-2 bg-blue-900/30 text-blue-400 text-[10px] font-bold rounded-lg border border-blue-500/20">REMARCAR</button>
                  <button onClick={() => atualizarStatus(ag.id, 'cancelado')} className="py-2 bg-red-900/30 text-red-400 text-[10px] font-bold rounded-lg border border-red-500/20">CANCELAR</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {modalRemarcar && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-5 z-50">
          <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-3xl w-full max-w-sm">
            <h3 className="font-black mb-4">Remarcar: {modalRemarcar.cliente}</h3>
            <div className="flex gap-2 overflow-x-auto pb-4">
              {diasAgenda.map(d => (
                <button key={d.dia} disabled={d.desabilitado} onClick={() => { setNovoDia(d.dia); setNovoMes(d.mes) }}
                  className={`p-2 min-w-[50px] rounded-lg border text-xs ${novoDia === d.dia ? 'bg-amber-600' : 'bg-zinc-800'}`}>{d.dia}</button>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-2 mb-6">
              {horariosDisponiveis.map(h => (
                <button key={h} onClick={() => setNovoHorario(h)} className={`p-2 rounded-lg border text-[10px] ${novoHorario === h ? 'bg-amber-600' : 'bg-zinc-800'}`}>{h}</button>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setModalRemarcar(null)} className="w-1/2 py-3 bg-zinc-800 rounded-xl">Fechar</button>
              <button onClick={salvarRemarcacao} className="w-1/2 py-3 bg-amber-600 font-bold rounded-xl text-white">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App