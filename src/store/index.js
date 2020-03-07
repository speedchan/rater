import Vue from 'vue'
import Vuex from 'vuex'

import modules from './modules'
import state from './state'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

const fb = require('../firebaseConfig.js');

Vue.use(Vuex);

function return_current_user_rating(rating) {
  if (rating.user_data.uid === state.current_user.uid) {
    return rating;
  }
}

// Maintains user's logged-in state
fb.auth.onAuthStateChanged(user => {
  if (user) {
    store.commit('set_current_user', user);
    store.dispatch('fetch_current_user_profile');

    // Get & stores all ratings in state
    fb.ratingsCollection.orderBy('created', 'desc').onSnapshot(queryset => {
      let ratings_list = [];

      queryset.forEach(rating_object => {
        let rating = rating_object.data();
        rating.id = rating_object.id;
        ratings_list.push(rating)
      });
      console.log("all rating list", ratings_list.length);
      store.commit('set_all_ratings', ratings_list);

      // Filters current user's ratings and stores in state
      let current_user_ratings_list = ratings_list.map(rating => {
        return_current_user_rating(rating)
      });
      console.log("cur usr rate lsit: ", current_user_ratings_list.length);
      store.commit('set_current_user_ratings', current_user_ratings_list)
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