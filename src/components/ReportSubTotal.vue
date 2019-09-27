<template>
    <tr style="background-color: #f4f4f5">
      <td v-if="!!rowTitleCol"><div></div></td>
      <td class="option text-center"><div>
        <template v-if="!!!title">小计</template>
        <template v-else>{{title}}</template>
      </div></td>
      <td class="sub-total text-center"><div>
        <template v-if="!!total">{{total}}</template>
        <template v-else>0</template>
      </div></td>
      <td class="scale"></td>
    </tr>
</template>

<script>
    export default {
        name: "ReportSubTotal",
      props: ['rowTitleCol', 'total', "title"]
    }
</script>

<style>

</style>
