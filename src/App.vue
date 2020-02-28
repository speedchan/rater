<template>
  <v-app>
    <Navigation v-if="current_user"></Navigation>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
  import Navigation from "./views/Navigation";
  import { mapState } from 'vuex';

  let tempArray = [[1,2], [3,4]];
  let newArray = [];
  tempArray.forEach(element => {
    newArray.push(element[0] + element[1]);
  });
  console.log(newArray);


  export default {
    name: 'App',
    components: { Navigation },
    computed: {
      ...mapState(['current_user'])
    }
  };
</script>
