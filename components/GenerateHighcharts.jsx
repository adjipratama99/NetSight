import HighchartsReact from "highcharts-react-official"
import Highcharts from 'highcharts'
import { chartColor } from "@/lib/Constants"
import { format } from "date-fns"
import HighchartsHeatmap from "highcharts/modules/heatmap"
import wordCloud from "highcharts/modules/wordcloud"
import HC_more from "highcharts/highcharts-more"
import HC_accesibility from "highcharts/modules/accessibility"
import HC_data from "highcharts/modules/data"
import HighchartsExporting from 'highcharts/modules/exporting'
import { Numeral } from "react-numeral"
import RenderHtml from "./RenderToString"

const HIGHCHART_FONT_FAMILY = 'Roboto'
const colors = chartColor()
const defaultOptions = {
    colors,
    title: {
        text: ''
    },
    chart: {
        backgroundColor: 'transparent',
        style: {
            fontFamily: HIGHCHART_FONT_FAMILY + ', sans-serif'
        }
    },
    exporting: {
        enabled: false,
        buttons: {
            contextButton: {
                menuItems: ["viewFullscreen", "printChart", "separator", "downloadJPEG", "downloadPDF"]
            }
        }
    },
    credits: {
        enabled: false
    }
}

const defaultTheme = {
    xAxis: {
        title: {
            style: {
                color: '#666'
            }
        },
        labels: {
            style: {
                color: '#666'
            }
        }
    },
    yAxis: {
        title: {
            style: {
                color: '#666'
            }
        },
        labels: {
            style: {
                color: '#666'
            }
        }
    },
    plotOptions: {
        series: {
            dataLabels: {
                color: '#fff',
                style: {
                    textOutline: '0'
                }
            }
        }
    },
    legend: {
        itemStyle: {
            color: '#666'
        },
        itemHoverStyle: {
            color: '#000'
        }
    },
    drilldown: {
        activeAxisLabelStyle: {
            color: '#666'
        },
        activeDataLabelStyle: {
            color: '#666'
        }
    }
}

Highcharts.theme = {...defaultOptions, ...defaultTheme};
if(typeof Highcharts.setOptions === "function") Highcharts.setOptions(Highcharts.theme);

if (typeof Highcharts === 'object') {
    HC_more(Highcharts)
    HighchartsExporting(Highcharts)
    HC_data(Highcharts)
    HC_accesibility(Highcharts)
    HighchartsHeatmap(Highcharts)
    wordCloud(Highcharts)
}

const numeral = (value) => {
    return RenderHtml(<Numeral value={value} format="0,0" />)
}

export default function GenerateHighcharts({
    type,
    data,
    options
}) {
    let defaultConfig = {};

    switch(type) {
        case "pie": 
            defaultConfig = {
                chart: {
                    type: 'pie'
                },
                yAxis: {
                    title: {
                        enabled: false
                    }
                },
                xAxis: {
                    title: {
                        enabled: false
                    },
                    gridLineWidth: 0
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: false,
                        cursor: 'default',
                        borderWidth: 0,
                        dataLabels: {
                            enabled: true,
                        }
                    }
                },
                series: data
            };
            break;
        case "wordCloud":
            data = data.reduce((arr, word) => {
                let obj = Highcharts.find(arr, obj => obj.name === word);
                if (obj) {
                    obj.weight += 1;
                } else {
                    obj = {
                        name: word,
                        weight: 1
                    };
                    arr.push(obj);
                }
                return arr;
            }, []);
            
            data = [{
                "type": "wordcloud",
                data
            }]

            Highcharts.seriesTypes.wordcloud.prototype.deriveFontSize = (relativeWeight) => {
                let maxFontSize = 100;
                let size = Math.floor(maxFontSize * relativeWeight);
                return size < 10 ? 10 : size;
            }

            defaultConfig = {
                chart: {
                    type: 'wordcloud',
                    marginTop: 0,
                    marginRight: 0,
                    marginLeft: 0,
                    marginBottom: 0
                },
                plotOptions: {
                    wordcloud: {
                        cursor: 'default',
                        rotation: {
                            from: 0,
                            to: 0
                        }
                    }
                },
                series: data,
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 50%)',
                    style: {
                        color: '#dedede'
                    }
                }
            }
            break;
        case "bubble":
            defaultConfig = {
                chart: {
                    type: 'bubble',
                    plotBorderWidth: 1,
                    zoomType: 'xy'
                },
                legend: {
                    enabled: false
                },
                xAxis: {
                    gridLineWidth: 1,
                    title: {
                        text: 'Total',
                        margin: 20
                    }
                },
                yAxis: {
                    startOnTick: false,
                    endOnTick: false,
                    title: {
                        text: 'Total'
                    },
                    labels: {
                        format: '{value}'
                    }
                },
                plotOptions: {
                    series: {
                        dataLabels: {
                            enabled: true,
                            format: '{point.name}'
                        }
                    },
                    bubble: {
                        dataLabels: {
                            borderColor: '#000'
                        }
                    }
                },
                series: data
            }
            break;
        case "heatmap":
            defaultConfig = {
                chart: {
                    type: 'heatmap',
                    borderColor: '#3F4F67'
                },
                xAxis: {
                    categories: data.xCat
                },
                yAxis: {
                    categories: data.yCat,
                    title: null
                },
                colorAxis: {
                    reversed: false,
                    minColor: '#eee',
                    maxColor: '#096b9a',
                    labels: {
                        style: {
                            color: '#666'
                        }
                    }
                },
                plotOptions: {
                    heatmap: {
                        borderColor: '#666',
                        dataLabels: {
                            enabled: true,
                        }
                    }
                },
                legend: {
                    align: 'right',
                    layout: 'vertical',
                    margin: 10,
                    verticalAlign: 'top',
                    symbolHeight: 250
                },
                tooltip: {
                    formatter: function() {
                        return '<b>' + this.point.value + '</b> Data <br>on <b>' + this.series.yAxis.categories[this.point.y] + '</b><br><b>' + this.series.xAxis.categories[this.point.x] + '</b>';
                    },
                    backgroundColor: 'rgba(0, 0, 0, 50%)',
                    style: {
                        color: '#dedede'
                    }
                },
                series: [{
                    borderWidth: 1,
                    dataLabels: {
                        enabled: true,
                        color: '#666'
                    }
                }]
            }

            if("series" in data) defaultConfig.series = {...defaultConfig.series, "data": data.series}
            if("tooltip" in data) defaultConfig.tooltip = {...defaultConfig.tooltip, ...data.tooltip};

            break;
        case "column":
            defaultConfig = {
                chart: {
                    type: 'column'
                },
                xAxis: {
                    type: 'category'
                },
                yAxis: {
                    title: {
                        text: 'Total'
                    },
                    allowDecimals: false
                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    series: {
                        dataLabels: {
                            enabled: true,
                            format: '{point.y}'
                        }
                    },
                    column: {
                        dataLabels: {
                            enabled: true,
                            crop: false,
                            overflow: "none"
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                    pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b>'
                },
                series: data
            }
            break;
        case "timeseries":
            defaultConfig = {
                chart: {
                    zoomType: 'x'
                },
                title: {
                    text: ''
                },
                xAxis: {
                    type: 'datetime'
                },
                yAxis: {
                    title: {
                        text: ''
                    },
                    allowDecimals: false,
                    min: 0
                },
                tooltip: {
                    formatter: function() {
                        return `<div>
                                    <div>${ format(new Date(this.x * 1000), 'EEEE, dd MMM yyyy HH:mm:ss') }</div>
                                    <br />
                                    <span>${ this.series.name }</span>
                                    <br />
                                    <br />
                                    <span>Total: ${ numeral(this.point.y) }<b></b></span>
                                </div>`
                    }
                },
                plotOptions: {
                    area: {
                        fillColor: {
                            linearGradient: {
                                x1: 0,
                                y1: 0,
                                x2: 0,
                                y2: 1
                            },
                            stops: [
                                [0, colors[0]],
                                [1, Highcharts.Color(colors[0]).setOpacity(0).get('rgba')]
                            ]
                        },
                        marker: {
                            radius: 2
                        },
                        lineWidth: 1,
                        states: {
                            hover: {
                                lineWidth: 1
                            }
                        },
                        threshold: null
                    }
                },
                legend: {
                    enabled: false
                },
                series: data
            }
            break;
        case "line":
            defaultConfig = {
                xAxis: {
                    visible: false
                },
                yAxis: {
                    title: {
                        text: ''
                    },
                    allowDecimals: false,
                    min: 0
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'top'
                },
                plotOptions: {
                    series: {
                        label: {
                            connectorAllowed: false
                        }
                    },
                    line: {
                        marker: false
                    }
                },
                tooltip: {
                    formatter: function() {
                        return `<div>
                                    <div>${ format(new Date(this.x * 1000), 'EEEE, dd MMM yyyy HH:mm:ss') }</div>
                                    <br />
                                    <span>${ this.series.name }</span>
                                    <br />
                                    <br />
                                    <span>Total: ${ numeral(this.point.y) }<b></b></span>
                                </div>`
                    }
                }
            }

            if("series" in data) defaultConfig.series = data.series
            if("categories" in data) defaultConfig.xAxis = {...defaultConfig.xAxis, "categories": data.categories}
            break;
        case "sankey":
            defaultConfig = {
                accessibility: {
                    point: {
                        valueDescriptionFormat: '{index}. {point.from} to {point.to}, {point.weight}.'
                    }
                },
                series: data,
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 50%)',
                    style: {
                        color: '#dedede'
                    }
                }
            }
            break;
        case "ontology":
            defaultConfig = {
                chart: {
                    type: 'networkgraph',
                    plotBorderWidth: 1
                },
                plotOptions: {
                    networkgraph: {
                        keys: ['from', 'to']
                    }
                },
                series: data.series
            }
            break;
        case "timeseriesMulti":
            let dataFormat = [{
                id: 'first',
                color: colors[0],
                name: data[0].name,
                data: data[0].data
            }];

            data.map((v, i) => {
                if (i > 0) {
                    dataFormat.push({
                        color: colors[i],
                        name: data[i].name,
                        data: data[i].data
                    });
                }
            })

            defaultConfig = {
                chart: {
                    zoomType: 'x'
                },
                xAxis: {
                    type: 'datetime'
                },
                yAxis: {
                    title: {
                        text: ''
                    },
                    min: 0
                },
                tooltip: {
                    formatter: function() {
                        return format(new Date(this.x * 1000), 'EEEE, dd MMM yyyy HH:mm:ss') + '<br/>' + this.series.name + '<br/>Total: <b>' + this.point.y + '</b>';
                    }
                },
                plotOptions: {
                    area: {
                        fillColor: {
                            linearGradient: {
                                x1: 0,
                                y1: 0,
                                x2: 0,
                                y2: 1
                            },
                            stops: [
                                [0, colors[0]],
                                [1, Highcharts.Color(colors[0]).setOpacity(0).get('rgba')]
                            ]
                        },
                        marker: {
                            radius: 2
                        },
                        lineWidth: 1,
                        states: {
                            hover: {
                                lineWidth: 1
                            }
                        },
                        threshold: null
                    }
                },
                legend: {
                    enabled: true
                },
                series: dataFormat
            }
            break;
        default:
            defaultConfig = {};
    }

    if(options) defaultConfig = {...defaultConfig, ...options};

    return <div className="relative h-full">
        <HighchartsReact 
        containerProps={{ style: { height: "100%" } }}
        highcharts={Highcharts} 
        options={defaultConfig} />
    </div>
}