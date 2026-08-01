import { h } from 'vue'
import TelpickZone from './src/telpick-zone.js'
import './src/telpick.css'

export const TelpickZoneVue = {
  props: {
    timezone: { type: String, default: null },
    styleOverrides: { type: Object, default: () => ({}) },
    baseFlagUrl: { type: String, default: '' },
    locale: { type: String, default: 'es' },
    groupByContinent: { type: Boolean, default: true }
  },
  emits: ['update:timezone'],
  mounted() {
    this.telpickZoneInstance = new TelpickZone({
      timezone: this.timezone,
      onChange: zone => this.$emit('update:timezone', zone),
      styleOverrides: this.styleOverrides,
      baseFlagUrl: this.baseFlagUrl,
      locale: this.locale,
      groupByContinent: this.groupByContinent
    })
    this.telpickZoneInstance.init(this.$el)
  },
  beforeUnmount() {
    if (this.telpickZoneInstance) this.telpickZoneInstance.destroy()
  },
  render() {
    return h('div')
  }
}
