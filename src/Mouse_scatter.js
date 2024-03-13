import React, {useRef} from 'react';
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
  VisualMapComponent,


} from 'echarts/components';
import { ScatterChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { useHistory } from 'react-router-dom';

echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
  ScatterChart,
  CanvasRenderer,
  UniversalTransition,
  VisualMapComponent,

]);

const Scat = (props) => {
  
  const path = props.path;
  const chartRef = useRef(null);
  const SampleSize = useRef(null);
  const Lambda = useRef(null);
  const history = useHistory();

  const handleLegendSelectChanged = (params, myChart, option) => {
    var selected = params.selected;
    var legendData = option.legend.data;
    // 将点击的图例设置为true，其他图例设置为false
    for (var i = 0; i < legendData.length; i++) {
      if (legendData[i] === params.name) {
        selected[legendData[i]] = true;
      } else {
        selected[legendData[i]] = false;
      }
    }
    // 更新图例选中状态
    myChart.setOption({
      legend: {
        selected: selected,
      }
    });
    myChart.off('legendselectchanged');
   
  };
 
  
  fetch(path)
    .then(response => response.text())
    .then(data1 => {
      const rows = data1.split("\n");
      const dataJson = [];
      const variety = rows[0].split("\t")[4];
      if (rows[0].split("\t").length == 7){
        SampleSize.current = rows[1].split("\t")[5];
        Lambda.current = rows[1].split("\t")[6];
      } else if (rows[0].split("\t").length == 8){
        SampleSize.current = rows[1].split("\t")[6];
        Lambda.current = rows[1].split("\t")[7];
      }

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i].split("\t");

        const x = parseInt(row[2]);
        const y = parseInt(row[3]);
        const z = parseFloat(row[4]);
        const name = row[1];

        dataJson.push({ name: name, x: x, y: y, z: z });
      }
    if (chartRef.current) {

      const myChart = echarts.init(chartRef.current);

      var option;
      var maxX = Number.NEGATIVE_INFINITY;
      var minX = Number.POSITIVE_INFINITY;
      var maxY = Number.NEGATIVE_INFINITY;
      var minY = Number.POSITIVE_INFINITY;
      var maxZ = Number.NEGATIVE_INFINITY;
      var minZ = Number.POSITIVE_INFINITY;
      var nameSet = new Set();
      for (var i = 0; i < dataJson.length; i++) {
          var item = dataJson[i]; 
          if (typeof item.x === 'number' && !isNaN(item.x)){
          maxX = Math.max(maxX, item.x);
          minX = Math.min(minX, item.x);}
          if (typeof item.y === 'number' && !isNaN(item.y)){
            maxY = Math.max(maxY, item.y);
            minY = Math.min(minY, item.y);}
          if (typeof item.z === 'number' && !isNaN(item.z)){
            maxZ = Math.max(maxZ, item.z);
            minZ = Math.min(minZ, item.z);}
          nameSet.add(item.name);
      }
      var nameleng = Array.from(nameSet).filter(function(item) {
        return typeof item === 'string' && item !== 'annotation';
      });

      var series = [];
      nameSet.forEach(function(name) {
      var data = [];
      for (var i = 0; i < dataJson.length; i++) {
          var item = dataJson[i];
          if (item.name === name) {
          data.push([item.x, item.y,item.z]);
          }
      }

      series.push({
          name: name,
          type: 'scatter',
          progressive: 1e5,
          data: data,
          // selected: false,
          symbolSize: 3,
          postEffect: {
              enable: true
            },
          emphasis: {
          itemStyle: {
            borderColor: '#00FF7F',
            borderWidth: 1,
            opacity:0.4
          }},
          // animation: false,
          // large:true,//开启大数据量优化，在数据特别多而出现图形卡顿时候开启，开启后不能每个点都做处理。


          // name: name,
          // type: 'scatter',
          // progressive: 1e5,
          // symbolSize: 3,
          // zoomScale: 0.002,
          // // large: true,
          // itemStyle: {
          //   // borderColor: '#00FF7F',
          //   borderWidth: 1,
          //   opacity:0.4
          // },
          // postEffect: {
          //   enable: true
          // },
          // data: data
          });
      });  
      
      var selected = {};
      // 遍历数组，设置每个legend项的默认选中状态为true
      nameleng.forEach(function(item) {
        selected[item] = true;
      });
      option = {
        title: {
          text: variety,
          subtext: dataJson.length + ' Points' + '\n\n' + 'SampleSize ' + SampleSize.current+ '\n\n' + 'Lambda ' + Lambda.current,
          // subtext: 'SampleSize' + SampleSize.current,
          // subtext: 'Lambda' + Lambda.current,
          subtextStyle: {
            fontSize: 16 // 设置字体大小为16px
          }
        },
        tooltip: {formatter: function(params) {
            // params参数包含了当前被点击的点的信息
            // 在这里构建自定义的提示框内容
            var tooltipContent = "annotation: <span style='display:inline-block; width:8px; height:8px; background-color:" + params.color + "; border-radius: 50%;'></span> ";
            tooltipContent += params.seriesName + "<br/>";
            tooltipContent += "(sx , sy): " + "(" + params.value[0] + " , " + params.value[1] + ")" + "<br/>";
            tooltipContent += variety + ": " + params.value[2]+ "<br/>";
            return tooltipContent;
          }},
        toolbox: {
          right: '54%',
          show: true,
          
          feature: {
            dataZoom: {
              // yAxisIndex: 'none'
            },
            //bruh未生效
            brush: {
              show: true,
              type: ['polygon', 'clear']
            },
            dataView: {},
            saveAsImage: {}
          }
        },
        brush: {},
        
        dataZoom: [
        {
            type: 'slider',
            orient: 'horizontal', // 设置为'horizontal'实现横向缩放
            filterMode: 'empty'
          },
          {
            type: 'slider',
            orient: 'vertical', // 设置为'vertical'实现纵向缩放
            filterMode: 'empty'
          },
          {
            type: 'inside',
            orient: 'horizontal', // 设置为'horizontal'实现横向缩放
            filterMode: 'empty'
          },
          {
            type: 'inside',
            orient: 'vertical', // 设置为'vertical'实现纵向缩放
            filterMode: 'empty'
          }
        ],
        
        xAxis: {
          type: 'value',
          scale: true,
          min: minX - (maxX-minX)*0.5, // 设置 x 轴的最小值
          max: maxX + (maxX-minX)*0.5,
          show: false },// 设置 x 轴的最大值
        yAxis: {
          type: 'value',
          scale: true,
          min: minY, 
          max: maxY + 10,
          show: false},
        visualMap: {
          min: 0,
          max: maxZ,
          calculable: true,
          realtime: true,
          inRange: {
            color: [
              '#313695',
              '#4575b4',
              '#74add1',
              '#abd9e9',
              '#e0f3f8',
              '#ffffbf',
              '#fee090',
              '#fdae61',
              '#f46d43',
              '#d73027',
              '#a50026'
            ]
          }
        },
        grid: {
          right: '17%', // 调整grid的右边距
          top: '6%', // 调整grid的上边距
          left: '5%'
          
        },
        legend: {
          show: true,
          data : nameleng,
          selected: selected,
          textStyle: {
            color: '#333' // 设置文本颜色
          },
          selector: [
            {
                // 全选
                type: 'all',
                // 可以是任意你喜欢的标题
                title: 'All'
            },
            {
                // 反选
                type: 'inverse',
                // 可以是任意你喜欢的标题
                title: 'Invert'
            }
          ],
          selectorLabel: {
            // backgroundColor: 'red',
            color: "black",
            padding: [4, 16, 4, 16],
            
          },
          selectorItemGap: 20,
          selectorButtonGap: 25,
          selectedMode: 'multiple', // 设置为'multiple'表示可以选择多个按钮
          orient: 'vertical', // 设置为垂直方向
          right: '5%', // 设置右对齐
          top: '5%', // 设置上对齐
          // selected: function(params) {
          //   var selectedNames = Object.keys(params);
          //   option.series.forEach(function(series) {
          //     if (selectedNames.includes(series.name)) {
          //       series.show = true;
          //     } else {
          //       series.show = false;
          //     }
          //   });
          //   Scat.setOption(option);
          // }
        },
        
        series: series,
      };  
      
      myChart.setOption(option);
      // 监听图例的点击事件
      myChart.on('legendselectchanged', (params) => {
        handleLegendSelectChanged(params, myChart, option);
      });
  

      myChart.setOption(option);

      return () => {
        myChart.dispose();
      };
  }}, [])
    .catch(error => {
      // 处理失败的回调函数
      console.error(error);
      // 跳转到其他页面
      
      history.push('/404');
    });    

  return <div ref={chartRef} style={{ height: '85vh' }} />;
};

export default Scat;