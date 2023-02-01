import './style/milligram.sass'
import './style/app.sass'
import '@riotjs/hot-reload'
import App from './components/app'
import { Route, Router, URL } from '@riotjs/route/route.js'
import { component, register } from 'riot'

register('router', Router)
register('route', Route)

component(App)(document.body, {})
