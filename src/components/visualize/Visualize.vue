<template>
  <div id="root">
    <h3>Select visualization type</h3>
    <br />

    <el-input placeholder="Search visualization types..."></el-input><br /><br />

    <h4>Basic Charts</h4>
    <br />

    <el-row :gutter="8">
      <el-col :span="4" :md="4" :sm="6" :xs="8" v-for="chart in charts" :key="chart.title">
        <el-card align="center" shadow="hover">
          <el-button type="text" @click="newChart(chart.title)" :disabled="chart.title === 'Pie'">
            <img class="image" :src="chart.icon" />
            <div style="padding: 14px;">{{ chart.title }}</div>
          </el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import ImageArea from '@assets/charts-icon/area.svg';
import ImageLine from '@assets/charts-icon/line.svg';
import ImagePie from '@assets/charts-icon/pie.svg';
import ImageVerticalBar from '@assets/charts-icon/vertical-bar.svg';
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Visualize extends Vue {
  public charts = [
    { title: 'Line', icon: ImageLine },
    { title: 'Vertical Bar', icon: ImageVerticalBar },
    { title: 'Area', icon: ImageArea },
    { title: 'Pie', icon: ImagePie },
  ];

  newChart(type: string) {
    this.$router.push({ path: '/visualize/chart', query: { type: type } });
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
.el-button {
  width: 100%;
  height: 100%;
}
.image {
  height: 46px;
}
</style>
