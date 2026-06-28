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
  const [filtroStatus, setFiltroStatus] = useState('todos')

  // Modal de Remarcar
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

  async function excluirAgendamento(id: number) {
    if (!confirm('Tem certeza que quer remover este agendamento?')) return
    await supabase.from('agendamentos').delete().eq('id', id)
    buscarAgendamentos()
  }

  async function salvarRemarcacao() {
    if (!novoDia || !novoHorario) { alert('Escolha o novo dia e horário!'); return }
    await supabase.from('agendamentos').update({
      data: `${novoDia}/${novoMes}`,
      horario: novoHorario,
      status: 'remarcado'
    }).eq('id', modalRemarcar.id)
    setModalRemarcar(null)
    setNovoDia('')
    setNovoMes('')
    setNovoHorario('')
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
      <h1 style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }} className="text-7xl font-black text-white leading-none">
        SEU<span className="text-amber-500">PRETO</span>
      </h1>
      <p className="text-zinc-500 text-[10px] tracking-[0.4em] uppercase mt-1">a barbearia que vai até você</p>
    </div>
  )

  return (
    <div style={{ fontFamily: "'Playfair Display', serif" }} className="min-h-screen bg-neutral-950 text-white flex flex-col items-center p-5">

      {/* ===== TELA INICIAL ===== */}
      {tela === 'inicio' && (
        <div className="w-full max-w-sm">
          <Header />
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-2xl mb-4">
            <button onClick={() => setTela('servicos')} className="w-full py-5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-2xl mb-3 text-lg">AGENDAR AGORA</button>
            <button onClick={() => setTela('login')} className="w-full py-4 bg-zinc-800 text-zinc-400 rounded-2xl text-sm hover:bg-zinc-700">ÁREA DO BARBEIRO 💈</button>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex justify-between">
            <div><p className="text-zinc-500 text-[10px] uppercase">WhatsApp</p><p className="font-bold text-sm">(71) 99197-8568</p></div>
            <div className="text-right"><p className="text-zinc-500 text-[10px] uppercase">Instagram</p><p className="text-amber-500 font-bold text-sm">@seupretooficial</p></div>
          </div>
        </div>
      )}

      {/* ===== SERVIÇOS ===== */}
      {tela === 'servicos' && (
        <div className="w-full max-w-md">
          <Header />
          <button onClick={() => setTela('inicio')} className="text-amber-500 text-sm font-bold mb-4 block">← VOLTAR</button>
          <h2 className="text-xl font-bold mb-4">Escolha o serviço:</h2>
          <div className="grid gap-3 max-h-[65vh] overflow-y-auto pr-1">
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

      {/* ===== AGENDA ===== */}
      {tela === 'agenda' && (
        <div className="w-full max-w-md">
          <Header />
          <button onClick={() => setTela('servicos')} className="text-amber-500 text-sm font-bold mb-4 block">← VOLTAR</button>
          <div className="bg-zinc-900 border border-amber-500/30 p-4 rounded-2xl mb-5 flex justify-between">
            <p className="font-bold text-amber-500">{servicoSelecionado?.nome}</p>
            <p className="font-black text-white">R$ {servicoSelecionado?.preco}</p>
          </div>
          <input type="text" placeholder="Seu Nome Completo" value={nomeCliente} onChange={e => setNomeCliente(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 focus:border-amber-500 outline-none p-4 rounded-xl mb-5 transition-colors" />
          <p className="text-sm text-zinc-400 mb-3">Escolha o dia:</p>
          <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
            {diasAgenda.map(d => (
              <button key={d.dia} disabled={d.desabilitado} onClick={() => { setDiaSelecionado(d.dia); setMesSelecionado(d.mes) }}
                className={`p-3 min-w-[60px] rounded-xl border transition-all font-bold ${d.desabilitado ? 'opacity-20 cursor-not-allowed bg-zinc-900 border-zinc-800' : diaSelecionado === d.dia ? 'bg-amber-600 border-amber-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-amber-500'}`}>
                <div className="text-[10px]">{d.semana}</div>
                <div className="text-lg">{d.dia}</div>
              </button>
            ))}
          </div>
          {diaSelecionado && (
            <>
              <p className="text-sm text-zinc-400 mb-3">Escolha o horário:</p>
              <div className="grid grid-cols-4 gap-2 mb-6">
                {horariosDisponiveis.map(h => (
                  <button key={h} onClick={() => setHorarioSelecionado(h)}
                    className={`p-3 rounded-xl border text-sm font-bold transition-all ${horarioSelecionado === h ? 'bg-amber-600 border-amber-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-amber-500'}`}>{h}</button>
                ))}
              </div>
            </>
          )}
          {diaSelecionado && horarioSelecionado && (
            <button onClick={confirmarAgendamento} className="w-full py-5 bg-amber-600 hover:bg-amber-500 font-black rounded-2xl text-lg transition-all active:scale-95">CONFIRMAR AGENDAMENTO</button>
          )}
        </div>
      )}

      {/* ===== CONFIRMADO ===== */}
      {tela === 'confirmado' && (
        <div className="text-center mt-20 w-full max-w-sm">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-4xl font-black text-amber-500">AGENDADO!</h2>
          <p className="mt-3 text-zinc-400">Obrigado, {nomeCliente}!<br />Junio Rodrigues recebeu seu pedido.</p>
          <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl mt-6 text-left space-y-3">
            <div className="flex justify-between"><span className="text-zinc-500">Serviço</span><span className="text-amber-500 font-bold">{servicoSelecionado?.nome}</span></div>
            <div className="flex justify-between"><span className="text-zinc-500">Data</span><span className="font-bold">{diaSelecionado}/{mesSelecionado}</span></div>
            <div className="flex justify-between"><span className="text-zinc-500">Horário</span><span className="font-bold">{horarioSelecionado}</span></div>
            <div className="flex justify-between"><span className="text-zinc-500">Valor</span><span className="text-amber-500 font-black">R$ {servicoSelecionado?.preco}</span></div>
          </div>
          <button onClick={() => { setTela('inicio'); setNomeCliente(''); setDiaSelecionado(''); setHorarioSelecionado(''); setServicoSelecionado(null) }}
            className="w-full py-4 mt-6 bg-zinc-800 hover:bg-zinc-700 font-bold rounded-2xl transition-all">VOLTAR AO INÍCIO</button>
        </div>
      )}

      {/* ===== LOGIN ===== */}
      {tela === 'login' && (
        <div className="w-full max-w-sm mt-10">
          <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800">
            <div className="text-center mb-6"><div className="text-5xl mb-3">💈</div><h2 className="text-2xl font-black">Área do Barbeiro</h2></div>
            <input type="text" placeholder="Usuário" value={loginUsuario} onChange={e => setLoginUsuario(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-xl mb-3 focus:outline-none focus:border-amber-500 transition-colors" />
            <input type="password" placeholder="Senha" value={loginSenha} onChange={e => setLoginSenha(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-xl mb-5 focus:outline-none focus:border-amber-500 transition-colors" />
            <button onClick={() => { if (loginUsuario === 'junio' && loginSenha === '1234') setTela('painel') else alert('Usuário ou senha incorretos!') }}
              className="w-full py-4 bg-amber-600 hover:bg-amber-500 font-black rounded-xl text-lg transition-all">ENTRAR</button>
          </div>
          <button onClick={() => setTela('inicio')} className="text-amber-500 text-sm font-bold mt-5 block text-center w-full">← VOLTAR</button>
        </div>
      )}

      {/* ===== PAINEL DO BARBEIRO ===== */}
      {tela === 'painel' && (
        <div className="w-full max-w-md">
          <div className="flex justify-between items-center mt-10 mb-6">
            <div>
              <p className="text-amber-500 text-[10px] tracking-widest uppercase">Bem-vindo</p>
              <h1 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-4xl font-black">JUNIO 💈</h1>
            </div>
            <button onClick={() => { setTela('inicio'); setLoginUsuario(''); setLoginSenha('') }} className="bg-zinc-800 text-zinc-400 text-xs px-4 py-2 rounded-xl hover:bg-zinc-700">SAIR</button>
          </div>

          {/* Cards de Resumo */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl text-center">
              <p className="text-amber-500 text-2xl font-black">{agendamentos.filter(a => a.status === 'pendente').length}</p>
              <p className="text-zinc-500 text-[9px] uppercase tracking-wider">Pendentes</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl text-center">
              <p className="text-green-400 text-2xl font-black">{agendamentos.filter(a => a.status === 'confirmado').length}</p>
              <p className="text-zinc-500 text-[9px] uppercase tracking-wider">Confirmados</p>
            </div>
            <div className="bg-zinc-900 border border-amber-500/20 p-4 rounded-2xl text-center">
              <p className="text-amber-500 text-lg font-black">R${totalFaturado}</p>
              <p className="text-zinc-500 text-[9px] uppercase tracking-wider">Faturado</p>
            </div>
          </div>

          {/* Filtros */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
            {['todos', 'pendente', 'confirmado', 'cancelado', 'remarcado'].map(f => (
              <button key={f} onClick={() => setFiltroStatus(f)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase whitespace-nowrap border transition-all
                  ${filtroStatus === f ? 'bg-amber-600 border-amber-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-amber-500'}`}>
                {f}
              </button>
            ))}
          </div>

          {/* Lista de Agendamentos */}
          <div className="space-y-4">
            {agendamentosFiltrados.map(ag => (
              <div key={ag.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-black text-white text-lg">{ag.cliente}</p>
                    <p className="text-zinc-400 text-sm">{ag.servico}</p>
                    <p className="text-zinc-600 text-xs mt-1">📅 {ag.data} às {ag.horario}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-amber-500 font-black text-xl">R$ {ag.valor}</p>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full border mt-1 inline-block ${statusConfig[ag.status]?.cor}`}>
                      {statusConfig[ag.status]?.label}
                    </span>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-zinc-800">
                  <button onClick={() => atualizarStatus(ag.id, 'confirmado')}
                    className="py-2 bg-green-900/40 hover:bg-green-800/60 text-green-400 text-xs font-bold rounded-xl border border-green-500/20 transition-all">
                    ✅ Confirmar
                  </button>
                  <button onClick={() => setModalRemarcar(ag)}
                    className="py-2 bg-blue-900/40 hover:bg-blue-800/60 text-blue-400 text-xs font-bold rounded-xl border border-blue-500/20 transition-all">
                    🔄 Remarcar
                  </button>
                  <button onClick={() => atualizarStatus(ag.id, 'cancelado')}
                    className="py-2 bg-red-900/40 hover:bg-red-800/60 text-red-400 text-xs font-bold rounded-xl border border-red-500/20 transition-all">
                    ❌ Cancelar
                  </button>
                </div>

                {/* Botão Remover (só para cancelados) */}
                {ag.status === 'cancelado' && (
                  <button onClick={() => excluirAgendamento(ag.id)}
                    className="w-full mt-2 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-500 text-xs font-bold rounded-xl transition-all">
                    🗑️ Remover da Lista
                  </button>
                )}
              </div>
            ))}
            {agendamentosFiltrados.length === 0 && (
              <p className="text-center text-zinc-600 mt-10 py-10">Nenhum agendamento encontrado.</p>
            )}
          </div>

          <button onClick={() => setTela('inicio')} className="w-full py-4 mt-6 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 font-bold rounded-2xl transition-all text-sm">VER SITE DO CLIENTE</button>
        </div>
      )}

      {/* ===== MODAL DE REMARCAR ===== */}
      {modalRemarcar && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-5">
          <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-3xl w-full max-w-sm">
            <h3 className="text-xl font-black mb-1">Remarcar Corte</h3>
            <p className="text-zinc-500 text-sm mb-5">Cliente: <span className="text-amber-500 font-bold">{modalRemarcar.cliente}</span></p>

            <p className="text-sm text-zinc-400 mb-3">Novo dia:</p>
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
              {diasAgenda.map(d => (
                <button key={d.dia} disabled={d.desabilitado} onClick={() => { setNovoDia(d.dia); setNovoMes(d.mes) }}
                  className={`p-2 min-w-[52px] rounded-xl border text-center transition-all ${d.desabilitado ? 'opacity-20 cursor-not-allowed' : novoDia === d.dia ? 'bg-amber-600 border-amber-500' : 'bg-zinc-800 border-zinc-700 hover:border-amber-500'}`}>
                  <div className="text-[9px]">{d.semana}</div>
                  <div className="text-sm font-bold">{d.dia}</div>
                </button>
              ))}
            </div>

            <p className="text-sm text-zinc-400 mb-3">Novo horário:</p>
            <div className="grid grid-cols-4 gap-2 mb-5">
              {horariosDisponiveis.map(h => (
                <button key={h} onClick={() => setNovoHorario(h)}
                  className={`p-2 rounded-xl border text-xs font-bold transition-all ${novoHorario === h ? 'bg-amber-600 border-amber-500' : 'bg-zinc-800 border-zinc-700 hover:border-amber-500'}`}>{h}</button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => { setModalRemarcar(null); setNovoDia(''); setNovoHorario('') }}
                className="py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 font-bold rounded-xl transition-all">Cancelar</button>
              <button onClick={salvarRemarcacao}
                className="py-3 bg-amber-600 hover:bg-amber-500 text-white font-black rounded-xl transition-all">Salvar</button>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-auto py-8 text-neutral-700 text-[9px] tracking-[0.4em] text-center">© 2026 SEUPRETO TECH</footer>
    </div>
  )
}

export default App