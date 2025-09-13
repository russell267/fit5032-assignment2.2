import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import LoginView from '@/views/LoginView.vue'
import AccessDenied from '@/views/AccessDenied.vue'
import isAuthenticated from '@/authenticate'
import FirebaseSigninView from '@/views/FirebaseSigninView.vue'
import FirebaseRegistrationView from '@/views/FirebaseRegistrationView.vue'
const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView
  },
  {
    path: '/access-denied',
    name: 'AccessDenied',
    component: AccessDenied
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/FireLogin',
    name: 'FireLogin',
    component: FirebaseSigninView
  },
  {
    path:'/FireRegister',
    name:'FireRegister',
    component: FirebaseRegistrationView
  }
]
const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  console.log('isAuthenticated', isAuthenticated.value)
  if (to.name === 'AccessDenied') {
    next()
  } else if (to.name !== 'Login' && to.name != 'FireLogin' && !isAuthenticated.value && to.name!=='FireRegister') next({ name: 'AccessDenied' })
  else next()
})

// router.beforeEach(async (to, from) => {
//   //   console.log('isAuthenticated', isAuthenticated.value)
//   //   console.log('to', to)
//   if (
//     // make sure the user is authenticated
//     !isAuthenticated.value &&
//     // ❗️ Avoid an infinite redirect
//     to.name !== 'About'
//   ) {
//     console.log('isAuthenticated', isAuthenticated)
//     console.log('to', to)
//     // redirect the user to the login page
//     return { name: 'Login' }
//   }
// })
export default router
