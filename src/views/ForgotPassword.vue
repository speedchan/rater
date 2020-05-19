<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-container class="px-md-10 px-8 py-md-4 py-2 mt-md-10">
            <v-row no-gutters>
              <v-col cols="12">
                <v-row no-gutters class="text-center left">
                  <v-row no-gutters>
                    <v-col cols="12" class="text-center b title">
                      <span>R8r</span>
                    </v-col>
                    <v-col cols="12" class="text-center overline">It's alright, we'll help you!</v-col>
                    <v-col cols="12" class="text-center">
                        <v-avatar size="250">
                          <v-img src='../assets/images/forgot.png'></v-img>
                        </v-avatar>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        prepend-icon="mdi-email"
                        v-model.trim="forgot_password_form.email"
                        type="text"
                        placeholder="you@email.com"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-btn @click="reset_password" color="bg_coral" dark width="250px">Submit</v-btn>
                    </v-col>
                    <v-col cols="12" class="my-2">
                      <router-link :to="{ name: 'Register' }">Create an Account</router-link>
                      <br />
                      <router-link :to="{ name: 'Login' }">Login</router-link>
                    </v-col>
                  </v-row>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
const fb = require("../firebaseConfig.js");

export default {
  data() {
    return {
      forgot_password_form: {
        email: ""
      },
      is_password_reset_success: false,
      error_message: ""
    };
  },
  methods: {
    reset_password() {
      fb.auth
        .sendPasswordResetEmail(this.forgot_password_form.email)
        .then(() => {
          this.is_password_reset_success = true;
          this.forgot_password_form.email = "";
        })
        .catch(err => {
          console.log(err);
          this.error_message = err.message;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@media (min-width: 576px) {
  .container {
    min-width: 385px;
    width: 385px;
    padding: 0;
  }
}
</style>