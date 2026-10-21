import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'seupreto-secret-dev'

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number
    usuario: string
    nome: string
  }
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token de autenticação ausente.' })
  }

  const token = authHeader.replace('Bearer ', '')

  try {
    const payload = jwt.verify(token, JWT_SECRET) as {
      id: number
      usuario: string
      nome: string
    }

    req.user = payload
    return next()
  } catch (_error) {
    return res.status(401).json({ message: 'Token inválido ou expirado.' })
  }
}
