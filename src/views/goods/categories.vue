<template>
  <!-- 商品分类 -->
  <div class="categories">
    <el-button type="primary" @click="toaddClassify">添加分类</el-button>
    <!-- 添加/编辑分类 -->
    <el-dialog :visible.sync="dialogVisible">
      <el-form
        ref="form"
        :model="form"
        label-width="80px"
        class="addclassify"
        :rules="rules"
      >
        <div>{{ addClassifyName }}</div>
        <el-form-item label="分类名称" class="name" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="form.value"
            :options="options"
            @change="handleChange"
            :props="props"
            class="cascader"
            :disabled="disabled"
          ></el-cascader>
        </el-form-item>
        <div>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addClassify">确定</el-button>
        </div>
      </el-form>
    </el-dialog>
    <!-- 表格 -->
    <el-table
      :data="tableData"
      style="width: 100%; margin-bottom: 20px"
      row-key="cat_id"
      border
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      class="table"
    >
      <el-table-column label="#" width="80" type="index"></el-table-column>
      <el-table-column prop="cat_name" label="分类名称"></el-table-column>
      <el-table-column prop="address" label="是否有效"
        ><i class="el-icon-success"></i>
      </el-table-column>
      <el-table-column label="排序">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-tag
              size="medium"
              :type="
                scope.row.cat_level
                  ? scope.row.cat_level == 1
                    ? 'success'
                    : 'warning'
                  : ''
              "
              >{{ scope.row.cat_level | titlebar }}</el-tag
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="updateClassify(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="todelete(scope.row.cat_id)"
              >删除</el-button
            >
          </div>
        </template>
      </el-table-column>

      <!-- 编辑框 -->
      <!-- <el-dialog :visible.sync="compilebox">
        <el-form
          ref="form"
          :model="form"
          label-width="80px"
          class="compilebox"
          :rules="rules"
        >
          <div>编辑分类</div>
          <el-form-item label="分类名称" class="name" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <div>
            <el-button @click="compilebox = false">取消</el-button>
            <el-button type="primary" @click="updateClassify">确定</el-button>
          </div>
        </el-form>
      </el-dialog> -->
    </el-table>
    <!-- 分页器  -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      v-if="total >= 1"
    >
    </el-pagination>
  </div>
</template>

<script>
import http from "./../../http";
export default {
  props: {},
  data() {
    return {
      // 添加表单
      form: {
        name: "",
        value: "",
        // 编辑
        id: 0,
      },
      rules: {
        name: [{ required: true, message: "请输入分类名称", trigger: "blur" }],
      },
      addClassifyName: "添加分类",
      // 遮罩层 (添加商品)
      dialogVisible: false,
      // 级联数据
      options: [],
      props: {
        label: "cat_name",
        value: "cat_id",
        checkStrictly: true,
      },
      disabled: false,
      // 列表数据
      tableData: [],
      //   页数
      pagenum: 1,
      //   每页条数
      pagesize: 5,
      //   全部条数
      total: 0,
    };
  },
  methods: {
    //   获取列表
    gainlist() {
      http({
        url: "categories",
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize,
        },
      }).then((res) => {
        // console.log(res);
        this.tableData = res.data.result;
        this.total = res.data.total;
      });
    },
    // 添加分类
    toaddClassify() {
      this.addClassifyName = "添加分类";
      this.form.name = "";
      this.dialogVisible = true;
      this.disabled = false;
    },
    // 添加/编辑分类提交
    addClassify() {
      let cat_pid = 0;
      let cat_level = 0;
      if (this.form.value) {
        cat_pid = this.form.value.pop();
        cat_level = this.form.value.length;
      }
      if (!this.disabled) {
        http({
          url: "categories",
          method: "post",
          data: {
            cat_name: this.form.name,
            cat_pid,
            cat_level,
          },
        }).then((res) => {
          // console.log(res);
          if (res.meta.status === 201) {
            this.dialogVisible = false;
            this.$message({
              message: res.meta.msg,
              type: "success",
            });
          } else {
            this.$message({
              message: res.meta.msg,
              type: "error",
            });
          }
        });
      } else {
        http({
          url: `categories/${this.form.id}`,
          method: "put",
          data: {
            cat_name: this.form.name,
          },
        }).then((res) => {
          // console.log(res)
          if (res.meta.status == 200) {
            this.$message({
              type: "success",
              message: res.meta.msg,
            });
            this.dialogVisible = false;
            this.gainlist();
          }
        });
      }
    },
    // 每页条数改变
    handleSizeChange(v) {
      this.pagesize = v;
      this.gainlist();
    },
    // 页数改变
    handleCurrentChange(v) {
      this.pagenum = v;
      this.gainlist();
    },
    // 删除操作(未验证)
    todelete(item) {
      // console.log(item);
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          http({
            url: `categories/${item}`,
            method: "delete",
          }).then(() => {
            // console.log(res);
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.gainlist();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 级联选择器
    handleChange() {},
    // 编辑
    updateClassify(item) {
      this.form.id = item.cat_id;
      this.addClassifyName = "编辑分类";
      this.form.name = item.cat_name;
      this.dialogVisible = true;
      this.disabled = true;
    },
  },
  mounted() {
    this.gainlist();
    // 级联数据
    http({
      url: "categories",
      params: {
        type: "1,2",
      },
    }).then((res) => {
      // console.log(res);
      this.options = res.data;
    });
  },
  filters: {
    titlebar(v) {
      //   console.log(v);
      if (v == 0) {
        return "一级";
      } else if (v == 1) {
        return "二级";
      } else {
        return "三级";
      }
    },
  },
};
</script>

<style scoped lang="scss">
.categories {
  padding: 15px 20px;
}

// 添加分类/编辑
.addclassify,
.compilebox {
  .name {
    margin-top: 50px;
  }
  .cascader {
    width: 100%;
  }
}
::v-deep .el-dialog__body {
  padding-top: 0;
}
// 表格
.table {
  margin-top: 15px;
  .el-icon-success {
    color: #90ee90;
  }
}
</style>
