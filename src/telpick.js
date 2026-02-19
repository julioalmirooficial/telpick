import countryCodesData from './assets/country-code.json'
import FLAGS from './flags-imports.js'

;(function () {
  if (typeof document !== 'undefined' && document.currentScript && document.currentScript.src) {
    const base = document.currentScript.src.replace(/\/[^/]*$/, '')
    if (typeof globalThis !== 'undefined') globalThis.__TELPICK_SCRIPT_BASE__ = base
    else if (typeof window !== 'undefined') window.__TELPICK_SCRIPT_BASE__ = base
  }
})()

function _getDefaultBaseFlagUrl() {
  const scriptBase = typeof globalThis !== 'undefined' && globalThis.__TELPICK_SCRIPT_BASE__
    ? globalThis.__TELPICK_SCRIPT_BASE__
    : (typeof window !== 'undefined' && window.__TELPICK_SCRIPT_BASE__) || ''
  if (scriptBase) return `${scriptBase.replace(/\/$/, '')}/assets/flags`
  return ''
}

class Telpick {
  constructor({ code = null, onChange = () => {}, styleOverrides = {}, baseFlagUrl = '' } = {}) {
    this.code = code
    this.onChange = onChange
    this.styleOverrides = styleOverrides
    this.baseFlagUrl = baseFlagUrl || _getDefaultBaseFlagUrl()
    this.codes = []
    this.selectedCode = code
    this.isDropdownOpen = false
    this.searchQuery = ''
    this.container = null
    this.dropdown = null
    this._outsideHandler = null
    this._scrollResizeCleanup = null
    this._boundUpdatePosition = () => this._updateDropdownPosition()
    this._getFlagUrl = this._getFlagUrl.bind(this)
  }

  _updateDropdownPosition() {
    if (!this.dropdown || !this.container) return
    const rect = this.container.getBoundingClientRect()
    this.dropdown.style.position = 'fixed'
    this.dropdown.style.top = `${rect.bottom + 4}px`
    this.dropdown.style.left = `${rect.left}px`
    this.dropdown.style.marginTop = '0'
  }

  _getFlagUrl(flagPathFromJson, countryCode) {
    const code = String(countryCode || '').toLowerCase()
    if (!code) return ''
    if (this.baseFlagUrl) {
      const base = this.baseFlagUrl.replace(/\/$/, '')
      if (base.includes('flagcdn.com')) return `${base}/${code}.png`
      const filename = flagPathFromJson ? flagPathFromJson.replace(/^.*\//, '') : `${code}.webp`
      return `${base}/${filename}`
    }
    return FLAGS[code] || ''
  }

  async init(container) {
    this.container = container
    this.codes = [...countryCodesData].sort((a, b) => a.country.localeCompare(b.country, 'es'))
    if (!this.code) {
      const services = [
        async () => {
          try {
            const res = await fetch('https://ip-api.com/json/?fields=countryCode')
            const data = await res.json()
            if (data.countryCode) {
              return this.codes.find(c => c.country_code === data.countryCode)
            }
          } catch {}
          return null
        },
        async () => {
          try {
            const res = await fetch('https://get.geojs.io/v1/ip/country.json')
            const data = await res.json()
            if (data.country) {
              return this.codes.find(c => c.country_code === data.country)
            }
          } catch {}
          return null
        },
        async () => {
          try {
            const res = await fetch('https://ipapi.co/json/')
            const data = await res.json()
            if (data.country_code) {
              return this.codes.find(c => c.country_code === data.country_code)
            }
          } catch {}
          return null
        }
      ]

      let found = null
      for (const service of services) {
        try {
          found = await Promise.race([
            service(),
            new Promise((resolve) => setTimeout(() => resolve(null), 3000))
          ])
          if (found) break
        } catch {}
      }

      if (!found) {
        try {
          const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
          const timezoneToCountry = {
            'America/Lima': 'PE', 'America/Bogota': 'CO', 'America/Mexico_City': 'MX',
            'America/Argentina/Buenos_Aires': 'AR', 'America/Santiago': 'CL',
            'America/Caracas': 'VE', 'America/Montevideo': 'UY', 'America/Asuncion': 'PY',
            'America/La_Paz': 'BO', 'America/Guayaquil': 'EC', 'America/Panama': 'PA',
            'America/Costa_Rica': 'CR', 'America/Managua': 'NI', 'America/Tegucigalpa': 'HN',
            'America/Guatemala': 'GT', 'America/El_Salvador': 'SV', 'America/Havana': 'CU',
            'America/Santo_Domingo': 'DO', 'America/Jamaica': 'JM', 'America/Port-au-Prince': 'HT',
            'Europe/Madrid': 'ES', 'Europe/London': 'GB', 'Europe/Paris': 'FR',
            'Europe/Berlin': 'DE', 'Europe/Rome': 'IT', 'Europe/Amsterdam': 'NL',
            'Europe/Brussels': 'BE', 'Europe/Vienna': 'AT', 'Europe/Zurich': 'CH',
            'Europe/Stockholm': 'SE', 'Europe/Oslo': 'NO', 'Europe/Copenhagen': 'DK',
            'Europe/Helsinki': 'FI', 'Europe/Warsaw': 'PL', 'Europe/Prague': 'CZ',
            'Europe/Bucharest': 'RO', 'Europe/Moscow': 'RU',
            'America/New_York': 'US', 'America/Chicago': 'US', 'America/Denver': 'US',
            'America/Los_Angeles': 'US', 'America/Toronto': 'CA', 'America/Vancouver': 'CA',
            'Asia/Tokyo': 'JP', 'Asia/Shanghai': 'CN', 'Asia/Hong_Kong': 'CN',
            'Asia/Seoul': 'KR', 'Asia/Singapore': 'SG', 'Asia/Bangkok': 'TH',
            'Asia/Jakarta': 'ID', 'Asia/Manila': 'PH', 'Asia/Kolkata': 'IN',
            'Asia/Dubai': 'AE', 'Asia/Riyadh': 'SA',
            'Australia/Sydney': 'AU', 'Australia/Melbourne': 'AU', 'Pacific/Auckland': 'NZ',
            'Africa/Cairo': 'EG', 'Africa/Johannesburg': 'ZA', 'Africa/Nairobi': 'KE',
            'Africa/Lagos': 'NG'
          }
          const countryCode = timezoneToCountry[timezone]
          if (countryCode) {
            found = this.codes.find(c => c.country_code === countryCode)
          }
        } catch {}
      }

      if (found) {
        this.selectedCode = found.country_code
      } else {
        const defaultCountry = this.codes.find(c => c.country_code === 'CO')
        if (defaultCountry) this.selectedCode = defaultCountry.country_code
      }
    } else {
      const found = this.codes.find(c => c.country_code === this.code)
      if (found) this.selectedCode = found.country_code
    }
    this.render()
    const selected = this.codes.find(c => c.country_code === this.selectedCode)
    if (selected) this.onChange(selected)
    this._setupOutsideClick()
  }

  render() {
    if (this._scrollResizeCleanup) {
      this._scrollResizeCleanup()
      this._scrollResizeCleanup = null
    }
    if (this.dropdown && this.dropdown.parentNode) {
      this.dropdown.parentNode.removeChild(this.dropdown)
      this.dropdown = null
    }
    this.container.innerHTML = ''
    const btn = document.createElement('button')
    btn.className = 'telpick-btn'
    Object.assign(btn.style, this.styleOverrides)
    btn.onclick = () => {
      this.isDropdownOpen = !this.isDropdownOpen
      this.render()
    }
    const flagDiv = document.createElement('div')
    flagDiv.className = 'telpick-flag'
    const selectedCountry = this.codes.find(c => c.country_code === this.selectedCode) || { country_code: '', code: '', country: '', flag: '' }
    const flagUrl = this._getFlagUrl(selectedCountry.flag, selectedCountry.country_code)
    if (flagUrl) {
      const img = document.createElement('img')
      img.src = flagUrl
      img.className = 'w-full h-full object-cover'
      img.alt = selectedCountry.country || 'flag'
      img.loading = 'lazy'
      img.referrerPolicy = 'no-referrer'
      flagDiv.appendChild(img)
    }
    btn.appendChild(flagDiv)
    const codeSpan = document.createElement('span')
    codeSpan.textContent = selectedCountry.code
    btn.appendChild(codeSpan)
    const arrowSpan = document.createElement('span')
    arrowSpan.className = 'ml-auto'
    arrowSpan.textContent = '▼'
    btn.appendChild(arrowSpan)
    this.container.appendChild(btn)

    if (this.isDropdownOpen) {
      this.dropdown = document.createElement('div')
      this.dropdown.className = 'telpick-dropdown'
      this.dropdown.onclick = e => e.stopPropagation()
      this.dropdown.onmousedown = e => e.stopPropagation()
      
      const input = document.createElement('input')
      input.className = 'telpick-search'
      input.type = 'text'
      input.placeholder = 'Buscar país...'
      input.value = this.searchQuery
      input.oninput = e => {
        e.stopPropagation()
        const inputEl = e.target
        const cursorPos = inputEl.selectionStart || 0
        const newValue = inputEl.value
        this.searchQuery = newValue
        const ul = this.dropdown?.querySelector('ul')
        if (ul) {
          ul.innerHTML = ''
          const filtered = !this.searchQuery ? this.codes : this.codes.filter(c => c.country.toLowerCase().includes(this.searchQuery.toLowerCase()))
          filtered.forEach(item => {
            const li = document.createElement('li')
            const isSelected = item.country_code === this.selectedCode && this.selectedCode !== null && this.selectedCode !== undefined
            li.className = `telpick-item ${isSelected ? 'telpick-item-selected' : ''}`
            li.onclick = () => {
              this.selectedCode = item.country_code
              this.onChange(item)
              this.isDropdownOpen = false
              this.searchQuery = ''
              this.render()
            }
            const flag = document.createElement('div')
            flag.className = 'telpick-flag'
            const flagUrl = this._getFlagUrl(item.flag, item.country_code)
            if (flagUrl) {
              const img = document.createElement('img')
              img.src = flagUrl
              img.className = 'w-full h-full object-cover'
              img.alt = item.country || 'flag'
              img.loading = 'lazy'
              img.referrerPolicy = 'no-referrer'
              flag.appendChild(img)
            }
            li.appendChild(flag)
            const countrySpan = document.createElement('span')
            countrySpan.textContent = item.country
            li.appendChild(countrySpan)
            const codeSpan = document.createElement('span')
            codeSpan.className = 'ml-auto'
            codeSpan.textContent = item.code
            li.appendChild(codeSpan)
            ul.appendChild(li)
          })
          requestAnimationFrame(() => {
            if (input) {
              input.focus()
              const newCursorPos = Math.min(cursorPos + 1, newValue.length)
              input.setSelectionRange(newCursorPos, newCursorPos)
            }
          })
        } else {
          this.render()
        }
      }
      input.onclick = e => e.stopPropagation()
      input.onmousedown = e => e.stopPropagation()
      this.dropdown.appendChild(input)
      const ul = document.createElement('ul')
      ul.style.maxHeight = '130px'
      ul.style.overflowY = 'auto'
      const filtered = !this.searchQuery ? this.codes : this.codes.filter(c => c.country.toLowerCase().includes(this.searchQuery.toLowerCase()))
      filtered.forEach(item => {
        const li = document.createElement('li')
        const isSelected = item.country_code === this.selectedCode && this.selectedCode !== null && this.selectedCode !== undefined
        li.className = `telpick-item ${isSelected ? 'telpick-item-selected' : ''}`
        li.setAttribute('aria-selected', isSelected)
        li.onclick = () => {
          this.selectedCode = item.country_code
          this.onChange(item)
          this.isDropdownOpen = false
          this.searchQuery = ''
          this.render()
        }
        const flag = document.createElement('div')
        flag.className = 'telpick-flag'
        const flagUrl = this._getFlagUrl(item.flag, item.country_code)
        if (flagUrl) {
          const img = document.createElement('img')
          img.src = flagUrl
          img.className = 'w-full h-full object-cover'
          img.alt = item.country || 'flag'
          img.loading = 'lazy'
          img.referrerPolicy = 'no-referrer'
          flag.appendChild(img)
        }
        li.appendChild(flag)
        const countrySpan = document.createElement('span')
        countrySpan.textContent = item.country
        li.appendChild(countrySpan)
        const codeSpan = document.createElement('span')
        codeSpan.className = 'ml-auto'
        codeSpan.textContent = item.code
        li.appendChild(codeSpan)
        ul.appendChild(li)
      })
      this.dropdown.appendChild(ul)
      document.body.appendChild(this.dropdown)
      this._updateDropdownPosition()
      this._scrollResizeCleanup = () => {
        window.removeEventListener('scroll', this._boundUpdatePosition, true)
        window.removeEventListener('resize', this._boundUpdatePosition)
      }
      window.addEventListener('scroll', this._boundUpdatePosition, true)
      window.addEventListener('resize', this._boundUpdatePosition)

      requestAnimationFrame(() => {
        if (input) {
          input.focus()
        }
      })
    }
  }

  _setupOutsideClick() {
    if (this._outsideHandler) document.removeEventListener('click', this._outsideHandler)
    this._outsideHandler = e => {
      const target = e.target
      if (this.isDropdownOpen && this.container && target) {
        const inContainer = this.container.contains(target)
        const inDropdown = this.dropdown && this.dropdown.contains(target)
        if (!inContainer && !inDropdown) {
          this.isDropdownOpen = false
          this.render()
        }
      }
    }
    document.addEventListener('click', this._outsideHandler, true)
  }

  destroy() {
    if (this._outsideHandler) document.removeEventListener('click', this._outsideHandler)
    if (this._scrollResizeCleanup) {
      this._scrollResizeCleanup()
      this._scrollResizeCleanup = null
    }
    if (this.dropdown && this.dropdown.parentNode) {
      this.dropdown.parentNode.removeChild(this.dropdown)
      this.dropdown = null
    }
    this.container.innerHTML = ''
  }
}

window.Telpick = Telpick
export default Telpick
