import { of, from } from 'rxjs'
import { map, switchMap, catchError, tap } from 'rxjs/operators'
import { ofType } from 'redux-observable'
import { isEmpty, isNil } from 'ramda'
import {
  START_WEBSERVER_INIT,
  START_WEBSERVER_SUCCESS,
  START_WEBSERVER_ERROR
} from 'state/actions/network'
import { trace } from 'shared/utils'

const startWebServer = (www_root = '/', port = 3000) =>
  new Promise((resolve, reject) => {
    console.info('this is the roor', www_root)
    const httpd = window.cordova.plugins.CorHttpd
    httpd.getURL(function(url) {
      console.info('getURL', url)
      if (isEmpty(url) || isNil(url)) {
        httpd.startServer(
          {
            www_root,
            port,
            localhost_only: false
          },
          function(wsurl) {
            console.info('<-- webserver started here')
            console.info(wsurl)
            resolve(wsurl)
          },
          function(error) {
            console.error('webserver NOT started')
            console.error(error)
            reject(error)
          }
        )
      } else {
        resolve(url)
      }
    })
  })

export const webserverEpic = action$ =>
  action$.pipe(
    ofType(START_WEBSERVER_INIT.getType()),
    switchMap(() =>
      from(startWebServer()).pipe(
        map(START_WEBSERVER_SUCCESS),
        tap(trace('What webserver gave me')),
        catchError(error => {
          console.error('on catch error')
          console.error(error)
          return of(START_WEBSERVER_ERROR(error))
        })
      )
    )
  )
