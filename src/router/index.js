import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'

import Login from '../views/Login'
import Dashboard from '../views/Dashboard'
import Settings from '../views/Settings'
import Register from "../views/Register";
import ForgotPassword from "../views/ForgotPassword";
import RatingCreate from "../views/RatingCreate";
import RatingDetail from "../views/RatingDetail";
import UserDetail from "../views/UserDetail";


Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '*',
      redirect: '/'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        title: 'Login'
      }
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
      meta: {
        requiresAuth: false,
        title: 'Register',
      }
    },
    {
      path: '/forgot-password',
      name: 'ForgotPassword',
      component: ForgotPassword,
      meta: {
        requiresAuth: false,
        title: 'Forgot Password',
      }
    },
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard,
      meta: {
        requiresAuth: true,
        title: 'Index',
      }
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings,
      meta: {
        requiresAuth: true,
        title: 'Settings',
      }
    },
    {
      path: '/ratings/create',
      name: 'RatingCreate',
      component: RatingCreate,
      meta: {
        requiresAuth: true,
        title: 'Create Rating',
      }
    },
    {
      path: '/ratings/:rating_id',
      name: 'RatingDetail',
      component: RatingDetail,
      meta: {
        title: 'Rating'
      }
    },
    {
      path: '/users/:user_uid',
      name: 'UserDetail',
      component: UserDetail,
      meta: {
        title: 'User Profile'
      }
    }
  ]
});


router.beforeEach((to, from, next) => {
  const requires_auth = to.matched.some(x => x.meta.requiresAuth);
  const current_user = firebase.auth().currentUser;

  if (requires_auth && !current_user) {
    next('/login')
  } else if (requires_auth && current_user) {
    next()
  } else {
    next()
  }
});

export default router
