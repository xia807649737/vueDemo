<template>
  <el-dialog
    top="30px"
    :show-close="false"
    :title="title"
    :width="width"
    :visible.sync="visible"
    :before-close="() => $emit('cancel')"
    destroy-on-close
    @close="() => $emit('cancel')"
  >
    <div class="form-body">
      <el-form ref="ruleForm" label-position="right" :rules="rules" label-width="80px" :model="formRole">
        <el-form-item label="颗粒名称" prop="atomName">
          <el-input v-model="formRole.atomName" placeholder="颗粒名称" />
        </el-form-item>
        <el-form-item label="所属分类" prop="parentCategoryId">
          <tree-select
            v-model="formRole.parentCategoryId"
            :options="list"
            :default-expand-level="1"
            :max-height="400"
            placeholder="请输入分类名称..."
            no-results-text="没有匹配的搜索结果"
            @select="handleSelect"
            @deselect="deselect"
          />
        </el-form-item>
        <el-form-item label="打标规则" prop="tagRule">
          <el-input v-model="formRole.tagRule" :rows="5" type="textarea" placeholder="请输入打标规则（若删除打标规则，则需对历史数据重新打标）" />
        </el-form-item>
        <el-form-item label="打标周期" prop="ext2">
          <el-cascader
            v-model="formRole.ext2"
            style="width: 100%"
            :options="arr"
          />
        </el-form-item>
        <el-form-item label="标签状态" prop="taskStatus">
          <el-select v-model="formRole.taskStatus" style="width: 100%">
            <el-option key="0" :value="0" label="停用标签" />
            <el-option key="1" :value="1" label="启用标签" />
          </el-select>
        </el-form-item>
        <el-form-item label="其他选项" prop="checkList">
          <el-checkbox-group v-model="formRole.checkList">
            <el-checkbox label="0">重点人标签</el-checkbox>
            <el-checkbox label="1">属于法定标签</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="标签定义" prop="tagCode">
          <el-input v-model="formRole.tagCode" :rows="5" type="textarea" placeholder="请输入标签定义（可选）" />
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
import { getArr } from './tree'

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
      arr: getArr(),
      title: '添加颗粒',
      width: '600px',
      formRole: {
        atomId: '',
        atomName: '',
        parentCategoryId: null,
        countRule: '',
        atomStatus: '',
        tagRule: '',
        ext2: '',
        taskStatus: '',
        atomKeyPerson: '',
        tagCode: '',
        checkList: []
      },
      rules: {
        atomName: [{ required: true, message: '请输入颗粒名称', trigger: 'blur' }],
        parentCategoryId: [{ required: true, message: '请选所属类别', trigger: 'blur' }],
        tagRule1: [{ required: true, message: '请输入打标规则', trigger: 'blur' }],
        ext21: [{ required: true, message: '请输入打标周期', trigger: 'change' }],
        atomStatus: [{ required: true, message: '请选择标签状态', trigger: 'change' }]
      }
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.formRole = this.data
        if (this.formRole.atomId) {
          this.title = '编辑颗粒'
        } else {
          this.title = '添加颗粒'
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
      this.$nextTick(() => {
        this.$refs.ruleForm.validateField('parentCategoryId')
      })
      if (node) this.formRole.atomLevel = node.categoryLevel
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
