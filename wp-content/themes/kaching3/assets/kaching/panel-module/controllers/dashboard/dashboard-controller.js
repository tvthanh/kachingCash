(function() {
    'use strict';

    angular.module('panelApp')
        .controller('dashboardCtrl', [
            '$scope',
            function($scope) {
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


                $scope.chartConfig2 = angular.copy($scope.chartConfig);
                $scope.chartConfig2.series[0].color = '#62d194';
                $scope.chartConfig2.series[0].data = [5, 20, 15, 2, 7, 10, 4, 11, 15, 10, 21];
                $scope.chartConfigGender = angular.copy($scope.chartConfig);


                //chart gender
                $scope.chartConfigGender.options.chart.type = 'bar';
                $scope.chartConfigGender.options.xAxis.categories = ['24:00', '18:00', '12:00', '06:00', '00:00'];
                $scope.chartConfigGender.options.xAxis.labels.enabled = true;
                $scope.chartConfigGender.options.xAxis.lineWidth = 1;
                $scope.chartConfigGender.options.xAxis.lineColor = '#E6EAEE';
                $scope.chartConfigGender.options.plotOptions.series.pointWidth = 18;
                $scope.chartConfigGender.options.yAxis = {
                    'title': {
                        'text': null
                    },
                    'labels': {
                        'enabled': true
                    },
                    'lineColor': '#E6EAEE',
                    'lineWidth': 1,
                    'min': 0,
                    'minRange': 100000,
                    'max': 100000,
                    'minPadding': 100000,
                    'gridLineWidth': 0

                };
                $scope.chartConfigGender.series = [{
                    name: 'female',
                    showInLegend: false,
                    data: [20000, 20000, 30000, 20000, 10000],
                    color: '#FFBC00'
                }, {
                    name: 'male',
                    showInLegend: false,
                    data: [53000, 34000, 40000, 70000, 20000],
                    color: '#2DA1F8'
                }];
                $scope.chartConfigGender.options.plotOptions.series.stacking = 'normal';
                $scope.chartConfigGender.size.height = 250;

                // Age Timeline
                $scope.chartConfigAgeTimeline = angular.copy($scope.chartConfig);
                $scope.chartConfigAgeTimeline.options.chart.type = 'column';
                $scope.chartConfigAgeTimeline.options.xAxis.categories = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00'];
                $scope.chartConfigAgeTimeline.options.xAxis.labels.enabled = true;
                $scope.chartConfigAgeTimeline.size.height = 281;
                $scope.chartConfigAgeTimeline.options.yAxis.lineWidth = 1;
                $scope.chartConfigAgeTimeline.options.yAxis.lineColor = '#E6EAEE';
                $scope.chartConfigAgeTimeline.options.plotOptions.series.stacking = 'normal';
                $scope.chartConfigAgeTimeline.options.plotOptions.series.pointWidth = 18;
                $scope.chartConfigAgeTimeline.options.xAxis.lineWidth = 1;
                $scope.chartConfigAgeTimeline.options.xAxis.lineColor = '#E6EAEE';
                $scope.chartConfigAgeTimeline.options.yAxis = {
                    'title': {
                        'text': null
                    },
                    'labels': {
                        'enabled': true
                    },
                    'lineColor': '#E6EAEE',
                    'lineWidth': 1,
                    'min': 0,
                    'minRange': 100000,
                    'max': 100000,
                    'minPadding': 100000,
                    'gridLineWidth': 0

                };
                $scope.chartConfigAgeTimeline.series = [{
                    name: '65+',
                    showInLegend: false,
                    data: [20000, 20000, 30000, 20000, 10000, 10000],
                    color: '#8567E6'
                }, {
                    name: '55-64',
                    showInLegend: false,
                    data: [53000, 34000, 40000, 70000, 20000, 10000],
                    color: '#40557D'
                }, {
                    name: '45-54',
                    showInLegend: false,
                    data: [53000, 34000, 40000, 70000, 20000, 10000],
                    color: '#289DF5'
                }, {
                    name: '35-44',
                    showInLegend: false,
                    data: [53000, 34000, 40000, 70000, 20000, 10000],
                    color: '#39BF23'
                }, {
                    name: '25-34',
                    showInLegend: false,
                    data: [53000, 34000, 40000, 70000, 20000, 10000],
                    color: '#FFD400'
                }, {
                    name: '0-24',
                    showInLegend: false,
                    data: [53000, 34000, 40000, 70000, 20000, 10000],
                    color: '#F0B499'
                }];

                // Customers
                $scope.chartconfigCustomer = angular.copy($scope.chartConfig);
                $scope.chartconfigCustomer.options.chart.type = 'pie';
                $scope.chartconfigCustomer.options.plotOptions.pie.size = 140;
                $scope.chartconfigCustomer.options.plotOptions.pie.colors = ['#289DF5', '#40557D', '#FFD400'];
                $scope.chartconfigCustomer.size.height = 150;
                $scope.chartconfigCustomer.series = [{
                    name: 'Customers',
                    data: [
                        ['Returning', 6],
                        ['New', 4],
                        ['Referrals', 7]
                    ],
                    innerSize: '70%',
                    showInLegend: false,
                    dataLabels: {
                        enabled: false
                    }
                }];

                // product spending
                $scope.chartconfigProductSpending = angular.copy($scope.chartConfig);
                $scope.chartconfigProductSpending.options.chart.type = 'pie';
                $scope.chartconfigProductSpending.options.plotOptions.pie.size = 150;
                $scope.chartconfigProductSpending.options.plotOptions.pie.colors = ['#40557D', '#3373B3', '#F0B499', '#72C4B9', '#FFD60D', '#1AA6D6'];
                $scope.chartconfigProductSpending.size.height = 200;
                $scope.chartconfigProductSpending.series = [{
                    name: 'Product',
                    data: [
                        ['Nike', 6],
                        ['Nike', 4],
                        ['Nike', 7],
                        ['Nike', 6],
                        ['Nike', 6],
                        ['Nike', 6]
                    ],
                    innerSize: '70%',
                    showInLegend: false,
                    dataLabels: {
                        enabled: false
                    }
                }];

                // age
                $scope.chartconfigAge = angular.copy($scope.chartConfig);
                $scope.chartconfigAge.options.chart.type = 'pie';
                $scope.chartconfigAge.options.plotOptions.pie.size = 150;
                $scope.chartconfigAge.options.plotOptions.pie.colors = ['#F0B499', '#FFD400', '#39BF23', '#289DF5', '#40557D', '#8567E6'];
                $scope.chartconfigAge.size.height = 180;
                $scope.chartconfigAge.series = [{
                    name: 'Product',
                    data: [
                        ['0-24', 6],
                        ['25-34', 4],
                        ['35-44', 7],
                        ['45-54', 6],
                        ['55-64', 6],
                        ['65+', 6]
                    ],
                    innerSize: '70%',
                    showInLegend: false,
                    dataLabels: {
                        enabled: false
                    }
                }];

                // Daily Sale
                $scope.chartconfigDailySale = angular.copy($scope.chartConfig);
                $scope.chartconfigDailySale.options.chart.type = 'column';
                $scope.chartconfigDailySale.options.plotOptions.series.pointWidth = 8;
                $scope.chartconfigDailySale.size.height = 179;
                $scope.chartconfigDailySale.series = [{
                    name: 'Thang 1',
                    showInLegend: false,
                    data: [20000, 20000, 30000, 20000, 10000, 10000, 20000, 20000, 30000, 20000, 10000, 10000, 20000, 20000, 30000, 20000, 10000, 10000, 20000, 20000, 30000, 20000, 10000, 10000, 20000, 20000, 30000, 20000, 10000, 10000],
                    color: '#1A91EB'
                }];

                // Hour
                $scope.chartconfigHour = angular.copy($scope.chartConfig);
                $scope.chartconfigHour.options.chart.type = 'area';
                $scope.chartconfigHour.options.xAxis = {
                    'categories': ['Jan', 'Feb', 'March', 'April', 'May'],
                    'title': {
                        'text': null
                    },
                    'labels': {
                        'enabled': true
                    },
                    'lineColor': '#E6EAEE',
                    'lineWidth': 1,
                    'gridLineWidth': 0

                };
                $scope.chartconfigHour.series = [{
                    name: '',
                    showInLegend: false,
                    data: [20000, 20000, 30000, 20000, 10000],
                    color: '#1A91EB'
                }];

                //Genre
                $scope.chartconfigGenres = angular.copy($scope.chartConfig);
                $scope.chartconfigGenres.options.chart.type = 'column';
                $scope.chartconfigGenres.size.height = 180;
                $scope.chartconfigGenres.options.xAxis = {
                    'categories': ['21/9', '22/9', '23/9', '24/9', '25/9', '26/9', '27/9'],
                    'title': {
                        'text': null
                    },
                    'labels': {
                        'enabled': true
                    },
                    'lineColor': '#E6EAEE',
                    'lineWidth': 1,
                    'gridLineWidth': 0

                };
                $scope.chartconfigGenres.series = [{
                    name: 'Male',
                    showInLegend: false,
                    data: [20000, 20000, 30000, 20000, 10000, 10000, 10000],
                    color: '#337BBF'
                }, {
                    name: 'Female',
                    showInLegend: false,
                    data: [20000, 20000, 30000, 20000, 10000, 10000, 10000],
                    color: '#2297F0'
                }];
                $scope.chartconfigGenres.options.yAxis = {
                    'title': {
                        'text': null
                    },
                    'labels': {
                        'enabled': true
                    },
                    'lineColor': '#E6EAEE',
                    'lineWidth': 1,
                    'min': 0,
                    'minRange': 100,
                    'max': 3000,
                    'minPadding': 1,
                    'gridLineWidth': 0

                };

                //Community Type
                $scope.chartconfigCommunity = angular.copy($scope.chartConfig);
                $scope.chartconfigCommunity.options.chart.type = 'solidgauge';
                $scope.chartconfigCommunity.size.height = 250;
                $scope.chartconfigCommunity.options.tooltip = {
                    'borderWidth': 0,
                    'backgroundColor': 'none',
                    'shadow': false,
                    'style': {
                        'fontSize': '16px'
                    },
                    'pointFormat': '{series.name}<br><span style=\'font-size:2em; color: {point.color}; font-weight: bold\'>{point.y}%</span>',
                    'useHTML': true,
                    positioner: function(labelWidth, labelHeight) {
                        return {
                            x: 104 - labelWidth / 2,
                            y: 104
                        };
                    }
                };
                Highcharts.getOptions().colors = ['#1F96EF', '#8668E6', '#FAC83F'];
                $scope.chartconfigCommunity.options.pane = {
                    startAngle: 0,
                    endAngle: 360,
                    background: [{ // Track for Move
                        outerRadius: '109%',
                        innerRadius: '91%',
                        backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0.2).get(),
                        borderWidth: 0
                    }, { // Track for Exercise
                        outerRadius: '66%',
                        innerRadius: '85%',
                        backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[1]).setOpacity(0.2).get(),
                        borderWidth: 0
                    }, { // Track for Stand
                        outerRadius: '40%',
                        innerRadius: '59%',
                        backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[2]).setOpacity(0.2).get(),
                        borderWidth: 0
                    }]
                };
                $scope.chartconfigCommunity.options.yAxis = {
                    'min': 0,
                    'max': 100,
                    'lineWidth': 0,
                    'tickPositions': []
                };
                $scope.chartconfigCommunity.options.plotOptions = {
                    solidgauge: {
                        borderWidth: '18px',
                        dataLabels: {
                            y: 0,
                            borderWidth: 0,
                            useHTML: true,
                            enabled: false
                        },
                        linecap: 'round',
                        stickyTracking: false,
                        innerRadius: '0%'
                    },
                    series: {
                        pointWidth: 0
                    }
                };
                $scope.chartconfigCommunity.series = [{
                    name: 'Urban',
                    borderColor: '#1F96EF',
                    data: [{
                        color: Highcharts.getOptions().colors[0],
                        radius: '100%',
                        innerRadius: '100%',
                        y: 50
                    }]
                }, {
                    name: 'Suburban',
                    borderColor: Highcharts.getOptions().colors[1],
                    data: [{
                        color: Highcharts.getOptions().colors[1],
                        radius: '75%',
                        innerRadius: '75%',
                        y: 35
                    }]
                }, {
                    name: 'Rural',
                    borderColor: Highcharts.getOptions().colors[2],
                    data: [{
                        color: Highcharts.getOptions().colors[2],
                        radius: '50%',
                        innerRadius: '50%',
                        y: 15
                    }]
                }];
                // Platform
                $scope.chartconfigPlatform = angular.copy($scope.chartConfig);
                $scope.chartconfigPlatform.options.chart.type = 'pie';
                $scope.chartconfigPlatform.options.plotOptions.pie.size = 200;
                $scope.chartconfigPlatform.options.plotOptions.pie.colors = ['#289DF5', '#F9C943'];
                $scope.chartconfigPlatform.size.height = 250;
                $scope.chartconfigPlatform.series = [{
                    name: '',
                    data: [
                        ['IOS', 6],
                        ['Android', 4]
                    ],
                    innerSize: '70%',
                    showInLegend: false,
                    dataLabels: {
                        enabled: false
                    }
                }];
                $scope.chartconfigPlatform.options.tooltip = {
                    'borderWidth': 0,
                    'backgroundColor': 'none',
                    'shadow': false,
                    'style': {
                        'fontSize': '20px'
                    },
                    'pointFormat': '<span style=\'font-size:2em; color: {point.color}; font-weight: bold;\'>{point.y}%</span>',
                    'useHTML': true,
                    positioner: function(labelWidth, labelHeight) {
                        return {
                            x: 100 - labelWidth / 2,
                            y: 80
                        };
                    }
                };



                //campaignDown
                $scope.campaignDown = angular.copy($scope.chartConfig);
                $scope.campaignDown.options.chart.margin = 0;
                $scope.campaignDown.options.chart.padding = 0;
                $scope.campaignDown.options.xAxis = {
                    'categories': [],
                    'title': {
                        'text': null
                    },
                    'lineWidth': 0,
                    'lineColor': 'transparent',
                    'labels': {
                        'enabled': false
                    },
                    'minorTickLength': 0,
                    'tickLength': 0,
                    'tickWidth': 0,
                    'minPadding': 0,
                    'maxPadding': 0,
                    'pointPadding': 0,
                    'groupPadding': 0
                };
                $scope.campaignDown.options.yAxis = {
                    'lineWidth': 0,
                    'lineColor': 'transparent',
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
                    'groupPadding': 0
                };

                $scope.campaignUp = angular.copy($scope.campaignDown);
                $scope.campaignUp.series[0].color = '#62d194';
                $scope.campaignUp.series[0].data = [5, 20, 15, 2, 7, 10, 4, 11, 15, 10, 21];


                // Age Timeline
                $scope.chartNetIncome = angular.copy($scope.chartConfig);
                $scope.chartNetIncome.options.chart.type = 'column';
                $scope.chartNetIncome.options.xAxis.categories = ['21/9/2016', '22/9/2016', '23/9/2016', '24/9/2016', '25/9/2016', '26/9/2016', '27/9/2016'];
                $scope.chartNetIncome.options.xAxis.labels.enabled = true;
                $scope.chartNetIncome.size.height = 250;
                $scope.chartNetIncome.options.yAxis.lineWidth = 1;
                $scope.chartNetIncome.options.yAxis.lineColor = '#E6EAEE';
                $scope.chartNetIncome.options.plotOptions.series.stacking = 'normal';
                $scope.chartNetIncome.options.plotOptions.series.pointWidth = 40;
                $scope.chartNetIncome.options.plotOptions.series.borderRadius = 3;
                $scope.chartNetIncome.options.xAxis.lineWidth = 1;
                $scope.chartNetIncome.options.xAxis.lineColor = '#E6EAEE';
                $scope.chartNetIncome.options.yAxis = {
                    'title': {
                        'text': null
                    },
                    'labels': {
                        'enabled': true
                    },
                    'lineColor': '#E6EAEE',
                    'lineWidth': 1,
                    'min': -200000,
                    'minRange': -200000,
                    'max': 200000,
                    'minPadding': 100000,
                    'gridLineWidth': 1

                };
                $scope.chartNetIncome.series = [{
                    name: '65+',
                    showInLegend: false,
                    data: [20000, 40000, 30000, 40000, 30000, 20000],
                    color: '#51B4FF'
                }, {
                    name: '55-64',
                    showInLegend: false,
                    data: [53000, 34000, 40000, 70000, 80000, 10000],
                    color: '#337BBF'
                }, {
                    name: '45-54',
                    showInLegend: false,
                    data: [-53000, -34000, -40000, -70000, -50000, -30000],
                    color: '#E2E7EE'
                }];


                // Age Timeline
                $scope.chartconfigHouseholdIncome = angular.copy($scope.chartConfig);
                $scope.chartconfigHouseholdIncome.options.chart.polar = true;
                $scope.chartconfigHouseholdIncome.options.pane.size = '80%';
                $scope.chartconfigHouseholdIncome.options.xAxis.categories = ['0-10K 15%', '20-30K 15%', '30-40K 17%', '40-50K 17%', '50-60K 45%', '60-70K', '70-80K 45%', '80K+ 45%'];
                $scope.chartconfigHouseholdIncome.options.xAxis.labels.enabled = true;
                $scope.chartconfigHouseholdIncome.size.height = 250;
                $scope.chartconfigHouseholdIncome.options.yAxis.lineWidth = 1;
                $scope.chartconfigHouseholdIncome.options.yAxis.lineColor = '#E6EAEE';
                $scope.chartconfigHouseholdIncome.options.plotOptions.series.stacking = 'normal';
                $scope.chartconfigHouseholdIncome.options.plotOptions.series.pointWidth = 40;
                $scope.chartconfigHouseholdIncome.options.plotOptions.series.borderRadius = 3;
                $scope.chartconfigHouseholdIncome.options.plotOptions.series.marker.enabled = true;
                $scope.chartconfigHouseholdIncome.options.xAxis.lineWidth = 1;
                $scope.chartconfigHouseholdIncome.options.xAxis.lineColor = '#E6EAEE';
                $scope.chartconfigHouseholdIncome.series = [{
                    showInLegend: false,
                    type: 'area',
                    data: [10000, 80000, 20000, 70000, 30000, 60000, 40000, 50000]
                }];

            }
        ]);
})();
