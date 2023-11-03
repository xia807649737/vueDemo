<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :before-close="() => $emit('cancel')"
    width="600px"
    destroy-on-close
    @close="() => $emit('cancel')"
  >
    <el-form ref="unitForm" label-position="right" :rules="rules" label-width="80px" :model="formUnit">
      <el-form-item label="部门名称" prop="deptName">
        <el-input v-model="formUnit.deptName" :disabled="true" placeholder="请输入单位名称" />
      </el-form-item>
      <el-form-item label="备注" prop="deptDetail">
        <el-input v-model="formUnit.deptDetail" disabled :rows="5" type="textarea" placeholder="角色描述" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="$emit('cancel')">取 消</el-button>
      <el-button size="small" type="primary" @click="handleSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: 'viewUnitDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {}
    },
    title: {
      type: String,
      default: '查看单位'
    }
  },
  data() {
    return {
      formUnit: {
        name: '',
        regionLevel: '',
        description: ''
      },
      rules: {
        // name: [{ required: true, message: '请输入类别名称', trigger: 'blur' }],
        // regionLevel: [{ required: true, message: '请选择级别定位', trigger: 'blur' }]
      }
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.formUnit = { ...this.data }
      }
    }
  },
  methods: {
    handleSubmit() {
      this.$emit('cancel')
      // this.$refs.unitForm.validate(valid => valid && this.$emit('ok', this.formUnit))
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-form-item__content {
  text-align: center;
}
</style>