<template>
  <section>
    <transition name="fade">
      <div v-if="is_performing_request" class="loading">
        <p>Loading...</p>
      </div>
    </transition>

    <!--    Looks taste texture portion price plating affordability heat-->
    <form @submit.prevent>
      <div>
        name: <input type="text" v-model="rating_data.name"><br>
        category: <select v-model="rating_data.category">
        <option disabled value="">Please select one</option>
        <option value="food">Food</option>
      </select><br>
        <br>
        <place-autocomplete-field
            v-model="rating_data.location"
            placeholder="Enter an an address, zipcode, or location"
            :api-key="google_places_api_key">
        </place-autocomplete-field>

      </div>
      <div>
        <apexchart
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
      <button @click="create_rating" class="button">Finish Rating!</button>
    </form>
  </section>
</template>

<script>
  const fb = require('../firebaseConfig.js');

  import Vue from 'vue';
  import { mapState } from 'vuex';

  import VueApexCharts from 'vue-apexcharts';
  import VuePlaceAutocomplete from 'vue-place-autocomplete';

  Vue.use(VuePlaceAutocomplete);

  export default {
    components: {
      'apexchart': VueApexCharts
    },
    data() {
      return {
        google_places_api_key: process.env.VUE_APP_GOOGLE_PLACES_API_KEY,
        is_performing_request: false,
        // error_message : '',
        chart_options: {
          series: [{
            name: 'Rating',
            data: [5, 5, 5, 5, 5],
          }],
          chart: {
            height: 300,
            type: 'radar',
            toolbar: {
              show: false
            }
          },
          xaxis: {
            categories: ['Taste', 'Texture', 'Portion Size', 'Looks', 'Price'],
          },
          yaxis: {
            show: false
          }
        },
        rating_data: {
          name: '',
          category: '',
          location: '',
          taste: 5,
          texture: 5,
          portion_size: 5,
          looks: 5,
          price: 5,
        }
      }
    },
    methods: {
      update_chart: function () {
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
      create_rating: function() {
        this.is_performing_request = true;
        fb.ratingsCollection.doc().set({
          name: this.rating_data.name,
          category: this.rating_data.category,
          location: this.rating_data.location,
          ratings: {
            taste: this.rating_data.taste,
            texture: this.rating_data.texture,
            portion_size: this.rating_data.portion_size,
            looks: this.rating_data.looks,
            price: this.rating_data.price,
          },
          user_data: {
            uid: this.current_user.uid,
          }
        }).then(() => {
          this.is_performing_request = false;
          this.$router.push('/dashboard')
        }).catch(err => {
          console.log(err);
          this.is_performing_request = false;
          // this.error_message = err.message
        })
      }
    },
    computed: {
      ...mapState(['current_user'])
    }
  }
</script>

<style scoped>

</style>