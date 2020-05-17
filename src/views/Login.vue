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
                      <v-col cols="12" class="text-center overline">Welcome back, friend!</v-col>
                      <v-col cols="12" class="text-center">
                        <v-avatar size="250">
                          <v-img :src='login_image'></v-img>
                        </v-avatar>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          prepend-icon="mdi-email"
                          v-model.trim="login_form.email"
                          placeholder="Email"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          prepend-icon="mdi-textbox-password"
                          v-model.trim="login_form.password"
                          placeholder="Password"
                          type="password"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <transition name="fade">
                          <v-row no-gutters v-if="is_performing_request">
                            <v-col cols="12">Loading...</v-col>
                          </v-row>
                        </transition>
                        <transition name="fade">
                          <v-row v-if="error_message !== ''" class="error-msg">
                            <v-col cols="12">{{ error_message }}</v-col>
                          </v-row>
                        </transition>
                        <v-btn @click="login" color="bg_coral" dark width="250px">Login</v-btn>
                      </v-col>
                      <v-col cols="12" class="my-2">
                        <router-link :to="{ name: 'Register' }">Create an Account</router-link>
                        <br />
                        <router-link :to="{ name: 'ForgotPassword' }">Forgot Password</router-link>
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
import firebase from "firebase";
import RatingListCard from "../components/RatingListCard";
import login_image from "../assets/images/login_image.png";

export default {
  data() {
    return {
      login_form: {
        email: "",
        password: ""
      },
      is_performing_request: false,
      error_message: "",
      login_image: login_image
    };
  },
  methods: {
    login() {
      this.is_performing_request = true;
      fb.auth
        .signInWithEmailAndPassword(
          this.login_form.email,
          this.login_form.password
        )
        .then(response => {
          fb.usersCollection.doc(response.user.uid).update({
            last_login: firebase.firestore.Timestamp.now().toDate()
          });

          this.$store.commit("set_current_user", response.user);
          this.$store.dispatch("fetch_current_user_profile");
          this.is_performing_request = false;
          this.$router.push("/dashboard");
        })
        .catch(err => {
          console.log(err);
          this.is_performing_request = false;
          this.error_message = err.message;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@media (min-width: 576px) {
  .container {
    width: 20vw;
    padding: 0;
  }
}
</style>