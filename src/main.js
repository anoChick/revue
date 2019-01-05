import Vue from 'vue'
import wrap from '@vue/web-component-wrapper'
import RevueForm from './RevueForm.vue'
import RevueList from './RevueList.vue'
import VueFire from 'vuefire'
Vue.use(VueFire)
window.customElements.define('revue-form', wrap(Vue, RevueForm))
window.customElements.define('revue-list', wrap(Vue, RevueList))
