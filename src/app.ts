import './style.sass'
import '@riotjs/hot-reload'
import App from './components/app.riot'
import { component } from 'riot'

component(App)(document.body, {})
