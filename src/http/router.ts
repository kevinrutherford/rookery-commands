import { Router } from 'express'
import { RouteHandler } from './execute-command'
import ping from './ping'

type Route = {
  path: string,
  method: string,
  handler: RouteHandler,
}

export const router = (routes: ReadonlyArray<Route>): Router => {
  const r = Router()

  r.get('/ping', ping())

  routes.forEach((route) => {
    switch (route.method) {
      case 'post':
        r.post(route.path, route.handler)
    }
  })

  return r
}

