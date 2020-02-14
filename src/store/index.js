import Vue from 'vue'
import Vuex from 'vuex'

import modules from './modules'
import state from './state'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

const fb = require('../firebaseConfig.js');

Vue.use(Vuex);

// Maintains user's logged-in state
fb.auth.onAuthStateChanged(user => {
  if (user) {
    store.commit('setCurrentUser', user);
    store.dispatch('fetchUserProfile');
  }
});


const store = new Vuex.Store({
state,
getters,
actions,
mutations,
modules
});

export default store;