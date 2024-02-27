<template>
    <div :class="{'has-logo':showLogo}" class="treeContent" :style="{ backgroundColor: settings.sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground }">
        <!-- <logo v-if="showLogo" :collapse="isCollapse" /> -->
        <el-scrollbar :class="settings.sideTheme" wrap-class="scrollbar-wrapper">
            <el-menu
                :default-active="activeMenu"
                :collapse="isCollapse"
                :text-color="settings.sideTheme === 'theme-dark' ? variables.menuColor : variables.menuLightColor"
                :unique-opened="true"
                active-text-color="#fff"
                :collapse-transition="false"
                mode="vertical"
            >
                <sidebar-item
                    v-for="(route, index) in sidebarRouters"
                    :key="route.path  + index"
                    :item="route"
                    :base-path="route.path"
                />
            </el-menu>
        </el-scrollbar>
    </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/assets/styles/variables.scss";

export default {
    components: { SidebarItem, Logo },
    computed: {
        ...mapState(["settings"]),
        ...mapGetters(["sidebarRouters", "sidebar"]),
        activeMenu() {
            const route = this.$route;
            const { meta, path } = route;
            // if set path, the sidebar will highlight the path you set
            if (meta.activeMenu) {
                return meta.activeMenu;
            }
            return path;
        },
        showLogo() {
            return this.$store.state.settings.sidebarLogo;
        },
        variables() {
            return variables;
        },
        isCollapse() {
            return !this.sidebar.opened;
        }
    }
};
</script>
<style>
.treeContent {
    padding-top: 18px;
    background: linear-gradient(140deg, #0E70D4 0%, #0E70D4 40%, #18B9D3 100%);
    box-shadow: none !important;
}
.treeContent .el-submenu__title i{
    color: #fff !important;
  }
  
  .el-aside .el-menu{
    background: linear-gradient(140deg, #0E70D4 0%, #18B9D3 100%);
  }
  .treeContent .el-menu{
    background: border-box;
  }
 .treeContent .is-active{
    background: linear-gradient(312deg, #92E2D3 0%, #3CCDF5 36%, #299DFF 100%);
  }
  .treeContent .el-menu-item:focus,.treeContent .el-menu-item:hover {
    background: linear-gradient(312deg, #92E2D3 0%, #3CCDF5 36%, #299DFF 100%);
}
.treeContent .el-submenu .el-menu-item{
    min-width: auto;
    height: 40px;
    line-height: 40px;
}
.treeContent .el-menu-item,.treeContent .el-submenu__title{
    height: 40px;
    line-height: 40px;
    margin: 3px 8px;
    padding-left:  10px !important;
  border-radius: 4px;
}

.menu-img{
    width: 15px;
    height: 15px;
    margin-left: 2px;
    margin-right: 10px;
    object-fit: cover;
}
#app .sidebar-container .svg-icon {
    margin-right: 8px !important;
    margin-left: 12px !important;
    vertical-align: middle;
}
.treeContent .el-menu--inline .el-menu-item{
    padding-left: 24px !important;
    padding-right: 0;
}
.treeContent .el-submenu__title:hover{
    background: linear-gradient(312deg, #92E2D3 0%, #3CCDF5 36%, #299DFF 100%);
}
.treeContent .el-submenu{
    background:linear-gradient(312deg, #92e2d300 0%, #3ccdf500 36%, #299dff00 100%);
}
#app .sidebar-container .nest-menu .el-submenu > .el-submenu__title, #app .sidebar-container .el-submenu .el-menu-item {
    min-width: auto!important;
}
.el-header{
    padding: 0 !important;
}
.el-dropdown{
    cursor: pointer;
}
</style>
