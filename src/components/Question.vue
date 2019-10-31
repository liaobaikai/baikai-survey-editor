<!-- 多选题 -->
<!--
// @Author: baikai.liao@qq.com
// 问题
-->
<template>


  <div class="question" :class="[ !!question.invalid ? 'invalid' : '']">

    <div class="question-preview" :class="'type-' + question.type">

      <div class="question-title">
        <!--不是分页，段落的话，就显示-->

        <template v-if="isQuestion">
          <span
            class="question-require-answer"
            v-if="question.requireAnswer"><b>*</b></span>
        </template>

        <div class="question-content">

          <div style="display: flex">

            <template v-if="isQuestion">

              <span
                class="question-sequence" style="margin-right: 5px;"
                v-if="showSequence">{{question.sequence}}. </span>

            </template>

            <div class="title" v-html="question.title"></div>
            <span style="color: #999; font-size: 14px;" v-if="question.answerTip">[{{question.answerTip}}]</span>


          </div>
          <!--不是分页，段落的话，就显示-->
          <div class="remark"
               v-if="question.remark && isQuestion" v-html="question.remark"></div>

        </div>

      </div>

      <!--题目答案-->
      <div class="question-answer"
           v-if="isQuestion">

        <!-- 选择题 -->
        <choice-answer
          v-if="isChoiceQuestion"
          @change-value="onChangeValue"
          @handle-forward="handleForward"
          @handle-forward-seq="forwardSequence"
          :sections="sections"
          :question="question"
          :readonly="readonly"
          :editable="editable"></choice-answer>


        <!-- 填空题 -->
        <completion-answer
          v-else-if="isCompletionQuestion"
          @handle-forward="handleForward"
          @handle-forward-seq="forwardSequence"
          :question="question"
          :sections="sections"
          :readonly="readonly"
          @change-value="onChangeValue"
          :editable="editable"></completion-answer>

        <!-- 矩阵题 -->
        <matrix-answer
          v-else-if="isMatrixQuestion"
          @handle-forward="handleForward"
          @handle-forward-seq="forwardSequence"
          :question="question"
          :sections="sections"
          :readonly="readonly"
          @change-value="onChangeValue"
          :editable="editable"></matrix-answer>

        <!-- 评分题 -->
        <score-answer
          v-else-if="isScoreQuestion"
          @handle-forward="handleForward"
          @handle-forward-seq="forwardSequence"
          :question="question"
          :sections="sections"
          :readonly="readonly"
          @change-value="onChangeValue"
          :editable="editable"></score-answer>

        <!--其他题型-->
        <other-answer
          v-else-if="isOthers"
          @handle-forward="handleForward"
          @handle-forward-seq="forwardSequence"
          :question="question"
          :sections="sections"
          :readonly="readonly"
          @change-value="onChangeValue"
          :editable="editable"></other-answer>


        <!-- 题目依赖提示 -->
        <div class="question-dependent"
             v-if="editable && !!this.question.dependent && typeof this.question.dependent === 'object'">
          <el-tooltip placement="bottom">
            <div slot="content">
              <span>当题目</span><br/>
              <template v-for="d of question.dependent">
                <span>
                  <strong>{{d.question.sequence}}.{{d.question.title.replace(/<\/?.+?\/?>/g, '').replace(/<[^>]+>/g, '')}}</strong> 选择
                  <template v-for="(so, index) of d.selectOptions">
                    [ {{d.question.answer[index]}} ]
                    <template v-if="index !== d.selectOptions.length - 1">、</template>
                  </template>
                  中的
                  <template v-if="d.combo === 0">其中一个</template>
                  <template v-else>全部选项</template>
                  时，<br/>
                </span>
              </template>
              此题才显示
            </div>
            <span>
              <span>依赖于</span>
              <span v-for="(d, index) of question.dependent" :key="index">
                第{{d.question.sequence}}题的第{{d.selectOptions.join('、')}}个选项
                <span v-if="index < question.dependent.length - 1
                    && question.dependentVisible === 1">和</span>
              </span>
            </span>
          </el-tooltip>
        </div>

        <!-- 题目跳转提示，无条件跳转 -->
        <div class="question-forward" v-if="hasForward">
          <span>*此题设置了跳转逻辑</span>
          <span style="color:#ff6600;">
            <template v-if="!!question.forward">
              <template v-if="question.forward > 1">
                (跳转到第{{question.forward}}题)
              </template>
              <template v-else>(结束作答)</template>
            </template>
          </span>
        </div>


      </div>

      <el-alert v-if="!!question.invalid && !!question['invalidMsg']" :closable="false" :title="question['invalidMsg']"
                type="error"></el-alert>

      <div v-if="editable && !!!question.editing" class="tool-bar">

        <div class="left">

          <el-link
            type="primary"
            @click="insertItem"
            v-if="!!insertPoint && insertPoint.id == null || question.id !== insertPoint.id">在此题后插入新题
          </el-link>
          <el-link
            type="primary"
            @click="cancelInsertItem" v-else>取消插入点
          </el-link>

        </div>

        <div class="right">
          <el-link
            class="operation"
            icon="el-icon-edit"
            :underline="false"
            @click="editItem">编辑
          </el-link>
          <el-link
            class="operation"
            :underline="false"
            icon="el-icon-copy-document"
            @click="duplicateItem">复制
          </el-link>
          <el-link
            class="operation"
            :underline="false"
            icon="el-icon-delete"
            @click="removeItem">删除
          </el-link>
          <el-link
            class="operation"
            icon="el-icon-top"
            :underline="false"
            @click="moveUp">上移
          </el-link>
          <el-link
            class="operation"
            icon="el-icon-bottom"
            :underline="false"
            @click="moveDown">下移
          </el-link>
          <el-link
            class="operation"
            :underline="false"
            icon="el-icon-download rotate180"
            @click="moveToFirst">最前
          </el-link>
          <el-link
            class="operation"
            :underline="false"
            icon="el-icon-download"
            @click="moveToLast">最后
          </el-link>
        </div>


      </div>

    </div>


    <!--选择编辑器-->
    <div class="question-editor" v-if="editable && !!question.editing">

      <div style="position:relative; text-align: left; margin-left: 2rem">
        <span class="triangle-up-outline"></span>
        <span class="triangle-up"></span>
      </div>

      <!-- 标题编辑 -->
      <!--<quill-editor-->
      <!--class="question-quill-editor"-->
      <!--v-model="question.title"-->
      <!--ref="descriptionQuillEditor"-->
      <!--:options="editorOption"-->
      <!--@change="onTitleChange"></quill-editor>-->
      <my-quill-editor
        class="question-quill-editor"
        v-model="question.title"
        style="margin-top: 10px"
        @change="onTitleChange"
        @upload-file="onUploadFile"></my-quill-editor>


      <div class="question-info" v-if="isQuestion">
        <!-- 问题类型，是否必答，填写提示 -->
        <span class="title">题型</span>
        <el-select
          v-model="question.type"
          @change="onChangeQuestionType">

          <!-- 选择题 -->
          <template v-if="isChoiceQuestion">
            <el-option
              v-for="item in choiceQuestion"
              :key="item.name"
              :label="item.name"
              :value="item.type"></el-option>
          </template>
          <!-- 填空题 -->
          <template v-if="isCompletionQuestion">
            <el-option
              v-for="item in completionQuestion"
              :key="item.name"
              :label="item.name"
              :value="item.type"></el-option>
          </template>

          <!-- 矩阵题 -->
          <template v-if="isMatrixQuestion">
            <el-option
              v-for="item in matrixQuestion"
              :key="item.name"
              :label="item.name"
              :value="item.type"></el-option>
            <!-- 表格填空 -->
            <!--<el-option :tag="completionQuestion.table.name" :value="completionQuestion.table.type"></el-option>-->
          </template>

          <!-- 评分题 -->
          <template v-if="isScoreQuestion">
            <el-option
              v-for="item in scoreQuestion"
              :key="item.name"
              :label="item.name"
              :value="item.type"></el-option>
          </template>

          <!-- 其他题型，排序题 -->
          <template v-if="isOthers">
            <el-option
              v-for="item in others"
              :key="item.name"
              :label="item.name"
              :value="item.type"></el-option>
          </template>


        </el-select>

        <el-checkbox
          style="margin-left: 1rem;"
          v-model="question.requireAnswer"
          :false-label="0" :true-label="1">必答
        </el-checkbox>

        <!-- 备注对话框 -->
        <remark-dialog :question="question" @upload-file="onUploadFile"></remark-dialog>

      </div>

      <!--选择题-->
      <choice-editor
        v-if="isChoiceQuestion || isSortQuestion"
        :question="question"
        :sections="sections"
        @upload-file="onUploadFile"></choice-editor>

      <!-- 填空题 -->
      <completion-editor
        v-if="isCompletionQuestion"
        :question="question"
        :sections="sections"></completion-editor>

      <!-- 矩阵题 -->
      <matrix-editor
        v-if="isMatrixQuestion && !isMatrixTableQuestion"
        :question="question"
        :sections="sections"></matrix-editor>

      <!-- 评分题, 单项，多项 -->
      <score-editor
        v-if="isScoreQuestion"
        :question="question"
        :sections="sections"></score-editor>


      <!-- 逻辑设置 -->
      <div class="settings">

        <span class="title">逻辑设置：</span>

        <dependent-dialog :question="question"
                          :sections="sections"></dependent-dialog>
        <forward-dialog :question="question" v-if="isQuestion"
                        :sections="sections"
                        :isSingleChoiceQuestion="isSingleChoiceQuestion"></forward-dialog>

        <!--<el-link icon="el-icon-paperclip">选项关联</el-link>-->

      </div>

      <div style="text-align: center; margin: 1rem">
        <el-button
          type="primary"
          @click="finishEdit">完成编辑
        </el-button>
      </div>

    </div>

  </div>

</template>

<script>

    // import { quillEditor } from 'vue-quill-editor';

    import ChoiceEditor from "./editor/ChoiceEditor";
    import CompletionEditor from "./editor/CompletionEditor";

    import questionTemplate from "../js/question.template";
    import DependentDialog from "./dialog/DependentDialog";
    import ForwardDialog from "./dialog/ForwardDialog";
    import RemarkDialog from "./dialog/RemarkDialog";
    import ChoiceAnswer from "./answer/ChoiceAnswer";
    import CompletionAnswer from "./answer/CompletionAnswer";
    import MatrixAnswer from "./answer/MatrixAnswer";
    import ScoreAnswer from "./answer/ScoreAnswer";
    import OtherAnswer from "./answer/OtherAnswer";
    import MatrixEditor from "./editor/MatrixEditor";
    import ScoreEditor from "./editor/ScoreEditor";
    import '../assets/css/question.css';
    import MyQuillEditor from "./MyQuillEditor";

    export default {
        name: "Question",
        components: {
            MyQuillEditor,
            ScoreEditor,
            MatrixEditor,
            OtherAnswer,
            ScoreAnswer,
            MatrixAnswer,
            CompletionAnswer,
            ChoiceAnswer,
            RemarkDialog,
            ForwardDialog,
            DependentDialog,
            CompletionEditor,
            ChoiceEditor
        },
        props: ['question', 'sections', 'editable', 'showSequence', 'insertPoint', 'readonly'],
        data: function () {
            return {

                choiceQuestion: questionTemplate.choiceQuestion,
                completionQuestion: questionTemplate.completionQuestion,
                matrixQuestion: questionTemplate.matrixQuestion,
                scoreQuestion: questionTemplate.scoreQuestion,
                others: questionTemplate.others,

                plugin: questionTemplate.plugin,
                editorOption: {
                    placeholder: '',
                },
                userAnswerBackup: "",
            }
        },

        created() {

            // 判断当前问题是否有依赖的问题，如果有依赖的问题，那个问题是否显示，如果不显示，则当前问题也不能显示。

            if (!!this.question.userAnswer) {

                this.userAnswerBackup = JSON.parse(JSON.stringify(this.question.userAnswer));
            }

            if (!!this.question.answer) {

                for (let answer of this.question.answer) {

                    if (!!answer && !!answer.answer) {

                        this.$set(answer, 'answer', answer.answer.replace(/<\/?.+?\/?>/g, '').replace(/<[^>]+>/g, ''));

                    }

                }

            }

        },

        watch: {
            'question': {
                handler: function (newVal) {

                    newVal.updated = true;


                },
                deep: true
            },
        },

        computed: {


            /**
             * 该题是否有跳转逻辑
             */
            hasForward: function () {

                if (this.editable && !!this.question.forward) return true;

                if (this.editable && !!this.question.answer) {

                    for (let answer of this.question.answer) {

                        if (!!answer.forward && answer.forward !== '0') {
                            return this.editable && true;
                        }

                    }

                }

                return false;
            },

            /**
             * 判断是否是问题
             * 非段落和分页
             */
            isQuestion: function () {
                return (this.question.type !== this.plugin.section.type
                    && this.question.type !== this.plugin.paragraph.type);
            },

            /**
             * 是选择题
             * 单选题，
             * 多选题
             * 下拉题
             * 评分单选
             * 评分多选
             */
            isChoiceQuestion: function () {
                return (this.question.type === this.choiceQuestion.single.type
                    || this.question.type === this.choiceQuestion.multiple.type
                    || this.question.type === this.choiceQuestion.list.type
                    || this.question.type === this.choiceQuestion.scoreSingle.type
                    || this.question.type === this.choiceQuestion.scoreMultiple.type);
            },

            // 单选题，下拉题
            isSingleChoiceQuestion: function () {
                return (this.question.type === this.choiceQuestion.single.type
                    || this.question.type === this.choiceQuestion.list.type
                    || this.question.type === this.choiceQuestion.scoreSingle.type);
            },

            /**
             * 填空题
             * 单项填空
             * 矩阵填空
             * 表格填空
             */
            isCompletionQuestion: function () {
                return (this.question.type === this.completionQuestion.single.type
                    || this.question.type === this.completionQuestion.matrix.type
                    || this.question.type === this.completionQuestion.table.type);
            },

            /**
             * 矩阵题
             * 矩阵单选
             * 矩阵多选
             * 表格填空
             */
            isMatrixQuestion: function () {
                return (this.question.type === this.matrixQuestion.single.type
                    || this.question.type === this.matrixQuestion.multiple.type
                    || this.question.type === this.completionQuestion.table.type
                    || this.question.type === this.matrixQuestion.score.type);
            },

            /**
             * 矩阵表格
             */
            isMatrixTableQuestion: function () {
                return this.question.type === this.completionQuestion.table.type;
            },
            /**
             * 判断是否为评分题
             * 单项评分
             * 多项评分
             */
            isScoreQuestion: function () {
                return (this.question.type === this.scoreQuestion.single.type
                    || this.question.type === this.scoreQuestion.multiple.type);
            },

            /**
             * 其他题型，
             * 排序题
             */
            isOthers: function () {
                return this.question.type === this.others.sort.type;
            },

            /**
             * 排序题
             */
            isSortQuestion: function () {
                return this.question.type === this.others.sort.type;
            }
        },

        methods: {

            // 上传图片
            onUploadFile: function (file, editor, index) {

                this.$emit('upload-file', file, editor, index);

            },


            // 通过问题ID获取问题
            getQuestionById: function (qid) {

                // 对依赖的问题进行显示。。。
                for (let sections of this.sections) {
                    //
                    for (let fragment of sections['fragments']) {

                        if (fragment.id === qid) {
                            return fragment;
                        }

                    }
                }

                return null;

            },

            onChangeValue: function (q) {
                this.$emit('change-value', q);
            },


            /*重置问题类型*/
            resetUserAnswer: function(q){

                console.info('resetUserAnswer', q);

                if(q.type === this.scoreQuestion.single.type){
                    this.$set(q, 'userAnswer', 0);
                } else if(typeof q.userAnswer === 'string'){
                    this.$set(q, 'userAnswer', '');
                } else if(q.userAnswer instanceof Array){

                    if(q.userAnswer[0] instanceof Array){

                        if(q.type === this.completionQuestion.table.type){

                            let array = [];
                            for(let i = 0; i < q.userAnswer.length; i++){
                                array[i] = [];
                                for(let j = 0; j < q.answer.length; j++){
                                    array[i][j] = '';
                                }

                            }

                            this.$set(q, 'userAnswer', array);

                        } else {

                            for(let item of q.userAnswer){
                                item.splice(0, item.length);
                            }

                        }


                    } else {

                        if(q.type === this.scoreQuestion.multiple.type || q.type === 8){

                            for(let i = 0; i < q.userAnswer.length; i++){

                                if(q.type === this.scoreQuestion.multiple.type){
                                    q.userAnswer[i] = 0;
                                } else if(q.type === this.completionQuestion.matrix.type){
                                    q.userAnswer[i] = '';
                                }
                            }

                        } else {
                            q.userAnswer.splice(0, q.userAnswer.length);
                        }

                    }


                }


            },

            /**
             * 跳转到指定的序号
             */
            forwardSequence: function (sequence, reset) {

                for (let sections of this.sections) {
                    //
                    for (let fragment of sections['fragments']) {

                        // 重置
                        if (!!reset) {

                            if (fragment.sequence > this.question.sequence && (fragment.sequence < sequence || sequence === -1) /*跳到问卷末尾结束作答*/) {

                                this.$delete(fragment, 'hide');
                                this.$delete(fragment, 'hideCausedBy');

                            }

                        } else {

                            // 设置
                            // question=1    hide=2   sequence=3
                            // question=1    hide=2,3   sequence=4
                            // question=1    hide=2,3,4   sequence=5
                            if (fragment.sequence > this.question.sequence && (fragment.sequence < sequence || sequence === -1)/*跳到问卷末尾结束作答*/) {

                                this.$set(fragment, 'hide', true);

                                if (sequence === -2) {
                                    // 直接提交为无效答卷
                                    this.$set(fragment, 'hideCausedBy', 'discard');
                                } else if (sequence === -1) {
                                    // 跳到问卷末尾结束作答
                                    this.$set(fragment, 'hideCausedBy', 'finish');
                                } else {
                                    // 范围
                                    this.$set(fragment, 'hideCausedBy', 'range');
                                }

                                // 重置答案
                                this.resetUserAnswer(fragment);


                                console.info('hide', fragment);

                            }

                        }
                    }
                }

            },

            /**
             * 处理跳转
             */
            handleForward: function () {

                console.info('handleForward', this.sections);

                // 判断是否有跳题
                // 如果有跳题的话，需要将两题之间的题目隐藏
                if (!!this.question.forwardType) {

                    // 如果不是默认的跳题类型，则需要跳题，
                    if (this.question.forwardType === 1) {
                        // 无条件跳转，
                        // this.question.forward <===> question.sequence

                        // 跳转到指定的题号
                        this.forwardSequence(this.question.forward);


                    } else if (this.question.forwardType === 2) {
                        // 选项跳转
                        // this.question.answer.forward <===> question.sequence


                        // 清空选中的情况
                        if (!!this.lastValue) {
                            // lastValue = index + 1;
                            let answer = this.question.answer[this.lastValue - 1];
                            if (!!answer['forward']) {
                                // 清空当前的值到上一次的
                                this.forwardSequence(answer['forward'], true);
                            }
                        }


                        // 跳转到指定的题号
                        for (let i = 0; i < this.question.answer.length; i++) {

                            let answer = this.question.answer[i];

                            if ((i + 1) === this.question.userAnswer && !!answer.forward) {
                                //
                                this.forwardSequence(answer.forward);
                                break;

                            } else {

                                this.forwardSequence(answer.forward, true);
                            }

                        }
                    }

                } else {

                    this.forwardSequence(undefined, true);

                }

            },


            /**
             * 在此题后插入新题
             */
            insertItem: function () {

                this.$emit('insert', this.question);
            },

            /**
             * 取消插入点
             */
            cancelInsertItem: function () {
                this.$emit('cancel-insert');
            },

            /**
             * 编辑
             * @param id
             * @param e
             */
            editItem: function () {

                this.$emit('edit', this.question);
            },

            /**
             * 复制
             * @param id
             * @param e
             */
            duplicateItem: function () {
                this.$emit('duplicate', this.question);
            },

            /**
             * 删除
             * @param id
             * @param e
             */
            removeItem: function () {
                this.$emit('remove', this.question);
            },

            /**
             * 上移
             * @param id
             * @param e
             */
            moveUp: function () {
                this.$emit('move-up', this.question);
            },

            /**
             * 下移
             * @param id
             * @param e
             */
            moveDown: function () {
                this.$emit('move-down', this.question);
            },

            /**
             * 移到开头
             * 如果是第一个，则提示，第一题不能再上移啦
             * @param id
             * @param e
             */
            moveToFirst: function () {
                this.$emit('move-to-first', this.question);
            },

            /**
             * 移到结尾
             * 如果最后第一个，则提示，最后一题不能再下移啦
             * @param id
             * @param e
             */
            moveToLast: function () {
                this.$emit('move-to-last', this.question);
            },

            /**
             * 完成编辑
             */
            finishEdit: function () {
                this.$delete(this.question, 'editing');

                console.info('finishEdit', this.question);
                this.$emit('finish-edit', this.question);
            },

            /**
             * 改变问题类型
             */
            onChangeQuestionType: function () {

                switch (this.question.type) {
                    case this.choiceQuestion.single.type:
                    case this.choiceQuestion.list.type:
                        this.$set(this.question, 'userAnswer', '');
                        break;
                    case this.choiceQuestion.multiple.type:
                        this.$set(this.question, 'userAnswer', []);
                        break;
                    case this.completionQuestion.single.type:
                        // 单项填空
                        this.$set(this.question, 'userAnswer', '');
                        // 清空answer
                        delete this.question.answer;
                        break;
                    case this.completionQuestion.matrix.type:
                        // 矩阵填空

                        // 添加矩阵answer
                        this.$set(this.question, 'answer', this.completionQuestion.matrix.answer);

                        {
                            let array = [];
                            for(let i = 0; i < this.question.answer.length; i++){
                                array[i] = '';
                            }

                            this.$set(this.question, 'userAnswer', array);
                        }

                        break;
                    case this.completionQuestion.table.type:
                        // 表格填空
                        this.$set(this.question, 'answer', this.completionQuestion.table.answer);
                        this.$set(this.question, 'vertical', this.completionQuestion.table.vertical);

                        {
                            let array = [];
                            for(let i = 0; i < this.question.vertical.length; i++){
                                array[i] = [];
                                for(let j = 0; j < this.question.horizontal.length; j++){
                                    array[i][j] = "";
                                }
                            }

                            this.$set(this.question, 'userAnswer', array);
                        }

                        break;
                    case this.scoreQuestion.single.type:
                        this.$set(this.question, 'userAnswer', 0);
                        // 只保留一个选项
                        console.info(this.question);

                        this.$set(this.question, 'vertical', this.question.vertical.splice(0, 1));

                        break;
                    case this.scoreQuestion.multiple.type:

                        let array = [];
                        for (let i = 0; i < this.question.vertical.length; i++) {
                            array.push(0);
                        }

                        this.$set(this.question, 'userAnswer', array);
                        break;
                }

                //
                this.$emit('change-question-type', this.question);

            },


            /*问题被修改*/
            onTitleChange: function (content) {
                this.$set(this.question, 'title', content);
            }
        },

        destroyed() {

            this.$set(this.question, 'userAnswer', this.userAnswerBackup);

            // 判断是否有问题依赖这个问题
            for (let section of this.sections) {

                for (let fragment of section['fragments']) {

                    if (!!fragment.dependent && !!fragment.dependent.length) {


                        for (let dq of fragment.dependent) {

                            if (dq.question.id === this.question.id) {
                                // 依赖本问题
                                // let q = this.getQuestionById(dq.question.id);

                                if (!!fragment) {
                                    // 依赖的问题重置显示
                                    if (!!fragment['dependentShow']) {
                                        this.$delete(fragment, 'dependentShow');
                                    }

                                }

                            }

                        }

                    }

                }

            }

        }
    }
</script>

