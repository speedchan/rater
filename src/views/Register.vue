<template>
  <div id="login">
    <transition name="fade">
      <div v-if="is_performing_request" class="loading">
        <p>Loading...</p>
      </div>
    </transition>
    <section>
      <div class="col1">
        <h1>Comparater</h1>
        <p>Welcome to Comparater, where you and millions of others save and rate things in general!</p>
        <p>This was built by <a href="https://speedchan.com/" target="_blank">Speed Chan</a> with Vue.js, on top of Google's Firebase</p>
      </div>
      <div class="col2 signup-form">
        <form @submit.prevent>
          <h1>Get Started</h1>
          <label for="display_name">Display Name</label>
          <input v-model.trim="sign_up_form.display_name" type="text" id="display_name"
                 placeholder="min 4 characters"/>

          <label for="full_name">Full Name</label>
          <input v-model.trim="sign_up_form.full_name" type="text" id="full_name"/>

          <label for="country">Country</label>
          <country-select v-model="sign_up_form.country" id="country" :countryName="false"
                          :removePlaceholder="true"></country-select>

          <label for="email2">Email</label>
          <input v-model.trim="sign_up_form.email" type="text" id="email2" placeholder="email@host.com"/>

          <label for="password2">Password</label>
          <input v-model.trim="sign_up_form.password" type="password" placeholder="min 6 characters"
                 id="password2"/>

          <button @click="sign_up" class="button">Sign Up</button>

          <div class="extras">
            <router-link :to="{ name: 'Login' }">Log In</router-link>
            <router-link :to="{ name: 'ForgotPassword' }">Forgot Password</router-link>
          </div>
        </form>
        <transition name="fade">
          <div v-if="error_message !== ''" class="error-msg">
            <p>{{ error_message }}</p>
          </div>
        </transition>
      </div>
    </section>
  </div>
</template>

<script>
  const fb = require('../firebaseConfig.js');
  import firebase from 'firebase';
  import Vue from 'vue'
  import vueCountryRegionSelect from 'vue-country-region-select';

  Vue.use(vueCountryRegionSelect);

  export default {
    data() {
      return {
        sign_up_form: {
          display_name: '',
          full_name: '',
          country: '',
          email: '',
          password: '',
        },
        is_performing_request: false,
        error_message: ''
      }
    },
    methods: {
      sign_up() {
        fb.auth.createUserWithEmailAndPassword(this.sign_up_form.email, this.sign_up_form.password)
            .then(response => {
              this.$store.commit('set_current_user', response.user);

              fb.usersCollection.doc(response.user.uid).set({
                display_name: this.sign_up_form.display_name,
                full_name: this.sign_up_form.full_name,
                country: this.sign_up_form.country,
                created: firebase.firestore.Timestamp.now().toDate(),
                modified: firebase.firestore.Timestamp.now().toDate(),
                last_login: firebase.firestore.Timestamp.now().toDate(),
              }).then(() => {
                this.$store.dispatch('fetch_current_user_profile');
                this.is_performing_request = false;
                this.$router.push('/dashboard')
              }).catch(err => {
                console.log(err);
                this.is_performing_request = false;
                this.error_message = err.message
              })
            }).catch(err => {
          console.log(err);
          this.is_performing_request = false;
          this.error_message = err.message
        })
      },
    }
  }
</script>