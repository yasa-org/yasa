<template>
  <div>
    <el-card shadow="never" id="buckets">
      <div slot="header" style="line-height: 28px">
        {{ $t('visualize.title') }}
        <el-button style="float: right" icon="el-icon-yasa-play" type="primary" @click="submit"></el-button>
      </div>
      <el-form ref="form" :rules="validateRules" :model="formData">
        <el-form-item prop="xField" label="X-Axis Field">
          <el-select v-model="formData.xField" :value="formData.xField" :loading="loadingFields" filterable>
            <el-option v-for="f in fields" :key="f.name" :value="f.name"></el-option>
          </el-select>
        </el-form-item>
        <el-collapse>
          <el-collapse-item v-for="(chart, index) in formData.charts" :key="index" :title="chart.title">
            <el-form :rules="validateRules" :model="chart">
              <el-form-item prop="title" label="Title">
                <el-input v-model="chart.title" :placeholder="$t('visualize.titleHint')"></el-input>
              </el-form-item>
              <el-form-item prop="yField" label="Y-Axis Field">
                <el-select v-model="chart.yField" :value="chart.yField" :loading="loadingFields" filterable>
                  <el-option v-for="f in fields" :key="f.name" :value="f.name"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="yFieldAggregation" label="Aggregation">
                <el-select v-model="chart.yFieldAggregation" :value="chart.yFieldAggregation" filterable>
                  <el-option v-for="a in yAggregations" :key="a" :value="a"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="type" label="Type">
                <el-select v-model="chart.type" placeholder="Select a chart type">
                  <el-option v-for="type in chartTypes" :key="type.value" :value="type.value" :label="type.label"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { Field } from '@/model'
import { ElForm } from 'element-ui/types/form'
import { ChartFormData } from '@store/modules/visualize/visualize'

const Store = namespace('visualize')

@Component
export default class ChartForm extends Vue {
  @Prop({
    default: []
  })
  private fields!: Field[]

  @Prop({
    default: false
  })
  private loadingFields!: boolean

  private chartTypes = [
    { label: 'Line', value: 'line' },
    { label: 'Bar', value: 'bar' },
    { label: 'Area', value: 'area' }
  ]

  private yAggregations = ['Average', 'Count', 'Unique', 'Max', 'Min', 'Sum']
  private xAggregations = ['Date Histogram', 'Date Range', 'Histogram', 'Terms']

  @Store.State private formData!: ChartFormData

  @Store.Action private reset!: () => void

  private validateRules: object = {}

  mounted () {
    this.validateRules = {
      type: [{ required: true, message: this.$t('visualize.typeIsRequired'), trigger: 'change' }],
      yFieldAggregation: [{ required: true, message: this.$t('visualize.aggregationIsRequired'), trigger: 'change' }],
      xField: [{ required: true, message: this.$t('visualize.fieldIsRequired'), trigger: 'change' }],
      yField: [{ required: true, message: this.$t('visualize.fieldIsRequired'), trigger: 'change' }]
    }
  }

  private submit () {
    (this.$refs.form as ElForm).validate((valid) => {
      if (valid) {
        this.$emit('submit', this.formData)
      } else return false
    })
  }

  @Watch('fields')
  private onFieldsChanged () {
    this.reset()
  }
}
</script>

<style scoped>
#buckets {
  margin-top: 12px;
}
.el-select, .el-input {
  width: 100%;
}
</style>
