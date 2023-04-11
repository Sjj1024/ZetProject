var newConfig = { data_transform_0: 1, data_transform_2: 3, home_data_split_1: 3, home_data_split_2: 4 }


function getNodeId(name) {
  console.log('获取算子序号')
  // 生成20个算子序号
  const futureAll = Array.from({ length: Object.keys(newConfig).length + 1 }, (value, key) => `${name}_${key}`)
  console.log('futureAll', futureAll);
  // 从this.newConfig中获取所有算子名称
  const exist = Object.keys(newConfig)
  // 过滤出还没有使用的算子
  const usableItem = futureAll.filter(item => !exist.includes(item))
  // 返回第一个
  console.log('得到的可用算子名称是:', usableItem);
  return usableItem[0]
}

const resNodeName = getNodeId("home_data_split")
console.log('可用算子名称是:', resNodeName);