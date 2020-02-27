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
    store.commit('set_current_user', user);
    store.dispatch('fetch_current_user_profile');

    fb.ratingsCollection.orderBy('created', 'desc').onSnapshot(queryset => {
      let ratings_list = [];

      queryset.forEach(rating_object => {
        let rating = rating_object.data();
        rating.id = rating_object.id;
        ratings_list.push(rating)
      });
      store.commit('set_current_user_ratings', ratings_list)
    })
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