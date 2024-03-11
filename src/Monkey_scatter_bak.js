import React, {useRef, useEffect} from 'react';
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
  // var chartDom = document.getElementById('main');
  // var myChart = echarts.init(chartDom);

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

  const handleRestoreClick = (myChart , option) => {
    // 处理 restore 操作的逻辑
    myChart.on('legendselectchanged', (params) => {
      handleLegendSelectChanged(params, myChart, option);
    });
    // 在这里执行你想要实现的还原逻辑
  };
  
  fetch(path)
    .then(response => response.text())
    .then(data1 => {
      const rows = data1.split("\n");
      const dataJson = [];
      const variety = rows[0].split("\t")[5];

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i].split("\t");

        const x = parseInt(row[0]);
        const y = parseInt(row[1]);
        const z = parseFloat(row[5]);
        const name = row[10];

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
            data: data,
            // selected: false,
            symbolSize: 3,
            emphasis: {
            itemStyle: {
              borderColor: '#00FF7F',
              borderWidth: 1,
              opacity:0.4
            }},
            progressive: 1000,
            animation: false,
            });
        });  


        var selected = {};
        // 遍历数组，设置每个legend项的默认选中状态为false
        nameleng.forEach(function(item) {
          selected[item] = true;
        });
        option = {
          title: {
            text: variety,
            subtext: dataJson.length + ' Points',
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
                yAxisIndex: 'none'
              },

              restore: {},
              saveAsImage: {}
            }
          },
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
            min: minX - 150, // 设置 x 轴的最小值
            max: maxX + 150, 
            show: false },// 设置 x 轴的最大值
          yAxis: {
            type: 'value',
            min: minY, 
            max: maxY + 10,
            show: false},
          visualMap: {
            min: 0,
            max: maxZ,
            calculable: true,
            realtime: false,
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

        myChart.on('restore', () => handleRestoreClick(myChart, option));

        myChart.setOption(option);

        return () => {
          myChart.dispose();
        };
      }}, []);

  return <div ref={chartRef} style={{ height: '85vh' }} />;
};

export default Scat;