import { h } from 'vue';
import Telpick from './src/telpick.js';
import './src/telpick.css';

export const TelpickVue = {
  props: {
    code: { type: String, default: null },
    styleOverrides: { type: Object, default: () => ({}) },
    baseFlagUrl: { type: String, default: '' },
  },
  emits: ['update:code'],
  mounted() {
    this.telpickInstance = new Telpick({
      code: this.code,
      onChange: (country) => this.$emit('update:code', country),
      styleOverrides: this.styleOverrides || {},
      baseFlagUrl: this.baseFlagUrl || '',
    });
    this.telpickInstance.init(this.$el);
  },
  beforeUnmount() {
    if (this.telpickInstance) this.telpickInstance.destroy();
  },
  render() {
    return h('div');
  },
};
