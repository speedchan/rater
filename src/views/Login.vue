<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-container class="px-md-10 px-2 py-md-4 py-2">
            <v-row no-gutters>
              <v-col cols="12">
                <v-row no-gutters class="text-center left">
                  <v-col cols="6">
                      <!-- <RatingListCard :rating=display_rating></RatingListCard> -->
                  </v-col>
                  <v-col cols="6">
                    <v-row no-gutters>
                      <v-col cols="12" class="text-center">Welcome Back!</v-col>
                      <v-col cols="12">
                        <v-text-field
                          prepend-icon="mdi-face"
                          v-model.trim="login_form.email"
                          placeholder="Email"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          prepend-icon="mdi-face"
                          v-model.trim="login_form.password"
                          placeholder="Password (no restrictions)"
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
                        <v-btn @click="login" color="bg_coral" dark>Login</v-btn>
                      </v-col>
                      <v-col cols="12" class="my-2">
                        <router-link :to="{ name: 'Register' }">Create an Account</router-link>
                        <br />
                        <router-link :to="{ name: 'ForgotPassword' }">Forgot Password</router-link>
                      </v-col>
                    </v-row>
                  </v-col>
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

export default {
  components: {
    RatingListCard
  },
  data() {
    return {
      login_form: {
        email: "",
        password: ""
      },
      is_performing_request: false,
      error_message: "",
      display_rating: {
          average_rating: 5,
          category: 'food',
          comment: 'This could be your 5-star rating of your favourite meal!',
          location: 'That restaurant you love',
          name: 'Ravioli Parmesano',
          picture_url: '',
          ratings: {
              looks: 5,
              portion_size: 5,
              price: 5,
              taste: 5,
              texture: 5
          },
          user_data: {
              display_name: 'Aus Foodie',
              full_name: 'John Smith',
              profile_picture: '',
              uuid: 123456
          }
      }
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
</style>