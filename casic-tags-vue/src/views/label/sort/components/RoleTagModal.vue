<template>
  <el-dialog
    :title="title"
    width="600px"
    :visible.sync="visible"
    :before-close="() => $emit('cancel')"
    destroy-on-close
    @close="() => $emit('cancel')"
  >
    <div class="form-body">
      <el-form ref="ruleForm" label-position="right" :rules="rules" label-width="80px" :model="formRole">
        <el-form-item label="分类名称" prop="categoryName">
          <el-input v-model="formRole.categoryName" placeholder="类别名称" />
        </el-form-item>
        <el-form-item label="所属分类" prop="parentCategoryId">
          <tree-select
            v-model="formRole.parentCategoryId"
            :default-expand-level="1"
            :options="list"
            :max-height="400"
            placeholder="请输入分类名称..."
            no-results-text="没有匹配的搜索结果"
            @select="handleSelect"
            @deselect="deselect"
          />
        </el-form-item>
        <el-form-item label="备注" prop="ext2">
          <el-input v-model="formRole.ext2" :rows="5" type="textarea" placeholder="请输入备注（可选）" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="$emit('cancel')">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import TreeSelect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'RoleTagModal',
  components: {
    TreeSelect
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {}
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      title: '添加分类',
      formRole: {
        categoryId: '',
        categoryName: '',
        categoryLevel: 1,
        parentCategoryId: null,
        ext2: ''
      },
      rules: {
        categoryName: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
        parentCategoryId: [{ required: true, message: '请选择所属分类', trigger: 'change' }]
      }
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.formRole = this.data || {}
        if (this.formRole.categoryId) {
          this.title = '编辑分类'
        } else {
          this.title = '添加分类'
        }
      }
    }
  },
  created() {
  },
  methods: {
    handleSubmit() {
      this.$refs.ruleForm.validate(valid => valid && this.$emit('ok', this.formRole))
    },
    handleSelect(node) {
      this.formRole.parentCategoryId = node.categoryId
      this.$nextTick(() => {
        this.$refs.ruleForm.validateField('parentCategoryId')
      })
      if (node) this.formRole.categoryLevel = node.categoryLevel + 1
    },
    deselect() {
      this.$nextTick(() => {
        this.$refs.ruleForm.validateField('parentCategoryId')
      })
      this.formRole.categoryLevel = null
    }
  }
}
</script>
<style lang="scss" scoped>
 .form-body {
   width: 560px;
 }
 .dialog-footer {
   text-align: right;
 }
 .select-body {
    display: none;
    width: 400px;
    position: absolute;
    right: 0;
    top: 0px;
    min-height: 500px;
    background: #f4f8fb;
    padding-left: 10px;
 }
 .select-title {
    border-bottom: 1px solid #c0c4cc;
    height: 55px;
    /* text-align: center; */
    background: white;
    line-height: 55px;
    padding-left: 10px;
    font-size: 18px;
    color: #303133;
}
.white {
  background: #fff;
}
.select-context {
  height: 542px;
  padding: 10px;
  margin-bottom: 15px;
}

 .form-tags {
   position: relative;
 }
 .form-tags-btn {
   position: absolute;
   right: 0px;
   top: 0px;
 }
 .show-select {
   display: block;
 }
</style>
<style>
.el-dialog__header{
   border-bottom: 1px solid #c0c4cc;
 }
</style>
