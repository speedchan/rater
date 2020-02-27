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
            <div class="col2">
                <form @submit.prevent>
                    <h1>Welcome Back</h1>

                    <label for="email1">Email</label>
                    <input v-model.trim="login_form.email" type="text" placeholder="you@email.com" id="email1" />

                    <label for="password1">Password</label>
                    <input v-model.trim="login_form.password" type="password" placeholder="******" id="password1" />

                    <button @click="login" class="button">Log In</button>

                    <div class="extras">
                        <router-link :to="{ name: 'Register' }">Create an Account</router-link>
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

    export default {
        data() {
            return {
                login_form: {
                    email: '',
                    password: ''
                },
                is_performing_request: false,
                error_message: ''
            }
        },
        methods: {
            login() {
                this.is_performing_request = true;
                fb.auth.signInWithEmailAndPassword(this.login_form.email, this.login_form.password).then(response => {

                    fb.usersCollection.doc(response.user.uid).update({last_login: firebase.firestore.Timestamp.now().toDate()});

                    this.$store.commit('set_current_user', response.user);
                    this.$store.dispatch('fetch_current_user_profile');
                    this.is_performing_request = false;
                    this.$router.push('/dashboard')
                }).catch(err => {
                    console.log(err);
                    this.is_performing_request = false;
                    this.error_message = err.message
                })
            },
        }
    }
</script>