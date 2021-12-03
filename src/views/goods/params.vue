<template>
  <div class="params">
    <!-- 警告 -->
    <el-alert
      title="注意：只允许为第三级分类设置相关参数！"
      type="warning"
      show-icon
      :closable="false"
    >
    </el-alert>
    <!-- 级联选择器 -->
    <div class="block">
      <span>选择商品分类:</span>
      <el-cascader
        v-model="selectorValue"
        :options="options"
        @change="handleChange"
        class="selector"
        :props="selectorProps"
        :multiple='false'
      ></el-cascader>
    </div>
  </div>
</template>

<script>
import http from '../../http'
export default {
  props: {},
  data() {
    return {
      options: [],
      selectorValue:'',
      selectorProps:{
          value:'cat_id',
          label:'cat_name',
      },
    };
  },
  methods: {
    //   静态参数、动态参数
      handleChange(){
        //   console.log(this.selectorValue.pop())
          http({
              url:`categories/${this.selectorValue.pop()}attributes`,
              params:{
                  sel:'only',
              }
          }).then(res=>console.log(res))
      },
  },
  components: {},
  mounted() {
    //   级联菜单
    http({
        url:'categories'
    }).then(res=>{
        // console.log(res)
        this.options = res.data
    })
  },
};
</script>

<style scoped lang="scss">
.params {
  padding: 15px 20px;
  .block {
      font-size: 14px;
      .selector{
          margin-left: 10px;
      }
  }
}
</style>
