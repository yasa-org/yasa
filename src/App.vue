<template>
  <el-container id="app">
    <el-aside width="inherit">
      <el-menu id="nav" :default-active="activeNav" :collapse="isCollapse" background-color="#282a36" text-color="#fff" active-text-color="#ffd04b" router>
        <el-menu-item index="" @click="isCollapse=!isCollapse">
          <i class="el-icon-fa-bars"></i><span slot="title">{{ isCollapse ? $t('menu.expand') : $t('menu.collapse') }}</span>
        </el-menu-item>
        <el-menu-item index="/discover">
          <i class="el-icon-yasa-discovery"></i><span slot="title">{{ $t('menu.discover') }}</span>
        </el-menu-item>
        <el-menu-item index="/visualize">
          <i class="el-icon-yasa-chart"></i><span slot="title">{{ $t('menu.visualize') }}</span>
        </el-menu-item>
        <el-menu-item index="/dashboard">
          <i class="el-icon-yasa-dashboard"></i><span slot="title">{{ $t('menu.dashboard') }}</span>
        </el-menu-item>
        <el-menu-item index="/dev-tools">
          <i class="el-icon-yasa-code"></i><span slot="title">{{ $t('menu.devTools') }}</span>
        </el-menu-item>
        <el-submenu index="/management">
          <template slot="title">
            <i class="el-icon-yasa-manage"></i><span slot="title">{{ $t('menu.management') }}</span>
          </template>
          <el-menu-item index="/management/collections">
            <i class="el-icon-yasa-collections"></i><span slot="title">Collections</span>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-main id="content">
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import {mapActions} from 'vuex'
export default {
  name: 'App',
  data () {
    return {
      isCollapse: localStorage.getItem('isCollapse') === 'true'
    }
  },
  created () {
    this.loadCollections()
  },
  watch: {
    isCollapse () {
      localStorage.setItem('isCollapse', this.isCollapse.toString())
    }
  },
  computed: {
    activeNav () {
      const segments = this.$route.path.match(/^(\/[^/]+).*/)
      const firstSegment = segments[1]
      if (firstSegment === '/management') {
        return this.$route.path
      }
      return segments[1]
    }
  },
  methods: {
    ...mapActions(['loadCollections'])
  }
}
</script>

<style>
@import "style/common.css";
@import "style/normalize.css";
@import "style/iconfont/iconfont.css";

#app {
  font-family: Monaco, Menlo, Consolas, monospace, "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
#nav:not(.el-menu--collapse) {
  width: 200px;
}
#nav {
  height: 100vh;
}
#content {
  padding: 0;
  height: 100vh;
}
</style>
