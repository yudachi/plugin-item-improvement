import 'views/env'

import { remote } from 'electron'
import { join } from 'path-extra'
import i18n2 from 'i18n-2'

window.config = remote.require('./lib/config')
const { config } = window

// Shortcuts and Components
window.$ = param => document.querySelector(param)
window.$$ = param => document.querySelectorAll(param)
 // Node modules

// language setting TODO: ?
// window.language = config.get('poi.language', navigator.language)


// augment font size with poi zoom level
const zoomLevel = config.get('poi.zoomLevel', 1)
const additionalStyle = document.createElement('style')

remote.getCurrentWindow().webContents.on('dom-ready', () => {
  document.body.appendChild(additionalStyle)
})

additionalStyle.innerHTML = `
  item-improvement {
    font-size: ${zoomLevel * 100}%;
  }
`

// User setting
// window.useSVGIcon = config.get('poi.useSVGIcon', false)

// i18n
const i18n = new i18n2({
  locales: ['en-US', 'ja-JP', 'zh-CN', 'zh-TW'],
  defaultLocale: 'zh-CN',
  directory: join(__dirname, 'i18n'),
  extension: '.json',
  updateFiles: false,
  devMode: false,
})
i18n.setLocale(window.language)

if (i18n.resources == null) {
  i18n.resources = {}
}

if (i18n.resources.__ == null) {
  i18n.resources.__ = str => str
}
if (i18n.resources.translate == null) {
  i18n.resources.translate = (locale, str) => str
}
if (i18n.resources.setLocale == null) {
  i18n.resources.setLocale = () => {}
}

window.i18n = i18n

try {
  require('poi-plugin-translator').pluginDidLoad()
} catch (error) {
  // TODO
  // console.warn('plugin-translator', error)
}


window.__ = i18n.__.bind(i18n)
window.__r = i18n.resources.__.bind(i18n.resources)

window.i18n = i18n

document.title = window.__('Equipment Improvement')

require('./views')
