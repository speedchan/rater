<template>
    <v-container id="login">
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
                <form @submit.prevent class="password-reset">
                    <div v-if="!is_password_reset_success">
                        <h1>Reset Password</h1>
                        <p>We will send you an email to reset your password</p>

                        <label for="email3">Email</label>
                        <input v-model.trim="forgot_password_form.email" type="text" placeholder="you@email.com" id="email3" />

                        <button @click="reset_password" class="button">Submit</button>

                        <div class="extras">
                            <router-link to="login">
                                <button class="button">Back to login</button>
                            </router-link>
                        </div>
                    </div>
                    <div v-else>
                        <h1>Email Sent</h1>
                        <p>check your email for a link to reset your password</p>
                        <router-link to="login">
                            <button class="button">Back to login</button>
                        </router-link>

                    </div>
                </form>
                <transition name="fade">
                    <div v-if="error_message !== ''" class="error-msg">
                        <p>{{ error_message }}</p>
                    </div>
                </transition>
            </div>
        </section>
    </v-container>
</template>

<script>
    const fb = require('../firebaseConfig.js');

    export default {
        data() {
            return {
                forgot_password_form: {
                    email: ''
                },
                is_password_reset_success: false,
                is_performing_request: false,
                error_message: ''
            }
        },
        methods: {
            reset_password() {
                this.is_performing_request = true;
                fb.auth.sendPasswordResetEmail(this.forgot_password_form.email).then(() => {
                    this.is_performing_request = false;
                    this.is_password_reset_success = true;
                    this.forgot_password_form.email = ''
                }).catch(err => {
                    console.log(err);
                    this.is_performing_request = false;
                    this.error_message = err.message
                })
            }
        }
    }
</script>