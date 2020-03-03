<script>
  import { Radar } from 'vue-chartjs';

  export default {
    name: "RadarChart",
    extends: Radar,
    props: ['chart_data', 'options'],
    mounted() {
      this.renderChart(this.chart_data, this.options)
    }
  }
</script>

<style scoped>

</style>