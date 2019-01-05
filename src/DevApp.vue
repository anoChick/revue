<template lang='pug'>
.app-container
  revue-form(subject-id='piyo')
  revue-list(subject-id='piyo')
</template>
<script>
import Vue from 'vue'
import RevueForm from './RevueForm.vue'
import RevueList from './RevueList.vue'

export default Vue.extend({
  components: {
    RevueForm,
    RevueList
  }
})
</script>
<style>
</style>
