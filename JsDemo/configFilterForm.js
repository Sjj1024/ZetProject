const config = [
  {
    "order": 1,
    "key": "intersect_method",
    "name": "intersect处理方法",
    "sub_key": null,
    "sub_name": null,
    "type": "str",
    "enum": ["rsa", "dh"],
    "options": ["rsa", "dh"],
    "default": "rsa",
    "show": 1,
    "condition_inner": true,
    "condition_field": "",
    "condition_value": "",
    "component": "Select"
  },
  {
    "order": 2,
    "key": "salt",
    "name": "源数据拼接后缀",
    "sub_key": "rsa_params",
    "sub_name": "rsa_params",
    "type": "str",
    "enum": null,
    "options": [],
    "default": "",
    "show": 1,
    "condition_inner": false,
    "condition_field": "intersect_method",
    "condition_value": "rsa",
    "component": "Input"
  },
  {
    "order": 3,
    "key": "salt",
    "name": "源数据拼接后缀",
    "sub_key": "dh_params",
    "sub_name": "dh_params",
    "type": "str",
    "enum": null,
    "options": [],
    "default": "",
    "show": 1,
    "condition_inner": false,
    "condition_field": "intersect_method",
    "condition_value": "dh",
    "component": "Input"
  },
  {
    "order": 4,
    "key": "hash_method",
    "name": "源数据hash方式",
    "sub_key": "rsa_params",
    "sub_name": "rsa_params",
    "type": "str",
    "enum": ["sha256", "sha384", "sha512", "sm3"],
    "options": ["sha256", "sha384", "sha512", "sm3"],
    "default": "sha256",
    "show": 1,
    "condition_inner": false,
    "condition_field": "intersect_method",
    "condition_value": "rsa",
    "component": "Select"
  },
  {
    "order": 5,
    "key": "hash_method",
    "name": "源数据hash方式",
    "sub_key": "dh_params",
    "sub_name": "dh_params",
    "type": "str",
    "enum": ["sha256", "sha384", "sha512", "sm3"],
    "options": ["sha256", "sha384", "sha512", "sm3"],
    "default": "sha256",
    "show": 1,
    "condition_inner": false,
    "condition_field": "intersect_method",
    "condition_value": "dh",
    "component": "Select"
  },
  {
    "order": 6,
    "key": "key_length",
    "name": "key长度",
    "sub_key": "rsa_params",
    "sub_name": "rsa_params",
    "type": "int",
    "enum": null,
    "options": [],
    "default": 1024,
    "show": 1,
    "condition_inner": false,
    "condition_field": "intersect_method",
    "condition_value": "rsa",
    "component": "Input"
  },
  {
    "order": 7,
    "key": "key_length",
    "name": "key长度",
    "sub_key": "dh_params",
    "sub_name": "dh_params",
    "type": "int",
    "enum": null,
    "options": [],
    "default": 1024,
    "show": 1,
    "condition_inner": false,
    "condition_field": "intersect_method",
    "condition_value": "dh",
    "component": "Input"
  },
  {
    "order": 8,
    "key": "final_hash_method",
    "name": "结果数据hash方式",
    "sub_key": "rsa_params",
    "sub_name": "rsa_params",
    "type": "str",
    "enum": ["sha256", "sha384", "sha512", "sm3"],
    "options": ["sha256", "sha384", "sha512", "sm3"],
    "default": "sha256",
    "show": 1,
    "condition_inner": false,
    "condition_field": "intersect_method",
    "condition_value": "rsa",
    "component": "Select"
  },
  {
    "order": 9,
    "key": "split_calculation",
    "name": "是否开启拆分操作",
    "sub_key": "rsa_params",
    "sub_name": "rsa_params",
    "type": "bool",
    "enum": null,
    "options": [],
    "default": false,
    "show": 1,
    "condition_inner": false,
    "condition_field": "intersect_method",
    "condition_value": "rsa",
    "component": "Radio"
  },
  {
    "order": 10,
    "key": "random_base_fraction",
    "name": "随机部分基础值",
    "sub_key": "rsa_params",
    "sub_name": "rsa_params",
    "type": "float",
    "enum": null,
    "options": [],
    "default": 0.11,
    "show": 1,
    "condition_inner": false,
    "condition_field": "intersect_method",
    "condition_value": "rsa",
    "component": "Input"
  },
  {
    "order": 11,
    "key": "random_bit",
    "name": "随机字节数",
    "sub_key": "rsa_params",
    "sub_name": "rsa_params",
    "type": "int",
    "enum": null,
    "options": [],
    "default": 128,
    "show": 1,
    "condition_inner": false,
    "condition_field": "intersect_method",
    "condition_value": "rsa",
    "component": "Input"
  },
  {
    "order": 12,
    "key": "only_output_key",
    "name": "only_output_key",
    "sub_key": null,
    "sub_name": null,
    "type": "bool",
    "enum": null,
    "options": [],
    "default": false,
    "show": 1,
    "condition_inner": false,
    "condition_field": null,
    "condition_value": null,
    "component": "Radio"
  },
  {
    "order": 13,
    "key": "sync_intersect_ids",
    "name": "sync_intersect_ids",
    "sub_key": null,
    "sub_name": null,
    "type": "bool",
    "enum": null,
    "options": [],
    "default": true,
    "show": 1,
    "condition_inner": false,
    "condition_field": null,
    "condition_value": null,
    "component": "Radio"
  }
]

const form = {
  "intersect_method": "rsa",
  "rsa_params": {
    "salt": "",
    "hash_method": "sha256",
    "key_length": 1024,
    "final_hash_method": "sha256",
    "split_calculation": false,
    "random_base_fraction": 0.11,
    "random_bit": 128
  },
  "dh_params": {
    "salt": "",
    "hash_method": "sha256",
    "key_length": 1024
  },
  "only_output_key": false,
  "sync_intersect_ids": true
}

// 扁平化config
const flattenObjArray = (arr = [], childKey = 'children') => {
  return arr.reduce(function (prev, cur) {
    return prev.concat((cur[childKey] && Array.isArray(cur[childKey])) ? flattenObjArray(cur[childKey], childKey).concat(cur) : cur)
  }, [])
}

// 从config中获取item
function getConfigItem(config = [], key = "") {
  return flattenObjArray(config).find(item => item.key === key)
}

// 某项字段存在条件
const conditionFlag = (formField, item, role) => {
  // 根据condition条件判断是否渲染
  let flag = false
  if (item.condition_field) {
    if (item.sub_key) {
      // 需要区分condition_inner来决定使用外层外层
      if (item.condition_inner) {
        flag =
          formField[role][item.sub_key][item.condition_field] === item.condition_value
      } else {
        flag = formField[role][item.condition_field] === item.condition_value
      }
    } else {
      flag = formField[role][item.condition_field] === item.condition_value
    }
  } else {
    flag = true
  }
  return flag
}

/**
 * 
 * @param {Array} config 配置参数数组
 * @param {Object} form 原始表单对象
 * @param {Object} target 组装后的表单对象
 */
function configFilterToForm(config = [], form = {}, role = "") {
  console.log('根据config条件配置过滤表单结构')
  // 遍历原始表单每个key，从config中获得此key的item
  const oneTree = flattenObjArray(config)
  console.log(`一共需要${oneTree.length}个字段`);
  for (const key in oneTree) {
    if (Object.hasOwnProperty.call(oneTree, key)) {
      const item = oneTree[key];
      makeForm(form, item, role)
    }
  }
}


function makeForm(form, item, role) {
  if (!target[role]) {
    target[role] = {}
  }
  console.log('role, item.key, conditionFlag(form, item, role)::::', role, item.key, conditionFlag(form, item, role));
  // 判断字段条件
  if (conditionFlag(form, item, role)) {
    if (!!item.sub_key) {
      target[role][item.sub_key] = target[role][item.sub_key] ? target[role][item.sub_key] : {}
      target[role][item.sub_key][item.key] = form[role][item.sub_key][item.key]
    } else {
      target[role][item.key] = form[role][item.key]
    }
  }
}


var target = {}
// const oneTree = flattenObjArray(config)
// console.log('oneTree', oneTree);
// configFilterToForm(config, form, target)

// const tar = getConfigItem(config, "default_value")
// console.log('tar', tar);

for (const key in form) {
  if (Object.hasOwnProperty.call(form, key)) {
    configFilterToForm(config, form, key)
  }
}

console.log('target', target);
