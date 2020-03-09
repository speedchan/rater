<template>
  <section>
    <transition name="fade">
      <div v-if="is_performing_request" class="loading">
        <p>Loading...</p>
      </div>
    </transition>

    <form @submit.prevent>
      <div>
        name: <input type="text" v-model="rating_data.name"><br>
        category:
        <select v-model="rating_data.category">
          <option v-for="category in categories" :value="category.value">{{category.name}}</option>
        </select><br>
        <br>
        <place-autocomplete-field
            v-model="rating_data.location"
            placeholder="Enter an address, zipcode, or location"
            :api-key="google_places_api_key">
        </place-autocomplete-field>
        <br>
        <input type="text" v-model="rating_data.comment" placeholder="Additional comments here...">
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
        Taste: <input type="range" max="5" min="1" step="1" value="5" v-model="rating_data.taste" @change="update_chart"><br>
        Texture: <input type="range" max="5" min="1" step="1" value="5" v-model="rating_data.texture" @change="update_chart"><br>
        Portion Size: <input type="range" max="5" min="1" step="1" value="5" v-model="rating_data.portion_size" @change="update_chart"><br>
        Looks: <input type="range" max="5" min="1" step="1" value="5" v-model="rating_data.looks" @change="update_chart"><br>
        Price: <input type="range" max="5" min="1" step="1" value="5" v-model="rating_data.price" @change="update_chart">
      </div>
      <button @click="handle_rating_creation" class="button">Finish Rating!</button>
    </form>
  </section>
</template>

<script>
  const fb = require('../firebaseConfig.js');

  import Vue from 'vue';
  import { mapState } from 'vuex';
  import firebase from 'firebase';

  import VueApexCharts from 'vue-apexcharts';
  import RadarChart from "../components/RadarChart";
  import VuePlaceAutocomplete from 'vue-place-autocomplete';

  Vue.use(VuePlaceAutocomplete);

  export default {
    components: {
      'apex-chart': VueApexCharts,
      'radar-chart': RadarChart,  // TODO Remove radar chart
    },
    data() {
      return {
        google_places_api_key: process.env.VUE_APP_GOOGLE_PLACES_API_KEY,
        is_performing_request: false,
        // error_message : '',
        chart_options: {
          chart: {
            height: 300,
            type: 'radar',
            toolbar: {
              show: false
            }
          },
          series: [{
            name: 'Rating',
            data: [5, 5, 5, 5, 5],
          }],
          xaxis: {
            categories: ['Taste', 'Texture', 'Portion Size', 'Looks', 'Price'],
          },
        },
        rating_data: {
          name: '',
          category: '',
          location: '',
          comment: '',
          taste: 5,
          texture: 5,
          portion_size: 5,
          looks: 5,
          price: 5,
        },
        chartjs_data: {
          labels: ['Taste', 'Texture', 'Portion Size', 'Looks', 'Price'],
          datasets: [{
            data: [5,5,5,5,5]
          }]
        },
      }
    },
    methods: {
      update_chart: function () {
        // Calling updateSeries re-renders the chart
        this.$refs.ratings_chart.updateSeries(
            [{ data: [
                parseInt(this.rating_data.taste),
                parseInt(this.rating_data.texture),
                parseInt(this.rating_data.portion_size),
                parseInt(this.rating_data.looks),
                parseInt(this.rating_data.price)
              ]
            }])
      },
      handle_rating_creation: function() {
        this.is_performing_request = true;
        this.create_rating();
      },
      create_rating: function() {
        fb.ratingsCollection.add({
          created: firebase.firestore.Timestamp.now().toDate(),
          modified: firebase.firestore.Timestamp.now().toDate(),
          name: this.rating_data.name,
          category: this.rating_data.category,
          location: this.rating_data.location,
          comment: this.rating_data.comment,
          ratings: {
            taste: parseInt(this.rating_data.taste),
            texture:  parseInt(this.rating_data.texture),
            portion_size: parseInt(this.rating_data.portion_size),
            looks: parseInt(this.rating_data.looks),
            price: parseInt(this.rating_data.price)
          },
          user_data: {
            uid: this.current_user.uid,
            display_name: this.current_user_profile.display_name,
            full_name: this.current_user_profile.full_name,
          }
        }).then(response => {
          console.log("Rating Created: ", response.id);
          this.create_votes(response.id)
        }).catch(err => {
          console.log(err);
          this.is_performing_request = false;
          // this.error_message = err.message
        })
      },
      create_votes: function (rating_id) {
        fb.votesCollection.add({
          created: firebase.firestore.Timestamp.now().toDate(),
          modified: firebase.firestore.Timestamp.now().toDate(),
          upvoters_uid_list: [],
          downvoters_uid_list: [],
          rating: rating_id
        }).then(response => {
          console.log('Votes object ' + response.id + ' created');
          this.is_performing_request = false;
          this.$router.push('/dashboard')
        }).catch(err => {
          this.is_performing_request = false;
          console.log('Error creating votes object: ', err)
        })
      }
    },
    computed: {
      ...mapState({
        current_user:'current_user',
        current_user_profile: 'current_user_profile',
        categories: 'categories'
      })
    },
    mounted() {
      this.rating_data.category = this.categories[0].value;
      this.$refs.ratings_chart.updateOptions({xaxis: this.chart_options.xaxis});
    }
  }
</script>

<style scoped>

</style>