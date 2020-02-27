const fb = require('../firebaseConfig');

export default {
  clear_current_user_data({ commit }) {
    // Don't forget to update this
    commit('set_current_user', null);
    commit('set_current_user_profile', {});
    commit('set_current_user_ratings', null);
  },
  fetch_current_user_profile({ commit, state }) {
    fb.usersCollection.doc(state.current_user.uid).get().then(function(response) {
      if (response.exists) {
        commit('set_current_user_profile', response.data());
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    }).catch(function(error) {
      console.log("Error getting document:", error);
    });
  },

}