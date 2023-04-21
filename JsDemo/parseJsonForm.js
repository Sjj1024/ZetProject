function formdataify(params) {
  let formData = {};
  Object.keys(params).forEach(key => {
    if (typeof params[key] == "string") {
      formData[key] = params[key];
    } else {
      // formData.append(key, JSON.stringify(params[key]));
      formData[key] = JSON.stringify(params[key])
    }
  });
  return formData;
};


function formdataParse(params) {
  let formData = {};
  Object.keys(params).forEach(key => {
    if (typeof params[key] == "string" || typeof params[key] == "number" || typeof params[key] == "boolean") {
      formData[key] = params[key];
    } else {
      // formData.append(key, JSON.stringify(params[key]));
      formData[key] = JSON.stringify(params[key])
    }
  });
  return formData;
};


function isNumber(val) {
  var regPos = /^\d+(\.\d+)?$/; //非负浮点数
  var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
  if (regPos.test(val) || regNeg.test(val)) {
    return true;
  } else {
    return false;
  }
}


const formDatas = {
  guest: {
    need_run: true,
    data_type: "62.98",
    exclusive_data_type: {},
    is_list: "[1, 2, 3, 4]",
    is_obj: "{\"Yes\": true, 'No': 0 }",
    tree_param: {
      missing_fill: "play",
      missing_fill_method: " { 'Yes': 1, 'No': 0 }",
      missing_method_list: "[1, 2, 3, 4]",
      missing_list: "['a', 'b', 'c', 'd']",
      missing_obj: "{ 'Yes': 1, 'No': 0, 'mid': 'center' }"
    }
  },
  host: {
    need_run: true,
    data_type: "float64",
    exclusive_data_type: "{}",
    is_list: "[1, 2, 3, 4]",
    is_obj: " { 'Yes': 1, 'No': 0 }",
    tree_param: {
      missing_fill: "play",
      missing_fill_method: "{ 'Yes': 1, 'No': 0 }",
      missing_method_list: "[1, 2, 3, 4]",
      missing_list: "['a', 'b', 'c', 'd']",
      missing_obj: "{ 'Yes': 1, 'No': 0, 'mid': 'center' }"
    }
  }
}


function parseFormdata(roleForm) {
  // 将form表单全层解析为form表单对象
  let newForm = {}
  for (const key in roleForm) {
    if (Object.hasOwnProperty.call(roleForm, key)) {
      let val = roleForm[key];
      console.log('val--', val);
      if (typeof val === "string") {
        // 判断是不是list或者json
        if (val.includes("[") || val.includes("{")) {
          val = val.replace(/'/gi, "\"")
          try {
            // 规定输入list或者json的时候就格式正确，比如数字/布尔就不要带引号，
            val = JSON.parse(val)
            console.log('转换后的结果是:', val, typeof val);
          } catch (error) {
            console.log('form转换错误', error);
          }
        } else {
          val = isNumber(val) ? + val : val
        }
      } else {
        // 是对象或者数字或者布尔
        if (typeof val === "object") {
          val = parseFormdata(val)
        } else if (typeof val === "undefined") {
          val = null
        }
      }
      newForm[key] = val
    }
  }
  return newForm
}


const resForm = parseFormdata(formDatas)
console.log('resForm', resForm);


// Object.keys(formDatas).map(role => {
//   const roleForm = formDatas[role]
//   for (const key in roleForm) {
//     if (Object.hasOwnProperty.call(roleForm, key)) {
//       let val = roleForm[key];
//       console.log('val--', val);
//       if (typeof val === "string") {
//         if (val.includes("[") || val.includes("{")) {
//           val = val.replace(/'/gi, "\"")
//           console.log('是对象类型:', key, val);
//           try {
//             const resData = JSON.parse(val)
//             console.log('转换后的结果是:', resData, typeof resData);
//           } catch (error) {
//             console.log('转换错误', error);
//           }
//         } else {
//           val = isNumber(val) ? + val : val
//         }
//       } else {
//         // 是对象或者数字或者布尔
//         if (typeof val === "object") {

//         }
//       }
//     }
//   }
// })
