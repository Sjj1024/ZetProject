function configToForm(config = [], pre = {}) {
  config.forEach((cur) => {
    pre[cur.key] = cur.default
    if (cur.hasOwnProperty('children')) {
      configToForm(cur['children'], pre)
    }
    if (cur.sub_key) {
      if (pre[cur.sub_key]) {
        pre[cur.sub_key][cur.key] = cur.default
      } else {
        pre[cur.sub_key] = { [cur.key]: cur.default }
      }
    } else {
      pre[cur.key] = cur.default
    }
  })
}


const cfg = [
  {
      "order": 16,
      "key": "bin_num",
      "name": "bin_num",
      "sub_key": null,
      "sub_name": null,
      "type": "int",
      "enum": null,
      "options": [],
      "default": 10,
      "show": 1,
      "condition_inner": true,
      "condition_field": "",
      "condition_value": "",
      "component": "Input"
  },
  {
      "order": 21,
      "key": "early_stopping_rounds",
      "name": "早停处理",
      "sub_key": null,
      "sub_name": null,
      "type": "int",
      "enum": null,
      "options": [],
      "default": null,
      "show": 1,
      "condition_inner": true,
      "condition_field": "",
      "condition_value": "",
      "component": "Input"
  },
  {
      "order": 15,
      "key": "key_length",
      "name": "key长度",
      "sub_key": "encrypt_param",
      "sub_name": "key长度",
      "type": "int",
      "enum": null,
      "options": [],
      "default": 1024,
      "show": 1,
      "condition_inner": true,
      "condition_field": "",
      "condition_value": "",
      "component": "Input"
  },
  {
      "order": 9,
      "key": "learning_rate",
      "name": "学习率",
      "sub_key": null,
      "sub_name": null,
      "type": "float",
      "enum": null,
      "options": [],
      "default": 0.3,
      "show": 1,
      "condition_inner": true,
      "condition_field": "",
      "condition_value": "",
      "component": "Input"
  },
  {
      "order": 2,
      "key": "max_depth",
      "name": "最大深度",
      "sub_key": "tree_param",
      "sub_name": "树结构参数",
      "type": "int",
      "enum": null,
      "options": [],
      "default": 3,
      "show": 1,
      "condition_inner": true,
      "condition_field": "",
      "condition_value": "",
      "component": "Input"
  },
  {
      "order": 14,
      "key": "method",
      "name": "加密方法",
      "sub_key": "encrypt_param",
      "sub_name": "加密参数",
      "type": "str",
      "enum": null,
      "options": [],
      "default": "Paillier",
      "show": 1,
      "condition_inner": true,
      "condition_field": "",
      "condition_value": "",
      "component": "Input"
  },
  {
      "order": 4,
      "key": "min_child_weight",
      "name": "最小权重",
      "sub_key": "tree_param",
      "sub_name": "树结构参数",
      "type": "float",
      "enum": null,
      "options": [],
      "default": 0,
      "show": 1,
      "condition_inner": true,
      "condition_field": "",
      "condition_value": "",
      "component": "Input"
  },
  {
      "order": 5,
      "key": "min_leaf_node",
      "name": "min_leaf_node",
      "sub_key": "tree_param",
      "sub_name": "树结构参数",
      "type": "int",
      "enum": null,
      "options": [],
      "default": 1,
      "show": 1,
      "condition_inner": true,
      "condition_field": "",
      "condition_value": "",
      "component": "Input"
  },
  {
      "order": 3,
      "key": "min_sample_split",
      "name": "要拆分的最少节点数量",
      "sub_key": "tree_param",
      "sub_name": "树结构参数",
      "type": "int",
      "enum": null,
      "options": [],
      "default": 2,
      "show": 1,
      "condition_inner": true,
      "condition_field": "",
      "confition_value": "",
      "component": "Input"
  },
  {
      "order": 17,
      "key": "mode",
      "name": "mode",
      "sub_key": "encrypted_mode_calculator_param",
      "sub_name": "encrypted_mode_calculator_param",
      "type": "str",
      "enum": [
          "strict",
          "fast",
          "balance",
          "confusion_opt"
      ],
      "options": [
          "strict",
          "fast",
          "balance",
          "confusion_opt"
      ],
      "default": "strict",
      "show": 1,
      "condition_inner": true,
      "condition_field": "",
      "condition_value": "",
      "component": "Select"
  },
  {
      "order": 13,
      "key": "n_iter_no_change",
      "name": "n_iter_no_change",
      "sub_key": null,
      "sub_name": null,
      "type": "bool",
      "enum": null,
      "options": [],
      "default": true,
      "show": 1,
      "condition_inner": true,
      "condition_field": "",
      "condition_value": "",
      "component": "Radio"
  },
  {
      "order": 10,
      "key": "num_trees",
      "name": "要构建的最大树数",
      "sub_key": null,
      "sub_name": null,
      "type": "float",
      "enum": null,
      "options": [],
      "default": 5,
      "show": 1,
      "condition_inner": true,
      "condition_field": "",
      "condition_value": "",
      "component": "Input"
  },
  {
      "order": 8,
      "key": "objective",
      "name": "目标",
      "sub_key": "objective_param",
      "sub_name": "目标参数",
      "type": "str",
      "enum": [
          "cross_entropy",
          "lse",
          "lae",
          "log_cosh",
          "tweedie",
          "fair",
          "huber"
      ],
      "options": [
          "cross_entropy",
          "lse",
          "lae",
          "log_cosh",
          "tweedie",
          "fair",
          "huber"
      ],
      "default": "cross_entropy",
      "show": 1,
      "condition_inner": true,
      "condition_field": "",
      "condition_value": "",
      "component": "Select"
  },
  {
      "order": 12,
      "key": "random_seed",
      "name": "random_seed",
      "sub_key": null,
      "sub_name": null,
      "type": "int",
      "enum": null,
      "options": [],
      "default": 100,
      "show": 1,
      "condition_inner": true,
      "condition_field": "",
      "condition_value": "",
      "component": "Input"
  },
  {
      "order": 18,
      "key": "re_encrypted_rate",
      "name": "re_encrypted_rate",
      "sub_key": "encrypted_mode_calculator_param",
      "sub_name": "encrypted_mode_calculator_param",
      "type": "float",
      "enum": null,
      "options": [],
      "default": 1,
      "show": 1,
      "condition_inner": true,
      "condition_field": "",
      "condition_value": "",
      "component": "Input"
  },
  {
      "order": 11,
      "key": "subsample_feature_rate",
      "name": "subsample_feature_rate",
      "sub_key": null,
      "sub_name": null,
      "type": "float",
      "enum": null,
      "options": [],
      "default": 1,
      "show": 1,
      "condition_inner": true,
      "condition_field": "",
      "condition_value": "",
      "component": "Input"
  },
  {
      "order": 1,
      "key": "task_type",
      "name": "任务类型",
      "sub_key": null,
      "sub_name": null,
      "type": "str",
      "enum": [
          "classification",
          "regression"
      ],
      "options": [
          "classification",
          "regression"
      ],
      "default": "classification",
      "show": 1,
      "condition_inner": true,
      "condition_field": "",
      "condition_value": "",
      "component": "Select"
  },
  {
      "order": 6,
      "key": "use_missing",
      "name": "训练过程中是否使用缺损的值",
      "sub_key": "tree_param",
      "sub_name": "树结构参数",
      "type": "bool",
      "enum": null,
      "options": [],
      "default": false,
      "show": 1,
      "condition_inner": true,
      "condition_field": "",
      "condition_value": "",
      "component": "Radio"
  },
  {
      "order": 19,
      "key": "use_missing",
      "name": "use_missing",
      "sub_key": null,
      "sub_name": null,
      "type": "bool",
      "enum": null,
      "options": [],
      "default": false,
      "show": 1,
      "condition_inner": true,
      "condition_field": "",
      "condition_value": "",
      "component": "Radio"
  },
  {
      "order": 7,
      "key": "zero_as_missing",
      "name": "对于0为缺值",
      "sub_key": "tree_param",
      "sub_name": "树结构参数",
      "type": "bool",
      "enum": null,
      "options": [],
      "default": false,
      "show": 1,
      "condition_inner": true,
      "condition_field": "use_missing",
      "condition_value": true,
      "component": "Radio"
  },
  {
      "order": 20,
      "key": "zero_as_missing",
      "name": "zero_as_missing",
      "sub_key": null,
      "sub_name": null,
      "type": "bool",
      "enum": null,
      "options": [],
      "default": false,
      "show": 1,
      "condition_inner": true,
      "condition_field": "use_missing",
      "condition_value": true,
      "component": "Radio"
  }
]

let res = {}
configToForm(cfg, res)
console.log('得到的结果是:', res);