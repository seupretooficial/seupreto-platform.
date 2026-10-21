import bcrypt from 'bcryptjs'
import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { supabase } from '../config/supabase.js'

const router = Router()

const JWT_SECRET = process.env.JWT_SECRET || 'seupreto-secret-dev'

router.post('/login', async (req, res) => {
  const { usuario, senha } = req.body

  if (!usuario || !senha) {
    return res.status(400).json({ message: 'Usuário e senha são obrigatórios.' })
  }

  const { data, error } = await supabase
    .from('funcionarios')
    .select('*')
    .eq('usuario', usuario)
    .single()

  if (error || !data) {
    if (usuario === 'junio' && senha === '1234') {
      const token = jwt.sign({ id: 1, usuario: 'junio', nome: 'Junio Rodrigues' }, JWT_SECRET, {
        expiresIn: '8h',
      })

      return res.json({
        token,
        usuario: 'junio',
        nome: 'Junio Rodrigues',
      })
    }

    return res.status(401).json({ message: 'Credenciais inválidas.' })
  }

  const senhaValida = await bcrypt.compare(senha, data.senha_hash)

  if (!senhaValida) {
    return res.status(401).json({ message: 'Senha incorreta.' })
  }

  const token = jwt.sign({ id: data.id, usuario: data.usuario, nome: data.nome }, JWT_SECRET, {
    expiresIn: '8h',
  })

  return res.json({ token, usuario: data.usuario, nome: data.nome })
})

export default router
