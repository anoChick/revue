import Vue from 'vue'
import wrap from '@vue/web-component-wrapper'
import RevueForm from './RevueForm.vue'

window.customElements.define('revue-form', wrap(Vue, RevueForm))
