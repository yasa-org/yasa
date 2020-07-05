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
          <i class="el-icon-yasa-bars"></i>
          <span slot="title">{{ isCollapse ? $t('menu.expand') : $t('menu.collapse') }}</span>
        </el-menu-item>
        <el-menu-item index="/legacy-ui" @click="back2LegacyUI()">
          <i class="el-icon-yasa-back"></i><span slot="title">{{ $t('menu.back2LegacyUI') }}</span>
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
          <el-menu-item index="/management/config-sets">
            <i class="el-icon-yasa-config"></i><span slot="title">{{ $t('menu.configSet') }}</span>
          </el-menu-item>
          <el-menu-item index="/management/collections">
            <i class="el-icon-yasa-collections"></i><span slot="title">{{ $t('menu.collections') }}</span>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="/cloud" v-if="solrMode === 'solrcloud'">
          <template slot="title">
            <i class="el-icon-yasa-cloud"></i><span slot="title">{{ $t('menu.cloud') }}</span>
          </template>
          <el-menu-item index="/cloud/tree">
            <i class="el-icon-yasa-tree"></i><span slot="title">{{ $t('menu.tree') }}</span>
          </el-menu-item>
          <el-menu-item index="/cloud/zk-status">
            <i class="el-icon-yasa-zookeeper"></i><span slot="title">{{ $t('menu.zkStatus') }}</span>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="/help">
          <template slot="title">
            <i class="el-icon-yasa-help"></i><span slot="title">{{ $t('menu.help') }}</span>
          </template>
          <el-menu-item index="/help/doc" @click="openUrl('http://lucene.apache.org/solr/')">
            <i class="el-icon-yasa-doc"></i>
            <span slot="title">{{ $t('menu.doc') }}</span>
          </el-menu-item>
          <el-menu-item index="/help/issue-tracker" @click="openUrl('http://issues.apache.org/jira/browse/SOLR')">
            <i class="el-icon-yasa-bug"></i>
            <span slot="title">{{ $t('menu.issue-tracker') }}</span>
          </el-menu-item>
          <el-menu-item index="/help/community-forum" @click="openUrl('http://wiki.apache.org/solr/UsingMailingLists')">
            <i class="el-icon-yasa-email"></i>
            <span slot="title">{{ $t('menu.community-forum') }}</span>
          </el-menu-item>
          <el-menu-item
            index="/help/syntax"
            @click="openUrl('https://lucene.apache.org/solr/guide/query-syntax-and-parsing.html')"
          >
            <i class="el-icon-yasa-code"></i>
            <span slot="title">{{ $t('menu.solr-query-syntax') }}</span>
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

  @State private node!: string;
  @State private solrMode!: string;
  @Action private loadCollections!: () => void;

  created() {
    this.loadCollections();
  }

  private openUrl(url: string) {
    window.open(url, '_blank');
  }

  private back2LegacyUI() {
    const segments = /.+:(\d+).*/.exec(this.node);
    const port = segments && segments.length > 1 ? segments[1] : '80';
    const host = window.location.host.includes(':') ? window.location.host.replace(/:.*/, '') : window.location.host;
    window.location.href = `http://${host}:${port}`;
  }

  @Watch('isCollapse')
  onIsCollapseChanged() {
    localStorage.setItem('isCollapse', this.isCollapse.toString());
  }

  get activeNav() {
    const segments = this.$route.path.match(/^(\/[^/]+).*/);
    const firstSegment = segments && segments[1];
    if (firstSegment && ['/management', '/cloud'].includes(firstSegment)) {
      return this.$route.path;
    }
    return firstSegment;
  }
}
</script>

<style lang="scss">
@import 'style/common';
@import '//at.alicdn.com/t/font_767061_pfvdbgcc81c.css';

#app {
  font-family: $default-fonts;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
#nav:not(.el-menu--collapse) {
  width: 240px;
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
