<template lang='pug'>
#app
  .reviews
    p.note 最新の5件を表示
    .review(v-for='review in reviews')
      .top
        span.title {{review.title}}
        .rating
          span.rating-text {{review.score}}
          star-rating.rating-star(v-model='review.score' :star-size='14' :read-only='true' :show-rating='false')
      p.description {{review.description}}
      .bottom
        .user
          img.avatar(:src='review.userReference.photoURL')
          span.name {{review.userReference.displayName}}
        button.delete-button(v-if='currentUser && currentUser.uid == review.userReference.uid' @click='deleteReview(review)')
          font-awesome-icon(icon='trash-alt')
        span.datetime {{review.createdAt.seconds | moment}}

</template>
<script>
import Vue from 'vue'
import moment from 'moment'
import firebase from 'firebase'
import StarRating from 'vue-star-rating'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { auth, db } from './firebase-init'
moment.lang('ja')
library.add(faTrashAlt)
export default Vue.extend({
  props: {
    subjectId: String,
  },
  components: {
    StarRating,
    FontAwesomeIcon
  },
  data() {
    return {
      currentUser: null,
      reviews: []
    }
  },
  async mounted() {
    this.currentUser = await new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged(user => resolve(user))
    })
  },
  created() {
    this.$bind('reviews', db.collection('subjects').doc(this.subjectId).collection('reviews').orderBy('createdAt', 'desc').limit(5)).then(reviews => {
      this.reviews === reviews
    })
  },
  destroyed() {
    this.$unbind('reviews')
  },
  methods: {
    deleteReview(review) {
      if(!confirm('本当に削除しますか？')) return
      db.collection('subjects').doc(this.subjectId).collection('reviews').doc(review.id).delete()
      .then(() => {
        alert('削除が完了しました.')
      }).catch((e) => {
        alert('エラーが発生しました.')
        console.error(e)
      })
    }
  },
  filters: {
    moment: function (date) {
      return moment(date * 1000).fromNow()
    }
  }
})
</script>
<style lang='sass' scoped>
#app
  border: 1px solid #ccc
  margin: 8px
  padding: 16px 8px
  .reviews
    .note
      text-align: center
      font-size: 14px
      color: #666
    .review
      border-bottom: 1px solid #ddd
      margin: 8px 0
      .top
        overflow: hidden
        width: 100%
        .title
          display: block
          font-weight: bold
          overflow: hidden
          text-overflow: ellipsis
          white-space: nowrap
        .rating
          .rating-star
            float: right
          .rating-text
            margin: 0 0 0 4px
            float: right
      p.description
        font-size: 14px
      .bottom
        height: 32px
        .user
          img.avatar
            width: 28px
            height: 28px
            border-radius: 14px
            float: left
          span.name
            font-size: 14px
            margin: 4px
            float: left
        .datetime
          float: right
          font-size: 12px
          color: #aaa
        button.delete-button
          color: #666
          float: right
          border: 1px solid #aaa
          border-radius: 4px
          font-size: 11px
          background-color: #fff
          padding: 2px 8px
          margin: 0 8px
  .form-item
    display: block
</style>
