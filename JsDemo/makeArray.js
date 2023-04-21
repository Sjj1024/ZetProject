const hosme = "data_transform"

const res = Array.from({length:10}, (value, key)=> `${hosme}_${key}`)

console.log('res', res);