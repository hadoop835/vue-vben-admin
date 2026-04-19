// 生成19位唯一数字标识符，来自chatgpt
export const randomNumber = () => {
  const timestamp = Date.now().toString(); // 获取当前时间戳
  const random =
    Math.floor(Math.random() * 9000000000000000) + 1000000000000000; // 生成15位随机数
  let identifier = timestamp + random.toString(); // 结合时间戳和随机数
  if (identifier.length > 19) {
    identifier = identifier.substr(0, 19); // 如果标识符超过19位，则截取前19位
  }
  if (identifier.charAt(0) === '0') {
    identifier = '1' + identifier.substr(1); // 如果开头是0，则将第一个字符替换为1
  }
  return identifier;
};

/**
 * @description:根据数组将value变成中文
 * @param {*} value value值
 * @param {*} arr 枚举数据
 * @param {*} typeValue 英文字段
 * @param {*} typeLabel 中文字段
 * @return {*}
 */
export const getLabelByValue = (value, arr, typeValue, typeLabel) => {
  console.log('getLabelByValue', value);
  if (value === 'polyline') {
    return '连线';
  } else {
    for (const menu in arr) {
      const obj = arr[menu];
      if (obj[typeValue] === value) {
        return obj[typeLabel];
      }
    }
  }
};
