
/**
 * 生成饼图
 *
 * @param row
 * @param radius
 */
export function pieChart(row, radius, isAvg){

  let data = [], titles = [];

  for(let option of row.answer){

    if(row['ignoreZero'] === true && option.total === 0){
      continue;
    }

    data.push({
      value: option.total,
      name: option.answer
    });

    titles.push(option.answer);

  }

  return {
    title: {
      text: row.title,
      left: 'left'
    },
    tooltip: {
      formatter: isAvg ? "{b} <br/> 平均值: {c}" : "{b} : {c} ({d}%)"
    },
    legend: {
      bottom: 10,
      orient: 'vertical',
      x: 'right',
      y: 'bottom',
      data: titles
    },
    series: [
      {
        avoidLabelOverlap: false,
        label: {
          normal: {
              show: false,
              position: 'center'
          },
        },
        type: 'pie',
        radius: radius,
        data: data
      }
    ]
  };
}


/**
 * 生成饼图
 * 适用于：矩阵单选，矩阵多选
 * @param row
 * @param radius
 */
export function matrixPieChart(row, radius, isAvg) {

  let answer = row.answer;
  let vertical = row.vertical;

  let totalArray = [];
  for(let i = 0; i < row.vertical.length; i++){
    if(!(!!totalArray[i])){
      totalArray[i] = 0;
    }

    for(let answer of row.answer[i]){
      totalArray[i] += answer.total;
    }
  }

  let data = [];

  /*
  data = [{
    value: 0,
    name: '',
    items: [
      {value: 0, name: '', percent: 0},
      {}
    ]
  }]
   */

  for(let i = 0; i < answer.length; i++){

    for(let j = 0; j < answer[i].length; j++) {

      let t = answer[i][j].total;

      if (!!!data[j]) {

        data[j] = {value: t, name: answer[i][j].answer};

      } else {

        data[j].value += t;

      }

      if (!!!data[j]['items'])
        data[j]['items'] = [];

      let item = {
        value: t,
        name: vertical[i],
        percent: Math.round(10000* t / totalArray[i])/100
      };

      data[j]['items'][i] = item;

    }
  }

  return {
    title: {
      text: row.title,
      left: 'left'
    },
    tooltip: {
      formatter: function(params){

        if(isAvg){
          // 显示平均值

           let str = [], items = params.data['items'];
           str.push(params['marker'] + params['name'] + " (平均值)");

           for(let i = 0; i < items.length; i++){
            let item = items[i];
            str.push(item['name'] + ' : ' + item['value']);
          }
          return str.join('<br/>');


        } else {

          let str = [], items = params.data['items'];
          str.push(params['marker'] + params['name']
            + ' : ' + params['value'] + ' ('+params['percent']+'%)');
          for(let i = 0; i < items.length; i++){
            let item = items[i];
            str.push(item['name'] + ' : ' + item['value']
              + ' (' + item['percent'] + '%)');
          }
          return str.join('<br/>');

        }

      }
    },
    legend: {
      orient: 'vertical',
      x: 'right',
      y: 'bottom'
    },
    series: [
      {
        type:'pie',
        radius: radius,
        avoidLabelOverlap: false,
        label: {
          normal: {
            show: false,
            position: 'center'
          },
        },
        data: data
      }
    ]
  };
}


/**
 * 生成柱状图
 *
 * @param row
 */
export function barChart(row, isHorizontal, isAvg) {

  let titles = [], percents = [], total = 0;

  if(!!!isAvg){
    for(let answer of row.answer){
      total += answer.total;
    }
  }

  for(let option of row.answer){

    if(row['ignoreZero'] === true && option.total === 0){
      continue;
    }

    if(!!isAvg){
      percents.push(option.total);
    } else {
      percents.push(Math.round(option.total/total*10000)/100);
    }


    titles.push(option.answer);

  }

  console.info(titles, percents);

  let xAxisData = { type: 'category', data: titles};
  let yAxisData = { type: 'value' };

  return {
    title: {
      text: row.title,
      left: 'left'
    },
    tooltip: {
      axisPointer: {
        type: 'shadow'
      },
      formatter:  isAvg ? "{b} <br/> 平均值: {c}" : "{b} : ({c}%)"
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: !!isHorizontal ? yAxisData : xAxisData,
    yAxis: !!isHorizontal ? xAxisData : yAxisData,
    series: [
      {
        type: 'bar',
        barWidth: '50%',
        data: percents
      }
    ]
  }
}

/**
 * 矩阵垂直柱状图
 *
 * @param row
 */
export function matrixBarChart(row, isHorizontal, isAvg) {

  let sourceData = [], barSeries = [], totalArray = [], dimensions = ['选项'];

  for(let i = 0; i < row.vertical.length; i++){
    barSeries.push({type: 'bar'});
    dimensions.push(row.vertical[i]);

    if(!(!!totalArray[i])){
      totalArray[i] = 0;
    }

    if(!isAvg){

      for(let answer of row.answer[i]){
        totalArray[i] += answer.total;
      }

    } else {

      totalArray[i] = 5;

    }

  }

  sourceData.push(dimensions);



  for(let i = 0; i < row.answer.length; i++){

    for(let j = 0; j < row.answer[i].length; j++){

      let array = [row.answer[i][j].answer];
      for(let x = 0; x < row.vertical.length; x++){
        // array.push(row.answer[x][j].total);
        if(isAvg){
          array.push(row.answer[x][j].total);
        } else {
          array.push(Math.round(10000* row.answer[x][j].total / totalArray[x])/100);
        }

      }

      sourceData.push(array);
    }

  }

  let xAxisData = { type: 'category' };
  let yAxisData = { type: 'value' };

  return {
    title: {
      text: row.title,
      left: 'left'
    },
    legend: {
      x: 'right'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    tooltip: {
      formatter: function (params) {

        if(isAvg){

          return params.marker + params.seriesName + ' (平均值) <br/>'
            + params.name + " : " + params.value[params.seriesIndex + 1];

        } else {

          return params.seriesName + '<br/>'
            + params.marker + params.name + " : ("
            + params.value[params.seriesIndex + 1] + "%)";

        }


      },
      axisPointer: {
        type: 'shadow'
      },
    },
    dataset: {
      source: sourceData
    },
    xAxis: !!isHorizontal ? yAxisData : xAxisData,
    yAxis: !!isHorizontal ? xAxisData : yAxisData,
    series: barSeries
  }
}


export default {
  pieChart,
  matrixPieChart,
  barChart,
  matrixBarChart
}
