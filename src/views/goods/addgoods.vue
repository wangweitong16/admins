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

    <!-- <el-tabs tab-position="left" style="height: 440px" class="thetabs">
      
      <el-tab-pane label="商品图片">
        <el-upload
          class="upload-demo"
          action="http://127.0.0.1:8888/api/private/v1/"
          :headers="headers"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-error="toerr"
          :file-list="fileList"
          list-type="picture"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">
            只能上传jpg/png文件，且不超过500kb
          </div>
        </el-upload>
      </el-tab-pane>
      <el-tab-pane label="商品内容">商品内容</el-tab-pane>
    </el-tabs> -->

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
          :on-remove="handleRemove"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-tab-pane>

      <el-tab-pane label="商品内容" name="4"><!-- 商品描述面板 --></el-tab-pane>
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
      // 商品参数
      http({
        url: `categories/${numid}/attributes`,
        params: {
          sel: "many",
        },
      }).then((res) => {
        // console.log(res);
        this.parameter = res.data;
      });
      // 商品属性
      http({
        url: `categories/${numid}/attributes`,
        params: {
          sel: "only",
        },
      }).then((res) => {
        // console.log(res);
        this.property = res.data;
      });
    },
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
  }
}
</style>
