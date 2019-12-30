<!-- 选择编辑器 -->
<template>

  <div class="choice-question-editor">

    <!-- 答案选项 -->
    <div class="options">

      <table>

        <thead>
          <tr>
            <td class="option-input"><div>选项文字</div></td>
            <td class="option-oper"><div>操作</div></td>
            <template v-if="isSingleChoice || isMultipleChoice || isScoreSingleChoice || isScoreMultipleChoice || isSortQuestion">
              <!--<td class="option-picture"><div>图片</div></td>-->
              <td class="option-description" v-if="!isSortQuestion"><div>说明</div></td>
              <td class="option-complete"><div>允许填空</div></td>
            </template>
            <td class="option-checked" v-if="isSingleChoice || isMultipleChoice"><div>默认</div></td>
            <td class="option-score" v-if="isScoreSingleChoice || isScoreMultipleChoice"><div>分数</div></td>
            <td class="option-move"><div>上移/下移</div></td>
          </tr>
        </thead>

        <tbody>

          <tr v-for="(item, optionIndex) in question.answer">
            <td class="option-input">
              <div>
                <el-input
                  v-model="item.answer"
                  maxlength="50"
                  show-word-limit
                  @change="changeOptionText(question.answer[optionIndex], optionIndex)"/>
              </div>
            </td>
            <td class="option-oper">
              <div>
                <span title="在此选项后添加选项" class="design-icon el-icon-plus" @click="addOption(optionIndex)"></span>
                <span title="删除选项" class="design-icon el-icon-minus" @click="removeOption(optionIndex)"></span>
              </div>
            </td>
            <template v-if="isSingleChoice || isMultipleChoice || isScoreSingleChoice || isScoreMultipleChoice || isSortQuestion">
            <!--<td class="option-picture">-->
              <!--<div>-->
                <!--<span class="design-icon el-icon-picture"-->
                      <!--:class="[ !!item.image ? 'selected' : '']"-->
                      <!--@click="choiceOptionImageDialog(item, optionIndex)" title="添加图片"></span>-->
              <!--</div>-->
            <!--</td>-->
            <td class="option-description" v-if="!isSortQuestion">
              <div>
                <span class="design-icon el-icon-document"
                      :class="[ !!item.description ? 'selected' : '']"
                  @click="editAnswerDescription(item, optionIndex)"
                  title="选项说明，支持HTML，图片，视频"></span>
              </div>
            </td>
            <!-- 允许填空 -->
            <td class="option-complete">
              <div>
                <el-checkbox
                    v-model="item.complete"
                    @change="arrowComplete(item, optionIndex)"
                    :true-label="1" :false-label="0"/>

                <!-- 如果允许填空的话，则需要显示是否为必填 -->
                <span v-if="item.complete">
                  |
                  <el-checkbox
                    v-model="item.requireComplete"
                    @change="requireComplete(item, optionIndex)"
                    :true-label="1" :false-label="0"/>
                  <span>必填</span>
                </span>
              </div>
            </td>
            </template>
            <!-- 默认 -->
            <td class="option-checked" v-if="isSingleChoice || isMultipleChoice">
              <div>
                <el-checkbox
                  v-model="item.checked"
                  @change="checkedOption(item, optionIndex)"
                  :true-label="1" :false-label="0"/>

              </div>
            </td>

            <td class="option-score text-center" v-if="isScoreSingleChoice || isScoreMultipleChoice">
              <el-input v-model="item.score" style="width: 40px"/>
              <el-checkbox v-model="ignoreScores[optionIndex]" @change="ignoreScore(item, optionIndex)" :true-label="1" :false-label="0">不记分</el-checkbox>
            </td>

            <td class="option-move">
              <div>
                <span class="design-icon el-icon-top" @click="optionMoveUp(optionIndex)"></span>
                <span class="design-icon el-icon-bottom" @click="optionMoveDown(optionIndex)"></span>
              </div>
            </td>

          </tr>

        </tbody>

      </table>

    </div>

    <!-- 添加选项 -->
    <div class="other-oper">

      <!-- 添加选项 -->
      <!-- 批量添加 -->
      <div>
        <el-link icon="el-icon-circle-plus-outline" @click="addOption(undefined)">添加选项</el-link>
        <el-link icon="el-icon-circle-plus-outline" @click="batchDialogVisible = true">批量增加</el-link>
      </div>

      <div>

        <!-- 选项随机 -->
        <!-- 选项排列方式 -->
        <template v-if="isSingleChoice || isMultipleChoice || isScoreSingleChoice || isScoreMultipleChoice">

          <span class="title">分组设置</span>

          <!-- 至少选几项 >= -->
          <el-select
            v-if="isMultipleChoice"
            v-model="question.minAnswer"
            @change="changeAnswer"
            style="width: 120px">
            <el-option label="至少选几项" value=""></el-option>
            <el-option v-for="(item, index) of question.answer"
                       :key="index" :label="'至少选' + (index + 1) + '项'"
                       :value="index + 1"></el-option>
          </el-select>

          <!-- 至多选几项 <= -->
          <el-select
            v-if="isMultipleChoice"
            v-model="question.maxAnswer"
            @change="changeAnswer"
            style="width: 120px">
            <el-option label="至多选几项" value=""></el-option>
            <template v-for="(item, index) of question.answer">
              <el-option v-if="index > 0" :label="'至多选' + (index + 1) + '项'" :value="index + 1"></el-option>
            </template>

          </el-select>

          <el-select
            v-model="question.columns"
            style="width: 120px">
            <el-option :value="1" label="竖向排列"></el-option>
            <el-option-group label="横向排列">
              <el-option v-for="c of columns" :value="c" :label="'每行' + c + '列'" :key="c"></el-option>
            </el-option-group>
          </el-select>

        </template>

      </div>

    </div>


    <!-- 批量添加选项 -->
    <el-dialog
      title="批量添加选项"
      :lock-scroll="false"
      :close-on-click-modal="false"
      :visible.sync="batchDialogVisible">
      <div>
        <div style="">
          预定义选项：<el-select
            v-model="selectedOptionIndex"
            @change="selectOptions"
            style="margin-bottom: 20px">
            <el-option
              v-for="(item, index) of answerTemplate"
              :key="item.name"
              :label="item.name"
              :value="index"
              >
            </el-option>
          </el-select>

          <el-input
            type="textarea"
            :rows="10"
            v-model="batchOptions"
            placeholder="每一行一个选项，空行忽略。"
            resize="none"/>

        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="batchDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="batchDialogClose">确定</el-button>
      </span>

    </el-dialog>


    <!-- 图片上传dialog -->
    <!--<el-dialog-->
      <!--title="选择图片"-->
      <!--:visible.sync="choiceImageDialogVisible">-->
      <!--<div class="dialog-body" style="background-color: transparent">-->
        <!--<div style="height: 100%;">-->

          <!--<div style="display: flex; align-items: center;">-->
            <!--<el-input v-model="optionImageUrl"/>-->
            <!--<el-button type="danger" icon="el-icon-delete" style="margin-left: 1rem;" @click="optionImageUrl = ''"></el-button>-->
          <!--</div>-->

          <!--<div style="border:1px solid #d7d8d9; background-color: #f7f8f9; margin-top: 1.5rem; min-height: 250px;">-->
            <!--<el-upload-->
              <!--class="option-image-uploader"-->
              <!--action="http://localhost:8899/api/file/option/image/upload"-->
              <!--:show-file-list="false"-->
              <!--:on-success="handleAvatarSuccess"-->
              <!--:before-upload="beforeAvatarUpload">-->
              <!--<img v-if="optionImageUrl" :src="optionImageUrl" class="option-image">-->
              <!--<template v-else>-->
                <!--<i class="el-icon-plus avatar-uploader-icon" style="font-size: 4rem; margin-top: 40px"></i>-->
                <!--<div style="margin-top: 2rem; font-size: 1rem">-->
                    <!--<span>点击上传或<span style="color: red">复制粘贴图片</span>上传</span>-->
                <!--</div>-->
                <!--<div style="color: #999; font-size: 0.8rem; margin-top: 0.5rem;">不能超过2M</div>-->
              <!--</template>-->
            <!--</el-upload>-->

          <!--</div>-->

        <!--</div>-->
      <!--</div>-->
      <!--<span slot="footer" class="dialog-footer">-->
        <!--<el-button @click="choiceImageDialogVisible = false">取消</el-button>-->
        <!--<el-button type="primary" @click="closeChoiceImageDialog">确定</el-button>-->
      <!--</span>-->

    <!--</el-dialog>-->


    <!-- 说明编辑 -->
    <el-dialog
      title="选项说明"
      :visible.sync="descriptionDialogVisible"
      :lock-scroll="false"
      :close-on-click-modal="false">
      <div class="dialog-body">
        <div>

          <!-- 选项说明 -->
          <!--<quill-editor-->
            <!--class="answer-description-quill-editor"-->
              <!--v-model="optionDescription"-->
              <!--ref="descriptionQuillEditor"-->
              <!--:options="editorOption"></quill-editor>-->
          <my-quill-editor
            class="answer-description-quill-editor"
            v-model="optionDescription"
            @change="onChange"
            @upload-file="onUploadFile"></my-quill-editor>

        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="descriptionDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="closeAnswerDescriptionDialog">确定</el-button>
      </span>

    </el-dialog>


  </div>


</template>

<script>

    import {answerTemplate} from '../../js/question.answer.template'
    import questionTemplate from "../../js/question.template";
    // import { quillEditor } from 'vue-quill-editor';
    import MyQuillEditor from "../MyQuillEditor";

    export default {
        name: "ChoiceEditor",
      props: ['question', 'sections'],
      components: {MyQuillEditor},
      data: function () {
        return {
          choiceQuestion: questionTemplate.choiceQuestion,
          others: questionTemplate.others,

          editorOption: {},
          columns: [2,3,4,5,6,7,8,9,10,11,12,15,20,30],

          answerTemplate: answerTemplate,

          newOption: null,
          checkOption: null,
          checkOptions: [],
          // ---------- 批量添加 -------------------
          batchDialogVisible: false,    // dialog 是否显示
          selectedOptionIndex: null,    // dialog中的select选择的选项
          batchOptions: '',    // 批量添加的属性
          // ---------- 批量添加 -------------------

          // ---------- 选项说明 -------------------
          descriptionDialogVisible: false,
          descriptionIndex: 0,
          optionDescription: '',  // 选项说明

          // ---------- 图片选择 -------------------
          // choiceImageDialogVisible: false,
          // optionImageIndex: 0, //
          // optionImageUrl: '',   // 选项图片

          ignoreScores: [], // 不计分

        }
      },
      computed: {

        // 单选题
        isSingleChoice: function () {
          return this.question.type === this.choiceQuestion.single.type;
        },
        // 评分单选题
        isScoreSingleChoice: function () {
          return this.question.type === this.choiceQuestion.scoreSingle.type;
        },
        // 多选题
        isMultipleChoice: function () {
          return this.question.type === this.choiceQuestion.multiple.type;
        },

        // 多选题
        isScoreMultipleChoice: function () {
          return this.question.type === this.choiceQuestion.scoreMultiple.type;
        },

        // 下拉题
        isList : function(){
          return this.question.type === this.choiceQuestion.list.type;
        },
        /**
         * 排序题
         */
        isSortQuestion: function(){
          return this.question.type === this.others.sort.type;
        }

      },

      mounted: function(){

        // if(!!this.question.answer){
        //   let i = 0;
        //   for(let answer of this.question.answer){
        //     if(answer.score == '0' || answer.score === 0){
        //       this.ignoreScores[i++] = true;
        //     }
        //   }
        // }

      },

      created() {
          // 初始化批量添加的属性
          let array = [];
          for(let answer of this.question.answer){
            array.push(answer.answer);
          }
          this.batchOptions = array.join('\n');
      },

      methods: {

          onChange: function(content){
            this.optionDescription = content;

          },

          onUploadFile: function(file, editor, index){
            this.$emit('upload-file', file, editor, index);
          },

          /**
           * 不计分
           */
          ignoreScore: function(item, optionIndex){

            if(!!this.ignoreScores[optionIndex]){
              item.score = '0';
            }
          },

          /**
           * 至少选择
           */
          changeAnswer: function(){

              console.info(this.question);

            if(!!this.question.minAnswer && !!!this.question.maxAnswer){
              this.$set(this.question, 'answerTip', '至少选择' + this.question.minAnswer + '项');

              return;
            }

            if(!!!this.question.minAnswer && !!this.question.maxAnswer){
              this.$set(this.question, 'answerTip', '至多选择' + this.question.maxAnswer + '项');

              return;
            }

            if(this.question.minAnswer > this.question.maxAnswer){

              this.$set(this.question, 'minAnswer', this.question.maxAnswer);
              this.$message.error('要求用户最多选中选项数量不合法！');

            }

            let value = this.question.minAnswer;
            if(value !== this.question.maxAnswer){
              value += '-' + this.question.maxAnswer;
            }

            this.$set(this.question, 'answerTip', '请选择' + value + '项');

            console.info(this.question);
          },

          // handleAvatarSuccess(res, file) {
          //   this.optionImageUrl = URL.createObjectURL(file.raw);
          // },
          // beforeAvatarUpload(file) {
          //
          //   const isImage = (file.type === 'image/jpeg' || file.type === 'image/png');
          //   const isLt2M = file.size / 1024 / 1024 < 2;
          //
          //   if (!isImage) {
          //     this.$message.error('上传头像图片只能是 JPG 格式!');
          //   }
          //   if (!isLt2M) {
          //     this.$message.error('上传头像图片大小不能超过 2MB!');
          //   }
          //   return isImage && isLt2M;
          // },

          // /**
          //  * 图片选择对话框
          //  */
          // closeChoiceImageDialog: function(){
          //
          //   this.question.answer[this.optionImageIndex].image = this.optionImageUrl;
          //
          //   this.choiceImageDialogVisible = false;
          //
          // },

          // /**
          //  * 选择选项图片
          //  */
          // choiceOptionImageDialog: function(option, index){
          //
          //   this.optionImageIndex = index;
          //
          //   this.optionImageUrl = option.image;
          //
          //   this.choiceImageDialogVisible = true;
          //
          // },

          /**
           * 编辑选项说明
           */
          editAnswerDescription: function(option, index){
            this.descriptionIndex = index;
            // 初始化 之前的内容
            this.optionDescription = option.description;

            this.descriptionDialogVisible = true;
          },

        /**
         * 关闭选项说明对话框
         *
         * 保存已编辑过的内容
         */
        closeAnswerDescriptionDialog: function(){

          // this.question.answer[this.descriptionIndex].description = this.optionDescription;

          this.$set(this.question.answer[this.descriptionIndex], 'description', this.optionDescription);

          // console.info(this.question.answer[this.descriptionIndex].description)

          this.descriptionDialogVisible = false;

        },


        /**
         * 批量添加处理
         */
        batchDialogClose: function(){
          this.batchDialogVisible = false;

          let batchOptions = this.batchOptions.split(/[(\r\n)\r\n]+/);
          console.info('batchOptions', batchOptions);

          for(let i = 0; i < batchOptions.length; i++){

            if(!!batchOptions[i]){

              let answer = this.question.answer[i];

              if(!!answer){
                answer.answer = batchOptions[i];
              } else {
                this.addOption(-1, batchOptions[i]);
              }

            }

            this.updateOptionOrderNo();

          }

        },

        /**
         * 选择预定义选项
         */
        selectOptions: function(){
          this.batchOptions = this.answerTemplate[this.selectedOptionIndex].options.join('\r\n');
        },

        /**
         * 允许填空
         */
        arrowComplete: function(option){
          if(!option.complete){
            option.requireComplete = 0;
          }
        },

        /**
         * 是否为必填
         */
        requireComplete: function(option, index){

        },

        /**
         * 修改选项文本
         *
         */
        changeOptionText: function(option, index){

          console.info(option);

          for(let i = 0, len = this.question.answer.length; i < len; i++){
            let answer = this.question.answer[i];

            if(i !== index && answer.answer === option.answer){
              this.$message.error('选项不能有重复，请修改！');
              break;
            }
          }

        },

          /**
           * 该方法是点击复选框后才触发。。。
           *
           * 设置默认选中
           * 单选，下拉只能默认选中一个，
           * 多选可以默认选中多个
           *
           * @param option: 更新后的值
           */
        checkedOption: function(option, optionIndex){


          switch (this.question.type) {
            case this.choiceQuestion.single.type:
            case this.choiceQuestion.list.type:

              let checked = 1;

              // 如果之前的是已选，即 新值 为option.checked == false
              if(!option.checked){
                checked = 0;
                option.checked = 0;
                this.$set(this.question, 'userAnswer', '');
              }

              for(let answer of this.question.answer){
                if(!!answer.checked){
                  answer.checked = 0;
                }
              }

              if(!!checked){
                option.checked = 1;
                this.$set(this.question, 'userAnswer', optionIndex + 1);
              }

              break;
          }

        },


        /**
         * 批量添加选项
         */
        addBatchOption: function(){

        },
        /**
         * 添加选项
         * @param answerIndex
         */
        addOption: function (index, name) {

          console.info('addOption...');

          switch (this.question.type) {
            case this.choiceQuestion.single.type:
            case this.choiceQuestion.list.type:
            case this.choiceQuestion.multiple.type:
            case this.choiceQuestion.scoreSingle.type:
            case this.choiceQuestion.scoreMultiple.type:
            case this.others.sort.type:

              let option = null;
              if(this.newOption == null){
                option = this.question.answer[0];
              } else {
                option = this.newOption;
              }

              option = JSON.parse(JSON.stringify(option));
              delete option['id'];

              option['orderNo'] = this.question.answer.length + 1;


              if(!!name){

                option['answer'] = name;

              } else {

                let num = parseInt(option['answer'].replace(/[^\d]/g,''));
                option['answer'] = option['answer'].replace(num, num + 1);

              }



              if(index !== undefined && index >= 0){
                this.question.answer.splice(index + 1, 0, option);
              } else {
                this.question.answer.push(option);
              }

              this.newOption = option;

              break;

          }

          this.updateOptionOrderNo();

        },

        /**
         * 删除选项
         *
         * 题目不能少于两个选项
         *
         * @param answerIndex
         */
        removeOption: function(index){

          switch (this.question.type) {
            case this.choiceQuestion.single.type:
            case this.choiceQuestion.list.type:
            case this.choiceQuestion.multiple.type:
            case this.choiceQuestion.scoreSingle.type:
            case this.choiceQuestion.scoreMultiple.type:
            case this.others.sort.type:

              if (this.question.answer.length <= 1) {
                this.$message.error('请至少保留1个选项。');
                return;
              }

              this.question.answer.splice(index, 1);

              break;

          }

          this.updateOptionOrderNo();
        },

        /**
         * 选项上移
         */
        optionMoveUp: function(index){

          if(index === 0){
            this.$message.error('第一个选项不能上移');
            return;
          }

          let tmp = this.question.answer[index - 1]; // 获取上一个选项
          this.$set(this.question.answer, index - 1, this.question.answer[index]);  // 将上一个选项设置为当前的选项
          this.$set(this.question.answer, index, tmp); // 设置当前的选项为上一个选项

          this.updateOptionOrderNo();

        },

        /**
         * 选项下移
         * @param index 选项索引
         */
        optionMoveDown: function(index){

          if(index === this.question.answer.length - 1){
            this.$message.error('最后一个选项不能下移');
            return;
          }

          let tmp = this.question.answer[index + 1]; // 获取下一个选项
          this.$set(this.question.answer, index + 1, this.question.answer[index]);  // 将下一个选项设置为当前的选项
          this.$set(this.question.answer, index, tmp); // 设置当前的选项为下一个选项

          this.updateOptionOrderNo();

        },

        /**
         * 更新选项排序
         */
        updateOptionOrderNo: function(){

          if(!!this.question.answer){

            for(let i = 0; i < this.question.answer.length; i++){
              this.$set(this.question.answer[i], 'orderNo', i+1);
            }

          }

        }
      }
    }
</script>

<style>



</style>
