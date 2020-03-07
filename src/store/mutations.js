export default {
  set_current_user(state, val) {
    state.current_user = val
  },
  set_current_user_profile(state, val) {
    state.current_user_profile = val
  },
  set_current_user_ratings(state, val) {
    state.current_user_ratings = val
  },
  set_all_ratings(state, val) {
    state.all_ratings = val
  }
}