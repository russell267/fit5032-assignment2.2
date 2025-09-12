// import './assets/main.css'
// import '@/assets/style.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
// import DataTable from 'primevue/datatable'
// import Column from 'primevue/Column'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDMkwPvFmifzgVg7ihVyUaOvJKd1BfWxdw",
  authDomain: "week7-jiaquanli.firebaseapp.com",
  projectId: "week7-jiaquanli",
  storageBucket: "week7-jiaquanli.firebasestorage.app",
  messagingSenderId: "704856679238",
  appId: "1:704856679238:web:d59830b036d70b26d17b47"
};

// Initialize Firebase
initializeApp(firebaseConfig);





const app = createApp(App)
app.use(PrimeVue, { theme: { preset: Aura } })
app.use(router)
// app.component('DataTable', DataTable)
// app.component('Column', Column)

app.mount('#app')
