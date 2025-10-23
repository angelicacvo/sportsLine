import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret'
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret'

type JwtPayload = {
  id: number
  email: string
  role: 'admin' | 'seller'
}

// sign a short-lived access token
export function signAccessToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' })
}

// sign a long-lived refresh token
export function signRefreshToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' })
}

// verify and decode an access token
export function verifyAccessToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as JwtPayload
}

// verify and decode a refresh token
export function verifyRefreshToken(token: string) {
  return jwt.verify(token, JWT_REFRESH_SECRET) as JwtPayload
}
