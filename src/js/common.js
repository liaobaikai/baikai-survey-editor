import questionTemplate from './question.template'

export const navMenu = [
  {
    collapse: false,
    title: '选择题',
    icons: ['iconfont icon-radio2', 'iconfont icon-checkbox', 'iconfont icon-select'],
    templates: [
      questionTemplate.choiceQuestion.single,
      questionTemplate.choiceQuestion.multiple,
      questionTemplate.choiceQuestion.list
    ],
  },
  {
    collapse: false,
    title: '填空题',
    icons: ['iconfont icon-radiofill', 'iconfont icon-matrix-completion', 'iconfont icon-table'],
    templates: [
      questionTemplate.completionQuestion.single,
      questionTemplate.completionQuestion.matrix,
      questionTemplate.completionQuestion.table
    ],
  },
  {
    collapse: false,
    title: '分页说明',
    icons: ['iconfont icon-pager', 'iconfont icon-paragraph'],
    templates: [
      questionTemplate.plugin.section,
      questionTemplate.plugin.paragraph
    ],
  },
  {
    collapse: false,
    title: '矩阵题',
    icons: ['iconfont icon-radio', 'iconfont icon-matrix-checkbox', 'iconfont icon-table', 'iconfont icon-matrix-checkbox'],
    templates: [
      questionTemplate.matrixQuestion.single,
      questionTemplate.matrixQuestion.multiple,
      questionTemplate.completionQuestion.table,
      questionTemplate.matrixQuestion.score,
    ],
  },
  {
    collapse: false,
    title: '评分题',
    icons: ['iconfont icon-star', 'iconfont icon-matrix-star', 'iconfont icon-radio', 'iconfont icon-checkbox'],
    templates: [
      questionTemplate.scoreQuestion.single,
      questionTemplate.scoreQuestion.multiple,
      questionTemplate.choiceQuestion.scoreSingle,
      questionTemplate.choiceQuestion.scoreMultiple
    ],
  },
  {
    collapse: false,
    title: '其他题型',
    icons: ['iconfont icon-order'],
    templates: [
      questionTemplate.others.sort
    ],
  },

];


export const surveyTemplate = {
    id: 0,
    title: '问卷标题',
    owner: 0,
    label: 0,
    description: '问卷说明',
    sections: [{
      fragments: []   // 碎片：题目、段落
    }],
    sectionType: 0, //
    currentSequence: 0, // 当前题号
    sequence: 1, // 是否显示题号
    submitAction: 1, // 提交后的操作
    submitForward: 'http://', // 提交后跳转到指定的URL
    submitText: '<h1 class="ql-align-center"><br></h1><h1 class="ql-align-center"><br></h1><h1 class="ql-align-center"><br></h1><h1 class="ql-align-center"><span style="color: rgb(178, 107, 0);">问卷到此结束，谢谢您的参与！</span></h1><p class="ql-align-center"><br></p><p class="ql-align-center"><br></p><p class="ql-align-center"><br></p><p class="ql-align-center"><br></p><p class="ql-align-center"><br></p>', // 提交后显示文案
  };

