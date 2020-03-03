import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'

import Login from '@/views/Login'
import Dashboard from '@/views/Dashboard'
import Settings from '@/views/Settings'
import Register from "../views/Register";
import ForgotPassword from "../views/ForgotPassword";
import RatingCreate from "../views/RatingCreate";
import RatingDetail from "../views/RatingDetail";


Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '*',
      redirect: '/dashboard'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/forgot-password',
      name: 'ForgotPassword',
      component: ForgotPassword
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/ratings/create',
      name: 'RatingCreate',
      component: RatingCreate,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/ratings/:rating_id',
      name: 'RatingDetail',
      component: RatingDetail,
    }
  ]
});


router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth);
  const currentUser = firebase.auth().currentUser;

  if (requiresAuth && !currentUser) {
    next('/login')
  } else if (requiresAuth && currentUser) {
    next()
  } else {
    next()
  }
});

export default router
