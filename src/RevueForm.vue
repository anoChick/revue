<template lang='pug'>
#app
  .login-form(v-if='!currentUser')
    p ログインしてください
    button(@click='signInWithGoogle') SignInWithGoogle
  form.review-form(v-if='currentUser' v-on:submit.prevent='submit')
    .user
      img.avatar(:src='currentUser.photoURL')
      span.name {{currentUser.displayName}}
    .form-item
      input.title(type='text' name='score-goods' v-model='review.title' placeholder='タイトル')
    .form-item
      star-rating(v-model='review.score' :star-size='24')
    .form-item
      textarea.description(name='score-goods' v-model='review.description' placeholder='詳細' rows='7')
    .form-item
      button.submit-button(:disabled='sending') {{sending ? '処理中...' : '投稿'}}
</template>

<script>
import Vue from 'vue'
import StarRating from 'vue-star-rating'
import firebase from 'firebase'
import { auth, db } from './firebase-init'
import VueFire from 'vuefire'
Vue.use(VueFire)

const defaultReview = {
  score:3,
  title: '',
  description: ''
}

export default Vue.extend({
  props: {
    subjectId: String,
  },
  components: {
    StarRating
  },
  data() {
    return {
      sending: false,
      currentUser: null,
      review: {...defaultReview}
    }
  },
  async mounted() {
    this.currentUser = await new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged(user => resolve(user))
    })
  },
  methods: {
    signInWithGoogle() {
      const provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithRedirect(provider)
    },

    submit(event) {
      this.sending = true
      const review = Object.assign(
        this.review,
        {
          userReference: db.collection('users').doc(this.currentUser.uid)
        }
      )
      db.collection('subjects').doc(this.subjectId).collection('reviews').add(this.review)
      .then(() => {
        alert('投稿が完了しました.')
        this.review = {...defaultReview}
        this.sending = false
      })
      .catch((e) => {
        alert('エラーが発生しました.')
        console.error(e)
        this.sending = false
      })
    }
  }
})
</script>

<style lang='sass' scoped>
#app
  border: 1px solid #ccc
  padding: 16px 8px
  margin: 8px
  .login-form
    text-align: center
  .review-form
    margin: 8px
    .user
      margin: 8px 0
      height: 32px
      img.avatar
        width: 28px
        height: 28px
        border-radius: 14px
        float: left
      span.name
        font-size: 14px
        margin: 4px
        float: left
    .form-item
      display: block
      padding: 0 8px
      margin-bottom: 16px
      text-align: center
      input.title
        border: 1px solid #aaa
        border-radius: 4px
        font-size: 14px
        width: 100%
        padding: 8px
        margin: 0 -8px

      textarea.description
        border: 1px solid #aaa
        border-radius: 4px
        font-size: 14px
        width: 100%
        padding: 8px
        margin: 0 -8px
      button.submit-button
        border: 1px solid #aaa
        border-radius: 4px
        font-size: 14px
        width: 100%
        background-color: #fff
        padding: 8px
        margin: 0 -8px
</style>
