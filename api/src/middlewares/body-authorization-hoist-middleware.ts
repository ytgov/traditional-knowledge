import { type NextFunction, type Request, type Response } from "express"

export function bodyAuthorizationHoistMiddleware(req: Request, _res: Response, next: NextFunction) {
  const accessToken = req.body.HOISTABLE_AUTHORIZATION_TOKEN
  if (accessToken && !req.headers.authorization) {
    req.headers.authorization = `Bearer ${accessToken}`
    delete req.body.HOISTABLE_AUTHORIZATION_TOKEN
  }

  next()
}

export default bodyAuthorizationHoistMiddleware
