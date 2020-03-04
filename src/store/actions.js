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
  update_user_profile({ commit, state }, data) {
    let full_name = data.full_name;
    let display_name = data.display_name;
    let country = data.country;

    fb.usersCollection.doc(state.current_user.uid).update({full_name, display_name, country})
        .then(user => {
          fb.ratingsCollection.where('user_data.uid', '==', state.current_user.uid)
              .get()
              .then(queryset => {
                queryset.forEach(rating => {
                  fb.ratingsCollection.doc(rating.id).update({
                    'user_data.full_name': full_name,
                    'user_data.display_name': display_name,
                  })
                })
              })
        })
        .catch(err => {
          console.log("e400 error updating user profile ", err)
        })
  }
}