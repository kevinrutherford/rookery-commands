import { NextFunction, Request, Response } from 'express'

export default () => (
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    res.set('Cache-Control', 'no-store, must-revalidate')
    res.status(200).send('pong')
    next()
  }
)

