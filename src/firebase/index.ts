import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyBoi5thJf-V2TLSSZurzkmNGc7dP_CnKL4',
  authDomain: 'consexual-dev.firebaseapp.com',
  projectId: 'consexual-dev',
  storageBucket: 'consexual-dev.appspot.com',
  messagingSenderId: '308478924855',
  appId: '1:308478924855:web:ec7a2888fc2959b3ec07b2'
}

let fApp: firebase.app.App

export function initialize () {
  fApp = firebase.initializeApp(firebaseConfig)
}

export const db = () => firebase.firestore(fApp)

export const storage = () => fApp.storage().ref()

export const uploader = (folder:string) => ({
  upload: async (file:File) => {
    return storage()
      .child(`${folder ? `${folder}/` : ''}${file.name}`)
      .put(file)
  }
})

export default {
  initialize,
  db,
  storage,
  uploader
}
