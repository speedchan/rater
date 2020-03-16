const fb = require('../firebaseConfig');

export default {
  clear_current_user_data({ commit }) {
    // Don't forget to update this
    commit('set_current_user', null);
    commit('set_current_user_profile', {});
    commit('set_current_user_ratings', null);
  },
  fetch_current_user_profile({ commit, state }) {
    fb.usersCollection.doc(state.current_user.uid).get().then(function (response) {
      if (response.exists) {
        commit('set_current_user_profile', response.data());
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    }).catch(function (error) {
      console.log("Error getting document:", error);
    });
  },
  async update_user_profile({ commit, state }, data) {
    let full_name = data.full_name;
    let display_name = data.display_name;
    let country = data.country;

    fb.usersCollection.doc(state.current_user.uid).update({
      full_name: full_name,
      display_name: display_name,
      country: country,
    })
      .then(user => {
        // Update all other places that user data is stored
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
  },
  update_user_profile_picture({ commit, state }, data) {
    let profile_picture = data.profile_picture;
    let meta_data = { contentType: 'image/jpg' }
    // TODO Change storage to profile_pictures/
    let upload_picture_task = fb.storage_ref.child('profile_pictures/' + state.current_user.uid + '.jpg').put(profile_picture, meta_data)
    // Upload image and then update user profile
    upload_picture_task.snapshot.ref.getDownloadURL().then(function (profile_picture_url) {
      return profile_picture_url
    }).then(profile_picture_url => {
      fb.usersCollection.doc(state.current_user.uid).update({
        profile_picture: profile_picture_url
      })
      console.log("Profile picture updated successfully")
      location.reload()
    })
  }
}