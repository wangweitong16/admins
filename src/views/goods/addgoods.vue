<template>
  <div class="addgoods">
    <!-- 消息提示的文案 -->
    <el-alert
      title="消息提示的文案"
      type="info"
      show-icon
      class="hint"
      :center="true"
      :closable="false"
    >
    </el-alert>
    <!-- 进度条 -->
    <el-steps
      :space="200"
      :active="active"
      finish-status="success"
      align-center
      class="steps"
    >
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>

    <!-- 标签页 -->
    <el-tabs
      tab-position="left"
      v-model="activeName"
      :before-leave="beforeTabLeave"
      class="thetabs"
    >
      <el-tab-pane label="基本信息" name="0">
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addFormRules"
          label-width="100px"
          label-position="top"
          class="demo-ruleForm"
        >
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="addForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="addForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="addForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="goods_cat">
            <el-cascader
              expand-trigger="hover"
              :options="cateList"
              v-model="addForm.goods_cat"
              @change="handleCascaderChange"
              :props="props"
            >
            </el-cascader>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="商品参数" name="1">
        <el-checkbox-group v-model="parameterValue">
          <div
            style="margin-top: 20px"
            v-for="item in parameter"
            :key="item.id"
          >
            <div style="font-size: 12px; line-height: 25px">
              {{ item.attr_name }}
            </div>
            <el-checkbox
              :label="item.attr_vals"
              border
              size="small"
            ></el-checkbox>
          </div>
        </el-checkbox-group>
      </el-tab-pane>

      <el-tab-pane label="商品属性" name="2">
        <el-form>
          <el-form-item
            :label="item.attr_name"
            v-for="item in property"
            :key="item.id"
          >
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="商品图片" name="3">
        <el-upload
          action="http://192.168.1.61:8888/api/private/v1/upload"
          :headers="uploadHeaders"
          list-type="picture"
          :on-success="handlesuccess"
          :on-remove="handleRemove"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-tab-pane>

      <el-tab-pane label="商品内容" name="4">
        <quill-editor @change="introduceChange">

        </quill-editor>
        <el-button type="primary" @click="addgoods">添加商品</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import http from "../../http";
export default {
  props: {},
  data() {
    return {
      theoptions: [],
      activeName: "0",
      active: 0,
      addForm: {
        goods_name: "",
        goods_price: "",
        goods_weight: "",
        goods_number: "",
        goods_cat: "",
        // goods_intro:'',
        pics:[],
      },
      addFormRules: {
        goods_name: [
          { required: true, message: "请填写商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请填写商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请填写商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请填写商品数量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },
      cateList: [],
      props: {
        value: "cat_id",
        label: "cat_name",
      },
      parameter: [],
      parameterValue: [],
      property: [],
      previewImgSrc: "",
      intro:''
    };
  },
  methods: {
    // 图片文件移除
    handleRemove(file,fileList) {
      console.log(file,fileList);
      const index = fileList.findIndex(
        (item) => item.pic === file.response.data.tmp_path
      );
      console.log(index)
      // 根据索引删除对应的图片信息对象
      fileList.splice(index, 1);
      // console.log(fileList)
    },
    handlesuccess(res){
      this.addForm.pics.push({ pic: res.data.tmp_path})
    },

    // 标签页改变
    beforeTabLeave(activeName) {
      if (activeName >= 1) {
        for (const key in this.addForm) {
          if (!this.addForm[key]) {
            this.$message({
              message: this.addFormRules[key][0].message,
              type: "error",
            });
            return false;
          }
        }
      }
      this.active = activeName - 0;
    },
    handleCascaderChange() {
      const numid = [...this.addForm.goods_cat].pop();
      // 商品参数  动态
      http({
        url: `categories/${numid}/attributes`,
        params: {
          sel: "many",
        },
      }).then((res) => {
        console.log(res);
        this.parameter = res.data;
      });
      // 商品属性  静态
      http({
        url: `categories/${numid}/attributes`,
        params: {
          sel: "only",
        },
      }).then((res) => {
        console.log(res);
        this.property = res.data;
      });
    },
    // 富文本
    introduceChange(v){
      // console.log(v.html)
      this.intro = v.html
    },
    // 商品添加
    addgoods(){
      // console.log(this.addForm,//基本信息
      // this.parameterValue,//商品参数
      // this.property,//商品属性
      // this.addForm.pics,//图片
      // this.intro) //介绍
      let goods_cat = [...this.addForm.goods_cat].join()
      let v1 = [...this.parameterValue]
      let attrs = [];
      for (const iterator of v1) {
        attrs.push({attr_value:iterator})
      }
      console.log(this.property)
      // console.log('静态',[{attr_value:...this.parameterValue}])
      http({
        url:'goods',
        method:'post',
        data:{
          goods_name:this.addForm.goods_name,
          goods_cat,
          goods_price:this.addForm.goods_price,
          goods_number:this.addForm.goods_number,
          goods_weight:this.addForm.goods_weight,
          goods_introduce:this.intro,
          pics:this.addForm.pics,
          attrs
        }
      }).then(res=>console.log(res))
    }
  },
  components: {},
  mounted() {
    http({
      url: "categories",
    }).then((res) => {
      this.cateList = res.data;
      // console.log(res);
    });
  },
  computed: {
    uploadHeaders() {
      return {
        Authorization:sessionStorage.token
      };
    },
  },
};
</script>

<style scoped lang="scss">
.addgoods {
  padding: 15px 20px;
  overflow: hidden;
  .steps {
    margin: 20px 0;
  }
  .thetabs {
    ::v-deep .el-form-item__label {
      text-align: left;
      font-size: 12px;
      padding: 0;
      line-height: 30px;
    }
    ::v-deep .el-input__inner {
      height: 35px;
    }
    ::v-deep .el-form-item {
      margin-bottom: 18px;
    }
    ::v-deep .ql-container {
      height: 200px;
    }
  }
}
</style>
