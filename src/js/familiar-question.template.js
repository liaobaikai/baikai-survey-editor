// 常见问题
export const questions = {
  sex: {
    name: '性别',
    title: '您的性别是？',
    answerTip: '',  // 答题提示
    sequence: 0, // 题号
    type: 1,
    remark: '',
    ssOrderNo: 0, // section排序
    requireAnswer: 1, // 需要回答
    userAnswer: '', // 用户答案
    columns: 1, // 答案列数，1列代表每一个答案一行
    dependent: '', // 依赖哪个题目的选项出现
    dependentVisible: 0, // 当多个问题被关联的时候，问题之间的关系。且(1)-或(0)
    forward: '', // 无条件跳转到
    forwardType: 0, // 0，默认 1，无条件跳转 2，按选项跳转
    answer: [
      {
        answer: '男',
        orderNo: 1,
        checked: 0, // 是否默认
        complete: 0, // 是否允许填空
        requireComplete: 0, // 是否为必填
        completeValue: '', // 填空的内容
        image: '', // 图片
        description: '',// 说明
        forward: '', // 选择该选项跳转到那里
        score: 0, // 分值
      },
      {
        answer: '女',
        orderNo: 2,
        checked: 0, // 是否默认
        complete: 0, // 是否允许填空
        requireComplete: 0, // 是否为必填
        completeValue: '', // 填空的内容
        image: '', // 图片
        description: '',// 说明
        forward: '', // 选择该选项跳转到那里
        score: 0, // 分值
      }
    ]
  },

  marry: {
    name: '婚姻',
    title: '请问您婚否？',
    answerTip: '',  // 答题提示
    sequence: 0, // 题号
    type: 1,
    remark: '',
    ssOrderNo: 0, // section排序
    requireAnswer: 1, // 需要回答
    userAnswer: '', // 用户答案
    columns: 1, // 答案列数，1列代表每一个答案一行
    dependent: '', // 依赖哪个题目的选项出现
    dependentVisible: 0, // 当多个问题被关联的时候，问题之间的关系。且(1)-或(0)
    forward: '', // 无条件跳转到
    forwardType: 0, // 0，默认 1，无条件跳转 2，按选项跳转
    answer: [
      {
        answer: '是',
        orderNo: 1,
        checked: 0, // 是否默认
        complete: 0, // 是否允许填空
        requireComplete: 0, // 是否为必填
        completeValue: '', // 填空的内容
        image: '', // 图片
        description: '',// 说明
        forward: '', // 选择该选项跳转到那里
        score: 0, // 分值
      },
      {
        answer: '否',
        orderNo: 2,
        checked: 0, // 是否默认
        complete: 0, // 是否允许填空
        requireComplete: 0, // 是否为必填
        completeValue: '', // 填空的内容
        image: '', // 图片
        description: '',// 说明
        forward: '', // 选择该选项跳转到那里
        score: 0, // 分值
      }
    ]
  },

  name: {
    name: '姓名',
    title: '您的姓名？',
    answerTip: '',  // 答题提示
    dependent: '', // 依赖哪个题目的选项出现
    dependentVisible: 0, // 当多个问题被关联的时候，问题之间的关系。且(1)-或(0)
    forward: '', // 无条件跳转到
    forwardType: 0, // 0，默认 1，无条件跳转 2，按选项跳转
    sequence: 0, // 题号
    type: 5,
    remark: '',
    placeholder: "请输入内容",
    ssOrderNo: 0, // section排序
    requireAnswer: 1, // 需要回答
    userAnswer: '', // 用户答案
    columns: '2', // 答案列数，1列代表每一个答案一行
    rows: "1", // 多少行
    dataType: 0,  // 引用：completionDataTypes
    dataMax: '', // 最大值
    dataMin: '', // 最小值
    underlineStyle: 0,  // 是否使用下划线样式
  },

  mobile: {
    name: '手机号码',
    title: '您的手机号码是？',
    answerTip: '',  // 答题提示
    dependent: '', // 依赖哪个题目的选项出现
    dependentVisible: 0, // 当多个问题被关联的时候，问题之间的关系。且(1)-或(0)
    forward: '', // 无条件跳转到
    forwardType: 0, // 0，默认 1，无条件跳转 2，按选项跳转
    sequence: 0, // 题号
    type: 5,
    remark: '',
    placeholder: "请输入内容",
    ssOrderNo: 0, // section排序
    requireAnswer: 1, // 需要回答
    userAnswer: '', // 用户答案
    columns: '2', // 答案列数，1列代表每一个答案一行
    rows: "1", // 多少行
    dataType: 4,  // 引用：completionDataTypes
    dataMax: '', // 最大值
    dataMin: '', // 最小值
    underlineStyle: 0,  // 是否使用下划线样式
  },

  email: {
    name: '邮箱',
    title: '您的邮箱是？',
    answerTip: '',  // 答题提示
    dependent: '', // 依赖哪个题目的选项出现
    dependentVisible: 0, // 当多个问题被关联的时候，问题之间的关系。且(1)-或(0)
    forward: '', // 无条件跳转到
    forwardType: 0, // 0，默认 1，无条件跳转 2，按选项跳转
    sequence: 0, // 题号
    type: 5,
    remark: '',
    placeholder: "请输入内容",
    ssOrderNo: 0, // section排序
    requireAnswer: 1, // 需要回答
    userAnswer: '', // 用户答案
    columns: '2', // 答案列数，1列代表每一个答案一行
    rows: "1", // 多少行
    dataType: 5,  // 引用：completionDataTypes
    dataMax: '', // 最大值
    dataMin: '', // 最小值
    underlineStyle: 0,  // 是否使用下划线样式
  },

  address: {
    name: '地址',
    title: '您的地址是？',
    answerTip: '',  // 答题提示
    dependent: '', // 依赖哪个题目的选项出现
    dependentVisible: 0, // 当多个问题被关联的时候，问题之间的关系。且(1)-或(0)
    forward: '', // 无条件跳转到
    forwardType: 0, // 0，默认 1，无条件跳转 2，按选项跳转
    sequence: 0, // 题号
    type: 5,
    remark: '',
    placeholder: "请输入内容",
    ssOrderNo: 0, // section排序
    requireAnswer: 1, // 需要回答
    userAnswer: '', // 用户答案
    columns: '2', // 答案列数，1列代表每一个答案一行
    rows: "1", // 多少行
    dataType: 11,  // 引用：completionDataTypes
    dataMax: '', // 最大值
    dataMin: '', // 最小值
    underlineStyle: 0,  // 是否使用下划线样式
  },

  date: {
    name: '日期',
    title: '请选择日期？',
    answerTip: '',  // 答题提示
    dependent: '', // 依赖哪个题目的选项出现
    dependentVisible: 0, // 当多个问题被关联的时候，问题之间的关系。且(1)-或(0)
    forward: '', // 无条件跳转到
    forwardType: 0, // 0，默认 1，无条件跳转 2，按选项跳转
    sequence: 0, // 题号
    type: 5,
    remark: '',
    placeholder: "请输入内容",
    ssOrderNo: 0, // section排序
    requireAnswer: 1, // 需要回答
    userAnswer: '', // 用户答案
    columns: '2', // 答案列数，1列代表每一个答案一行
    rows: "1", // 多少行
    dataType: 3,  // 引用：completionDataTypes
    dataMax: '', // 最大值
    dataMin: '', // 最小值
    underlineStyle: 0,  // 是否使用下划线样式
  },

  education: {
    name: '学历',
    title: '您的最高学历是？',
    answerTip: '',  // 答题提示
    sequence: 0, // 题号
    type: 1,
    remark: '',
    ssOrderNo: 0, // section排序
    requireAnswer: 1, // 需要回答
    userAnswer: '', // 用户答案
    columns: 1, // 答案列数，1列代表每一个答案一行
    dependent: '', // 依赖哪个题目的选项出现
    dependentVisible: 0, // 当多个问题被关联的时候，问题之间的关系。且(1)-或(0)
    forward: '', // 无条件跳转到
    forwardType: 0, // 0，默认 1，无条件跳转 2，按选项跳转
    answer: [
      {
        answer: '初中',
        orderNo: 1,
        checked: 0, // 是否默认
        complete: 0, // 是否允许填空
        requireComplete: 0, // 是否为必填
        completeValue: '', // 填空的内容
        image: '', // 图片
        description: '',// 说明
        forward: '', // 选择该选项跳转到那里
        score: 0, // 分值
      },
      {
        answer: '高中',
        orderNo: 2,
        checked: 0, // 是否默认
        complete: 0, // 是否允许填空
        requireComplete: 0, // 是否为必填
        completeValue: '', // 填空的内容
        image: '', // 图片
        description: '',// 说明
        forward: '', // 选择该选项跳转到那里
        score: 0, // 分值
      },
      {
        answer: '大学专科',
        orderNo: 3,
        checked: 0, // 是否默认
        complete: 0, // 是否允许填空
        requireComplete: 0, // 是否为必填
        completeValue: '', // 填空的内容
        image: '', // 图片
        description: '',// 说明
        forward: '', // 选择该选项跳转到那里
        score: 0, // 分值
      },
      {
        answer: '大学本科',
        orderNo: 4,
        checked: 0, // 是否默认
        complete: 0, // 是否允许填空
        requireComplete: 0, // 是否为必填
        completeValue: '', // 填空的内容
        image: '', // 图片
        description: '',// 说明
        forward: '', // 选择该选项跳转到那里
        score: 0, // 分值
      },
      {
        answer: '硕士研究生',
        orderNo: 5,
        checked: 0, // 是否默认
        complete: 0, // 是否允许填空
        requireComplete: 0, // 是否为必填
        completeValue: '', // 填空的内容
        image: '', // 图片
        description: '',// 说明
        forward: '', // 选择该选项跳转到那里
        score: 0, // 分值
      },
      {
        answer: '博士研究生',
        orderNo: 6,
        checked: 0, // 是否默认
        complete: 0, // 是否允许填空
        requireComplete: 0, // 是否为必填
        completeValue: '', // 填空的内容
        image: '', // 图片
        description: '',// 说明
        forward: '', // 选择该选项跳转到那里
        score: 0, // 分值
      }
    ]
  },

  income: {
    name: '收入',
    title: '您的月平均收入是？',
    answerTip: '',  // 答题提示
    sequence: 0, // 题号
    type: 1,
    remark: '',
    ssOrderNo: 0, // section排序
    requireAnswer: 1, // 需要回答
    userAnswer: '', // 用户答案
    columns: 1, // 答案列数，1列代表每一个答案一行
    dependent: '', // 依赖哪个题目的选项出现
    dependentVisible: 0, // 当多个问题被关联的时候，问题之间的关系。且(1)-或(0)
    forward: '', // 无条件跳转到
    forwardType: 0, // 0，默认 1，无条件跳转 2，按选项跳转
    answer: [
      {
        answer: '3000元以下',
        orderNo: 1,
        checked: 0, // 是否默认
        complete: 0, // 是否允许填空
        requireComplete: 0, // 是否为必填
        completeValue: '', // 填空的内容
        image: '', // 图片
        description: '',// 说明
        forward: '', // 选择该选项跳转到那里
        score: 0, // 分值
      },
      {
        answer: '3000-5000元',
        orderNo: 2,
        checked: 0, // 是否默认
        complete: 0, // 是否允许填空
        requireComplete: 0, // 是否为必填
        completeValue: '', // 填空的内容
        image: '', // 图片
        description: '',// 说明
        forward: '', // 选择该选项跳转到那里
        score: 0, // 分值
      },
      {
        answer: '3000-5000元',
        orderNo: 3,
        checked: 0, // 是否默认
        complete: 0, // 是否允许填空
        requireComplete: 0, // 是否为必填
        completeValue: '', // 填空的内容
        image: '', // 图片
        description: '',// 说明
        forward: '', // 选择该选项跳转到那里
        score: 0, // 分值
      },
      {
        answer: '5000-10000元',
        orderNo: 4,
        checked: 0, // 是否默认
        complete: 0, // 是否允许填空
        requireComplete: 0, // 是否为必填
        completeValue: '', // 填空的内容
        image: '', // 图片
        description: '',// 说明
        forward: '', // 选择该选项跳转到那里
        score: 0, // 分值
      },
      {
        answer: '10000-20000元',
        orderNo: 5,
        checked: 0, // 是否默认
        complete: 0, // 是否允许填空
        requireComplete: 0, // 是否为必填
        completeValue: '', // 填空的内容
        image: '', // 图片
        description: '',// 说明
        forward: '', // 选择该选项跳转到那里
        score: 0, // 分值
      },
      {
        answer: '20000元以上',
        orderNo: 6,
        checked: 0, // 是否默认
        complete: 0, // 是否允许填空
        requireComplete: 0, // 是否为必填
        completeValue: '', // 填空的内容
        image: '', // 图片
        description: '',// 说明
        forward: '', // 选择该选项跳转到那里
        score: 0, // 分值
      }
    ]
  },

  age: {
    name: '年龄',
    title: '您的年龄？',
    answerTip: '',  // 答题提示
    sequence: 0, // 题号
    type: 1,
    remark: '',
    ssOrderNo: 0, // section排序
    requireAnswer: 1, // 需要回答
    userAnswer: '', // 用户答案
    columns: 1, // 答案列数，1列代表每一个答案一行
    dependent: '', // 依赖哪个题目的选项出现
    dependentVisible: 0, // 当多个问题被关联的时候，问题之间的关系。且(1)-或(0)
    forward: '', // 无条件跳转到
    forwardType: 0, // 0，默认 1，无条件跳转 2，按选项跳转
    answer: [
      {
        answer: '18岁以下',
        orderNo: 1,
        checked: 0, // 是否默认
        complete: 0, // 是否允许填空
        requireComplete: 0, // 是否为必填
        completeValue: '', // 填空的内容
        image: '', // 图片
        description: '',// 说明
        forward: '', // 选择该选项跳转到那里
        score: 0, // 分值
      },
      {
        answer: '18~25',
        orderNo: 2,
        checked: 0, // 是否默认
        complete: 0, // 是否允许填空
        requireComplete: 0, // 是否为必填
        completeValue: '', // 填空的内容
        image: '', // 图片
        description: '',// 说明
        forward: '', // 选择该选项跳转到那里
        score: 0, // 分值
      },
      {
        answer: '26~30',
        orderNo: 3,
        checked: 0, // 是否默认
        complete: 0, // 是否允许填空
        requireComplete: 0, // 是否为必填
        completeValue: '', // 填空的内容
        image: '', // 图片
        description: '',// 说明
        forward: '', // 选择该选项跳转到那里
        score: 0, // 分值
      },
      {
        answer: '31~40',
        orderNo: 4,
        checked: 0, // 是否默认
        complete: 0, // 是否允许填空
        requireComplete: 0, // 是否为必填
        completeValue: '', // 填空的内容
        image: '', // 图片
        description: '',// 说明
        forward: '', // 选择该选项跳转到那里
        score: 0, // 分值
      },
      {
        answer: '41~50',
        orderNo: 5,
        checked: 0, // 是否默认
        complete: 0, // 是否允许填空
        requireComplete: 0, // 是否为必填
        completeValue: '', // 填空的内容
        image: '', // 图片
        description: '',// 说明
        forward: '', // 选择该选项跳转到那里
        score: 0, // 分值
      },
      {
        answer: '51~60',
        orderNo: 6,
        checked: 0, // 是否默认
        complete: 0, // 是否允许填空
        requireComplete: 0, // 是否为必填
        completeValue: '', // 填空的内容
        image: '', // 图片
        description: '',// 说明
        forward: '', // 选择该选项跳转到那里
        score: 0, // 分值
      },
      {
        answer: '60以上',
        orderNo: 7,
        checked: 0, // 是否默认
        complete: 0, // 是否允许填空
        requireComplete: 0, // 是否为必填
        completeValue: '', // 填空的内容
        image: '', // 图片
        description: '',// 说明
        forward: '', // 选择该选项跳转到那里
        score: 0, // 分值
      }
    ]
  },


}
