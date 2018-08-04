<template>
  <div id="root">
    <h3>Select visualization type</h3><br>

    <el-input placeholder="Search visualization types..."></el-input><br><br>

    <h4>Basic Charts</h4><br>

    <el-row :gutter="8">
      <el-col :span="4" :md="4" :sm="6" :xs="8" v-for="chart in charts" :key="chart.title">
        <el-card align="center" shadow="hover">
          <el-button type="text" @click="newChart">
            <img class="image" :src="chart.icon">
            <div style="padding: 14px;">{{ chart.title }}</div>
          </el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ImageArea from '../../assets/charts-icon/area.svg'
import ImageHeatMap from '../../assets/charts-icon/heat-map.svg'
import ImageHorizontalBar from '../../assets/charts-icon/horizontal-bar.svg'
import ImageLine from '../../assets/charts-icon/line.svg'
import ImagePie from '../../assets/charts-icon/pie.svg'
import ImageVerticalBar from '../../assets/charts-icon/vertical-bar.svg'
export default {
  name: 'new',
  data () {
    return {
      charts: [
        {title: 'Area', icon: ImageArea},
        {title: 'Heat Map', icon: ImageHeatMap},
        {title: 'Horizontal bar', icon: ImageHorizontalBar},
        {title: 'Line', icon: ImageLine},
        {title: 'Pie', icon: ImagePie},
        {title: 'Vertical Bar', icon: ImageVerticalBar}
      ]
    }
  },
  methods: {
    newChart () {
      this.$router.push('/visualize/chart')
    }
  }
}
</script>

<style scoped>
#root {
  padding: 24px;
}
.el-card {
  margin-bottom: 8px;
}
.image {
  height: 46px;
}
</style>
