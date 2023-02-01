import './style/milligram.sass'
import './style/app.sass'
import '@riotjs/hot-reload'
import App from './components/app'
import { component } from 'riot'

component(App)(document.body, {})
