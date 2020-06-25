<template>
  <el-container id="app">
    <el-aside width="inherit">
      <el-menu
        id="nav"
        :default-active="activeNav"
        :collapse="isCollapse"
        background-color="#282a36"
        text-color="#fff"
        active-text-color="#ffd04b"
        router
      >
        <el-menu-item index="" @click="isCollapse = !isCollapse">
          <i class="el-icon-yasa-bars"></i
          ><span slot="title">{{ isCollapse ? $t('menu.expand') : $t('menu.collapse') }}</span>
        </el-menu-item>
        <el-menu-item index="/dashboard">
          <i class="el-icon-yasa-dashboard"></i><span slot="title">{{ $t('menu.dashboard') }}</span>
        </el-menu-item>
        <el-menu-item index="/discover">
          <i class="el-icon-yasa-discovery"></i><span slot="title">{{ $t('menu.discover') }}</span>
        </el-menu-item>
        <el-menu-item index="/logging">
          <i class="el-icon-yasa-logging"></i><span slot="title">{{ $t('menu.logging') }}</span>
        </el-menu-item>
        <el-menu-item index="/visualize">
          <i class="el-icon-yasa-chart"></i><span slot="title">{{ $t('menu.visualize') }}</span>
        </el-menu-item>
        <el-menu-item index="/dev-tools">
          <i class="el-icon-yasa-code"></i><span slot="title">{{ $t('menu.devTools') }}</span>
        </el-menu-item>
        <el-submenu index="/management" v-if="solrMode === 'solrcloud'">
          <template slot="title">
            <i class="el-icon-yasa-manage"></i><span slot="title">{{ $t('menu.management') }}</span>
          </template>
          <el-menu-item index="/management/tree">
            <i class="el-icon-yasa-tree"></i><span slot="title">Tree</span>
          </el-menu-item>
          <el-menu-item index="/management/config-sets">
            <i class="el-icon-yasa-config"></i><span slot="title">Config Set</span>
          </el-menu-item>
          <el-menu-item index="/management/collections">
            <i class="el-icon-yasa-collections"></i><span slot="title">Collections</span>
          </el-menu-item>
          <el-menu-item index="/management/zk-status">
            <i class="el-icon-yasa-zookeeper"></i><span slot="title">ZK Status</span>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-main id="content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';

@Component
export default class App extends Vue {
  private isCollapse: boolean = localStorage.getItem('isCollapse') === 'true';

  @State private solrMode!: string;
  @Action private loadCollections!: () => void;

  created() {
    this.loadCollections();
  }

  @Watch('isCollapse')
  onIsCollapseChanged() {
    localStorage.setItem('isCollapse', this.isCollapse.toString());
  }

  get activeNav() {
    const segments = this.$route.path.match(/^(\/[^/]+).*/);
    const firstSegment = segments && segments[1];
    if (firstSegment === '/management') {
      return this.$route.path;
    }
    return segments && segments[1];
  }
}
</script>

<style lang="scss">
@import 'style/common.scss';
@import 'style/normalize.css';
@import '//at.alicdn.com/t/font_767061_yqlmn672s0h.css';

#app {
  font-family: $default-fonts;
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
.el-collapse-item__content {
  padding-bottom: 0 !important;
}
</style>
