<template>
  <div :class="classObj" class="app-wrapper" :style="{ '--current-color': theme }">
    <!-- 药房管理 -->
    <div class="PharmacyEndContainer" v-if="LoginRole >= 0">
      <PharmacyEndHome></PharmacyEndHome>
    </div>
    <!-- 后端管理 -->
    <div class="adminContainer" v-else>
      <div v-if="device === 'mobile' && sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
      <sidebar v-if="!sidebar.hide" class="sidebar-container" />
      <div :class="{ hasTagsView: needTagsView, sidebarHide: sidebar.hide }" class="main-container">
        <div :class="{ 'fixed-header': fixedHeader }">
          <navbar />
          <div class="needTagsPosition">
            当前位置:
            <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
          </div>
          <!-- <tags-view v-if="needTagsView" /> -->
        </div>
        <app-main />
        <right-panel>
          <settings />
        </right-panel>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import RightPanel from '@/components/RightPanel'
import PharmacyEndHome from '@/components/PharmacyEndHome'
import { AppMain, Navbar, Settings, Sidebar, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'
import variables from '@/assets/styles/variables.scss'
import Cookies from "js-cookie";


export default {
  name: 'Layout',
  components: {
    AppMain,
    PharmacyEndHome,
    Navbar,
    Breadcrumb,
    RightPanel,
    Settings,
    Sidebar,
    TagsView
  },
  mixins: [ResizeMixin],
  data() {
    return {
      LoginRole: null
    }
  },
  computed: {
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    ...mapState({
      theme: state => state.settings.theme,
      //LoginRole: state => state.settings.LoginRole,//登录角色
      sideTheme: state => state.settings.sideTheme,
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    },
    variables() {
      return variables;
    }
  },
  mounted() {
    let storeId = Cookies.get('storeId');////判断角色
    this.LoginRole = storeId;//判断角色
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/mixin.scss";
@import "~@/assets/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.needTagsPosition {
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #666666;
  padding-left: 15px;
  display: flex;
  align-items: center;
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$base-sidebar-width});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.sidebarHide .fixed-header {
  width: 100%;
}

.mobile .fixed-header {
  width: 100%;
}</style>
