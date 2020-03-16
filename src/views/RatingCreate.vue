<template>
  <v-container>
    <transition name="fade">
      <div v-if="is_performing_request" class="loading">
        <p>Loading...</p>
      </div>
    </transition>

    <form @submit.prevent>
      <div>
        <v-avatar size="125">
          <v-img :src="rating_data.picture_url" v-show="is_display_rating_image"></v-img>
        </v-avatar>
        <v-btn @click="open_image_picker">Select Image</v-btn>
        <v-btn @click="upload_rating_picture">Upload Image</v-btn>
        <span v-show="upload_image_message" v-text="upload_image_message"></span>
        <input
          type="file"
          style="display:none;"
          ref="rating_picture_input"
          accept="image/*"
          @change="on_rating_picture_selected"
        />

        <br />
        <br />
        <br />
        <br />Object Name:
        <input type="text" v-model="rating_data.name" />
        <br />category:
        <v-select
          v-model="rating_data.category"
          :items="categories"
          placeholder="Select Category"
          outlined
        ></v-select>
        <br />
        <place-autocomplete-field
          v-model="rating_data.location"
          placeholder="Enter an address, zipcode, or location"
          :api-key="google_places_api_key"
        ></place-autocomplete-field>
        <br />
        <input type="text" v-model="rating_data.comment" placeholder="Additional comments here..." />
      </div>
      <div>
        <apex-chart
          type="radar"
          :height="chart_options.chart.height"
          :options="chart_options"
          :series="chart_options.series"
          ref="ratings_chart"
        />
      </div>
      <div>
        Taste:
        <input
          type="range"
          max="5"
          min="1"
          step="1"
          value="5"
          v-model="rating_data.taste"
          @change="update_chart"
        />
        <br />Texture:
        <input
          type="range"
          max="5"
          min="1"
          step="1"
          value="5"
          v-model="rating_data.texture"
          @change="update_chart"
        />
        <br />Portion Size:
        <input
          type="range"
          max="5"
          min="1"
          step="1"
          value="5"
          v-model="rating_data.portion_size"
          @change="update_chart"
        />
        <br />Looks:
        <input
          type="range"
          max="5"
          min="1"
          step="1"
          value="5"
          v-model="rating_data.looks"
          @change="update_chart"
        />
        <br />Price:
        <input
          type="range"
          max="5"
          min="1"
          step="1"
          value="5"
          v-model="rating_data.price"
          @change="update_chart"
        />
      </div>
      <v-btn @click="handle_rating_creation" class="v-btn">Finish Rating!</v-btn>
    </form>
  </v-container>
</template>

<script>
const fb = require("../firebaseConfig.js");

import Vue from "vue";
import { mapState } from "vuex";
import firebase from "firebase";

import VueApexCharts from "vue-apexcharts";
import RadarChart from "../components/RadarChart";
import VuePlaceAutocomplete from "vue-place-autocomplete";
import { v1 as uuidv1 } from "uuid";

Vue.use(VuePlaceAutocomplete);

export default {
  components: {
    "apex-chart": VueApexCharts,
    "radar-chart": RadarChart // TODO Remove radar chart
  },
  data() {
    return {
      google_places_api_key: process.env.VUE_APP_GOOGLE_PLACES_API_KEY,
      is_performing_request: false,
      rating_picture: null,
      is_display_rating_image: false,
      upload_image_message: '',
      chart_options: {
        chart: {
          height: 300,
          type: "radar",
          toolbar: {
            show: false
          }
        },
        series: [
          {
            name: "Rating",
            data: [5, 5, 5, 5, 5]
          }
        ],
        xaxis: {
          categories: ["Taste", "Texture", "Portion Size", "Looks", "Price"]
        }
      },
      rating_data: {
        name: "",
        category: "",
        location: "",
        comment: "",
        taste: 5,
        texture: 5,
        portion_size: 5,
        looks: 5,
        price: 5,
        picture_url: ""
      },
      chartjs_data: {
        labels: ["Taste", "Texture", "Portion Size", "Looks", "Price"],
        datasets: [
          {
            data: [5, 5, 5, 5, 5]
          }
        ]
      }
    };
  },
  methods: {
    update_chart: function() {
      // Calling updateSeries re-renders the chart
      this.$refs.ratings_chart.updateSeries([
        {
          data: [
            parseInt(this.rating_data.taste),
            parseInt(this.rating_data.texture),
            parseInt(this.rating_data.portion_size),
            parseInt(this.rating_data.looks),
            parseInt(this.rating_data.price)
          ]
        }
      ]);
    },
    handle_rating_creation: function() {
      this.is_performing_request = true;
      this.create_rating();
    },
    create_rating: function() {
      fb.ratingsCollection
        .add({
          created: firebase.firestore.Timestamp.now().toDate(),
          modified: firebase.firestore.Timestamp.now().toDate(),
          picture_url: this.rating_data.picture_url,
          name: this.rating_data.name,
          category: this.rating_data.category,
          location: this.rating_data.location,
          comment: this.rating_data.comment,
          ratings: {
            taste: parseInt(this.rating_data.taste),
            texture: parseInt(this.rating_data.texture),
            portion_size: parseInt(this.rating_data.portion_size),
            looks: parseInt(this.rating_data.looks),
            price: parseInt(this.rating_data.price)
          },
          user_data: {
            uid: this.current_user.uid,
            display_name: this.current_user_profile.display_name,
            full_name: this.current_user_profile.full_name
          }
        })
        .then(response => {
          console.log("Rating Created: ", response.id);
          this.create_votes(response.id);
        })
        .catch(err => {
          console.log(err);
          this.is_performing_request = false;
          // this.error_message = err.message
        });
    },
    create_votes: function(rating_id) {
      // Create vote, associate with picture
      fb.votesCollection
        .add({
          created: firebase.firestore.Timestamp.now().toDate(),
          modified: firebase.firestore.Timestamp.now().toDate(),
          upvoters_uid_list: [],
          downvoters_uid_list: [],
          rating: rating_id
        })
        .then(response => {
          console.log("Votes object " + response.id + " created");
          this.is_performing_request = false;
          this.$router.push("/dashboard");
        })
        .catch(err => {
          this.is_performing_request = false;
          console.log("Error creating votes object: ", err);
        });
    },
    open_image_picker() {
      this.$refs.rating_picture_input.click();
    },
    on_rating_picture_selected(event) {
      this.is_display_rating_image = false;
      // let file_reader = new FileReader();
      let files = event.target.files;
      let file_name = files[0].name;
      if (file_name.lastIndexOf(".") <= 0) {
        this.upload_image_message = `Requires valid image extension (.jpg)`;
        return console.log("e400 Requires valid image extension");
      }
      this.upload_image_message = `${file_name} selected`;
      // file_reader.readAsDataURL(files[0]);
      this.rating_picture = files[0];
    },
    upload_rating_picture() {
      // TODO Enforce this flow upon creation/update of images
      // User selects image (No preview, but text says "xxx.jpg selected"), user clicks upload image, if image upload successful, get URL from db, preview image
      console.log("Upload rating picture called");
      let meta_data = { contentType: "image/jpg" };
      let upload_task = fb.storage_ref
        .child(`rating_pictures/${this.current_user.uid}/${uuidv1()}.jpg`)
        .put(this.rating_picture, meta_data);

      upload_task.on(
        "state_changed",
        snapshot => {
          this.upload_image_message =  `Upload is ${(snapshot.bytesTransferred / snapshot.totalBytes) * 100}% done`;
        },
        error => {
          console.log("e400 Error in uploading image", error);
              this.upload_image_message = 'Error in uploading image. Please try again.';
        },
        () => {
          upload_task.snapshot.ref
            .getDownloadURL()
            .then(picture_url => {
              this.rating_data.picture_url = picture_url;
              this.is_display_rating_image = true;
              this.upload_image_message = '';
            })
            .catch(error => {
              // TODO Add contact admin area
              this.upload_image_message = 'Error in retrieving uploaded image. Please contact admins';
            });
        }
      );
    }
  },
  computed: {
    ...mapState({
      current_user: "current_user",
      current_user_profile: "current_user_profile",
      categories: "categories"
    })
  },
  mounted() {
    // this.rating_data.category = this.categories[0].value;
    this.$refs.ratings_chart.updateOptions({ xaxis: this.chart_options.xaxis });
  }
};
</script>

<style scoped>
</style>