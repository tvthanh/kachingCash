(function() {
    'use strict';

    angular.module('panelApp')
        .controller('trafficCtrl', [
            '$scope',
            function($scope) {

                var dataProductTrafficeDetails = [
                    {
                        srcImg: 'https://www.ccep.com/system/image_block/2941/Coca-Cola.jpg',
                        title: 'Coca Cola',
                        dollars: '23,197.20',
                        unitSold: '1724',
                        order: '471',
                        numView: '58,910',
                        coinRate: '5.10',
                        dollarAVO: '65.90',
                        dollarRPV: '21.10',
                        status: 'status-green'
                    },
                    {
                        srcImg: 'http://theshoegame.com/wp-content/uploads/2015/01/nike-logo-copy.jpg',
                        title: 'Nike',
                        dollars: '11,203.20',
                        unitSold: '985',
                        order: '432',
                        numView: '42,892',
                        coinRate: '3.25',
                        dollarAVO: '34.10',
                        dollarRPV: '12.60',
                        status: 'status-green'
                    },
                    {
                        srcImg: 'http://www.kowalskis.com/sites/kowalskis.com/files/images/departments/starbucks-logo-trans.png',
                        title: 'Starbucks',
                        dollars: '4,289.90',
                        unitSold: '89',
                        order: '211',
                        numView: '8,991',
                        coinRate: '1.11',
                        dollarAVO: '18.30',
                        dollarRPV: '3.10',
                        status: 'status-organce'
                    },
                    {
                        srcImg: 'http://vector.me/files/images/7/3/73419/nikon.png',
                        title: 'Nikon',
                        dollars: '9,190.30',
                        unitSold: '166',
                        order: '99',
                        numView: '13,991',
                        coinRate: '1.98',
                        dollarAVO: '43.10',
                        dollarRPV: '21.60',
                        status: 'status-gray'
                    },
                    {
                        srcImg: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQRlV2lijfvgaPUFrfCrp0l4lxiT_dYcj_6El3HGaS50i_yz1EFEg',
                        title: 'LG',
                        dollars: '12,890.20',
                        unitSold: '221',
                        order: '210',
                        numView: '31,900',
                        coinRate: '2.11',
                        dollarAVO: '32.80',
                        dollarRPV: '10.90',
                        status: 'status-organce'
                    },
                    {
                        srcImg: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRI5hwT454_ibBEE1HoYkSvJfRI2PS8jQ07-a9EJegFistqkSer',
                        title: 'Leica',
                        dollars: '15,560.50',
                        unitSold: '321',
                        order: '350',
                        numView: '68,500',
                        coinRate: '5.88',
                        dollarAVO: '40.70',
                        dollarRPV: '20.10',
                        status: 'status-green'
                    }
                    // {
                    //     srcImg: 'xxx',
                    //     title: 'xxx',
                    //     dollars: 'xxx',
                    //     unitSold: 'xxx',
                    //     order: 'xxx',
                    //     numView: 'xxx',
                    //     coinRate: 'xxx',
                    //     dollarAVO: 'xxx',
                    //     dollarRPV: 'xxx',
                    //     status: 'xxx'
                    // }
                ];

                $scope.dataProductTrafficeDetails = dataProductTrafficeDetails;

                $scope.chartConfig = {
                    'options': {
                        'chart': {
                            'type': 'areaspline'
                        },
                        'xAxis': {
                            'categories': [],
                            'title': {
                                'text': null
                            },

                            'labels': {
                                'enabled': false
                            },
                            'minorTickLength': 0,
                            'tickLength': 0,
                            'tickWidth': 0,
                            'minPadding': 0,
                            'maxPadding': 0,
                            'pointPadding': 0,
                            'groupPadding': 0,
                            'lineColor': '',
                            'lineWidth': ''
                        },
                        'yAxis': {
                            'categories': [],
                            'title': {
                                'text': null
                            },
                            'labels': {
                                'enabled': false
                            },
                            'minorTickLength': 0,
                            'tickLength': 0,
                            'gridLineColor': 'transparent',
                            'tickWidth': 0,
                            'minPadding': 0,
                            'maxPadding': 0,
                            'pointPadding': 0,
                            'groupPadding': 0,
                            'lineColor': '',
                            'lineWidth': ''
                        },
                        'pane': {

                        },
                        'tooltip': {

                        },
                        'plotOptions': {
                            'series': {
                                'stacking': '',
                                'marker': {
                                    'enabled': false
                                }
                            },
                            'pie': {
                                'size': 500
                            }
                        },
                        'exporting': {
                            'enabled': false
                        }
                    },
                    'series': [

                        {
                            'showInLegend': false,
                            'data': [],
                            'color': '',
                            'name': ''

                        }, {
                            'showInLegend': false,
                            'data': [],
                            'color': '',
                            'name': ''
                        }
                    ],
                    'title': {
                        'text': ''
                    },
                    'credits': {
                        'enabled': false
                    },
                    'loading': false,
                    'size': {
                        'height': 130,
                    },
                    'tooltip': {

                    },
                    'useHighStocks': false,
                    func: function(chart) {

                    }
                };

                // Traffic Source chart
                $scope.trafficSource = angular.copy($scope.chartConfig);
                $scope.trafficSource.options.chart.type = 'area';
                $scope.trafficSource.options.xAxis = {
                    allowDecimals: false,
                    title: {
                        text: null
                    },
                    labels: {
                        enabled: false,
                        formatter: function() {
                            return this.value; // clean, unformatted number for year
                        }
                    }
                };
                $scope.trafficSource.options.yAxis = {
                    title: {
                        text: null
                    },
                    labels: {
                        formatter: function() {
                            return this.value / 1000 + 'k';
                        }
                    }
                };
                $scope.trafficSource.options.tooltip = {
                    pointFormat: '{series.name} produced <b>{point.y:,.0f}</b><br/>warheads in {point.x}'
                };
                $scope.trafficSource.options.plotOptions = {
                    area: {
                        pointStart: 1940,
                        marker: {
                            enabled: false,
                            symbol: 'circle',
                            radius: 2,
                            states: {
                                hover: {
                                    enabled: true
                                }
                            }
                        }
                    }
                };
                $scope.trafficSource.series = [{
                    name: 'Top Revenue',
                    data: [null, null, null, null, null, 6, 11, 32, 110, 235, 369, 640,
                        1005, 1436, 2063, 3057, 4618, 6444, 9822, 15468, 20434, 24126,
                        27387, 29459, 31056, 31982, 32040, 31233, 29224, 27342, 26662,
                        26956, 27912, 28999, 28965, 27826, 25579, 25722, 24826, 24605,
                        24304, 23464, 23708, 24099, 24357, 24237, 24401, 24344, 23586,
                        22380, 21004, 17287, 14747, 13076, 12555, 12144, 11009, 10950,
                        10871, 10824, 10577, 10527, 10475, 10421, 10358, 10295, 10104
                    ]
                }, {
                    name: 'Top Converation Rate',
                    data: [null, null, null, null, null, null, null, null, null, null,
                        5, 25, 50, 120, 150, 200, 426, 660, 869, 1060, 1605, 2471, 3322,
                        4238, 5221, 6129, 7089, 8339, 9399, 10538, 11643, 13092, 14478,
                        15915, 17385, 19055, 21205, 23044, 25393, 27935, 30062, 32049,
                        33952, 35804, 37431, 39197, 45000, 43000, 41000, 39000, 37000,
                        35000, 33000, 31000, 29000, 27000, 25000, 24000, 23000, 22000,
                        21000, 20000, 19000, 18000, 18000, 17000, 16000
                    ]
                }];
                $scope.trafficSource.size.height = 400;

                // Traffic Rate Chart
                $scope.trafficRateChart = angular.copy($scope.chartConfig);
                $scope.trafficRateChart.options.chart.type = 'pie';
                $scope.trafficRateChart.tooltip = {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                };
                $scope.trafficRateChart.options.plotOptions = {
                    pie: {
                        dataLabels: {
                            enabled: false,
                            distance: 0,
                            style: {
                                fontWeight: 'bold',
                                color: 'white'
                            }
                        },
                        startAngle: 0,
                        endAngle: 360,
                        center: ['50%', '50%'],
                        showInLegend: true
                    }
                };
                $scope.trafficRateChart.options.legend = {
                    labelFormatter: function() {
                        var total = 0;
                        var percentage;
                        var data = this.series.data;
                        for (var key in data) {
                            if (data[key]) {
                                total += data[key].y;
                            }
                        }
                        percentage = ((this.y / total) * 100).toFixed(2);
                        return this.name + ' ' + this.y + '<br/>' + percentage + '%' + '<br/><span style="color:#B0B0B0;">______________________</span>';
                    },
                    align: 'right',
                    verticalAlign: 'middle',
                    layout: 'horizontal',
                    symbolRadius: 100,
                    symbolPadding: 5,
                    itemMarginBottom: 10,
                    itemDistance: 10,
                    width: 300,
                    height: 250,
                    itemWidth: 130,
                    itemStyle: {
                        fontWeight: 100
                    },
                    symbolWidth: 14,
                    symbolHeight: 14,
                    y: 60
                };
                $scope.trafficRateChart.series = [{
                    innerSize: '50%',
                    data: [
                        ['<strong>ROLEX</strong> USD ', 1396],
                        ['<strong>VANS</strong> USD ', 501],
                        ['<strong>INCASE</strong> USD ', 465],
                        ['<strong>GUCCI</strong> USD ', 430],
                        ['<strong>LV</strong> USD ', 215],
                        ['<strong>INCASE</strong> USD ', 573]
                    ]
                }];
                $scope.trafficRateChart.size.height = 299;

            }
        ]);
})();
