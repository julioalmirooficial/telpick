export interface CountryCode {
  country: string
  code: string
  flag: string
  country_code: string
}

export interface TimezoneEntry {
  id: string
  city: string
  country: string
  country_code: string
  continent: string
  flag: string
  offset: string
}

export interface TelpickOptions {
  code?: string | null
  onChange?: (country: CountryCode) => void
  styleOverrides?: Partial<CSSStyleDeclaration>
  baseFlagUrl?: string
}

export interface TelpickZoneOptions {
  timezone?: string | null
  onChange?: (timezone: TimezoneEntry) => void
  styleOverrides?: Partial<CSSStyleDeclaration>
  baseFlagUrl?: string
  locale?: string
  groupByContinent?: boolean
}

export class Telpick {
  constructor(options?: TelpickOptions)
  init(container: HTMLElement): Promise<void>
  destroy(): void
}

export class TelpickZone {
  constructor(options?: TelpickZoneOptions)
  init(container: HTMLElement): Promise<void>
  destroy(): void
}

export interface TelpickReactProps extends TelpickOptions {}
export interface TelpickZoneReactProps extends TelpickZoneOptions {}

export const TelpickReact: import('react').ComponentType<TelpickReactProps>
export const TelpickZoneReact: import('react').ComponentType<TelpickZoneReactProps>
export const TelpickVue: import('vue').DefineComponent
export const TelpickZoneVue: import('vue').DefineComponent
