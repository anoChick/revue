const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp()

const db = admin.firestore()
db.settings({
  timestampsInSnapshots: true
})

exports.createUser = functions.auth.user().onCreate((userRecord, context) => {
  const docRef = db.collection('users').doc(userRecord.uid)
  const currentUserRef =  db.collection('users').doc(userRecord.uid)
  return docRef.set({
    uid: userRecord.uid,
    photoURL: userRecord.photoURL,
    displayName: userRecord.displayName
  })
})
