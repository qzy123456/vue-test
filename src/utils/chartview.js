import * as echarts from 'echarts';
import {
    countNumber
} from './index';

var linchartResize = [],
    piechartResize = [],
    barchartResize = []

const lineChart = params => {
    return new line(params);
};

function line(params) {
    this.init(params);
}
line.prototype = {
    init: function(params) {
        var options = [];
        this.lineChartArr = params;
        for (var i = 0; i < params.length; i++) {
            options.push({
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                tooltip: {
                    trigger: 'axis'
                },
                grid: {
                    top: '20%',
                    bottom: '15%',
                    containLabel: true
                },
                xAxis: {
                    type: "category",
                    data: params[i].xData,
                    boundaryGap: false,
                    axisTick: {
                        show: false
                    }
                },
                yAxis: {
                    type: "value",
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    }
                },
                series: (function() {
                    var series = [];
                    for (var j = 0; j < params[i].seriesData.length; j++) {
                        if (params[i].chartDetailType === "singleLine") {
                            var item = {
                                data: params[i].seriesData[j].data,
                                type: "line",
                                areaStyle: {},
                                symbol: null,
                                symbolSize: 0
                            };
                            series.push(item);
                        }
                        if (params[i].chartDetailType === "doubleLine") {
                            var item = {
                                data: params[i].seriesData[j].data,
                                type: "line",
                                symbol: null,
                                symbolSize: 0
                            };
                            series.push(item);
                        }
                    }
                    return series;
                })()
            });
        }
        this.setLinechart(options);
    },
    setLinechart: function(options) {
        linchartResize = [];
        for (var i = 0; i < this.lineChartArr.length; i++) {
            for (var j = 0; j < options.length; j++) {
                if (i === j) {
                    this.lineChart = echarts.init(
                        document.querySelector(
                            this.lineChartArr[i].chartMainClass + " .charShow"
                        )
                    );
                    linchartResize.push(this.lineChart);
                    this.lineChart.setOption(options[j]);
                }
            }
        }
        window.addEventListener(
            "resize",
            function() {
                for (var x = 0; x < linchartResize.length; x++) {
                    linchartResize[x].resize();
                }
            }.bind(this)
        );
    }
};

const pieChart = params => {
    return new pie(params);
};

function pie(params) {
    this.init(params);
}
pie.prototype = {
    init: function(params) {
        var options = [];
        this.pieChartArr = params;
        for (var i = 0; i < params.length; i++) {
            options.push({
                tooltip: {
                    trigger: "item",
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                legend: {
                    orient: "vertical",
                    x: "right",
                    y: "center"
                },
                series: function() {
                    var series = [];
                    if (params[i].chartDetailType === "circlePie") {
                        var circlePieColor = params[i].chartColor
                        var item = {
                            type: "pie",
                            radius: ["50%", "70%"],
                            center: ["50%", "50%"],
                            avoidLabelOverlap: false,
                            label: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    fontSize: '18',
                                    fontWeight: 'bold'
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data: params[i].seriesData
                        };
                        series.push(item);
                    }
                    if (params[i].chartDetailType === "areaPie") {
                        var areaPieColor = params[i].chartColor
                        var item = {
                            type: "pie",
                            radius: ["10%", "60%"],
                            center: ["50%", "50%"],
                            roseType: "radius",
                            label: {
                                normal: {
                                    show: false
                                },
                                emphasis: {
                                    show: true
                                }
                            },
                            lableLine: {
                                normal: {
                                    show: false
                                },
                                emphasis: {
                                    show: true
                                }
                            },
                            data: params[i].seriesData
                        };
                        series.push(item);
                    }
                    return series;
                }.bind(this)()
            });
        }
        this.setPieChart(options);
    },
    setPieChart: function(options) {
        piechartResize = [];
        for (var i = 0; i < this.pieChartArr.length; i++) {
            for (var j = 0; j < options.length; j++) {
                if (i === j) {
                    this.lineChart = echarts.init(
                        document.querySelector(
                            this.pieChartArr[i].chartMainClass + " .charShow"
                        )
                    );
                    piechartResize.push(this.lineChart);
                    this.lineChart.setOption(options[j]);
                }
            }
        }
        window.addEventListener(
            "resize",
            function() {
                for (var x = 0; x < piechartResize.length; x++) {
                    piechartResize[x].resize();
                }
            });
    }
};

const barChart = params => {
    return new bar(params);
};

function bar(params) {
    this.init(params);
}
bar.prototype = {
    init: function(params) {
        var options = []
        this.barChartArr = params
        for (var i = 0; i < params.length; i++) {
            if (params[i].chartDetailType === "rowBar") {
                options.push({
                    toolbox: {
                        feature: {
                            dataView: { show: true, readOnly: false },
                            saveAsImage: { show: true }
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    xAxis: {
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {
                                type: 'solid',
                                color: '#e7e7e7',
                                width: '2'
                            }
                        },
                        splitLine: { show: false },
                        type: 'value',
                        boundaryGap: [0, 0],
                        axisLabel: { interval: 0 }
                    },
                    grid: {
                        left: '23%',
                        top: '20%',
                        bottom: '3%'
                    },
                    yAxis: {
                        type: 'category',
                        data: params[i].xData,
                        axisTick: [{
                            show: false
                        }],
                        axisLine: {
                            show: true,
                            lineStyle: {
                                type: 'solid',
                                color: '#e7e7e7',
                                width: '2'
                            }
                        },
                        axisLabel: {
                            textStyle: {
                                fontSize: '14',
                                fontFamily: 'PingFang SC Medium',
                                color: '#666'
                            }
                        }
                    },
                    series: function() {
                        var series = [];
                        for (var j = 0; j < params[i].seriesData.length; j++) {
                            var item = {
                                type: 'bar',
                                tooltip: { show: false },
                                itemStyle: {
                                    barBorderRadius: [0, 20, 20, 0], // 圆角（左上、右上、右下、左下）

                                    color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                                        offset: 0,
                                        color: '#51C5FD'
                                    }, {
                                        offset: 1,
                                        color: '#005BB1'
                                    }], false), // 渐变
                                },
                                barWidth: 16,
                                data: params[i].seriesData[j].data,
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'insideRight',
                                        formatter: '{c}'
                                    }
                                }
                            };
                            series.push(item);
                        }
                        return series;
                    }()
                })
            }
            if (params[i].chartDetailType === "columnBar") {
                options.push({
                    toolbox: {
                        feature: {
                            dataView: { show: true, readOnly: false },
                            magicType: { show: true, type: ['line', 'bar'] },
                            restore: { show: true },
                            saveAsImage: { show: true }
                        }
                    },
                    calculable : true,
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    xAxis: {
                        data: params[i].xData,
                        splitLine:{
                            show:false,
                        },
                    },
                    grid: {
                        left: '15%',
                        top: '20%',
                        bottom: '15%',
                        containLabel: true
                    },
                    yAxis: {
                        splitLine:{
                            show:false,
                        },
                    },
                    series: function() {
                        var series = []
                        for (var j = 0; j < params[i].seriesData.length; j++) {
                            series.push({
                                type: 'bar',
                                stack: 'Ad',
                                emphasis: {
                                    focus: 'series'
                                },
                                data: params[i].seriesData[j].data,
                                itemStyle : { normal: {label : {show: true, position: 'insideRight'}}},
                                animation: false
                            })
                        }
                         console.log(series)
                        return series;
                    }.bind(this)()
                })
            }
            this.setBarChart(options)
        }
    },
    setBarChart: function(options) {
        barchartResize = [];
        for (var i = 0; i < this.barChartArr.length; i++) {
            for (var j = 0; j < options.length; j++) {
                if (i === j) {
                    this.lineChart = echarts.init(
                        document.querySelector(
                            this.barChartArr[i].chartMainClass + " .charShow"
                        )
                    );
                    barchartResize.push(this.lineChart);
                    this.lineChart.setOption(options[j]);
                }
            }
        }
        window.addEventListener(
            "resize",
            function() {
                for (var x = 0; x < barchartResize.length; x++) {
                    barchartResize[x].resize();
                }
            });
    }
};
export { lineChart, pieChart, barChart };
