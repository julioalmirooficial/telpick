/**
 * Demo init: carga Telpick y monta el Interactive Demo.
 * Así Telpick está disponible cuando se ejecuta el init (evita race con el script inline).
 */
import Telpick from './telpick.js'
import TelpickZone from './telpick-zone.js'

window.Telpick = Telpick
window.TelpickZone = TelpickZone

// Base para banderas: en build (GitHub Pages) están en /telpick/src/assets/flags; en dev en /src/assets/flags.
const flagsBase = `${(import.meta.env.BASE_URL || '/').replace(/([^/])$/, '$1/')}src/assets/flags`

function initDemo() {
  const container = document.getElementById('telpick-container')
  if (!container) return

  const telpick = new Telpick({
    code: null,
    baseFlagUrl: flagsBase,
    onChange: (country) => {
      const infoEl = document.getElementById('selected-info')
      if (infoEl) {
        document.getElementById('selected-code').textContent = country.code
        document.getElementById('selected-country').textContent = country.country
        document.getElementById('selected-phone').textContent = country.code
        document.getElementById('selected-iso').textContent = country.country_code
        infoEl.classList.add('active')
      }
    },
    styleOverrides: {}
  })
  telpick.init(container)

  const zoneContainer = document.getElementById('telpick-zone-container')
  if (!zoneContainer) return

  const telpickZone = new TelpickZone({
    baseFlagUrl: flagsBase,
    onChange: (zone) => {
      const infoEl = document.getElementById('selected-zone-info')
      if (!infoEl) return
      document.getElementById('selected-timezone').textContent = zone.id
      document.getElementById('selected-zone-country').textContent = zone.country
      document.getElementById('selected-offset').textContent = zone.offset
      infoEl.classList.add('active')
    }
  })
  telpickZone.init(zoneContainer)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDemo)
} else {
  initDemo()
}
