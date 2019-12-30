<!-- 矩阵编辑器 -->

<template>

  <div>

    <div class="matrix-oper matrix-table">
      <!-- 表格填空题 -->
      <div class="row-title">
        <div class="title matrix-table">行标题</div>
        <el-input type="textarea" rows="5" v-model="vertical" @blur="changeVertical"></el-input>
      </div>

      <div class="col-title">
        <div class="title matrix-table">列标题</div>
        <el-input type="textarea" rows="5" v-model="horizontal" @blur="changeHorizontal"></el-input>
      </div>

    </div>


  </div>

</template>

<script>

    import questionTemplate from "../../js/question.template";

    export default {
        name: "MatrixEditor",
      props: ['question'],
      data: function () {
        return {
          matrixQuestion: questionTemplate.matrixQuestion,
          vertical: '',
          horizontal: '',
        }
      },
      mounted: function(){

        this.initVertical();
        this.initHorizontal();

      },
      computed: {

        isSingleMatrix: function(){
          return this.question.type === this.matrixQuestion.single.type;
        },

        isMultipleMatrix: function(){
          return this.question.type === this.matrixQuestion.multiple.type;
        },

        isScoreMatrix: function(){
          return this.question.type === this.matrixQuestion.score.type;
        },


      },
      methods: {

        // 初始化行数据
        initVertical: function(){

          this.vertical = '';

          for(let v of this.question.vertical){
            this.vertical += v + '\n';
          }

        },

        // 初始化列数据
        initHorizontal: function(){

          this.horizontal = '';

          for(let h of this.question.horizontal){
            this.horizontal += h + '\n';
          }

        },

        /**
         * 修改行标题
         */
        changeVertical: function () {
          let verticals = this.vertical.split(/[(\r\n)\r\n]+/);

          // 实际长度
          let len = 0;

          // 重置
          this.$set(this.question, 'userAnswer', []);

          for(let i = 0; i < verticals.length; i++){
            if(!!verticals[i]){
              len++; // 实际长度

              //
              let vertical = this.question.vertical[i];
              if(!!vertical){
                if(vertical !== verticals[i]){
                  this.$set(this.question.vertical, i, verticals[i]);
                }
              } else {
                this.question.vertical.splice(i + 1, 0, verticals[i]);
              }

              if(this.question.type === this.matrixQuestion.multiple.type || this.question.type === this.matrixQuestion.score.type){
                  this.question.userAnswer.push([]);
              }

            }

          }


          if(len < this.question.vertical.length && (this.question.type === this.matrixQuestion.multiple.type || this.question.type === this.matrixQuestion.score.type)){
            // 删除后面的
            this.question.vertical.splice(len, (this.question.vertical.length - len));
          }

          if(len === 0){
            this.$set(this.question, 'vertical', JSON.parse(JSON.stringify(
              this.isSingleMatrix ? this.matrixQuestion.single.vertical : this.matrixQuestion.multiple.vertical
            )));
            this.initVertical();
          }

        },

        /**
         * 修改列标题
         */
        changeHorizontal: function () {

          let horizontals = this.horizontal.split(/[(\r\n)\r\n]+/);

          // 实际长度
          let len = 0;

          for(let i = 0; i < horizontals.length; i++) {
            if (!!horizontals[i]) {
              len++; // 实际长度

              let horizontal = this.question.horizontal[i];
              if(!!horizontal){

                if(horizontal !== horizontals[i]){
                  this.$set(this.question.horizontal, i, horizontals[i]);
                }
              } else {
                this.question.horizontal.splice(i + 1, 0, horizontals[i]);
              }

            }

          }

          if(len < this.question.horizontal.length){
            // 删除后面的
            this.question.horizontal.splice(len, (this.question.horizontal.length - len));
          }

          if(len === 0){
            this.$set(this.question, 'horizontal',  JSON.parse(JSON.stringify(
              this.isSingleMatrix ? this.matrixQuestion.single.horizontal : this.matrixQuestion.multiple.horizontal
            )));
            this.initHorizontal();
          }
        }
      }
    }
</script>

<style scoped>

</style>
