<template>
  <el-container id="chart-root">
    <chart style="height: 200px; overflow: hidden;" class="chart" ref="chart" :options="options" auto-resize />
  </el-container>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import defaults from '@/defaults';

type Data = {
  value: number;
  name: string;
};

@Component
export default class Gauge extends Vue {
  @Prop({
    required: true,
  })
  private name!: string;

  @Prop({
    required: true,
    type: Array,
  })
  private data!: Data[];

  @Prop({
    required: false,
    default: '{a}: {c}%',
  })
  private tooltip!: string;

  private get options() {
    return {
      tooltip: {
        formatter: this.tooltip,
        textStyle: {
          fontSize: 10,
          fontFamily: defaults.fonts,
        },
        position: 'inside',
      },
      series: [
        {
          type: 'gauge',
          name: this.name,
          data: this.data,
          title: {
            offsetCenter: [0, '70%'],
            fontSize: 10,
            fontFamily: defaults.fonts,
          },
          axisLine: {
            lineStyle: {
              width: 16,
            },
          },
          splitLine: {
            length: 16,
          },
          pointer: {
            width: 4,
          },
          detail: {
            formatter: '{value}%',
            fontSize: 10,
            fontFamily: defaults.fonts,
          },
        },
      ],
    };
  }
}
</script>

<style scoped>
#chart-root {
  width: 100%;
  height: 100%;
  overflow: auto;
  padding: 0;
}
</style>
