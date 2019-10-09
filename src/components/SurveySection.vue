<!--
// @Author: baikai.liao@qq.com
// 问卷section/分页
-->

<template>

  <div class="survey-section" >

    <div class="section-info" v-if="editable">

      <div class="section-page-info">[ 第{{currentPage}}页/共{{pageCount}}页 ]</div>

      <div class="tool-bar">

        <div class="left">

          <el-link
            type="primary"
            @click="insertToSection(sections[currentPage-1], currentPage-1)" v-if="insertSection === null">在此插入新题
          </el-link>
          <el-link
            type="primary"
            @click="cancelInsertToSection" v-else>取消插入点
          </el-link>

        </div>

        <div class="right" v-if="currentPage > 1">

          <el-link
            class="operation"
            icon="el-icon-delete"
            @click="removeSection(sections[currentPage-1], currentPage-1)">删除</el-link>
          <el-link
            class="operation"
            icon="el-icon-top"
            @click="moveUpSection(sections[currentPage-1], currentPage-1)">上移</el-link>
          <el-link
            class="operation"
            icon="el-icon-bottom"
            @click="moveDownSection(sections[currentPage-1], currentPage-1)">下移</el-link>
          <el-link
            class="operation"
            icon="el-icon-download rotate180"
            @click="moveToFirstSection(sections[currentPage-1], currentPage-1)">最前</el-link>
          <el-link
            class="operation"
            icon="el-icon-download"
            @click="moveToLastSection(sections[currentPage-1], currentPage-1)">最后</el-link>
        </div>


      </div>

    </div>

    <!-- 问卷是否可以编辑 -->
    <template v-for="item in fragments">


      <question
        v-if="isVisible"
        :question="item"
        :id="'ssqid_' + item.id"
        :showSequence="showSequence"
        :editable="editable"
        :sections="sections"
        :insertPoint="insertPoint"
        :readonly="readonly"
        @finish-edit="finishEdit"
        @change-value="onChangeValue"
        @insert="insertItem"
        @cancel-insert="cancelInsertItem"
        @edit="editItem"
        @remove="removeItem"
        @duplicate="duplicateItem"
        @move-up="moveUp"
        @move-down="moveDown"
        @move-to-first="moveToFirst"
        @move-to-last="moveToLast"
        @upload-file="onUploadFile"></question>

    </template>

  </div>

</template>

<script>


    import Question from "./Question";

    export default {
      name: "SurveySection",
      components: {Question},
      props: ['fragments', 'questionSequences', 'editable', 'readonly',
        'showSequence', 'sections', 'currentPage', 'pageCount', 'insertPoint'],
      data: function(){
        return {
          insertSection: null,
        }
      },
      computed: {
        /**
         * 是否为可见状态，如果没有存在依赖关系的话，是可见的。
         * 如果有依赖关系，在非编辑中是不能显示的，非常符合显示的条件。
         */
        isVisible: function(){

          return this.editable
            || !!this.question.dependent
            || this.question.dependent.length === 0;

        }
      },
      methods: {

        onUploadFile: function(file, editor, index){
          this.$emit('upload-file', file, editor, index);
        },

        onUpdated: function (e) {
          console.info(e);
          // this.$emit();
        },
        onChangeValue: function(q){
          this.$emit('change-value', q);
        },

        /**
         * 在此题后插入新题
         */
        insertItem: function (q) {
          this.$emit('insert', q);
        },

        /**
         * 编辑
         * @param id
         * @param e
         */
        editItem: function(q){
          this.$emit('edit', q);
        },

        /**
         * 取消插入点
         */
        cancelInsertItem: function () {
          this.$emit('cancel-insert');
        },

        /**
         * 复制
         * @param id
         * @param e
         */
        duplicateItem: function(q){
          this.$emit('duplicate', q);
        },

        /**
         * 删除
         * @param id
         * @param e
         */
        removeItem: function(q){
          this.$emit('remove', q);
        },

        /**
         * 上移
         * @param id
         * @param e
         */
        moveUp: function(q){
          this.$emit('move-up', q);
        },

        /**
         * 下移
         * @param id
         * @param e
         */
        moveDown: function(q){
          this.$emit('move-down', q);
        },

        /**
         * 移到开头
         * 如果是第一个，则提示，第一题不能再上移啦
         * @param id
         * @param e
         */
        moveToFirst: function(q){
          this.$emit('move-to-first', q);
        },

        /**
         * 移到结尾
         * 如果最后第一个，则提示，最后一题不能再下移啦
         * @param id
         * @param e
         */
        moveToLast: function(q){
          this.$emit('move-to-last', q);
        },

        /**
         * 在分页插入新题
         */
        insertToSection: function (section) {
          this.insertSection = section;
          this.$emit('insert-section', section);
        },

        /**
        * 取消插入点
        */
        cancelInsertToSection: function () {
          this.insertSection = null;
          this.$emit('cancel-insert-section');
        },

        /**
         * 改变问题类型
         */
        // changeQuestionType: function(q){
        //   this.$emit('change-question-type', q);
        // },

        /**
         * 删除分页
         */
        removeSection: function (section, index) {
          // 如果这个分页有fragments
          let fragments = section['fragments'];

          let prevSectionFragments;

          if(fragments.length > 0){

            prevSectionFragments = this.sections[index - 1]['fragments'];
            for(let f of fragments){
              prevSectionFragments.push(f);
            }

          }

          let deleted = this.sections.splice(index, 1);

          // 删除分页
          this.$emit('section-remove', deleted[0]);

        },

        /**
         * 分页上移，意思是将上一个分页的题目，移到这个分页中。
         *
         * @param section
         * @param index
         */
        moveUpSection: function (section, index) {

          let fragments = this.sections[index - 1]['fragments'];

          if(fragments.length > 0){
            // 获取题目
            this.moveDown(fragments[fragments.length - 1]);
          }

        },

        /**
         * 下移分页，意思是将后面的题目上移
         * @param section
         * @param index
         */
        moveDownSection: function (section, index) {

          let fragments = this.sections[index]['fragments'];

          if(fragments.length > 0){
            // 获取题目
            this.moveUp(fragments[0]);
          }

        },

        /**
         * 将分页移到第2，将题目留在上一个分页。
         *
         * @param section
         * @param index
         */
        moveToFirstSection: function (section, index) {

          let fragments = section['fragments'];

          // 将这个分页的问题移动到上一个分页中
          if(fragments.length > 0){

            let array = fragments.splice(0, fragments.length);

            let prevSectionFragments = this.sections[index - 1]['fragments'];

            for(let i = 0, len = array.length; i < len; i++){
              prevSectionFragments.splice(len + i + 1, 0, array[i]);

              // 更新ssid
              array[i]['ssid'] = this.sections[index - 1]['id'];
            }

          }

          // 将第一页的问题移动到第二页
          let secondSection = this.sections.splice(index, 1)[0];

          let firstFragments = this.sections[0]['fragments'];

          console.info(firstFragments);

          if(firstFragments.length > 0){

            let array = firstFragments.splice(0, firstFragments.length);

            console.info("firstFragments" , array);

            let secondSectionFragments = secondSection['fragments'];

            for(let i = 0, len = array.length; i < len; i++){
              secondSectionFragments.splice(len + i + 1, 0, array[i]);

              // 更新ssid
              array[i]['ssid'] = secondSection['id'];
            }

            console.info('secondSectionFragments', secondSectionFragments);

          }

          this.sections.splice(1, 0, secondSection);

          // 移动到最前面
          this.$emit('section-move-to-first', secondSection);

        },

        /**
         * 将分页移到最后面，将题目留在上一个分页。
         *
         * @param section
         * @param index
         */
        moveToLastSection: function (section, index) {

          let fragments = section['fragments'];

          if(fragments.length > 0){

            let array = fragments.splice(0, fragments.length);

            let prevSectionFragments = this.sections[index - 1]['fragments'];

            for(let i = 0, len = array.length; i < len; i++){
              prevSectionFragments.splice(len + i + 1, 0, array[i]);
            }

          }

          let deleted = this.sections.splice(index, 1);
          this.sections.splice(this.sections.length + 1, 0, deleted[0]);

          // 移动到最后面
          this.$emit('section-move-to-last', deleted[0]);

        },

        /**
         * 完成编辑
         */
        finishEdit: function (q) {
          this.$emit('finish-edit', q);
        },
      }
    }
</script>

<style scoped>

  .section-info{
    padding: 2rem 2rem 1rem 2rem;
    font-size: 14px;
    color: #6a6a6a;
  }

  .section-info .section-page-info{
    text-align: center;
  }

  .section-info{
    border-bottom: 1px solid #DCDFE6;
  }

  .section-info .tool-bar{
    visibility: hidden;
    display: flex;
    margin-top: 10px;
    justify-content: space-between;
  }

  .section-info .tool-bar .operation{
    margin-left: 10px;
  }

  .section-info:hover .tool-bar{
    visibility: visible;
  }


</style>
