<template>
    <v-container>
        <transition name="fade">
            <div v-if="is_performing_request" class="loading">
                <p>Loading...</p>
            </div>
        </transition>
        <section>
            <form @submit.prevent>
                <h1>Welcome Back</h1>

                <label for="email">Email</label>
                <input v-model.trim="login_form.email" type="text" placeholder="you@email.com" id="email" />

                <label for="password">Password</label>
                <input v-model.trim="login_form.password" type="password" placeholder="******" id="password" />

                <button @click="login" class="button">Log In</button>

                <div class="extras">
                    <router-link :to="{ name: 'Register' }">Create an Account</router-link>
                    <br>
                    <router-link :to="{ name: 'ForgotPassword' }">Forgot Password</router-link>
                </div>
            </form>
            <transition name="fade">
                <div v-if="error_message !== ''" class="error-msg">
                    <p>{{ error_message }}</p>
                </div>
            </transition>
        </section>
    </v-container>
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