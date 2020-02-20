const fb = require('../firebaseConfig');

export default {
  fetch_user_profile({ commit, state }) {
    fb.usersCollection.doc(state.current_user.uid).get().then(res => {
      commit('set_user_profile', res.data());
    }).catch(err => {
      console.log(err)
    })
  },
  clear_user_data({ commit }) {
    commit('set_current_user', null);
    commit('set_user_profile', {});
  }
}