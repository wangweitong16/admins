<template>
  <div class="bg">
    <div class="box">
      <img src="" alt="">
      <el-input v-model="username" placeholder="请输入用户名" class="input"></el-input>
      <el-input v-model="password" placeholder="请输入密码" class="input"></el-input>
      <div class="lo_re">
        <el-button type="primary" @click="login">登录</el-button>
        <el-button type="info">重置</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import http from "../http";
export default {
  props: {},
  data() {
    return {
      username:'',
      password:''
    };
  },
  methods: {
    login() {
      http({
        url: "login",
        method: "post",
        data: {
          username: "admin",
          password: "123456",
        },
      }).then((res) => {
        console.log(res);
        sessionStorage.setItem("token", res.data.token);
      });
    },
  },
  components: {},
};
</script>

<style scoped lang="scss">
.bg {
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #2b4b6b;
  box-sizing: border-box;
}
.box {
  background-color: #fff;
  width: 450px;
  height: 300px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-sizing: border-box;
  padding: 30px;
  img{
      position: absolute;
      top: -80px;
      left: 50%;
      transform: translate(-50%);
      width: 130px;
      height: 130px;
      background-color: black;
      border: solid #fff 11px;
      border-radius: 50%;
      box-shadow: 0 0 5px #666;
  }
  .input{
    height: 38px;
    padding: 0 30px;
    margin-top: 32px;
    box-sizing: border-box;
    &:nth-child(2){
        margin-top: 70px;
    }
  }
  .lo_re{
      float: right;
      margin-top: 30px;
  }
}
</style>
