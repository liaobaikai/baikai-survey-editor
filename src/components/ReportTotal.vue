<template>
    <tr style="background-color: #fdf6ec">
      <td v-if="!!rowTitleCol"><div></div></td>
      <td class="option text-center"><div>本题有效填写人数</div></td>
      <td class="sub-total text-center"><div>{{total}}</div></td>
      <td class="scale"></td>
    </tr>
</template>

<script>
    export default {
        name: "ReportTotal",
      props: ['rowTitleCol', 'total']
    }
</script>

<style>

</style>
