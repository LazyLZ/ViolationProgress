const NAME_MAX = 25
const DETAILS_MAX = 250
/**
 * 中国大陆境内车牌格式：
 * 第一位为汉字，表示省级行政区，共31种：京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼
 * 注意：海南省是“琼”
 * 第一位还有可能是“使”，代表使馆车辆
 *
 * 第二位为字母代表地级行政区，一般跳过I和O, *但O一般被用于警车，I只有直辖市有权使用*
 * 如果是使馆车辆，第二位为数字（第二到四位为使馆编号，后三位为国家编号）
 * 如果是拖拉机，此处为两位阿拉伯数字组成的发牌机关代号
 *
 * 之后的四到五位为编号，为数字和英文字母组合，*此处I和O不能使用*
 * 后缀可能为：领警学挂港澳临试超
 * 使用后缀文字的车辆*全部*是四位编号加后缀的形式，不使用后缀的车牌*全部*为五位
 * 新能源汽车编号增加一位升至六位，目前为止限制首尾仅能为D或F
 *
 * 附：这里以后车牌为准，某些摩托车的前车牌没有第一二位。
 * 公安部文件对于编号还有更加详细的规定限制此处也略去
 * 新能源车牌首（小型车）或尾（大型车）编号必须为D或F的限制因为没有文件硬性要求此处也略去
 * 不考虑民航车辆、军用车辆、武警车辆
 * 由于容错性考虑，不考虑拖拉机车辆
 */
const reg = {
  // 此正则错误极多，废弃
  // PLATE_PATTERN: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z][A-Z][A-Z0-9]{4}[A-Z0-9挂学警港澳]$/i
  PLATE_PATTERN: /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼][A-Z](([A-HJ-NP-Z\d]{4}[A-HJ-NP-Z\d领警学挂港澳临试超])|([DF][A-HJ-NP-Z\d]{5})|([A-HJ-NP-Z\d]{5}[DF])))|([使]\d{6}))$/i,
  NEW_ENERGY_PLATE: /^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼][A-Z](([DF][A-HJ-NP-Z\d]{5})|([A-HJ-NP-Z\d]{5}[DF])))$/i,
  PHONE_11: /^(\+\d{2}[- ])?(0\d{2,3}[- ])?(\d{11})$/i,
  PHONE_8: /^(\+\d{2}[- ])?(0\d{2,3}[- ])?(\d{8})$/i,
  PHONE_ALL: /^(\+\d{2}[- ])?(0\d{2,3}[- ])?(\d{11}|\d{8})$/i
}
// let phoneAll = /^1\d{10}$|^\d{8}$/i
// let phone8 = /^\d{8}$/i
let phone11 = /^(\+\d{2}[- ])?(0\d{2,3}[- ])?(\d{11})$/i
let phone8 = /^(\+\d{2}[- ])?(0\d{2,3}[- ])?(\d{8})$/i
export default {
  NAME_MAX,
  DETAILS_MAX,
  reg,
  nameRequired: [
    v => !!v || '名称不能为空',
    v => (!!v && v.length <= NAME_MAX) || '名称不能多于25个字符'
  ],
  name: [
    v => v.length <= NAME_MAX || '名称不能多于25个字符'
  ],
  detailsRules: [
    v => v.length <= DETAILS_MAX || '详情不能多于250个字符'
  ],

  required (msg = '必填项') {
    return [
      v => !!v || msg,
    ]
  },
  requiredArray (msg = '必填项') {
    return v => v.length > 0 || msg
  },
  requiredS (msg = '必填项') {
    return v => !!v || msg
  },
  objRequired (msg = '必选项', key = 'id') {
    return [
      v => (v instanceof Object && !!v[key]) || msg,
    ]
  },
  range (min, max) {
    return v => (Number(v) >= min && Number(v) <= max) || `数字不在范围内, ${min} <= x <= ${max}`
  },
  phone11 (required = true) {
    if (required) {
      return [
        v => !!v || '必须填写电话号码(11位)',
        v => phone11.test(v) || '手机号格式不正确，格式：11位，可加区号'
      ]
    }
    else {
      return [
        v => phone11.test(v) || '手机号格式不正确'
      ]
    }
  },
  plate: [
    v => reg.PLATE_PATTERN.test(v) || '车牌格式错误'
  ],
  positiveInteger: [
    v => (v !== '' && typeof Number(v) === 'number' && Number(v) >= 0) || '非负整数'
  ],
  ledPromptRule: v => !v || v.length <= 100 || '屏显提示不能多于100个字符',
  audioPromptRule: v => !v || v.length <= 100 || '屏显提示不能多于100个字符',

  ledPromptCount: 100,
  audioPromptCount: 100,
}
