<template>
  <div id="root">
    <el-row :gutter="8">
      <el-col :span="6">
        <chart-form></chart-form>
      </el-col>
      <el-col :span="16"></el-col>
    </el-row>
  </div>
</template>

<script>
import ChartForm from './ChartForm'
export default {
  name: 'chart',
  components: {ChartForm}
}
</script>

<style scoped>

</style>
