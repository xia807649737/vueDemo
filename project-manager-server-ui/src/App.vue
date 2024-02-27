<template>
  <div id="app">
    <router-view />
    <theme-picker />
  </div>
</template>

<script>
import ThemePicker from "@/components/ThemePicker";
import { removeWatermark, setWaterMark } from "../src/utils/waterMark"
import Cookies from "js-cookie";

export default {
  name: "App",
  components: { ThemePicker },
  metaInfo() {
    return {
      title: this.$store.state.settings.dynamicTitle && this.$store.state.settings.title,
      titleTemplate: title => {
        return title ? `${title} - ${process.env.VUE_APP_TITLE}` : process.env.VUE_APP_TITLE
      }
    }
  },
  updated() {
    // 设置页面水印，判断cookies中是否有userName，有的话设置当前账号，没有就给他传入一个空
    let username = Cookies.get('username')
    if (username) {
      setWaterMark("", username);
    } else {
      setWaterMark("", '');
    }
  },
  destroyed() {
    removeWatermark();
  }
}

</script>
<style scoped>
#app .theme-picker {
  display: none;
}
</style>
