# Telpick

Multi-platform country and phone code selector with a modern design, smooth animations, and automatic IP detection.

[![npm version](https://img.shields.io/npm/v/telpick)](https://www.npmjs.com/package/telpick)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm downloads](https://img.shields.io/npm/dm/telpick)](https://www.npmjs.com/package/telpick)

**English** | [Español](README.es.md)

## Try the demo

You can try the interactive demo online:

**[→ Open demo (GitHub Pages)](https://julioalmirooficial.github.io/telpick/)**

## Features

- Modern design with smooth animations
- Automatic country detection by IP (multiple fallback services)
- Compatible with Vue 3, React, and Vanilla JavaScript
- Customizable via CSS variables
- Accessible with ARIA attributes
- Responsive design
- Built-in country search
- **TelpickZone**: IANA timezone selector (110 zones) with search by country, city, or identifier
- Lightweight with no heavy dependencies

## Installation

### npm
```bash
npm install telpick
```

### pnpm
```bash
pnpm add telpick
```

### yarn
```bash
yarn add telpick
```

### CDN
```html
<link rel="stylesheet" href="https://unpkg.com/telpick@latest/dist/style.css">
<script src="https://unpkg.com/telpick@latest/dist/telpick.umd.js"></script>
```

**Importing CSS:** Use `import 'telpick/dist/style.css'` when you install from npm (the published package includes `dist`). If you install from GitHub (e.g. `npm install github:julioalmirooficial/telpick`), use `import 'telpick/src/telpick.css'` instead, because `dist` is not in the repo.

## Usage

### React

```tsx
import React, { useState } from 'react'
import { TelpickReact } from 'telpick/react'
import 'telpick/dist/style.css'

function App() {
  const [selectedCountry, setSelectedCountry] = useState(null)

  return (
    <TelpickReact
      code={null}
      onChange={(country) => {
        console.log('Selected country:', country)
        setSelectedCountry(country)
      }}
    />
  )
}
```

### Vue 3

```vue
<template>
  <TelpickVue
    :code="selectedCode"
    @update:code="handleCountryChange"
  />
</template>

<script setup>
import { ref } from 'vue'
import { TelpickVue } from 'telpick/vue'
import 'telpick/dist/style.css'

const selectedCode = ref(null)

const handleCountryChange = (country) => {
  console.log('Selected country:', country)
  selectedCode.value = country.country_code
}
</script>
```

### Vanilla JavaScript

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://unpkg.com/telpick@latest/dist/style.css">
</head>
<body>
  <div id="telpick-container"></div>
  
  <script src="https://unpkg.com/telpick@latest/dist/telpick.umd.js"></script>
  <script>
    const telpick = new Telpick({
      code: null,
      onChange: (country) => {
        console.log('Selected country:', country)
      }
    })
    telpick.init(document.getElementById('telpick-container'))
  </script>
</body>
</html>
```

## Props

### `code` (optional)
Initial country code (ISO 3166-1 alpha-2). If `null`, it is detected automatically by IP.

**Type:** `string | null`  
**Default:** `null`

```tsx
<TelpickReact code="ES" onChange={handleChange} />
```

### `onChange` (optional)
Callback fired when the user selects a country.

**Type:** `(country: CountryCode) => void`

```tsx
<TelpickReact
  onChange={(country) => {
    console.log('Code:', country.code)
    console.log('Country:', country.country)
    console.log('Flag:', country.flag)
    console.log('ISO code:', country.country_code)
  }}
/>
```

### `styleOverrides` (optional)
Object of inline CSS styles to customize the main button.

**Type:** `Partial<Record<string, string>>`

```tsx
<TelpickReact
  styleOverrides={{
    padding: '12px 16px',
    fontSize: '16px',
    backgroundColor: '#f0f0f0'
  }}
/>
```

## Customization

You can customize styles using CSS variables:

```css
:root {
  --telpick-bg: #ffffff;
  --telpick-border: #e5e7eb;
  --telpick-radius: 12px;
  --telpick-flag-size: 24px;
  --telpick-font-size: 14px;
  --telpick-selected-bg: #eff6ff;
  --telpick-selected-border: #3b82f6;
  --telpick-selected-shadow: 2px 0 4px rgba(59, 130, 246, 0.3);
  --telpick-selected-text: #1f2937;
  --telpick-text: #1f2937;
  --telpick-text-secondary: #6b7280;
  --telpick-border-focus: #3b82f6;
  --telpick-transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  --telpick-font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}
```

## CountryCode interface

```typescript
interface CountryCode {
  country_code: string  // ISO 3166-1 alpha-2 code (e.g. "ES", "US")
  flag: string          // Country flag URL
  country: string       // Country name (e.g. "Spain", "United States")
  code: string         // Phone code (e.g. "+34", "+1")
}
```

## TelpickZone

Timezone selector shipped alongside Telpick. It includes **110 IANA timezones**, detects the browser timezone, and supports searching by country, city, or identifier (`America/Lima`).

### React

```tsx
import React, { useState } from 'react'
import { TelpickZoneReact } from 'telpick/zone/react'
import 'telpick/dist/style.css'

function App() {
  const [selectedZone, setSelectedZone] = useState(null)

  return (
    <TelpickZoneReact
      timezone={null}
      onChange={(zone) => {
        console.log('Selected timezone:', zone)
        setSelectedZone(zone)
      }}
    />
  )
}
```

### Vue 3

```vue
<template>
  <TelpickZoneVue
    :timezone="selectedTimezone"
    @update:timezone="handleTimezoneChange"
  />
</template>

<script setup>
import { ref } from 'vue'
import { TelpickZoneVue } from 'telpick/zone/vue'
import 'telpick/dist/style.css'

const selectedTimezone = ref(null)

const handleTimezoneChange = (zone) => {
  console.log('Selected timezone:', zone)
  selectedTimezone.value = zone.id
}
</script>
```

### Vanilla JavaScript / CDN

```html
<link rel="stylesheet" href="https://unpkg.com/telpick@latest/dist/style.css">
<div id="timezone"></div>
<script src="https://unpkg.com/telpick@latest/dist/telpick-zone.umd.js"></script>
<script>
  const telpickZone = new TelpickZone({
    timezone: null,
    onChange: (zone) => console.log(zone.id, zone.offset)
  })
  telpickZone.init(document.getElementById('timezone'))
</script>
```

### TelpickZone props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `timezone` | `string \| null` | `null` | Initial IANA timezone. If `null`, detected via `Intl`. |
| `onChange` | `(zone: TimezoneEntry) => void` | — | Callback when a timezone is selected. |
| `styleOverrides` | `object` | `{}` | Inline styles for the button. |
| `baseFlagUrl` | `string` | `''` | Base URL for flags (CDN or custom path). |
| `locale` | `string` | `'es'` | Locale for sorting and UTC offset. |
| `groupByContinent` | `boolean` | `true` | Group the dropdown by continent. |

### `onChange` return value

When the user selects a timezone, you receive a `TimezoneEntry` object:

```javascript
{
  id: "America/Lima",       // IANA identifier
  city: "Lima",             // City derived from the ID
  country: "Perú",          // Country name
  country_code: "PE",       // ISO 3166-1 alpha-2
  continent: "America",     // Continent from the dataset
  flag: "/flags/pe.webp",   // Flag path
  offset: "GMT-5"           // Current UTC offset (DST-aware)
}
```

### TimezoneEntry interface

```typescript
interface TimezoneEntry {
  id: string           // IANA timezone (e.g. "America/Lima")
  city: string         // City (e.g. "Lima")
  country: string      // Country (e.g. "Perú")
  country_code: string // ISO code (e.g. "PE")
  continent: string    // Continent (e.g. "America")
  flag: string         // Flag URL or path
  offset: string       // Dynamic UTC offset (e.g. "GMT-5")
}
```

## License

MIT

---

## Created by

**Julio Almiro**

- Website: [julioalmiro.com](https://julioalmiro.com)
- GitHub: [@julioalmirooficial](https://github.com/julioalmirooficial)
- Email: almiror.info@gmail.com

## Donate

If this project has been useful to you, consider donating to support its development and maintenance.

<div align="center">

[![PayPal](https://img.shields.io/badge/PayPal-Donate-00457C?style=for-the-badge&logo=paypal&logoColor=white)](https://www.paypal.me/almiror)

</div>
