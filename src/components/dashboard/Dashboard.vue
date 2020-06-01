<template>
  <el-row id="dashboard-root">
    <el-collapse v-model="activeNames">
      <el-collapse-item name="system" v-loading="loadingSystemInfo">
        <template slot="title">
          <i class="el-icon-yasa-system"></i>
          <b>System</b>
        </template>
        <el-row align="center">
          <el-col :lg="6" :sm="12" class="center">
            <gauge
              name="Physical Memory"
              :data="[{ name: 'Physical Memory', value: physicalMemoryPercentage}]"
              :tooltip="`${system.totalPhysicalMemorySize - system.freePhysicalMemorySize} / ${system.totalPhysicalMemorySize}`"/>
          </el-col>
          <el-col :lg="6" :sm="12" class="center">
            <gauge
              name="Swap Memory"
              :data="[{ name: 'Swap Space', value: swapSpacePercentage}]"
              :tooltip="`${system.totalSwapSpaceSize - system.freeSwapSpaceSize} / ${system.totalSwapSpaceSize}`"/>
          </el-col>
          <el-col :lg="6" :sm="12" class="center">
            <gauge
              name="JVM"
              :data="[{ name: 'JVM Memory', value: jvmMemoryPercentage }]"
              :tooltip="`${jvm.memory.raw.used} / ${jvm.memory.raw.max}`"/>
          </el-col>
          <el-col :lg="6" :sm="12" class="center">
            <gauge
              name="File Descriptor Count"
              :data="[{ name: 'File', value: fileDescriptorPercentage }]"
              :tooltip="`${system.openFileDescriptorCount} / ${system.maxFileDescriptorCount}`"/>
          </el-col>
        </el-row>
      </el-collapse-item>
      <el-collapse-item name="instance" v-loading="loadingSystemInfo">
        <template slot="title">
          <i class="el-icon-yasa-instance"></i>
          <b>Instance</b>
        </template>
        <el-form label-width="120px" label-position="left">
          <el-form-item label="Mode">{{ response.mode }}</el-form-item>
          <el-form-item label="Start">{{ startTime }}</el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item name="versions" v-loading="loadingSystemInfo">
        <template slot="title">
          <i class="el-icon-yasa-version"></i>
          <b>Versions</b>
        </template>
        <el-form label-width="120px" label-position="left">
          <el-form-item label="Solr Spec">{{ response.lucene['solr-spec-version'] }}</el-form-item>
          <el-form-item label="Solr Impl">{{ response.lucene['solr-impl-version'] }}</el-form-item>
          <el-form-item label="Lucene Spec">{{ response.lucene['lucene-spec-version'] }}</el-form-item>
          <el-form-item label="Lucene Impl">{{ response.lucene['lucene-impl-version'] }}</el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item name="jvm" v-loading="loadingSystemInfo">
        <template slot="title">
          <i class="el-icon-yasa-java"></i>
          <b>JVM</b>
        </template>
        <el-form label-width="120px" label-position="left">
          <el-form-item label="Runtime">{{ jvm.name }} {{ jvm.version }}</el-form-item>
          <el-form-item label="Processors">{{ jvm.processors }}</el-form-item>
          <el-form-item label="Arguments">
            <div class="arg" v-for="(arg, index) in jvm.jmx.commandLineArgs" :key="index">{{ arg }}</div>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
  </el-row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { SystemResponse } from '@service/solr/admin/info'
import Gauge from '@components/dashboard/Gauge.vue'

@Component({
  components: { Gauge }
})
export default class Dashboard extends Vue {
  private loadingSystemInfo = false
  private activeNames = ['instance', 'versions', 'jvm', 'system']
  private response: SystemResponse = new SystemResponse()

  created () {
    this.loadingSystemInfo = true
    this.$service.solr.admin.info.system().then(res => {
      this.loadingSystemInfo = false
      this.response = res.data
    }, () => (this.loadingSystemInfo = false))
  }

  private get system () {
    return this.response.system
  }

  private get jvm () {
    return this.response.jvm
  }

  private get startTime () {
    const upTimeInSeconds = this.jvm.jmx.upTimeMS / 1000
    if (upTimeInSeconds < 60) {
      return this.$i18n.t('common.justNow')
    }
    if (upTimeInSeconds < 60 * 60) {
      return this.$i18n.t('common.nMinutesAgo', [Math.ceil(upTimeInSeconds / 60)])
    }
    if (upTimeInSeconds < 60 * 60 * 24) {
      return this.$i18n.t('common.nHoursAgo', [Math.ceil(upTimeInSeconds / 60 / 60)])
    }
    return this.$i18n.t('common.nDaysAgo', [Math.ceil(upTimeInSeconds / 60 / 60 / 24)])
  }

  private get physicalMemoryPercentage () {
    const free = this.system.freePhysicalMemorySize
    const total = this.system.totalPhysicalMemorySize || 1
    return Math.round((total - free) / total * 10000) / 100
  }

  private get swapSpacePercentage () {
    const free = this.system.freeSwapSpaceSize
    const total = this.system.totalSwapSpaceSize || 1
    return Math.round((total - free) / total * 10000) / 100
  }

  private get fileDescriptorPercentage () {
    const used = this.system.openFileDescriptorCount
    const total = this.system.maxFileDescriptorCount || 1
    return Math.round(used / total * 10000) / 100
  }

  private get jvmMemoryPercentage () {
    const used = this.jvm.memory.raw.used
    const total = this.jvm.memory.raw.total || 1
    return Math.round(used / total * 10000) / 100
  }
}
</script>

<style scoped>
#dashboard-root {
  padding: 24px;
}
i {
  margin-right: 8px;
}
.arg {
  font-family: Menlo, Monaco, Consolas monospace;
  font-size: 9pt;
  word-break: break-all;
}
</style>
