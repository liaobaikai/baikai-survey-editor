<template>

  <span>
    <el-link
      :type="!!question.remark ? 'primary' : ''"
      :underline="false"
      @click="editQuestionRemark"
      style="text-decoration: underline; color: #666;">填写提示</el-link>
    <!-- 填写提示、问题备注 -->
    <el-dialog
      title="填写提示"
      :visible.sync="remarkDialogVisible"
      :lock-scroll="false"
      :close-on-click-modal="false">
      <div class="dialog-body">

        <quill-editor
          class="dialog-quill-editor"
          v-model="remark"
          ref="descriptionQuillEditor"
          :options="editorOption"></quill-editor>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="remarkDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="updateQuestionRemark">确定</el-button>
      </span>

    </el-dialog>
  </span>

</template>

<script>

    import { quillEditor } from 'vue-quill-editor';

    export default {
        name: "RemarkDialog",
      props: ['question'],
      components: {quillEditor},
      data: function () {
        return {
          // ---------- 填写提示对话框 -------------------
          remarkDialogVisible: false,    // 填写提示对话框
          remark: '',
          editorOption: {
            placeholder: '请填写提示',
          }
        }
      },
      methods: {
        /**
         * 填写提示、问题备注
         */
        editQuestionRemark: function(){
          this.remark = this.question.remark;
          this.remarkDialogVisible = true;
        },

        /**
         * 更新用户填写的"填写提示"
         */
        updateQuestionRemark: function(){
          this.$set(this.question, 'remark', this.remark);
          this.remarkDialogVisible = false;
        },
      }
    }
</script>

<style scoped>

</style>
