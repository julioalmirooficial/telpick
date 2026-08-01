import React, { useEffect, useRef } from 'react'
import TelpickZone from './src/telpick-zone.js'
import './src/telpick.css'

export function TelpickZoneReact({
  timezone = null,
  onChange,
  styleOverrides,
  baseFlagUrl = '',
  locale = 'es',
  groupByContinent = true
}) {
  const ref = useRef()

  useEffect(() => {
    if (!ref.current) return
    const instance = new TelpickZone({
      timezone,
      onChange,
      styleOverrides,
      baseFlagUrl,
      locale,
      groupByContinent
    })
    instance.init(ref.current)
    return () => instance.destroy()
  }, [timezone, onChange, styleOverrides, baseFlagUrl, locale, groupByContinent])

  return <div ref={ref}></div>
}
