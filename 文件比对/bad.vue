<template>
  <div class="app-container flow-list">
    <div
      v-if="flowInfo"
      class="breadtitle"
    >
      <!-- <router-link to="/flow/flow-template">工作流模版</router-link> -->
      <h3>{{ flowInfo.modelName }}</h3>
      <ul class="flex">
        <li class="time">创建时间： {{ flowInfo.createDate }}</li>
        <li class="time">创建人： {{ flowInfo.createName }}</li>
        <li class="time">修改时间： {{ flowInfo.updateDate }}</li>
        <li class="time">修改人： {{ flowInfo.updateName }}</li>
      </ul>
      <p class="desc">
        <el-tooltip
          :content="flowInfo.remark"
          class="item"
          effect="dark"
          placement="bottom"
        >
          <span>备注：{{ flowInfo.remark }}</span>
        </el-tooltip>
      </p>
    </div>
    <!-- <breadcrumb-ext :breads="breads"/> -->
    <div class="drag-flow">
      <!-- 左侧算子列表-->
      <div class="drag-left">
        <item-panel :draggable="canEdit"></item-panel>
      </div>

      <!-- 挂载节点 -->
      <div class="drag-center">
        <div
          id="canvasPanel"
          ref="canvasPanel"
          @dragover.prevent
        ></div>
      </div>

      <Form
        ref="setParams"
        :can-edit="canEdit"
        @save="saveHandler"
      />
    </div>
    <!-- 配置面板 -->
    <div
      id="configPanel"
      :class="{ hidden: !configVisible }"
      class="drag-right"
    >
      <h4 class="panel-title">{{ label }}-设置项</h4>
      <params-edit
        ref="setting"
        :can-edit="canEdit"
        @paramsResult="paramsResult"
      />
      <!-- <Setting ref="setting" :can-edit="canEdit" @paramsResult="paramsResult" /> -->
    </div>
    <div
      v-if="tooltip"
      :style="`top: ${top}px; left: ${left}px;`"
      class="g6-tooltip"
    >
      type: {{ tooltip }}
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import G6 from '@antv/g6/dist/g6.min.js'
import registerFactory from '@/components/graph/graph'
import ItemPanel from './ItemPanel.vue'
// import Setting from './setting'
import ParamsEdit from '@/components/ParamsEdit/index.vue'
import Form from './form'
//import okSvg from '../../../../assets/ok.svg'
//import dirlist from '../../../../assets/dirlist.svg'
import okSvg from '@/assets/ok.svg'
import dirlist from '@/assets/dirlist.svg'

//import BreadcrumbExt from '@/components/BreadcrumbExt'
import { mapActions, mapGetters } from 'vuex'
import _ from 'lodash'
import { workFlowApi } from '@/api/flow'
export default {
  components: {
    ParamsEdit,
    ItemPanel,
    Form
    //  BreadcrumbExt
  },
  data() {
    return {
      // 1-编辑 2-查看
      canEdit: (localStorage.getItem('flowTempCanEdit') || '1') === '1',
      flowInfo: null,
      mode: 'drag-shadow-node',
      graph: {},
      tooltip: '',
      top: 0,
      left: 0,
      breads: null,
      commonParams: {},
      newConfig: {},
      highLight: {
        undo: false,
        redo: false
      },
      modelName: '',
      configJson: {
        dsl_version: 2,
        initiator: {
          role: 'guest',
          party_id: 0
        },
        role: {
          host: [],
          guest: []
        },
        job_parameters: {
          common: {
            job_type: 'train',
            backend: 0,
            work_mode: 1,
            task_cores: 4
          }
        },
        component_parameters: {
          common: {},
          role: {
            guest: {
              0: {
                reader_0: {
                  table: {
                    name: '',
                    namespace: ''
                  }
                }
              }
            },
            host: {
              0: {
                reader_0: {
                  table: {
                    name: '',
                    namespace: 'experiment'
                  }
                }
              }
            }
          }
        }
      },
      readerObj: {
        table: {
          name: '',
          namespace: ''
        }
      },
      readerHostObj: {
        table: {
          name: '',
          namespace: ''
        }
      },
      workflowid: 0,
      // 保存线条样式
      lineStyle: {
        type: 'line',
        width: 1
      },
      label: '',
      labelCfg: {
        fontSize: 12,
        style: {
          fill: '#fff'
        }
      },
      node: {
        fill: '',
        lineDash: 'none',
        borderColor: '',
        width: 160,
        height: 60,
        shape: 'rect-node'
      },
      canvasJson: null,
      nodeShapes: [
        {
          name: '矩形',
          shape: 'rect-node'
        }
      ],
      cfgcommon: {},
      res: {},
      headVisible: false,
      configVisible: false,
      config: {},
      tooltip: '',
      wfId: this.$route.params.id,
      wfName: this.$route.params.name,
      top: 0,
      left: 0,
      federalMlType: 1
    }
  },
  mounted() {
    this.createGraphic()
    this.initGraphEvent()
  },
  destroy() {
    this.graph.destroy()
  },
  computed: {
    ...mapGetters(['navStatus', 'isOpenMenu'])
  },
  methods: {
    // ...mapActions("dragflow", ["saveWorkFlow", "getWorkFlowVersionDetail"]),
    paramsResult(data, roles = []) {
      if (!(data === 'cancle')) {
        const name = this.config.label
        if (roles.includes('common')) {
          this.commonParams[name] = JSON.parse(JSON.stringify(data.common))
        } else if (roles.includes('guest')) {
          this.configJson.component_parameters.role.guest['0'][name] =
            JSON.parse(JSON.stringify(data.guest))
          this.configJson.component_parameters.role.host['0'][name] =
            JSON.parse(JSON.stringify(data.host))
        }
        this.saveHandler()
      } else {
        this.configVisible = false
      }
    },
    saveHandler(form) {
      const data = this.graph.save()
      console.log(form, 'saveHandler')
      if (this.$route.params.id) {
        const jobJson = this.saveParams(data)
        if (form) {
          this.configJson = JSON.parse(form.jsonStr)
        } else {
          try {
            this.configJson.component_parameters.common = {
              ...this.commonParams
            }
          } catch (error) {
            throw new Error('configJson格式不正确，请检查！')
          }
        }
        // console.log(JSON.stringify(this.commonParams, null, '\t'))
        let params = {
          id: +this.workflowid,
          modelName: this.modelName,
          federalMlType: this.federalMlType,
          jobJson,
          canvasJson: JSON.stringify(data),
          configJson: JSON.stringify(this.configJson),
          canvasOperatorParamJson: JSON.stringify(this.newConfig)
        }
        workFlowApi.save({ ...params }).then((res) => {
          if (res.retcode === 0) {
            this.$message.success('保存成功')
            setTimeout(() => {
              if (form) {
                window.location.reload()
              }
            }, 0)
          }
        })
      }
    },
    toDashboard() {
      this.$router.push(`/pj/project`)
    },
    initConf() {},
    createGraphic() {
      const vm = this
      const grid = new G6.Grid()
      const menu = new G6.Menu({
        offsetX: 0,
        offsetY: 0,
        itemTypes: ['node', 'edge'],
        getContent(e) {
          const { _cfg } = e.item
          let label = _cfg.model.label
          const alias = _cfg.model.alias
          const outDiv = document.createElement('div')
          outDiv.style.width = '80px'
          outDiv.style.cursor = 'pointer'
          outDiv.innerHTML = `<p id="deleteNode" data-label=${label} data-alias=${alias}>${
            _cfg.type === 'node' ? '删除算子' : '删除连线'
          }</p>`
          return outDiv
        },
        handleMenuClick(target, item) {
          console.log(target, 'targethandleMenuClick')
          const { id } = target
          const label = target.getAttribute('data-label')
          const alias = target.getAttribute('data-alias')
          console.log('删除label,alias, vm', label, alias, vm)
          if (label) {
            if (id) {
              // 调用deleteNode(item), 从画布上删除
              vm[id](item)
            }
            // 删除配置中的
            console.log(
              'vm.configJson.component_parameters',
              vm.configJson.component_parameters
            )
            if (vm.commonParams[label.toLowerCase()]) {
              // 如果common存在这个算子，就从configJson里面删除其配置
              vm.$delete(vm.commonParams, label.toLowerCase())
            }
            // 如果guest/host中存在这个算子，就从configJson里面删除
            if (
              vm.configJson.component_parameters.role.guest[0][
                label.toLowerCase()
              ]
            ) {
              console.log('guest配置里面存在', label.toLowerCase())
              vm.$delete(
                vm.configJson.component_parameters.role.guest[0],
                label.toLowerCase()
              )
            }
            if (
              vm.configJson.component_parameters.role.host[0][
                label.toLowerCase()
              ]
            ) {
              console.log('host配置里面存在', label.toLowerCase())
              vm.$delete(
                vm.configJson.component_parameters.role.host[0],
                label.toLowerCase()
              )
            }
            if (vm.newConfig[label.toLowerCase()]) {
              vm.$delete(vm.newConfig, label.toLowerCase())
            }
            if (alias) {
              vm.resDeleteLabel(alias)
            }

            vm.configVisible = false
          }
        }
      })
      const snapLine = new G6.SnapLine()
      const minimap = new G6.Minimap({
        size: [150, 100]
      })
      const tooltip = new G6.Tooltip({
        offsetX: 10,
        offsetY: 20,
        getContent(e) {
          const outDiv = document.createElement('div')
          outDiv.style.width = '180px'
          outDiv.innerHTML = `
          <h4>提示</h4>
          <ul>
            <li>Label: ${e.item.getModel().label || e.item.getModel().id}</li>
          </ul>`
          return outDiv
        },
        itemTypes: ['node']
      })
      // <li code='setting'><i class="el-icon-setting"></i></li>
      console.log(
        'this.getterProjectDetail.authority的值是:',
        this.getterProjectDetail
      )
      const toolbar = new G6.ToolBar({
        getContent: () => {
          return `
            <ul>
              <li code='zoomOut'><i class="el-icon-zoom-in"></i></li>
              <li code='zoomIn'><i class="el-icon-zoom-out"></i></li>
              <li code='run'><i class="el-icon-success"></i></li>
              <li code='setting'><i class="el-icon-setting"></i></li>
            </ul>
          `
        },
        handleClick: (code, graph) => {
          // console.log(code, graph, toolbar)
          if (code === 'run') {
            this.saveHandler()
          } else if (code === 'setting') {
            // const task_cores = this.configJson.job_parameters.common.task_cores;
            const jsonStr = JSON.stringify(this.configJson)
            let data = {
              // task_cores,
              jsonStr
            }
            this.$refs.setParams.show(data)
          } else {
            toolbar.handleDefaultOperator(code, graph)
          }
        }
      })
      let inner = this.isOpenMenu ? 110 : 260
      const cfg = registerFactory(G6, {
        width: window.innerWidth - 210 - inner,
        height: window.innerHeight - 180,
        enabledStack: true,
        // renderer: 'svg',
        layout: {
          type: 'compactBox' // 位置将固定
        },
        fitView: true,
        // 所有节点默认配置
        defaultNode: {
          type: 'rect-node',
          style: {
            radius: 4,
            width: 200,
            height: 34,
            cursor: 'move'
            // fill: "#ecf3ff"
          },
          labelCfg: {
            fontSize: 20,
            style: {
              cursor: 'move'
            }
          }
        },
        // 所有边的默认配置
        defaultEdge: {
          type: 'cubic-edge', // 扩展了内置边, 有边的事件
          style: {
            radius: 5,
            offset: 15,
            stroke: '#aab7c3',
            lineAppendWidth: 10, // 防止线太细没法点中
            endArrow: true
          }
        },
        // 覆盖全局样式
        nodeStateStyles: {
          'nodeState:default': {
            opacity: 1
          },
          'nodeState:hover': {
            opacity: 0.8
          },
          'nodeState:selected': {
            opacity: 0.9
          }
        },
        // 默认边不同状态下的样式集合
        edgeStateStyles: {
          'edgeState:default': {
            stroke: '#1976d2'
          },
          'edgeState:selected': {
            stroke: '#1976d2'
          },
          'edgeState:hover': {
            animate: true,
            animationType: 'dash',
            stroke: '#1976d2'
          }
        },
        modes: {
          // 支持的 behavior
          default: [
            'zoom-canvas',
            'drag-canvas',
            'drag-shadow-node',
            'canvas-event',
            'delete-item',
            'select-node',
            'hover-node',
            'active-edge'
          ]
        },
        plugins: [menu, minimap, grid, toolbar, snapLine]
        // ... 其他G6原生入参
      })
      this.graph = new G6.Graph(cfg)
      const id = this.$route.params.id
      if (this.$route.params.id !== 'add') {
        workFlowApi.workFlowTemplateDetail({ id: +id }).then((res) => {
          if (res.retcode === 0) {
            const {
              id,
              canvasJson,
              canvasOperatorParamJson,
              configJson,
              modelName,
              federalMlType
            } = res.data
            // const { partyId } = this.userinfo;
            this.federalMlType = federalMlType
            this.modelName = modelName
            this.workflowid = id
            this.flowInfo = res.data
            try {
              if (configJson) {
                let cfgJson = JSON.parse(configJson)
                this.configJson = { ...cfgJson }
                if (cfgJson) {
                  let component_parameters = cfgJson.component_parameters
                  if (component_parameters) {
                    this.commonParams = { ...component_parameters.common }
                  }
                }
                if (canvasOperatorParamJson) {
                  let newConfig = JSON.parse(canvasOperatorParamJson)
                  if (newConfig) {
                    let common = cfgJson.component_parameters.common
                    let copyCommon = JSON.parse(JSON.stringify(common))
                    if (common) {
                      let commonKeys = _.keys(common)
                      if (commonKeys.length) {
                        commonKeys.map((cmkey) => {
                          let comattr = _.keys(common[cmkey])
                          if (comattr.length && newConfig[cmkey]) {
                            comattr.map((item) => {
                              newConfig[cmkey] &&
                                newConfig[cmkey].length &&
                                newConfig[cmkey].map((ck, index) => {
                                  const { key, sub_key, type } = ck
                                  let value
                                  //一级
                                  if (!sub_key) {
                                    value = copyCommon[cmkey][key]
                                  } else {
                                    // 二级
                                    value = copyCommon[cmkey][key][sub_key]
                                  }
                                  if (type === 'json') {
                                    value = JSON.stringify(value)
                                  } else if (type === 'list') {
                                    console.log(value, 'wade')
                                    if (Array.isArray(value)) {
                                      let isTwoArray = value.some((items) => {
                                        return Array.isArray(items)
                                      })
                                      if (isTwoArray) {
                                        // 是二维数组
                                        let itemValue = ''
                                        value.map((item, index) => {
                                          itemValue += `${JSON.stringify(
                                            item
                                          )}${
                                            index === value.length - 1
                                              ? ''
                                              : '|'
                                          }`
                                        })
                                        value = itemValue
                                      } else {
                                        // 数组
                                        value = value.toString()
                                      }
                                    }
                                  }
                                  newConfig[cmkey][index].default = value
                                })
                            })
                          }
                        })
                      }
                    }
                    this.newConfig = { ...newConfig }
                  }
                }
              }
            } catch (error) {}
            // console.log(configJson, "configJson");

            if (canvasJson) {
              const data = JSON.parse(canvasJson)
              vm.getRepeat(data.nodes)
              this.graph.read(data)
            }
          }
        })
      }
    },
    // 初始化图事件
    initGraphEvent() {
      this.graph.on('drop', (e) => {
        const { originalEvent } = e

        if (originalEvent.dataTransfer) {
          const transferData =
            originalEvent.dataTransfer.getData('dragComponent')
          console.log('initGraphEvent-transferData', transferData)
          if (transferData) {
            this.addNode(transferData, e)
          }
        }
      })

      this.graph.on('node:drop', (e) => {
        e.item.getOutEdges().forEach((edge) => {
          edge.clearStates('edgeState')
        })
      })

      this.graph.on('after-node-selected', (e) => {
        this.configVisible = false
        if (e && e.item) {
          const model = e.item.get('model')
          console.log('model', model)
          const paramRoles = model.paramRoles
          // 此算子不支持参数配置
          if (!model.needConfig) {
            this.$message.warning('该算子无需配置参数')
            return false
          }
          this.configVisible = !!e
          this.config.label = model.label
          let label = model.label.toLowerCase()
          this.revertParams(label)
          if (this.newConfig[label]) {
            this.config.cfg = this.newConfig[label]
          } else {
            if (model.cfg) {
              this.config.cfg = [...model.cfg]
            } else {
              this.config.cfg = model.cfg
            }
          }
          this.$refs.setting.show(this.config, paramRoles, this.configJson)
          this.label = model.label
          this.labelCfg = {
            fontSize: model.labelCfg.fontSize,
            style: {
              fill: model.labelCfg.style.fill
            }
          }
          this.node = {
            fill: model.style.fill,
            borderColor: model.style.stroke,
            lineDash: model.style.lineDash || 'none',
            width: model.style.width,
            height: model.style.height,
            shape: model.type
          }
          const selectedNodes = this.graph.getNodes()
          selectedNodes.forEach((node) => {
            this.graph.updateItem(node, {
              style: {
                lineWidth: 1,
                fill: '#fff'
              }
            })
          })
          this.graph.updateItem(e.item, {
            style: {
              lineWidth: 3,
              fill: 'rgba(25, 118, 210, .1)'
            }
          })
        }
      })
      this.graph.on('on-node-mouseenter', (e) => {
        if (e && e.item) {
          e.item.getOutEdges().forEach((edge) => {
            edge.clearStates('edgeState')
            edge.setState('edgeState', 'hover')
          })
        }
      })

      this.graph.on('on-node-mouseleave', (e) => {
        if (e && e.item) {
          this.tooltip = ''
          if (e && e.item) {
            e.item.getOutEdges().forEach((edge) => {
              edge.clearStates('edgeState')
            })
          }
        }
      })

      this.graph.on(
        'before-node-removed',
        ({ target, alias, label, callback }) => {
          this.resDeleteLabel(alias)
          console.log(label, 'remove')
          if (this.commonParams[label.toLowerCase()]) {
            this.$delete(this.commonParams, label.toLowerCase())
            this.$delete(
              this.configJson.component_parameters.common,
              label.toLowerCase()
            )
          }
          if (this.newConfig[label.toLowerCase()]) {
            this.$delete(this.newConfig, label.toLowerCase())
          }
          callback(true)
        }
      )
      this.graph.on('before-edge-removed', ({ target, callback }) => {
        callback(true)
      })
      this.graph.on('after-edge-selected', (e) => {
        // alert('我执行了')
        // this.configVisible = !!e;
        if (e && e.item) {
          // this.config = e.item.get("model").id;

          this.graph.updateItem(e.item, {
            // shape: 'line-edge',
            style: {
              radius: 10,
              lineWidth: 2
            }
          })
        }
      })

      this.graph.on('anchors-hover-enter', (e) => {
        if (e.target.get('dragType') && e && e.item) {
          this.left = e.clientX - 40
          this.top = e.clientY + 15
          this.tooltip = e.target.get('dragType')
        }
      })
      this.graph.on('anchors-hover-leave', (e) => {
        if (e && e.item) {
          this.tooltip = ''
        }
      })
      this.graph.on(
        'before-edge-add',
        ({
          source,
          target,
          sourceAnchor,
          targetAnchor,
          starType,
          endType,
          startDirection,
          endDirection,
          startKeyType,
          endKeyType,
          ilable,
          olable
        }) => {
          console.log(startKeyType, endKeyType, startDirection, endDirection)
          if (startDirection === endDirection) {
            // console.log(startDirection, endDirection, "endDirection");
            this.$message.error('输入只能连输出或者输出只能连输入，不能连接！')
            return
          }
          if (startKeyType !== endKeyType) {
            this.$message.error('类型不同，不能连接！')
            return
          }
          setTimeout(() => {
            this.graph.addItem('edge', {
              id: `${+new Date() + (Math.random() * 10000).toFixed(0)}`, // edge id
              source: source.get('id'),
              target: target.get('id'),
              sourceAnchor,
              targetAnchor,
              ilable,
              olable,
              starType,
              endType
            })
          }, 100)
        }
      )
    },
    deleteNode(item) {
      console.log('删除算子同时删除算子配置', item)
      this.graph.removeItem(item)
    },
    revertParams(label) {
      const elementObj = this.commonParams[label]
    },
    resDeleteLabel(label) {
      // const [name] = label.split('_')
      let num = this.res[label]
      if (num === 1) {
        this.$delete(this.res, label)
      } else {
        this.res[label] -= 1
      }
    },
    // 添加节点
    addNode(transferData, { x, y }) {
      const {
        role: { guest, host }
      } = this.configJson

      this.configVisible = false
      let {
        label,
        shape,
        fill,
        output,
        input,
        config,
        alias,
        needConfig,
        roles
      } = JSON.parse(transferData)
      console.log(alias, 'alias')
      // const { nodes } = this.graph.save();

      // console.log(nodes, "config --- data");
      this.setResVal(alias)
      const paramRoles = JSON.parse(roles)
      let cfg = JSON.parse(config) || null
      let name = `${alias}_${this.res[alias] - 1}`

      console.log(cfg, 'cfg', name)
      if (cfg) {
        cfg.sort(function (s, t) {
          var a = s.key.toLowerCase()
          var b = t.key.toLowerCase()
          if (a < b) return -1
          if (a > b) return 1
          return 0
        })
        // const filterCfg = cfg.filter(item => item.default);
        this.newConfig[name] = [...cfg]
        let obj = {}
        cfg.map((item) => {
          let value = item.default
          let key = item.key
          let sub_key = item.sub_key
          if (name.indexOf('data_transform') > -1) {
            // if (value) {
            //   obj[key] = value
            // }
          } else {
            // if (item.type === 'json') {
            //   // let val = JSON.parse(item.default)
            //   // value = { ...val }
            // }
            if (sub_key) {
              if (obj[key]) {
                obj[key][sub_key] = value
              } else {
                obj[key] = {
                  [sub_key]: value
                }
              }
            } else {
              obj[key] = value
            }
          }
        })
        if (name.indexOf('data_transform') > -1) {
          console.log('data_transform')
        } else {
          this.commonParams[name] = { ...obj }
        }
        // console.log(this.commonParams, "this.commonParams");
      } else {
        if (name.indexOf('reader') > -1) {
          guest.map((item, index) => {
            let data =
              this.configJson.component_parameters.role.guest[0]['reader_0']
            this.configJson.component_parameters.role.guest[index][name] = {
              ...data
            }
          })
          host.map((item, index) => {
            let data =
              this.configJson.component_parameters.role.host[0]['reader_0']
            this.configJson.component_parameters.role.host[index][name] = {
              ...data
            }
          })
        }
      }

      const model = {
        paramRoles,
        needConfig,
        label: name,
        optName: label,
        // id:  Util.uniqueId(),
        // 形状
        type: shape,
        style: {
          fill: fill || '#ecf3ff'
        },
        // 坐标
        x,
        y,
        output,
        input,
        alias,
        color: '#1890ff',
        image: dirlist,
        cfg,
        stateImage: okSvg
      }
      this.graph.addItem('node', model, true)
    },
    setResVal(name) {
      if (!this.res[name]) {
        this.res[name] = 1
      } else {
        this.res[name]++
      }
    },
    getRepeat(arr) {
      for (var i = 0; i < arr.length; i++) {
        let label = arr[i].alias
        // const [name] = label.split('_')
        this.setResVal(label)
      }
    },
    saveParams(data) {
      // 存储工作流配置
      console.log('模板存储工作流配置')
      let { edges, nodes } = data
      nodes = nodes.sort(function (s, t) {
        var a = s.y
        var b = t.y
        if (a < b) return -1
        if (a > b) return 1
        return 0
      })
      edges = edges.sort()
      let list = []
      let label = ''
      let params = {
        components: {}
      }
      let input
      let output
      let endType
      let starType
      let sourceList = []
      let typeList = []
      const nodesLen = nodes.length
      const edgesLen = edges.length
      const sourceIds = edges.reduce((memo, cur) => {
        memo.push({
          current: cur.source,
          target: cur.target,
          endType: cur.endType,
          starType: cur.starType
        })
        return memo
      }, [])
      if (nodes.length) {
        for (let i = 0; i < nodes.length; i++) {
          const item = nodes[i]
          const cfgparams = item.cfg
          let id = item.id
          const name = item.optName
          console.log(name, 'name---333')
          let labelCase = item.label.toLocaleLowerCase()
          let outputTypeList = []
          let outPutObject
          input = item.input ? JSON.parse(item.input) : null
          output = item.output ? JSON.parse(item.output) : null
          // let comonKeys = this.commonParams[labelCase]
          // if (comonKeys) {
          //   // console.log(Object.keys(comonKeys).length, "comonKeys", comonKeys);
          //   const keysLen = Object.keys(comonKeys).length

          //   if (keysLen) {
          //     let objValues = Object.values(comonKeys).every(item => !item)
          //     console.log(objValues, 'addNoobjValuese')
          //     Object.keys(comonKeys).forEach((item, index) => {
          //       if (comonKeys[item] === null) {
          //         delete this.commonParams[labelCase][item]
          //       } else {
          //         // console.log("mi---in");
          //         let newCfglist = this.newConfig[labelCase]
          //         if(newCfglist) {
          //           let subList = newCfglist.filter(ele => ele.sub_key)
          //           console.log(subList, 'subList')
          //           if (subList.length) {
          //             subList.map(sub => {
          //               let key = sub.key
          //               let sub_key = sub.sub_key
          //               if (sub.default) {
          //                 let obj = {
          //                   [sub_key]: sub.default
          //                 }
          //                 delete this.commonParams[labelCase][sub_key]
          //                 this.commonParams[labelCase][key] = {
          //                   ...this.commonParams[labelCase][key],
          //                   ...obj
          //                 }
          //                 // this.$set(this.commonParams[labelCase], key, obj);
          //               }
          //             })

          //             // console.log(obj, 'obj', key)
          //           }
          //         }
          //         // console.log(this.commonParams, '535252')
          //       }
          //     })
          //     // if (objValues) {
          //     //   delete this.commonParams[labelCase];
          //     // } else {

          //     // }
          //   } else {
          //     delete this.commonParams[labelCase]
          //   }
          // }
          if (output) {
            outPutObject = output.reduce((memo, cur) => {
              // memo.push(cur.key)
              if (cur.type === 'Table') {
                outputTypeList.push(cur.key)
                memo['data'] = [...outputTypeList]
              } else {
                memo[cur.key] = [cur.key]
              }
              return memo
            }, {})
          }
          let inputObj = {
            module: name,
            input: {},
            output: { ...outPutObject }
          }
          const targetList = edges.filter((item) => item.target === id)
          if (targetList.length) {
            targetList.sort((a, b) => {
              return +a.id > +b.id
            })
            targetList.map((item) => {
              console.log(item.endType, 'targetList', targetList)
              if (item.endType.indexOf('model') > -1) {
                inputObj.input[item.endType] = []
              } else {
                inputObj.input.data = {
                  ...inputObj.input.data,
                  [`${item.endType}`]: []
                }
              }
            })
            // console.log(inputObj, "inputObj");
            targetList.map((item, index) => {
              // console.log(item, 'item1')
              if (item.endType.indexOf('model') > -1) {
                inputObj.input[item.endType].push(
                  `${item.ilable.toLowerCase()}.${item.starType}`
                )
              } else {
                console.log(inputObj, 'inputObj ---- 88888', item.endType)
                inputObj.input.data[item.endType].push(
                  `${item.ilable.toLowerCase()}.${item.starType}`
                )
              }
              if (!output) {
                delete inputObj.output
              } else {
                inputObj.output = { ...outPutObject }
              }
              params.components[labelCase] = { ...inputObj }
            })
          } else {
            delete inputObj.input
            params.components[labelCase] = { ...inputObj }
          }
        }
      }
      console.log(JSON.stringify(params), 'list --params')
      return JSON.stringify(params)
    }
  }
}
</script>

<style lang="scss" scoped>
.flow-list {
  /* position: relative; */
  width: 100%;
  .breadtitle {
    margin-bottom: 10px;
    line-height: 25px;
    color: #475669;
    h3 {
      color: #1f2d3d;
      font-weight: 600;
      font-size: 20px;
      line-height: 34px;
      margin-bottom: 6px;
    }
    .desc {
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .time {
      padding-right: 50px;
    }
  }
  .drag-flow {
    display: flex;
    justify-content: space-between;
    overflow: hidden;
    position: relative;
    .g6-grid-container {
      z-index: 5 !important;
    }
    .g6-component-contextmenu {
      z-index: 20;
    }
    .drag-left {
      width: 220px;
      height: calc(100vh - 175px);
      background-color: #fff;
    }
    .drag-center {
      flex: 1;
      position: relative;
      #canvasPanel {
        position: relative;
        /deep/ .g6-component-toolbar {
          left: 50%;
          z-index: 16;
          font-size: 16px;
          border: none;
          transform: translateX(-50%);
          box-shadow: rgba(9, 30, 66, 0.25) 0px 4px 8px -2px,
            rgba(9, 30, 66, 0.08) 0px 0px 0px 1px;
          li {
            line-height: 24px;
            width: 24px;
            margin-right: 10px;
            transition: all 0.2s linear;
            &:last-child {
              margin-right: 0;
            }
            &:hover {
              color: #fff;
              background-color: #1976d2;
              border-radius: 50%;
            }
          }
        }
        & > canvas {
          position: relative;
          z-index: 10;
        }
      }
      /deep/ .g6-minimap {
        position: absolute;
        left: 2px;
        top: 2px;
        z-index: 15;
        background: #fff;
        border: 1px solid rgba(25, 118, 210, 1);
      }
    }
  }
  #configPanel {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 20;
    min-width: 360px;
    height: calc(100vh - 49px);
    overflow: hidden;
    background: #fff;
    padding: 10px 10px 10px 20px;
    display: block;
    transition: transform 0.3s ease-in-out;
    h4 {
      margin-bottom: 10px;
      font-size: 18px;
      color: rgb(25, 118, 210);
    }
    .btn-footer {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 15px;
    }
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.1);
    &.hidden {
      display: none;
      transform: translate(100%, 0);
    }
  }
}

/* 参数编辑弹框的高度设置 */
/deep/ .form-content {
  height: calc(100vh - 205px);
}

/* 提示框的样式 */
.g6-tooltip {
  position: fixed;
  top: 0;
  left: 0;
  font-size: 12px;
  color: #545454;
  border-radius: 4px;
  border: 1px solid #e2e2e2;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: rgb(174, 174, 174) 0 0 10px;
  padding: 10px 8px;
  z-index: 10;
}
</style>
