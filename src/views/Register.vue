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
                    <v-col cols="12" class="text-center overline">Hello there!</v-col>
                    <v-col cols="12" class="text-center">
                      <v-avatar size="250" tile>
                        <v-img :src="register_image"></v-img>
                      </v-avatar>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        prepend-icon="mdi-domino-mask"
                        v-model.trim="sign_up_form.display_name"
                        placeholder="Display Name"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        prepend-icon="mdi-face"
                        v-model.trim="sign_up_form.full_name"
                        placeholder="Full Name"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                    <v-icon class="mr-2">mdi-map-marker</v-icon>
                    <country-select
                      v-model="sign_up_form.country"
                      :countryName="true"
                      class="country_selector"
                      id="country"
                    ></country-select>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        prepend-icon="mdi-email"
                        v-model.trim="sign_up_form.email"
                        placeholder="Email"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        prepend-icon="mdi-lock"
                        v-model.trim="sign_up_form.password"
                        placeholder="Password (no restrictions)"
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
                      <v-btn @click="sign_up" color="bg_coral" dark width="250px">Register</v-btn>
                    </v-col>
                    <v-col cols="12" class="my-2">
                      <router-link :to="{ name: 'Login' }">Login</router-link>
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
import Vue from "vue";
import vueCountryRegionSelect from "vue-country-region-select";
import register_image from "../assets/images/register_image.png";

Vue.use(vueCountryRegionSelect);

export default {
  data() {
    return {
      sign_up_form: {
        display_name: "",
        full_name: "",
        country: "",
        email: "",
        password: ""
      },
      is_performing_request: false,
      error_message: "",
      register_image: register_image
    };
  },
  methods: {
    sign_up() {
      fb.auth
        .createUserWithEmailAndPassword(
          this.sign_up_form.email,
          this.sign_up_form.password
        )
        .then(response => {
          this.$store.commit("set_current_user", response.user);

          fb.usersCollection
            .doc(response.user.uid)
            .set({
              display_name: this.sign_up_form.display_name,
              full_name: this.sign_up_form.full_name,
              country: this.sign_up_form.country,
              created: firebase.firestore.Timestamp.now().toDate(),
              modified: firebase.firestore.Timestamp.now().toDate(),
              last_login: firebase.firestore.Timestamp.now().toDate()
            })
            .then(() => {
              this.$store.dispatch("fetch_current_user_profile");
              this.is_performing_request = false;
              this.$router.push("/dashboard");
            })
            .catch(err => {
              console.log(err);
              this.is_performing_request = false;
              this.error_message = err.message;
            });
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
.country_selector {
  width: 87%;
  height: 30px;
  padding: 5px;
  border-bottom: 1px solid lightgray;
}

@media (min-width: 576px) {
  .container {
    min-width: 385px;
    width: 385px;
    padding: 0;
  }
  .country_selector {
    width: 270px;
    height: 35px;
    margin-bottom: 5px;
    border-bottom: 1px solid grey;
  }
}
</style>