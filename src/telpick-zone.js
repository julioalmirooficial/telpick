import timezonesByContinent from './assets/timezones-por-continente.json'
import timezoneCountries from './timezone-countries.js'
import FLAGS from './flags-imports.js'

;(function captureScriptBase() {
  if (typeof document === 'undefined' || !document.currentScript?.src) return
  const base = document.currentScript.src.replace(/\/[^/]*$/, '')
  if (typeof globalThis !== 'undefined') globalThis.__TELPICK_SCRIPT_BASE__ = base
})()

function getDefaultBaseFlagUrl() {
  const scriptBase = typeof globalThis !== 'undefined' && globalThis.__TELPICK_SCRIPT_BASE__
    ? globalThis.__TELPICK_SCRIPT_BASE__
    : ''
  return scriptBase ? `${scriptBase.replace(/\/$/, '')}/assets/flags` : ''
}

function normalize(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function getCity(timezone) {
  return timezone.split('/').pop().replace(/_/g, ' ')
}

class TelpickZone {
  constructor({
    timezone = null,
    onChange = () => {},
    styleOverrides = {},
    baseFlagUrl = '',
    locale = 'es',
    groupByContinent = true
  } = {}) {
    this.timezone = timezone
    this.onChange = onChange
    this.styleOverrides = styleOverrides
    this.baseFlagUrl = baseFlagUrl || getDefaultBaseFlagUrl()
    this.locale = locale
    this.groupByContinent = groupByContinent
    this.zones = []
    this.selectedTimezone = timezone
    this.isDropdownOpen = false
    this.searchQuery = ''
    this.container = null
    this.dropdown = null
    this._outsideHandler = null
    this._scrollResizeCleanup = null
    this._boundUpdatePosition = () => this._updateDropdownPosition()
  }

  _buildZones() {
    return Object.entries(timezonesByContinent).flatMap(([continent, timezones]) =>
      timezones.map(id => {
        const [country = '', countryCode = ''] = timezoneCountries[id] || []
        return {
          id,
          city: getCity(id),
          country,
          country_code: countryCode,
          continent,
          flag: countryCode ? `/flags/${countryCode.toLowerCase()}.webp` : ''
        }
      })
    )
  }

  _getOffset(timezone) {
    try {
      const parts = new Intl.DateTimeFormat(this.locale, {
        timeZone: timezone,
        timeZoneName: 'shortOffset'
      }).formatToParts(new Date())
      return parts.find(part => part.type === 'timeZoneName')?.value || ''
    } catch {
      return ''
    }
  }

  _withOffset(zone) {
    return zone ? { ...zone, offset: this._getOffset(zone.id) } : null
  }

  _getFlagUrl(countryCode) {
    const code = String(countryCode || '').toLowerCase()
    if (!code) return ''
    if (this.baseFlagUrl) {
      const base = this.baseFlagUrl.replace(/\/$/, '')
      if (base.includes('flagcdn.com')) return `${base}/${code}.png`
      return `${base}/${code}.webp`
    }
    return FLAGS[code] || ''
  }

  _findInitialTimezone() {
    const aliases = {
      'Europe/Kyiv': 'Europe/Kiev',
      'Asia/Calcutta': 'Asia/Kolkata'
    }
    const requested = aliases[this.timezone] || this.timezone
    let selected = this.zones.find(zone => zone.id === requested)

    if (!selected && !this.timezone) {
      try {
        const detected = Intl.DateTimeFormat().resolvedOptions().timeZone
        selected = this.zones.find(zone => zone.id === (aliases[detected] || detected))
      } catch {}
    }

    return selected || this.zones.find(zone => zone.id === 'America/Bogota') || this.zones[0]
  }

  async init(container) {
    if (!container) throw new Error('TelpickZone requires a valid container')
    this.container = container
    this.container.classList.add('telpick-wrapper')
    this.zones = this._buildZones()
    const selected = this._findInitialTimezone()
    this.selectedTimezone = selected?.id || null
    this.render()
    if (selected) this.onChange(this._withOffset(selected))
    this._setupOutsideClick()
  }

  _updateDropdownPosition() {
    if (!this.dropdown || !this.container) return
    const rect = this.container.getBoundingClientRect()
    this.dropdown.style.position = 'fixed'
    this.dropdown.style.top = `${rect.bottom + 4}px`
    this.dropdown.style.left = `${rect.left}px`
    this.dropdown.style.marginTop = '0'
  }

  _createFlag(zone) {
    const flag = document.createElement('div')
    flag.className = 'telpick-flag'
    const flagUrl = this._getFlagUrl(zone.country_code)
    if (flagUrl) {
      const img = document.createElement('img')
      img.src = flagUrl
      img.alt = zone.country || 'flag'
      img.loading = 'lazy'
      img.referrerPolicy = 'no-referrer'
      flag.appendChild(img)
    }
    return flag
  }

  _filteredZones() {
    const query = normalize(this.searchQuery)
    if (!query) return this.zones
    return this.zones.filter(zone =>
      [zone.country, zone.id, zone.city, zone.country_code, zone.continent]
        .some(value => normalize(value).includes(query))
    )
  }

  _selectZone(zone) {
    this.selectedTimezone = zone.id
    this.onChange(this._withOffset(zone))
    this.isDropdownOpen = false
    this.searchQuery = ''
    this.render()
  }

  _renderZoneList(list) {
    list.innerHTML = ''
    const zones = this._filteredZones()
    let currentContinent = null

    zones.forEach(zone => {
      if (this.groupByContinent && zone.continent !== currentContinent) {
        currentContinent = zone.continent
        const header = document.createElement('li')
        header.className = 'telpick-group-header'
        header.textContent = currentContinent
        list.appendChild(header)
      }

      const item = document.createElement('li')
      const isSelected = zone.id === this.selectedTimezone
      item.className = `telpick-item telpick-zone-item ${isSelected ? 'telpick-item-selected' : ''}`
      item.setAttribute('aria-selected', String(isSelected))
      item.onclick = () => this._selectZone(zone)
      item.appendChild(this._createFlag(zone))

      const details = document.createElement('span')
      details.className = 'telpick-zone-details'
      const label = document.createElement('span')
      label.className = 'telpick-zone-label'
      label.textContent = `${zone.country} · ${zone.city}`
      const id = document.createElement('span')
      id.className = 'telpick-zone-id'
      id.textContent = zone.id
      details.append(label, id)
      item.appendChild(details)

      const offset = document.createElement('span')
      offset.className = 'telpick-zone-offset'
      offset.textContent = this._getOffset(zone.id)
      item.appendChild(offset)
      list.appendChild(item)
    })

    if (!zones.length) {
      const empty = document.createElement('li')
      empty.className = 'telpick-empty'
      empty.textContent = 'No se encontraron zonas horarias'
      list.appendChild(empty)
    }
  }

  render() {
    if (!this.container) return
    if (this._scrollResizeCleanup) {
      this._scrollResizeCleanup()
      this._scrollResizeCleanup = null
    }
    if (this.dropdown?.parentNode) this.dropdown.parentNode.removeChild(this.dropdown)
    this.dropdown = null
    this.container.innerHTML = ''

    const selected = this.zones.find(zone => zone.id === this.selectedTimezone) || this.zones[0]
    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'telpick-btn telpick-zone-btn'
    button.setAttribute('aria-haspopup', 'listbox')
    button.setAttribute('aria-expanded', String(this.isDropdownOpen))
    Object.assign(button.style, this.styleOverrides)
    button.onclick = () => {
      this.isDropdownOpen = !this.isDropdownOpen
      this.render()
    }

    if (selected) button.appendChild(this._createFlag(selected))
    const label = document.createElement('span')
    label.textContent = selected ? `${selected.city} (${this._getOffset(selected.id)})` : 'Zona horaria'
    button.appendChild(label)
    const arrow = document.createElement('span')
    arrow.className = 'telpick-arrow'
    arrow.textContent = '▼'
    button.appendChild(arrow)
    this.container.appendChild(button)

    if (!this.isDropdownOpen) return

    this.dropdown = document.createElement('div')
    this.dropdown.className = 'telpick-dropdown telpick-zone-dropdown'
    this.dropdown.onclick = event => event.stopPropagation()
    this.dropdown.onmousedown = event => event.stopPropagation()

    const input = document.createElement('input')
    input.className = 'telpick-search'
    input.type = 'search'
    input.placeholder = 'Buscar país o zona horaria...'
    input.value = this.searchQuery
    input.onclick = event => event.stopPropagation()
    input.onmousedown = event => event.stopPropagation()

    const list = document.createElement('ul')
    list.setAttribute('role', 'listbox')
    this._renderZoneList(list)
    input.oninput = event => {
      this.searchQuery = event.target.value
      this._renderZoneList(list)
    }

    this.dropdown.append(input, list)
    document.body.appendChild(this.dropdown)
    this._updateDropdownPosition()
    window.addEventListener('scroll', this._boundUpdatePosition, true)
    window.addEventListener('resize', this._boundUpdatePosition)
    this._scrollResizeCleanup = () => {
      window.removeEventListener('scroll', this._boundUpdatePosition, true)
      window.removeEventListener('resize', this._boundUpdatePosition)
    }
    requestAnimationFrame(() => input.focus())
  }

  _setupOutsideClick() {
    if (this._outsideHandler) document.removeEventListener('click', this._outsideHandler, true)
    this._outsideHandler = event => {
      if (!this.isDropdownOpen || !this.container) return
      const inContainer = this.container.contains(event.target)
      const inDropdown = this.dropdown?.contains(event.target)
      if (!inContainer && !inDropdown) {
        this.isDropdownOpen = false
        this.render()
      }
    }
    document.addEventListener('click', this._outsideHandler, true)
  }

  destroy() {
    if (this._outsideHandler) document.removeEventListener('click', this._outsideHandler, true)
    if (this._scrollResizeCleanup) this._scrollResizeCleanup()
    if (this.dropdown?.parentNode) this.dropdown.parentNode.removeChild(this.dropdown)
    if (this.container) {
      this.container.innerHTML = ''
      this.container.classList.remove('telpick-wrapper')
    }
    this.dropdown = null
    this.container = null
  }
}

if (typeof window !== 'undefined') window.TelpickZone = TelpickZone

export default TelpickZone
