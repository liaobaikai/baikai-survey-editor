<template>
    <tr>

      <td v-if="!!rowTitle" style="width: 120px; text-align: center" :rowspan="rowspan">
        <div>
          {{rowTitle}}
        </div>
      </td>

      <td class="option text-center">
        <div>{{option}}</div>
      </td>

      <td class="sub-total text-center">
        <div>{{total}}</div>
      </td>

      <td class="scale" v-if="!!isScoreQuestion">
        <div>
          <el-progress v-if="!!showDataScaleBar"
                       :percentage="total/5*100"></el-progress>
          <span v-else>{{total/5*100 + '%'}}</span>
        </div>

      </td>
      <td class="scale" v-else>
        <div>
          <el-progress :id="progressId" v-if="!!showDataScaleBar"
                       :percentage="Math.round(percentage*100)"></el-progress>
          <span v-else>{{Math.round(10000*this.percentage)/100 + '%'}}</span>

          <!--<img v-if="!!dataURL" :src="dataURL"/>-->
        </div>
      </td>

    </tr>
</template>

<script>
    // import html2canvas from 'html2canvas';

    export default {
        name: "ReportRow",
      props: ['rowspan', 'rowTitle', 'option', 'total', 'percentage', 'showDataScaleBar', "isScoreQuestion"],
      data: function(){
        return {
          progressId: 'process_id_' + new Date().getTime() + '-' + Math.random(),
          progressId2: 'process_id_' + new Date().getTime() + '-' + Math.random(),
          // dataURL: null
        }
      },
      mounted() {


        let ele = document.getElementById(this.progressId);
        if(ele){
          ele.lastChild.innerHTML = Math.round(10000*this.percentage)/100 + '%';
        }


        // setTimeout(()=> {
        //   //
        //   html2canvas(document.getElementById(this.progressId2)).then((canvas) => {
        //     let dataURL = canvas.toDataURL("image/png");
        //     this.dataURL = dataURL;
        //   });
        //
        //
        // }, 0);

      }
    }
</script>

<style>

  th > div{
    color: #000;
    font-weight: bold;
    font-size: 14px;
  }

  td > div{
    color: #444;
    font-size: 14px;
  }

  .el-progress{
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .el-progress .el-progress__text{
    min-width: 50px;
    text-align: right;
  }

</style>
