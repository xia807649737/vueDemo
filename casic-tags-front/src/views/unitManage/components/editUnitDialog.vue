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
      <el-form-item label="单位名称" prop="unitName">
        <el-input v-model="formUnit.unitName" placeholder="请输入单位名称" />
      </el-form-item>
      <el-form-item label="上级单位" v-if="title === '新增下级单位' || (title === '修改单位' && formUnit.parentUnitId && formUnit.parentUnitId !== '0')" prop="parentUnitId">
        <el-select v-model="formUnit.parentUnitId" :disabled="title === '修改单位'" style="width: 100%">
          <el-option
            v-for="item in unitsOptions"
            :key="item.unitId"
            :value="item.unitId"
            :label="item.unitName"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="unitDetail">
        <el-input v-model="formUnit.unitDetail" :rows="5" type="textarea" placeholder="角色描述" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="$emit('cancel')">取 消</el-button>
      <el-button size="small" type="primary" @click="handleSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getAllUnitIdAndNames, } from '@/api/unitManage'
export default {
  name: 'editUnitDialog',
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
      default: '新增主单位'
    }
  },
  data() {
    return {
      formUnit: {},
      rules: {
        unitName: [{ required: true, message2: '单位名称', trigger: 'blur', validator: this.validateChinese }],
        unitDetail: [{ message2: '备注', trigger: 'blur', validator: this.validateStringAndChinese }]
      },
      unitsOptions: []
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.formUnit = {...this.data}
        // 获取角色列表
        this.getAllUnitIdAndNames()
      }
    }
  },
  methods: {
    handleSubmit() {
      this.$refs.unitForm.validate(valid => valid && this.$emit('ok', this.formUnit))
    },
    // 查看角色列表数据
    async getAllUnitIdAndNames() {
      getAllUnitIdAndNames().then(res => {
        this.unitsOptions = res.result || []
      })
    },
    validateStringAndChinese(rule, value, callback) {
      // const reg = /^[\u4E00-\u9FA5A-Za-z_0-9]{0,100}$/
      if (!value) {
        // callback(new Error('请输入' + rule.message2))
        callback()
      } else {
        if (value.length > 100) {
          callback(new Error(rule.message2 + '应由100位以内的字符组成！'))
        } else {
          callback()
        }
      }
    },
    validateChinese(rule, value, callback) {
      const reg = /^[\u4E00-\u9FA5]{2,16}$/
      if (!value) {
        callback(new Error('请输入' + rule.message2))
      } else {
        if (!reg.test(value.trim())) {
          callback(new Error(rule.message2 + '应由2-16位以内的中文组成！'))
        } else {
          callback()
        }
      }
    },
  }
}
</script>
