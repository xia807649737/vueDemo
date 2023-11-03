<template>
  <div class="dashboard-container">
    <div class="dashboard-text">
      <!-- <img :src="imgUrl"> -->
      <div class="body">
        <!-- <img class="text" src="@/assets/text.png"> -->
        <p class="logintext">欢迎进入自然人颗粒化管理系统</p>
        <img class="bgimg" src="@/assets/homePage.png">
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  height: calc( 100vh - 110px);
  &-container {
    padding:1px 0;
      height: calc( 100vh - 110px);
  background: #F4F8FB;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
    height: calc( 100vh - 110px);
    background-color:#fff;

  }

}
.dashboard-text{
  width: 98%;
  height: calc( 100vh - 150px);
  margin:20px auto;
  opacity: 1;
  box-shadow: 0px 3px 6px rgba(21, 21, 21, 0.2);
}
.body{
  width:620px;
  height: 500px;
  margin:0 auto;
   position: absolute;
 left: 50%;
 top: 50%;
 margin-left:-250px;
margin-top:-310px;
}
.logintext{
  width:600px;
  height:35px;
  margin: 50px auto;
  text-align: center;
  font-style:italic;
  color: #195798;
  font-weight: Regular;
  font-family: "FontName";
  display: inline-block;
}
.bgimg{
  width:600px;
  height:400px;
margin: 0 auto;
}
</style>
