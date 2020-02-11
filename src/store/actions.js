const fb = require('../firebaseConfig');

export default {
  fetchUserProfile({ commit, state }) {
    fb.usersCollection.doc(state.currentUser.uid).get().then(res => {
      commit('setUserProfile', res.data());
    }).catch(err => {
      console.log(err)
    })
  }
}