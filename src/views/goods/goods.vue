<template>
  <div class="box">
    <!-- 面包屑 -->
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb> -->
    <!-- 搜索 -->
    <div class="top">
      <div class="tosearch">
        <input v-model="search" placeholder="请输入内容" class="search" />
        <el-button icon="el-icon-search" @click="tosearch"></el-button>
      </div>
      <el-button type="primary" class="toadd" @click="toadd"
        >添加商品</el-button
      >
    </div>
    <!-- 商品列表 -->
    <div class="list">
      <el-row>
        <el-col :span="1"><div class="grid-content bg-purple">#</div></el-col>
        <el-col :span="13"
          ><div class="grid-content bg-purple-light">商品名称</div></el-col
        >
        <el-col :span="2"
          ><div class="grid-content bg-purple">商品价格(元)</div></el-col
        >
        <el-col :span="2"
          ><div class="grid-content bg-purple-light">商品重量</div></el-col
        >
        <el-col :span="3"
          ><div class="grid-content bg-purple">创建时间</div></el-col
        >
        <el-col :span="3"
          ><div class="grid-content bg-purple-light">操作</div></el-col
        >
      </el-row>
      <el-row v-for="(item, index) in list" :key="item.add_time">
        <el-col :span="1"
          ><div class="grid-content bg-purple">{{ index + 1 }}</div></el-col
        >
        <el-col :span="13"
          ><div class="grid-content bg-purple-light">
            <input type="text" v-model="item.goods_name" v-if="item.is_promote" class="update"/>
            <span v-else> {{ item.goods_name }} </span>
          </div></el-col
        >
        <el-col :span="2"
          ><div class="grid-content bg-purple">
            <input type="text" v-model="item.goods_price" v-if="item.is_promote" class="update"/>
            <span v-else>{{ item.goods_price }}</span>
          </div></el-col
        >
        <el-col :span="2"
          ><div class="grid-content bg-purple-light">
            <input type="text" v-model="item.goods_weight" v-if="item.is_promote" class="update"/>
            <span v-else>{{ item.goods_weight }}</span>
          </div></el-col
        >
        <el-col :span="3"
          ><div class="grid-content bg-purple">
            {{ item.add_time | comTime }}
          </div></el-col
        >
        <el-col :span="3"
          ><div class="grid-content bg-purple-light">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="toupda(item)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="todel(item)"
            ></el-button></div
        ></el-col>
      </el-row>
    </div>
    <!-- 分页器 -->
    <div class="block">
      <el-pagination
        background
        @size-change="sizechange"
        @current-change="page"
        :current-page="pagenum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :hide-on-single-page="true"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import http from "../../http";
export default {
  props: {},
  data() {
    return {
      list: [],
      pagenum: 1,
      pagesize: 10,
      total: 0,
      search: "",
    };
  },
  methods: {
    // 获取列表
    gainlist() {
      http({
        url: "goods",
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize,
        },
      }).then((res) => {
        // console.log(res);
        this.list = res.data.goods;
        this.total = res.data.total;
      });
    },
    // 分页器
    page(v) {
      this.pagenum = v;
      this.gainlist();
    },
    sizechange(v) {
      this.pagesize = v;
      this.gainlist();
    },
    // 修改，删除
    toupda(item) {
      item.is_promote = !item.is_promote;
      console.log(item);
      if(!item.is_promote){
        http({
          url:`goods/${item.goods_id}`,
          method:'put',
          data:{
            goods_name:item.goods_name,
            goods_price:item.goods_price,
            goods_weight:item.goods_weight,
            goods_number:item.goods_number,
            goods_introduce:item.goods_introduce,
            pics:item.pics,
            attrs:item.attrs,
          }
        }).then(res=>{
          console.log(res)
          this.gainlist()
        })
      }
    },
    todel(item) {
      // console.log(item)
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          http({
            url: `goods/${item.goods_id}`,
            method: "delete",
          }).then(() => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.gainlist()
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 搜索
    tosearch() {
      http({
        url: `goods/${this.search}`,
      }).then((res) => {
        // console.log(res)
        // this.pagenum = 1
        this.total = 1;
        this.list = [res.data];
      });
    },
    // 添加商品
    toadd() {
      this.$router.push("/home/addgoods");
    },
  },
  components: {},
  mounted() {
    this.gainlist();
  },
  filters: {
    comTime(time) {
      var date = new Date(parseInt(time));
      var year = date.getFullYear();
      var mon = date.getMonth() + 1;
      var day = date.getDate();
      var hours = date.getHours();
      var min = date.getMinutes();
      var sec = date.getSeconds();
      return year + "-" + mon + "-" + day + " " + hours + ":" + min + ":" + sec;
    },
  },
};
</script>

<style scoped lang="scss">
.box {
  font-size: 12px;
  padding-bottom: 20px;
}
.top {
  overflow: hidden;
  padding: 15px 20px;
  padding-bottom: 0;
  .tosearch {
    float: left;
    border: #dcdfe6 solid 1px;
    display: inline-block;
    padding-left: 20px;
    box-sizing: border-box;
    border-radius: 5px;
    overflow: hidden;
    height: 38px;
    .search {
      outline: none;
      height: 38px;
      width: 288px;
      border: none;
    }
    button {
      box-sizing: border-box;
      border: none;
      height: 38px;
      border-left: 1px solid #dcdfe6;
      border-radius: 0;
    }
  }
  .toadd {
    float: left;

    margin-left: 50px;
  }
}
.list {
  padding: 15px 20px;
}
.block {
  padding-left: 20px;
}
.el-row {
  margin-bottom: 20px;
  margin: 0;
  box-sizing: border-box;
  border-left: 1px solid #ebeef5;
  border-top: 1px solid #ebeef5;
  &:last-child {
    margin-bottom: 0;
    border-bottom: 1px solid #ebeef5;
  }
  &:nth-child(2n) {
    > .el-col {
      > div {
        background-color: #f5f7fa;
        border-radius: 0;
      }
    }
  }
  .el-col {
    > div {
      border-right: 1px solid #ebeef5;
      line-height: 40px;
      .el-button {
        width: 44px;
        height: 28px;
        padding: 0;
      }
    }
  }
}
.el-col {
  height: 40px;
  > div {
    padding: 0 10px;
    white-space: nowrap;
    background-color: #fff;
  }
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.update{
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  background-color: #F5F7FA;
}
</style>
