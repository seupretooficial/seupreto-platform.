import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import agendamentosRoutes from './routes/agendamentos.js'
import authRoutes from './routes/auth.js'

dotenv.config()

const app = express()
const port = Number(process.env.PORT || 3001)

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'SeuPreto Platform API',
    timestamp: new Date().toISOString(),
  })
})

app.use('/api', agendamentosRoutes)
app.use('/api/auth', authRoutes)

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`)
})
