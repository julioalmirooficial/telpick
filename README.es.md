# Telpick

Selector de país y código telefónico multiplataforma con diseño moderno y animaciones suaves.

[![npm version](https://img.shields.io/npm/v/telpick)](https://www.npmjs.com/package/telpick)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm downloads](https://img.shields.io/npm/dm/telpick)](https://www.npmjs.com/package/telpick)

[English](README.md) | **Español**

## Probar la demo

Puedes probar la demo interactiva en línea:

**[→ Abrir demo (GitHub Pages)](https://julioalmirooficial.github.io/telpick/)**

## Características

- Diseño moderno con animaciones suaves
- Detección automática del país por IP (múltiples servicios de fallback)
- Compatible con Vue 3, React y Vanilla JavaScript
- Personalizable mediante variables CSS
- Accesible con atributos ARIA
- Diseño responsive
- Búsqueda integrada de países
- Ligero y sin dependencias pesadas

## Instalación

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

**Importar CSS:** Usa `import 'telpick/dist/style.css'` cuando instalas desde npm (el paquete publicado incluye `dist`). Si instalas desde GitHub (ej. `npm install github:julioalmirooficial/telpick`), usa `import 'telpick/src/telpick.css'` porque `dist` no está en el repo.

## Uso

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
        console.log('País seleccionado:', country)
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
  console.log('País seleccionado:', country)
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
        console.log('País seleccionado:', country)
      }
    })
    telpick.init(document.getElementById('telpick-container'))
  </script>
</body>
</html>
```

## Props

### `code` (opcional)
Código de país inicial (ISO 3166-1 alpha-2). Si es `null`, se detecta automáticamente por IP.

**Tipo:** `string | null`  
**Por defecto:** `null`

```tsx
<TelpickReact code="ES" onChange={handleChange} />
```

### `onChange` (opcional)
Callback que se ejecuta cuando el usuario selecciona un país.

**Tipo:** `(country: CountryCode) => void`

```tsx
<TelpickReact
  onChange={(country) => {
    console.log('Código:', country.code)
    console.log('País:', country.country)
    console.log('Bandera:', country.flag)
    console.log('Código ISO:', country.country_code)
  }}
/>
```

### `styleOverrides` (opcional)
Objeto con estilos CSS en línea para personalizar el botón principal.

**Tipo:** `Partial<Record<string, string>>`

```tsx
<TelpickReact
  styleOverrides={{
    padding: '12px 16px',
    fontSize: '16px',
    backgroundColor: '#f0f0f0'
  }}
/>
```

## Personalización

Puedes personalizar los estilos usando variables CSS:

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

## Interfaz CountryCode

```typescript
interface CountryCode {
  country_code: string  // Código ISO 3166-1 alpha-2 (ej: "ES", "US")
  flag: string          // URL de la bandera del país
  country: string       // Nombre del país (ej: "España", "United States")
  code: string          // Código telefónico (ej: "+34", "+1")
}
```

## Licencia

MIT

---

## Creado por

**Julio Almiro**

- Sitio web: [julioalmiro.com](https://julioalmiro.com)
- GitHub: [@julioalmirooficial](https://github.com/julioalmirooficial)
- Email: almiror.info@gmail.com

## Donaciones

Si este proyecto te ha sido útil, considera hacer una donación para apoyar su desarrollo y mantenimiento continuo.

<div align="center">

[![PayPal](https://img.shields.io/badge/PayPal-Donate-00457C?style=for-the-badge&logo=paypal&logoColor=white)](https://www.paypal.me/almiror)

</div>
