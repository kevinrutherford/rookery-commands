import Router from '@koa/router'
import { RouteHandler } from './execute-command'
import ping from './ping'

type Method = 'post' | 'patch' | 'delete'

export type Route = {
  path: string,
  method: Method,
  handler: RouteHandler,
}

export const router = (routes: ReadonlyArray<Route>): Router => {
  const r = new Router()

  r.get('/ping', ping())

  routes.forEach((route) => {
    switch (route.method) {
      case 'delete':
        r.delete(route.path, route.handler)
        break
      case 'patch':
        r.patch(route.path, route.handler)
        break
      case 'post':
        r.post(route.path, route.handler)
        break
    }
  })

  return r
}

