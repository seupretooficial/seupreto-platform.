import { Router } from 'express'
import { supabase } from '../config/supabase.js'

const router = Router()

router.get('/servicos', async (_req, res) => {
  const { data, error } = await supabase.from('servicos').select('*').order('id', { ascending: true })

  if (error) {
    return res.status(400).json({ message: 'Erro ao consultar serviços', error: error.message })
  }

  return res.json(data ?? [])
})

router.get('/agendamentos', async (_req, res) => {
  const { data, error } = await supabase
    .from('agendamentos')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return res.status(400).json({ message: 'Erro ao consultar agendamentos', error: error.message })
  }

  return res.json(data ?? [])
})

router.post('/agendamentos', async (req, res) => {
  const { cliente, servico, data, horario, valor } = req.body

  if (!cliente || !servico || !data || !horario || valor === undefined) {
    return res.status(400).json({ message: 'Dados incompletos para criar agendamento.' })
  }

  const { data: novoAgendamento, error } = await supabase
    .from('agendamentos')
    .insert([
      {
        cliente,
        servico,
        data,
        horario,
        valor,
        status: 'pendente',
      },
    ])
    .select()
    .single()

  if (error) {
    return res.status(400).json({ message: 'Erro ao criar agendamento', error: error.message })
  }

  return res.status(201).json(novoAgendamento)
})

router.patch('/agendamentos/:id', async (req, res) => {
  const { id } = req.params
  const { status, data, horario } = req.body

  const { data: atualizado, error } = await supabase
    .from('agendamentos')
    .update({ status, data, horario, updated_at: new Date().toISOString() })
    .eq('id', Number(id))
    .select()
    .single()

  if (error) {
    return res.status(400).json({ message: 'Erro ao atualizar agendamento', error: error.message })
  }

  return res.json(atualizado)
})

router.delete('/agendamentos/:id', async (req, res) => {
  const { id } = req.params

  const { error } = await supabase.from('agendamentos').delete().eq('id', Number(id))

  if (error) {
    return res.status(400).json({ message: 'Erro ao remover agendamento', error: error.message })
  }

  return res.json({ ok: true, id: Number(id) })
})

export default router
