<template>
  <div class="home">
    <el-container>
      <el-header class="header">
        <span>电商管理系统</span>
        <button>退出</button>
      </el-header>
      <el-container>
        <el-aside width="198px">
          <el-col>
            <el-menu
              class="el-menu-vertical-demo"
              :unique-opened="isopen"
              :router="isrouter"
              :default-active="open_submenu"
              :default-openeds="open_menu"
              background-color="#333744"
              text-color="#fff"
              active-text-color="#ffd04b"
            >
              <!-- <el-submenu index="item.id" v-for="item in list" :key="item.id">
              <template slot="title">
                  <i class="el-icon-user-solid"></i>
                  <span slot="title">{{item.authName}}</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item :index="ite.path" v-for="ite in item" :key="ite.id">
                    <i class="el-icon-menu"></i>{{ite.authName}}</el-menu-item
                  >
                </el-menu-item-group>
            </el-submenu> -->
              <!-- 用户管理 -->
              <el-submenu index="1">
                <template slot="title">
                  <i class="el-icon-user-solid"></i>
                  <span slot="title">用户管理</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="1-1">
                    <i class="el-icon-menu"></i> 用户列表</el-menu-item
                  >
                </el-menu-item-group>
              </el-submenu>
              <!-- 权限管理 -->
              <el-submenu index="2">
                <template slot="title">
                  <i class="el-icon-receiving"></i>
                  <span slot="title">权限管理</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="1-1"
                    ><i class="el-icon-menu"></i> 角色列表</el-menu-item
                  >
                  <el-menu-item index="1-2"
                    ><i class="el-icon-menu"></i> 权限列表</el-menu-item
                  >
                </el-menu-item-group>
              </el-submenu>
              <!-- 商品管理 -->
              <el-submenu index="3">
                <template slot="title">
                  <i class="el-icon-s-goods"></i>
                  <span slot="title">商品管理</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="/home/goods"
                    ><i class="el-icon-menu"></i> 商品列表</el-menu-item
                  >
                  <el-menu-item index="/home/params"
                    ><i class="el-icon-menu"></i> 分类参数</el-menu-item
                  >
                  <el-menu-item index="/home/categories"
                    ><i class="el-icon-menu"></i> 商品分类</el-menu-item
                  >
                </el-menu-item-group>
              </el-submenu>
              <!-- 订单管理 -->
              <el-submenu index="4">
                <template slot="title">
                  <i class="el-icon-s-order"></i>
                  <span slot="title">订单管理</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="1-1"
                    ><i class="el-icon-menu"></i> 订单列表</el-menu-item
                  >
                </el-menu-item-group>
              </el-submenu>
              <!-- 数据统计 -->
              <el-submenu index="5">
                <template slot="title">
                  <i class="el-icon-s-marketing"></i>
                  <span slot="title">数据统计</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="1-1"
                    ><i class="el-icon-menu"></i> 数据报表</el-menu-item
                  >
                </el-menu-item-group>
              </el-submenu>
            </el-menu>
          </el-col>
        </el-aside>
        <el-main>
          <div class="title"></div>
          <div class="main_content">
            <!-- 内容区域 内容区域 内容区域 内容区域 内容区域 内容区域 -->
            <router-view />
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import http from "./../http";
export default {
  props: {},
  data() {
    return {
      list: [],
      isopen: true,
      isrouter: true,
      open_menu: [],
      open_submenu: "",
    };
  },
  methods: {},
  components: {},
  mounted() {
    http({
      url: "menus",
    }).then((res) => {
      // console.log(res);
      this.list = res.data.list;
      if (res.data.list) {
        this.open_menu.push(res.data.list[0].id);
        this.open_submenu = res.data.list[0].children[0].id;
      }
    });
  },
};
</script>

<style scoped lang="scss">
.home {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
  .el-container {
    width: 100%;
    height: 100%;
    .el-header {
      background-color: #373d41;
      display: flex;
      height: 55px;
      justify-content: space-between;
      align-items: center;
      color: #fff;
      font-size: 20px;
      button {
        background-color: #afb0b1;
        border: none;
        height: 35px;
        width: 70px;
      }
    }
    .el-aside {
      background-color: #333744;
      overflow: hidden;
      .el-menu-vertical-demo {
        width: 100%;
        height: 100%;
        background-color: #333744;
      }
    }
    .el-main {
      background-color: #eaedf1;
      padding: 0 20px;
      box-sizing: border-box;
      padding-bottom: 100px;
      .main_content {
        background-color: #fff;
      }
    }
    .el-main > .title {
      height: 50px;
      width: 100%;
      background-color: #eaedf1;
    }
  }
}
</style>
