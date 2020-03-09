import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

// TODO Add light/dark theme for easy switching
export default new Vuetify({
  theme: {
    themes: {
      light: {
        bg_coral: '#FA7268',
      },
    },
  },
});
