<template>
  <div class="setting">
    <el-form
      v-loading="formLoading"
      ref="form"
      :model="form"
      :rules="rules"
      class="form-content"
      label-width="240px"
    >
      <!-- <div v-if="showDataio">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="guset" name="guest"> </el-tab-pane>
          <el-tab-pane label="host" name="host"></el-tab-pane>
        </el-tabs>
      </div> -->
      <div
        v-for="(value, key, index) in form"
        :key="index"
      >
        <el-form-item
          v-if="params[index] && params[index]['show'] === 1"
          :label="filteKey(params[index])"
          :prop="key"
        >
          <!-- boolean -->
          <el-radio-group
            v-if="params[index]['type'] === 'bool'"
            :disabled="!canEdit"
            v-model="form[key]"
          >
            <el-radio
              :label="true"
              :value="true"
            >是</el-radio>
            <el-radio
              :label="false"
              :value="false"
            >否</el-radio>
          </el-radio-group>
          <!-- list -->
          <el-select
            v-if="
              params[index]['enum'] &&
                params[index]['enum'].length &&
                params[index]['type'] !== 'bool'
            "
            :disabled="!canEdit"
            v-model="form[key]"
            placeholder="请选择"
            size="small"
            style="width:90%"
          >
            <el-option
              v-for="item in params[index]['enum']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
          <!-- int -->
          <el-input-number
            v-if="
              (params[index]['type'] === 'int' && !params[index]['enum']) ||
                (params[index]['type'] === 'float' && !params[index]['enum'])
            "
            :disabled="!canEdit"
            v-model="form[key]"
            :controls="false"
            size="small"
            style="width:90%"
          />
          <!-- string -->
          <el-input
            v-if="
              (params[index]['type'] === 'str'
                && params[index]['enum']
                && !params[index]['enum'].length)
                || (params[index]['type'] === 'str' && !params[index]['enum'])
                || (params[index]['type'] === 'list' && !params[index]['enum'])
                || (params[index]['type'] === 'list'
                && params[index]['enum']
                && params[index]['enum'].length === 0)
            "
            :disabled="!canEdit"
            v-model="form[key]"
            size="small"
            style="width:90%"
          />
          <el-input
            v-if="params[index]['type'] === 'json'"
            v-model="form[key]"
            :disabled="!canEdit"
            type="textarea"
            autosize
            style="width:90%"
          />
        </el-form-item>
      </div>
      <!-- <div v-if="paramsDataset && paramsDataset['init_param']" class="params-service-wrapper">
        <h3>初始参数(init_params)</h3>
        <el-form-item label="初始化方法" prop="init_method">
          <el-select v-model="form.init_param.init_method" :placeholder="'请选择' + paramsDataset.init_param.init_method.cn" size="small">
            <el-option v-for="(item,idx) in paramsDataset.init_param.init_method.values" :key="idx" :label="item" :value="item" />
          </el-select>
        </el-form-item>
      </div>
      <div v-if="paramsDataset && paramsDataset['iv_percentile_param']" class="params-service-wrapper">
        <h3>信息价值百分比参数(iv_percentile_param)</h3>
        <el-form-item label="阈值" prop="percentile_threshold">
          <el-input-number
            v-model="form.iv_percentile_param.percentile_threshold"
            :controls="false"
            :precision="2"
            size="small"
            style="width:90%"
          />
        </el-form-item>
      </div>
      <div v-if="paramsDataset && paramsDataset['iv_value_param']" class="params-service-wrapper">
        <h3>信息价值参数(iv_value_param)</h3>
        <el-form-item label="阈值" prop="value_threshold">
          <el-input-number
            v-model="form.iv_value_param.value_threshold"
            :controls="false"
            :precision="2"
            size="small"
            style="width:90%"
          />
        </el-form-item>
      </div>
      <div v-if="paramsDataset && paramsDataset['manually_param']" class="params-service-wrapper">
        <h3>自定义选择特征(manually_param)</h3>
        <el-form-item label="去除列" prop="filter_out_indexes">
          <el-input
            v-model="form.manually_param.filter_out_indexes"
            size="small"
            style="width:90%"
          />
        </el-form-item>
      </div>
      <div v-if="paramsDataset && paramsDataset['cv_param']" class="params-service-wrapper">
        <h3>交叉验证参数(cv_param)</h3>
        <el-form-item label="K折数" prop="n_splits">
          <el-input-number
            v-model="form.cv_param.n_splits"
            :controls="false"
            :precision="0"
            size="small"
            style="width:90%"
          />
        </el-form-item>
        <el-form-item label="need_cv" prop="need_cv">
          <el-radio-group v-model="form.cv_param.need_cv">
            <el-radio :label="true" :value="true">是</el-radio>
            <el-radio :label="false" :value="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="随机种子" prop="random_seed">
          <el-input-number
            v-model="form.cv_param.random_seed"
            :controls="false"
            :precision="0"
            size="small"
            style="width:90%"
          />
        </el-form-item>
        <el-form-item label="shuffle" prop="shuffle">
          <el-radio-group v-model="form.cv_param.shuffle">
            <el-radio :label="true" :value="true">是</el-radio>
            <el-radio :label="false" :value="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </div> -->
      <!-- <div v-if="paramsDataset && paramsDataset['variance_coe_param']" class="params-service-wrapper">
        <h3>方差选择法变量参数(variance_coe_param)</h3>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="方差阈值" prop="value_threshold">
              <el-input-number
                v-model="form.variance_coe_param.value_threshold"
                :controls="false"
                :precision="2"
                size="small"
                style="width:90%"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div> -->
    </el-form>
    <div class="flex justify-center btn-footer">
      <el-button
        size="small"
        @click="closeDialog"
      >{{ canEdit ? '取 消' : '关 闭' }}</el-button>
      <el-button
        v-if="canEdit"
        size="small"
        type="primary"
        style="margin-left: 23px;"
        @click="handleSubmit"
      >保 存</el-button>
    </div>
  </div>
</template>

<script>
/* eslint-disable */

import _ from 'lodash'
import { paramsApi } from '@/api/flow'

const translateType = {
  int: 'blur',
  float: 'blur',
  text: 'blur',
  list: 'change',
  boolean: 'change'
}

export default {
  name: 'ParamsModel',
  props: ['config', 'canEdit'],
  data() {
    return {
      rules: {},
      form: {},
      nodeName: '',
      configJson: null,
      showDialog: false,
      formLoading: false,
      paramsDataset: null,
      translateType,
      params: [],
      noShowParams: [],
      activeName: 'guest',
      guestForm: {},
      hostForm: {}
    }
  },
  computed: {
    showDataio() {
      return ['dataio'].includes(this.nodeName.split('_')[0])
    }
  },
  watch: {
    // form: {
    //   handler(value) {
    //     console.log(value, "6666");
    //     if (this.showDataio) {
    //       console.log(value, "form watch");
    //       if (this.activeName === "guest") {
    //         this.guestForm = value;
    //       } else {
    //         this.hostForm = value;
    //       }
    //     }
    //   },
    //   deep: true
    // }
  },
  methods: {
    handleClick(tab, event) {
      // this.$refs.form.resetFields();
      console.log(
        this.guestForm,
        'this.guestForm',
        this.hostForm,
        'this.hostForm'
      )
      this.form =
        this.activeName === 'guest'
          ? { ...this.guestForm }
          : { ...this.hostForm }
    },
    show({ label, cfg }) {
      this.nodeName = label.toLowerCase()
      // console.log(this.nodeName, "777");
      if (!cfg) {
        this.form = {}
        return false
      }

      // this.mapFn(cfg)
      // 清空
      this.rules = {}
      this.form = {}
      this.params = []
      this.showDialog = true
      this.formLoading = true
      // this.paramsDataset = null
      cfg.sort(function (s, t) {
        var a = s.key.toLowerCase()
        var b = t.key.toLowerCase()
        if (a < b) return -1
        if (a > b) return 1
        return 0
      })
      this.params = [...cfg]
      console.log(this.params, 'params--shw')
      this.params.map((item, index) => {
        console.log('params.map', item)
        let key = this.filteKey(item)
        // console.clear()
        // console.log(key, 'key', index)
        let value
        if (item.type === 'json') {
          // 可能已经转为字符串了 所以需要判断一下
          value =
            typeof item.default == 'string'
              ? item.default
              : JSON.stringify(item.default)
        } else {
          value = Array.isArray(item.default)
            ? item.default.toString()
            : item.default
        }
        if (value === null) {
          value = undefined
        }

        console.log(key, index, 'key --- item.subkey', item.sub_key, value)
        this.$set(this.form, key, value)
      })
      console.log(this.form, 'wade')
      if (this.showDataio) {
        this.guestForm = this.form
        this.hostForm = this.form
      }
      this.formLoading = false
    },
    closeDialog() {
      this.showDialog = false
      this.$emit('paramsResult', 'cancle')
    },
    isNumber(val) {
      var regPos = /^\d+(\.\d+)?$/ //非负浮点数
      var regNeg =
        /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/ //负浮点数
      if (regPos.test(val) || regNeg.test(val)) {
        return true
      } else {
        return false
      }
    },
    filteKey(item) {
      let key
      if (item.key) {
        key = item.key
        if (item.sub_key) {
          key = `${item.key}/${item.sub_key}`
        }
      }
      return key
    },
    // paramsValue(level, key) {

    // },
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const { nodeName, params, form } = this
          let newConfig = []
          let level1Key, level2Key, index, type
          const data = {}
          Object.keys(this.form).forEach((key) => {
            let defaultVal = []
            let value = this.form[key]
            let aliasValue = this.form[key]
            if (value === undefined || value === null) {
              value = ''
            }
            // 二级
            if (key.indexOf('/') > -1) {
              const [sub1, sub2] = key.split('/')
              const listData = params.filter((item, idx) => {
                if (item.sub_key) {
                  return item.sub_key === sub2
                }
              })
              level1Key = sub1
              level2Key = sub2
              // console.log(level1Key, level2Key);
              type = listData[0].type
              index = params.findIndex(
                (item) => item.key === sub1 && item.sub_key === sub2
              )
              if (type === 'list') {
                value = `${value}`
                if (value.toString().indexOf('[') > -1) {
                  defaultVal = []
                  let splitVal = value.split('|')
                  if (splitVal.length) {
                    splitVal.map((item) => {
                      let left = item.replace('[', '')
                      let right = left.replace(']', '')
                      const options = right.split(',')
                      const option = options.map((opt) => {
                        opt = this.isNumber(opt) ? +opt : opt
                        return opt
                      })
                      console.log(option, '66666----option')
                      defaultVal.push(option)
                    })
                    value = [...defaultVal]
                  }
                } else if (value.toString().indexOf(',') > -1) {
                  if (value.toString().indexOf(',') > -1) {
                    let splitVal = value.split(',')
                    if (splitVal.length) {
                      const arr = splitVal.map((item) => {
                        return (item = this.isNumber(item) ? +item : item)
                      })
                      defaultVal = [...arr]
                      value = [...defaultVal]
                    }
                  }
                }

                // data[level1Key][level2Key] = [...defaultVal];
              } else if (type === 'json') {
                try {
                  let textJson = value
                  value = eval('(' + textJson + ')')
                  //  console.log(value, 'value = eval(value)');
                } catch (error) {
                  console.log(error)
                }
              }

              if (data[level1Key]) {
                data[level1Key][level2Key] = value
              } else {
                data[level1Key] = {
                  [level2Key]: value
                }
              }
            } else {
              // 一级
              level1Key = key
              const listData = params.filter((item, idx) => {
                return item.key === key
              })
              type = listData[0].type
              index = params.findIndex((item) => item.key === key)
              // console.log(listData, "listData===", index, value);
              if (type === 'list') {
                value = `${value}`
                if (value.indexOf('[') > -1) {
                  console.log('我进来了')
                  let splitVal = value.split('|')
                  console.log(splitVal, 'splitVal -- splitVal')
                  if (splitVal.length) {
                    splitVal.map((item) => {
                      console.log(item, 'item-- splitVal', typeof item)
                      let left = item.replace('[', '')
                      let right = left.replace(']', '')
                      const options = right.split(',')
                      const option = options.map((opt) => {
                        opt = this.isNumber(opt) ? +opt : opt
                        return opt
                      })
                      defaultVal.push(option)
                    })
                    value = [...defaultVal]
                  }
                } else if (
                  value.toString().indexOf(',') > -1 &&
                  !(value.indexOf('[') > -1)
                ) {
                  if (value.toString().indexOf(',') > -1) {
                    let splitVal = value.split(',')
                    if (splitVal.length) {
                      const arr = splitVal.map((item) => {
                        return (item = this.isNumber(item) ? +item : item)
                      })
                      defaultVal = [...arr]
                      value = [...defaultVal]
                    }
                  }
                } else {
                  value = this.isNumber(value) ? [Number(value)] : [value]
                }
              } else if (type === 'json') {
                try {
                  let textJson = value
                  value = eval('(' + textJson + ')')
                  console.log(value, 'value = eval(value)')
                } catch (error) {
                  console.log(error)
                }
              }

              data[level1Key] = value
            }
            console.log(value, 'value')

            // this.params[index] = {
            //   ...this.params[index],
            //   default: value
            // }
            this.params[index].default = value
            // this.$set(this.params, index, { ...this.params[index], default: value })
            //  console.log(value, this.params[index], index, 'wade')
            // this.$set()
            // newConfig.push(paramsList[0])
          })
          // this.$set(this.params, index, { ...this.params[index], default: value })
          console.log(data, '6666--888', this.params)
          this.$emit('paramsResult', data, this.params)
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
.setting {
  width: 100%;
  height: calc(100vh - 100px);
  .form-content {
    width: 100%;
    height: calc(100vh - 220px);
    overflow: auto;
    overflow-x: hidden;
    .el-form-item__label {
      height: 40px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      line-height: inherit !important;
      word-break: break-all;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
.data-service-wrapper {
  width: 600px;
  padding: 20px;
  border: 1px solid rgb(220, 223, 230);
  border-radius: 10px;
  margin: 10px auto 20px;
  h3 {
    margin-bottom: 10px;
    font-size: 14px;
    color: #606266;
  }
  .data-service-box {
    display: flex;
    flex-wrap: wrap;
    > div {
      width: 50%;
    }
  }
}
.el-form.form-content {
  min-height: 200px;
}
.form-label-160 {
  width: 160px;
}
.el-input-number input {
  text-align: left !important;
}
.form-label-80 {
  width: 80px;
}
.form-content-160 {
  margin-left: 160px;
}
.params-service-wrapper h3 {
  padding-left: 100px;
}
</style>
