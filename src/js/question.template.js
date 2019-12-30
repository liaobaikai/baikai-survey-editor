
// 问题模板
// @Author: baikai.liao@qq.com
// @2019-07-21

export default {

  /**
   * 选择题
   */
  choiceQuestion: {
    // 单选
    single: {
      name: '单选题',
      title: '标题：',
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
          answer: '选项1',
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
          answer: '选项2',
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
          answer: '选项3',
          orderNo: 3,
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
    // 多选
    multiple: {
      name: '多选题',
      title: '标题',
      answerTip: '',  // 答题提示
      dependent: '', // 依赖哪个题目的选项出现
      dependentVisible: 0, // 当多个问题被关联的时候，问题之间的关系。且(1)-或(0)
      forward: '', // 无条件跳转到
      forwardType: 0, // 0，默认 1，无条件跳转 2，按选项跳转
      sequence: 0, // 题号
      type: 2,
      remark: '',
      ssOrderNo: 0, // section排序
      requireAnswer: 1, // 需要回答
      minAnswer: '', // 最小选择
      maxAnswer: '', // 最多选择
      userAnswer: [], // 用户答案
      columns: 1, // 答案列数，1列代表每一个答案一行
      answer: [
        {
          answer: '选项1',
          orderNo: 1,
          checked: 0, // 是否默认
          complete: 0, // 是否允许填空
          requireComplete: 0, // 是否为必填
          completeValue: '', // 填空的内容
          image: '', // 图片
          description: '', // 说明
          score: 0, // 分值
        },
        {
          answer: '选项2',
          orderNo: 2,
          checked: 0, // 是否默认
          complete: 0, // 是否允许填空
          completeValue: '', // 填空的内容
          requireComplete: 0, // 是否为必填
          image: '', // 图片
          description: '', // 说明
          score: 0, // 分值
        },
        {
          answer: '选项3',
          orderNo: 3,
          checked: 0, // 是否默认
          complete: 0, // 是否允许填空
          completeValue: '', // 填空的内容
          requireComplete: 0, // 是否为必填
          image: '', // 图片
          description: '', // 说明
          score: 0, // 分值
        }
      ]
    },
    // 列表/下拉
    list: {
      name: '下拉题',
      title: '标题',
      answerTip: '',  // 答题提示
      sequence: 0, // 题号
      dependent: '', // 依赖哪个题目的选项出现
      dependentVisible: 0, // 当多个问题被关联的时候，问题之间的关系。且(1)-或(0)
      forward: '', // 无条件跳转到
      forwardType: 0, // 0，默认 1，无条件跳转 2，按选项跳转
      type: 3,
      remark: '',
      ssOrderNo: 0, // section排序
      requireAnswer: 1, // 需要回答
      userAnswer: '', // 用户答案
      columns: 1, // 答案列数，1列代表每一个答案一行
      answer: [
        {
          answer: '选项1',
          orderNo: 1,
          checked: 0, // 是否默认
          forward: '', // 选择该选项跳转到那里
        },
        {
          answer: '选项2',
          orderNo: 2,
          checked: 0, // 是否默认
          forward: '', // 选择该选项跳转到那里
        },
        {
          answer: '选项3',
          orderNo: 3,
          checked: 0, // 是否默认
          forward: '', // 选择该选项跳转到那里
        }
      ]
    },
    // 单选
    scoreSingle: {
      name: '评分单选',
      title: '标题',
      answerTip: '',  // 答题提示
      sequence: 0, // 题号
      type: 16,
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
          answer: '选项1',
          orderNo: 1,
          checked: 0, // 是否默认
          complete: 0, // 是否允许填空
          requireComplete: 0, // 是否为必填
          completeValue: '', // 填空的内容
          image: '', // 图片
          description: '',// 说明
          forward: '', // 选择该选项跳转到那里
          score: 5, // 分值
        },
        {
          answer: '选项2',
          orderNo: 2,
          checked: 0, // 是否默认
          complete: 0, // 是否允许填空
          requireComplete: 0, // 是否为必填
          completeValue: '', // 填空的内容
          image: '', // 图片
          description: '',// 说明
          forward: '', // 选择该选项跳转到那里
          score: 4, // 分值
        },
        {
          answer: '选项3',
          orderNo: 3,
          checked: 0, // 是否默认
          complete: 0, // 是否允许填空
          requireComplete: 0, // 是否为必填
          completeValue: '', // 填空的内容
          image: '', // 图片
          description: '',// 说明
          forward: '', // 选择该选项跳转到那里
          score: 3, // 分值
        }
      ]
    },
    // 多选
    scoreMultiple: {
      name: '评分多选',
      title: '标题',
      answerTip: '',  // 答题提示
      dependent: '', // 依赖哪个题目的选项出现
      dependentVisible: 0, // 当多个问题被关联的时候，问题之间的关系。且(1)-或(0)
      forward: '', // 无条件跳转到
      forwardType: 0, // 0，默认 1，无条件跳转 2，按选项跳转
      sequence: 0, // 题号
      type: 17,
      remark: '多选题',
      ssOrderNo: 0, // section排序
      requireAnswer: 1, // 需要回答
      minAnswer: '', // 最小选择
      maxAnswer: '', // 最多选择
      userAnswer: [], // 用户答案
      columns: 1, // 答案列数，1列代表每一个答案一行
      answer: [
        {
          answer: '选项1',
          orderNo: 1,
          checked: 0, // 是否默认
          complete: 0, // 是否允许填空
          requireComplete: 0, // 是否为必填
          completeValue: '', // 填空的内容
          image: '', // 图片
          description: '', // 说明
          score: 1, // 分值
        },
        {
          answer: '选项2',
          orderNo: 2,
          checked: 0, // 是否默认
          complete: 0, // 是否允许填空
          completeValue: '', // 填空的内容
          requireComplete: 0, // 是否为必填
          image: '', // 图片
          description: '', // 说明
          score: 2, // 分值
        },
        {
          answer: '选项3',
          orderNo: 3,
          checked: 0, // 是否默认
          complete: 0, // 是否允许填空
          completeValue: '', // 填空的内容
          requireComplete: 0, // 是否为必填
          image: '', // 图片
          description: '', // 说明
          score: 3, // 分值
        }
      ]
    },
  },

  /**
   * 填空题
   */
  completionQuestion: {

    // 单项填空
    single: {
      name: '单项填空',
      title: '标题',
      answerTip: '',  // 答题提示
      dependent: '', // 依赖哪个题目的选项出现
      dependentVisible: 0, // 当多个问题被关联的时候，问题之间的关系。且(1)-或(0)
      forward: '', // 无条件跳转到
      forwardType: 0, // 0，默认 1，无条件跳转 2，按选项跳转
      sequence: 0, // 题号
      type: 5,
      remark: '',
      ssOrderNo: 0, // section排序
      requireAnswer: 1, // 需要回答
      userAnswer: '', // 用户答案
      columns: 2, // 答案列数，1列代表每一个答案一行
      rows: 1, // 多少行
      dataType: 0,  // 引用：completionDataTypes
      dataMax: '', // 最大值
      dataMin: '', // 最小值
      underlineStyle: 0,  // 是否使用下划线样式
    },

    // 矩阵填空
    // 标题
    // 外观 _________
    // 功能 _________
    matrix: {
      name: '矩阵填空',
      title: '标题',
      answerTip: '',  // 答题提示
      dependent: '', // 依赖哪个题目的选项出现
      dependentVisible: 0, // 当多个问题被关联的时候，问题之间的关系。且(1)-或(0)
      forward: '', // 无条件跳转到
      forwardType: 0, // 0，默认 1，无条件跳转 2，按选项跳转
      sequence: 0, // 题号
      type: 8,
      remark: '',
      ssOrderNo: 0, // section排序
      requireAnswer: 1, // 需要回答
      userAnswer: ['', '', ''], // 用户答案
      dataRows: 1, // 多少行
      columns: 2, // 答案列数，1列代表每一个答案一行
      underlineStyle: 0,  // 是否使用下划线样式
      answer: [
        {
          answer: '选项1',
          orderNo: 1,
          dataType: 0,  // 引用：completionDataTypes
          dataMax: '', // 最大值
          dataMin: '', // 最小值
          requireComplete: 0, // 是否为必填
          uniqueValue: 0, // 是否唯一
        },
        {
          answer: '选项2',
          orderNo: 2,
          dataType: 0,  // 引用：completionDataTypes
          dataMax: '', // 最大值
          dataMin: '', // 最小值
          requireComplete: 0, // 是否为必填
          uniqueValue: 0, // 是否唯一
        },
        {
          answer: '选项3',
          orderNo: 3,
          dataType: 0,  // 引用：completionDataTypes
          dataMax: '', // 最大值
          dataMin: '', // 最小值
          requireComplete: 0, // 是否为必填
          uniqueValue: 0, // 是否唯一
        }
      ]
    },

    // 表格填空
    table: {
      name: '表格填空',
      title: '标题',
      answerTip: '',  // 答题提示
      sequence: 0, // 题号
      dependent: '', // 依赖哪个题目的选项出现
      dependentVisible: 0, // 当多个问题被关联的时候，问题之间的关系。且(1)-或(0)
      forward: '', // 无条件跳转到
      forwardType: 0, // 0，默认 1，无条件跳转 2，按选项跳转
      type: 9,
      remark: '',
      dataRows: 1,
      ssOrderNo: 0, // section排序
      requireAnswer: 1, // 需要回答
      answer: [
        {
          answer: '选项1',
          dataType: 0,  // 引用：completionDataTypes
          dataMax: '', // 最大值
          dataMin: '', // 最小值
          requireComplete: 0, // 是否为必填
          uniqueValue: 0, // 是否唯一
        },
        {
          answer: '选项2',
          dataType: 0,  // 引用：completionDataTypes
          dataMax: '', // 最大值
          dataMin: '', // 最小值
          requireComplete: 0, // 是否为必填
          uniqueValue: 0, // 是否唯一
        },{
          answer: '选项3',
          dataType: 0,  // 引用：completionDataTypes
          dataMax: '', // 最大值
          dataMin: '', // 最小值
          requireComplete: 0, // 是否为必填
          uniqueValue: 0, // 是否唯一
        }],
      vertical: ['行标题1', '行标题2'],
      userAnswer: [["", "", ""], ["", "", ""]], // 用户答案
      columns: 2, // 答案列数，1列代表每一个答案一行
      underlineStyle: 0,  // 是否使用下划线样式
    }

  },

  // 附件：分页，段落
  plugin: {

    // 分页
    section: {
      name: '分页',
      type: 10,
    },

    // 段落
    paragraph: {
      name: '段落',
      title: '段落内容',
      type: 11,
      dependent: '', // 依赖哪个题目的选项出现
      ssOrderNo: 0, // section排序
    }

  },

  // 矩阵题
  matrixQuestion: {

    // 矩阵单选
    single: {
      name: '矩阵单选',
      title: '标题',
      answerTip: '',  // 答题提示
      sequence: 0, // 题号
      dependent: '', // 依赖哪个题目的选项出现
      dependentVisible: 0, // 当多个问题被关联的时候，问题之间的关系。且(1)-或(0)
      forward: '', // 无条件跳转到
      forwardType: 0, // 0，默认 1，无条件跳转 2，按选项跳转
      type: 12,
      remark: '',
      ssOrderNo: 0, // section排序
      requireAnswer: 1, // 需要回答
      horizontal: ['列1', '列2', '列3'],
      vertical: ['行1', '行2'],
      userAnswer: [], // 用户答案
    },

    // 矩阵多选
    multiple: {
      name: '矩阵多选',
      title: '标题',
      answerTip: '',  // 答题提示
      sequence: 0, // 题号
      dependent: '', // 依赖哪个题目的选项出现
      dependentVisible: 0, // 当多个问题被关联的时候，问题之间的关系。且(1)-或(0)
      forward: '', // 无条件跳转到
      forwardType: 0, // 0，默认 1，无条件跳转 2，按选项跳转
      type: 13,
      remark: '',
      ssOrderNo: 0, // section排序
      requireAnswer: 1, // 需要回答
      horizontal: ['列1', '列2', '列3'],
      vertical: ['行1', '行2'],
      userAnswer: [[], []], // 用户答案
    },

    // 矩阵评分
    score: {
      name: '矩阵评分',
      title: '标题',
      answerTip: '',  // 答题提示
      sequence: 0, // 题号
      dependent: '', // 依赖哪个题目的选项出现
      dependentVisible: 0, // 当多个问题被关联的时候，问题之间的关系。且(1)-或(0)
      forward: '', // 无条件跳转到
      forwardType: 0, // 0，默认 1，无条件跳转 2，按选项跳转
      type: 20,
      remark: '',
      ssOrderNo: 0, // section排序
      requireAnswer: 1, // 需要回答
      horizontal: ['列1', '列2', '列3'],
      vertical: ['行1', '行2'],
      userAnswer: [[], []], // 用户答案
    },

  },

  scoreQuestion: {
    // 评分题
    single: {
      name: '单项评分',
      title: '标题',
      answerTip: '',  // 答题提示
      remark: '单项评分题',
      dependent: '', // 依赖哪个题目的选项出现
      dependentVisible: 0, // 当多个问题被关联的时候，问题之间的关系。且(1)-或(0)
      forward: '', // 无条件跳转到
      forwardType: 0, // 0，默认 1，无条件跳转 2，按选项跳转
      sequence: 0, // 题号
      type: 14,
      vertical: ['行1'],
      userAnswer: 0, // 用户答案
      requireAnswer: 1, // 需要回答
    },

    // 评分题
    multiple: {
      name: '多项评分',
      title: '标题',
      answerTip: '',  // 答题提示
      remark: '多项评分',
      dependent: '', // 依赖哪个题目的选项出现
      dependentVisible: 0, // 当多个问题被关联的时候，问题之间的关系。且(1)-或(0)
      forward: '', // 无条件跳转到
      forwardType: 0, // 0，默认 1，无条件跳转 2，按选项跳转
      sequence: 0, // 题号
      type: 15,
      vertical: ['行1', '行2'],
      userAnswer: [0, 0], // 用户答案
      requireAnswer: 1, // 需要回答
    },
  },

  /**
   * 其他题型
   */
  others: {

    sort: {
      name: '排序题',
      answerTip: '',  // 答题提示
      dependent: '', // 依赖哪个题目的选项出现
      dependentVisible: 0, // 当多个问题被关联的时候，问题之间的关系。且(1)-或(0)
      forward: '', // 无条件跳转到
      forwardType: 0, // 0，默认 1，无条件跳转 2，按选项跳转
      title: '标题',
      sequence: 0, // 题号
      type: 18,
      minAnswer: '', // 最小选择
      maxAnswer: '', // 最多选择
      userAnswer: [], // 用户答案
      requireAnswer: 1, // 需要回答
      remark: '', //备注
      columns: 1, // 答案列数，1列代表每一个答案一行
      answer: [
        {
          answer: '选项1',
          orderNo: 1,
          complete: 0, // 是否允许填空
          requireComplete: 0, // 是否为必填
          completeValue: '', // 填空的内容
          image: '', // 图片
          userAnswer: 0, // 用户排序
        },
        {
          answer: '选项2',
          orderNo: 2,
          complete: 0, // 是否允许填空
          requireComplete: 0, // 是否为必填
          completeValue: '', // 填空的内容
          image: '', // 图片
          userAnswer: 0, // 用户排序
        },
        {
          answer: '选项3',
          orderNo: 3,
          complete: 0, // 是否允许填空
          requireComplete: 0, // 是否为必填
          completeValue: '', // 填空的内容
          image: '', // 图片
          userAnswer: 0, // 用户排序
        }
      ]
    },

  }

}
