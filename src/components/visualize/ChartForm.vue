<template>
  <div>
    <div align="right">
      <el-button icon="el-icon-fa-play" type="primary" @click="$emit('submit', xAxis, yAxis)"></el-button>
    </div>
    <el-card shadow="never" id="metrics">
      <div slot="header">{{ $t('visualize.metrics') }}</div>
      <el-form>
        <el-form-item label="Y-Axis"></el-form-item>
        <el-form-item label="Aggregation">
          <el-select v-model="yAxis.aggregation" :value="yAxis.aggregation">
            <el-option v-for="a in yAggregations" :key="a" :value="a"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Field">
          <el-select v-model="yAxis.field" :value="yAxis.field">
            <el-option v-for="f in fields" :key="f.name" :value="f.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Custom Label">
          <el-input></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="never" id="buckets">
      <div slot="header">{{ $t('visualize.buckets') }}</div>
      <el-form>
        <el-form-item label="X-Axis"></el-form-item>
        <el-form-item label="Aggregation">
          <el-select v-model="xAxis.aggregation" :value="xAxis.aggregation">
            <el-option v-for="a in xAggregations" :key="a" :value="a">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Field">
          <el-select v-model="xAxis.field" :value="xAxis.field">
            <el-option v-for="f in fields" :key="f.name" :value="f.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Custom Label">
          <el-input></el-input>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'chart-form',
  props: {
    fields: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data: function () {
    return {
      yAggregations: ['Average', 'Count', 'Max', 'Median', 'Min', 'Sum'],
      xAggregations: ['Date Histogram', 'Date Range', 'Histogram', 'Terms'],
      yAxis: {
        aggregation: undefined,
        field: undefined
      },
      xAxis: {
        aggregation: undefined,
        field: undefined
      }
    }
  }
}
</script>

<style scoped>
#buckets, #metrics {
  margin-top: 12px;
}
.el-select, .el-input {
  width: 100%;
}
</style>
