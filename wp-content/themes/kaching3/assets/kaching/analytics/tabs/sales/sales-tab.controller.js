(function() {
    'use strict';

    angular.module('panelApp')
        .controller('sales', [
            '$scope',
            'salesService',
            function(
            $scope,
            salesService
            ) {

                var service = salesService;
                const WEEK = 'week';
                const MONTH = 'month';

                const BY_AGE = 'saleByAge';
                const BY_DEVICE_OS = 'saleByDeviceOS';
                const BY_COUNTRY = 'saleByCountry';
                const BY_GENDER = 'saleByGender';

                const REVENUE_IN_PERIOD = 'revenueInPeriod';
                const AVG_PER_TRANS_IN_PERIOD = 'avgPerTransInPeriod';
                const TRANSACTION_IN_PERIOD = 'transactionInPeriod';

                // const ACTIVE_USER_BY_DAY = 'activeUserByDay';
                // const TOP_CAMPAIGN_BY_TRIGGER = 'topCampaignByTrigger';
                // const ACTIVE_CAMPAIGN_IN_PERIOD = 'activeCampaignInPeriod';
                // const SCAN_IN_PERIOD = 'scanInPeriod';

                var period = WEEK;

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


                var increaseColor = '#0fbd66';
                var decreaseColor = '#E6315E';
                $scope.$watch('analytic.filter', (newVal, oldVal) => {
                    init();
                });



                // ActiveTriggers
                $scope.chartconfigSalesVsScans = angular.copy($scope.chartConfig);
                $scope.chartconfigSalesVsScans.options.chart.type = 'line';
                $scope.chartconfigSalesVsScans.size.height = 50;
                $scope.chartconfigSalesVsScans.options.xAxis = {
                    title: {
                        text: null
                    },
                    labels: {
                        enabled: false
                    },
                    lineColor: '#FFFFFF',
                    lineWidth: 1,
                    gridLineWidth: 0,
                    tickColor: '#FFFFFF',
                    tickWidth: 0
                };
                $scope.chartconfigSalesVsScans.series = [{
                    name: '',
                    showInLegend: false,
                    data: [2, 2, 3, 2, 1, 4, 5, 7, 1, 5, 4],
                    color: decreaseColor
                }];

                // totalRevenueLineChar
                var activeUsers = {
                    id: 'totalRevenueLineChar',
                    name: 'Weekly Users',
                    data: [
                        1000, 1000, 2000, 2000, 3000, 3000, 4500, 4000, 4500, 5000, 6000, 5500, 4000, 3000, 4000, 4500, 4575, 4700, 5000,5500,5550,5555,4554,6923,
                        3000, 3000, 3000, 3100, 3100, 3150, 3400, 3300, 3570, 3333, 3586, 3867, 3860, 3051, 3054, 3768, 3451, 3856, 3949,3222,3333,3210,3462,3678,
                        2000, 1000, 4000, 3500, 10000, 6000, 5500, 7500, 4500, 6750, 8540, 9000, 8000, 6500, 4000, 4750, 2750, 8750, 9432,1234,5461,2378,3462,6923,
                        2000, 1000, 4000, 3500, 2222, 2000, 3200, 7500, 4500, 6750, 8540, 9000, 8000, 6500, 4000, 4750, 2750, 8750, 9432,1234,5461,2378,3462,6923,
                        2000, 1000, 4000, 3500, 3000, 2000, 1200, 7500, 4500, 6750, 8540, 9000, 8000, 6500, 4000, 4750, 2750, 8750, 9432,1234,5461,2378,3462,6923,
                        2000, 1000, 4000, 3500, 1000, 2000, 2400, 3300, 4500, 6750, 8540, 9000, 8000, 6500, 4000, 4750, 2750, 8750, 9432,1234,5461,2378,3462,6923,
                        2000, 1000, 4000, 3500, 2000, 6000, 5500, 7500, 4500, 6750, 8540, 9000, 8000, 6500, 4000, 4750, 2750, 8750, 9432,1234,5461,2378,3462,6923,
                        ],
                    pointStart: Date.UTC(2016, 0, 1),
                    pointInterval: 3600 * 1000
                };
                $scope.activeUsers = activeUsers;

                // conversionLineChar
                var conversion = {
                    id: 'conversionLineChar',
                    name: 'Weekly Users',
                    data: [
                        1000, 1000, 2000, 2000, 3000, 3000, 4500, 4000, 4500, 5000, 6000, 5500, 4000, 3000, 4000, 4500, 4575, 4700, 5000,5500,5550,5555,4554,6923,
                        3000, 3000, 3000, 3100, 3100, 3150, 3400, 3300, 3570, 3333, 3586, 3867, 3860, 3051, 3054, 3768, 3451, 3856, 3949,3222,3333,3210,3462,3678,
                        2000, 1000, 4000, 3500, 10000, 6000, 5500, 7500, 4500, 6750, 8540, 9000, 8000, 6500, 4000, 4750, 2750, 8750, 9432,1234,5461,2378,3462,6923,
                        2000, 1000, 4000, 3500, 2222, 2000, 3200, 7500, 4500, 6750, 8540, 9000, 8000, 6500, 4000, 4750, 2750, 8750, 9432,1234,5461,2378,3462,6923,
                        2000, 1000, 4000, 3500, 3000, 2000, 1200, 7500, 4500, 6750, 8540, 9000, 8000, 6500, 4000, 4750, 2750, 8750, 9432,1234,5461,2378,3462,6923,
                        2000, 1000, 4000, 3500, 1000, 2000, 2400, 3300, 4500, 6750, 8540, 9000, 8000, 6500, 4000, 4750, 2750, 8750, 9432,1234,5461,2378,3462,6923,
                        2000, 1000, 4000, 3500, 2000, 6000, 5500, 7500, 4500, 6750, 8540, 9000, 8000, 6500, 4000, 4750, 2750, 8750, 9432,1234,5461,2378,3462,6923,
                        ],
                    pointStart: Date.UTC(2016, 0, 1),
                    pointInterval: 3600 * 1000
                };
                $scope.conversion = conversion;

                // conversionLineChar
                var daytimesSales = {
                    id: 'daytimesSalesLineChar',
                    name: 'Weekly Users',
                    data: [
                        1000, 1000, 2000, 2000, 3000, 3000, 4500, 4000, 4500, 5000, 6000, 5500, 4000, 3000, 4000, 4500, 4575, 4700, 5000,5500,5550,5555,4554,6923,
                        3000, 3000, 3000, 3100, 3100, 3150, 3400, 3300, 3570, 3333, 3586, 3867, 3860, 3051, 3054, 3768, 3451, 3856, 3949,3222,3333,3210,3462,3678,
                        2000, 1000, 4000, 3500, 10000, 6000, 5500, 7500, 4500, 6750, 8540, 9000, 8000, 6500, 4000, 4750, 2750, 8750, 9432,1234,5461,2378,3462,6923,
                        2000, 1000, 4000, 3500, 2222, 2000, 3200, 7500, 4500, 6750, 8540, 9000, 8000, 6500, 4000, 4750, 2750, 8750, 9432,1234,5461,2378,3462,6923,
                        2000, 1000, 4000, 3500, 3000, 2000, 1200, 7500, 4500, 6750, 8540, 9000, 8000, 6500, 4000, 4750, 2750, 8750, 9432,1234,5461,2378,3462,6923,
                        2000, 1000, 4000, 3500, 1000, 2000, 2400, 3300, 4500, 6750, 8540, 9000, 8000, 6500, 4000, 4750, 2750, 8750, 9432,1234,5461,2378,3462,6923,
                        2000, 1000, 4000, 3500, 2000, 6000, 5500, 7500, 4500, 6750, 8540, 9000, 8000, 6500, 4000, 4750, 2750, 8750, 9432,1234,5461,2378,3462,6923,
                        ],
                    pointStart: Date.UTC(2016, 0, 1),
                    pointInterval: 3600 * 1000
                };
                $scope.daytimesSales = daytimesSales;

                // daytimesTransactionsLineChar
                var daytimesTransactions = {
                    id: 'daytimesTransactionsLineChar',
                    name: 'Weekly Users',
                    data: [
                        1000, 1000, 2000, 2000, 3000, 3000, 4500, 4000, 4500, 5000, 6000, 5500, 4000, 3000, 4000, 4500, 4575, 4700, 5000,5500,5550,5555,4554,6923,
                        3000, 3000, 3000, 3100, 3100, 3150, 3400, 3300, 3570, 3333, 3586, 3867, 3860, 3051, 3054, 3768, 3451, 3856, 3949,3222,3333,3210,3462,3678,
                        2000, 1000, 4000, 3500, 10000, 6000, 5500, 7500, 4500, 6750, 8540, 9000, 8000, 6500, 4000, 4750, 2750, 8750, 9432,1234,5461,2378,3462,6923,
                        2000, 1000, 4000, 3500, 2222, 2000, 3200, 7500, 4500, 6750, 8540, 9000, 8000, 6500, 4000, 4750, 2750, 8750, 9432,1234,5461,2378,3462,6923,
                        2000, 1000, 4000, 3500, 3000, 2000, 1200, 7500, 4500, 6750, 8540, 9000, 8000, 6500, 4000, 4750, 2750, 8750, 9432,1234,5461,2378,3462,6923,
                        2000, 1000, 4000, 3500, 1000, 2000, 2400, 3300, 4500, 6750, 8540, 9000, 8000, 6500, 4000, 4750, 2750, 8750, 9432,1234,5461,2378,3462,6923,
                        2000, 1000, 4000, 3500, 2000, 6000, 5500, 7500, 4500, 6750, 8540, 9000, 8000, 6500, 4000, 4750, 2750, 8750, 9432,1234,5461,2378,3462,6923,
                        ],
                    pointStart: Date.UTC(2016, 0, 1),
                    pointInterval: 3600 * 1000
                };
                $scope.daytimesTransactions = daytimesTransactions;

                // Begin: Function Zone //
                function init() {
                    switch ($scope.analytic.filter) {
                        case 'Last 7 days':
                            period = WEEK;
                            break;
                        case 'Last month':
                            period = MONTH;
                            break;
                        default:
                            break;
                    }

                    // REVENUE_IN_PERIOD
                    service.getDataOf(REVENUE_IN_PERIOD, period).then((response) => {
                        $scope.chartconfigTotalRevenue = angular.copy($scope.chartConfig);
                        $scope.chartconfigTotalRevenue.options.chart.type = 'line';
                        $scope.chartconfigTotalRevenue.size.height = 50;
                        $scope.chartconfigTotalRevenue.options.xAxis = {
                            title: {
                                text: null
                            },
                            labels: {
                                enabled: false
                            },
                            lineColor: '#FFFFFF',
                            lineWidth: 1,
                            gridLineWidth: 0,
                            tickColor: '#FFFFFF',
                            tickWidth: 0
                        };
                        $scope.totalRevenue = {};
                        $scope.totalRevenue.data = response.by_days.map((element) => {
                            return element.amount;
                        });
                        response.percentage
                            ? $scope.totalRevenue.percentage = response.percentage.toFixed(2)
                            : $scope.totalRevenue.percentage = 100;
                        $scope.totalRevenue.total = response.total.toFixed(2);

                        $scope.chartconfigTotalRevenue.series = [{
                            name: '',
                            showInLegend: false,
                            data: $scope.totalRevenue.data,
                            color: $scope.totalRevenue.percentage > 0
                                ? increaseColor
                                : decreaseColor
                        }];
                    });

                    // TRANSACTION_IN_PERIOD
                    service.getDataOf(TRANSACTION_IN_PERIOD, period).then((response) => {
                        $scope.chartconfigTransaction = angular.copy($scope.chartConfig);
                        $scope.chartconfigTransaction.options.chart.type = 'line';
                        $scope.chartconfigTransaction.size.height = 50;
                        $scope.chartconfigTransaction.options.xAxis = {
                            title: {
                                text: null
                            },
                            labels: {
                                enabled: false
                            },
                            lineColor: '#FFFFFF',
                            lineWidth: 1,
                            gridLineWidth: 0,
                            tickColor: '#FFFFFF',
                            tickWidth: 0
                        };
                        $scope.transaction = {};
                        $scope.transaction.data = response.by_days.map((element) => {
                            return element.amount;
                        });
                        response.percentage
                            ? $scope.transaction.percentage = response.percentage.toFixed(2)
                            : $scope.transaction.percentage = 100;
                        $scope.transaction.total = response.total.toFixed(2);
                        $scope.chartconfigTransaction.series = [{
                            name: '',
                            showInLegend: false,
                            data: $scope.transaction.data,
                            color: $scope.transaction.percentage > 0
                                ? increaseColor
                                : decreaseColor
                        }];
                    });

                    // AVG_PER_TRANS_IN_PERIOD
                    service.getDataOf(AVG_PER_TRANS_IN_PERIOD, period).then((response) => {
                        $scope.chartconfigAvgRevenueSale = angular.copy($scope.chartConfig);
                        $scope.chartconfigAvgRevenueSale.options.chart.type = 'line';
                        $scope.chartconfigAvgRevenueSale.size.height = 50;
                        $scope.chartconfigAvgRevenueSale.options.xAxis = {
                            title: {
                                text: null
                            },
                            labels: {
                                enabled: false
                            },
                            lineColor: '#FFFFFF',
                            lineWidth: 1,
                            gridLineWidth: 0,
                            tickColor: '#FFFFFF',
                            tickWidth: 0
                        };
                        $scope.avgRevenueSale = {};
                        $scope.avgRevenueSale.data = response.by_days.map((element) => {
                            return element.amount;
                        });
                        response.percentage
                            ? $scope.avgRevenueSale.percentage = response.percentage.toFixed(2)
                            : $scope.avgRevenueSale.percentage = 100;
                        $scope.avgRevenueSale.total = response.total.toFixed(2);
                        $scope.chartconfigAvgRevenueSale.series = [{
                            name: '',
                            showInLegend: false,
                            data: $scope.avgRevenueSale.data,
                            color: $scope.avgRevenueSale.percentage > 0
                                ? increaseColor
                                : decreaseColor
                        }];
                    });

                    service.getDataOf(BY_AGE, period).then((response) => {
                        let data = response.reduce(function(data, element) {
                            data.push(['Age: ' + element.age[0] + '-' + element.age[1], element.count]);
                            return data;
                        }, []);
                        let maxText = _.max(response, (item) => {
                            return item.count;
                        }).age;
                        maxText = maxText[0] + '-' + maxText[1];
                        var agePie = {
                            id: 'agePie',
                            title: {
                                text: 'AGE'
                            },
                            series: [
                                {
                                    name: 'Percent',
                                    data: data
                                }
                            ],
                            credits: {
                                enabled: false
                            },
                            image: '/assets/images/analytics/pieImages/birthday_icon.svg',
                            max: maxText
                                ? maxText
                                : 'None'
                        };
                        $scope.agePie = agePie;
                        // genderPie
                        drawPieChart($scope.agePie);
                    });

                    service.getDataOf(BY_GENDER, period).then((response) => {
                        // genderPie
                        let data = [
                            [
                                'Male', response.male
                            ],
                            ['Female', response.female]
                        ];
                        let maxText = response.male >= response.female
                            ? 'Male'
                            : 'Female';
                        let maleImage = '/assets/images/analytics/pieImages/male_icon.svg';
                        let femaleImage = '/assets/images/analytics/pieImages/female_icon.svg';
                        let maxImage = response.male >= response.female
                            ? maleImage
                            : femaleImage;
                        var genderPie = {
                            id: 'genderPie',
                            title: {
                                text: 'GENDER'
                            },
                            series: [
                                {
                                    name: 'Percent',
                                    data: data
                                }
                            ],
                            credits: {
                                enabled: false
                            },
                            image: maxImage,
                            max: maxText
                                ? maxText
                                : 'None'
                        };
                        $scope.genderPie = genderPie;
                        drawPieChart($scope.genderPie);
                    });

                    service.getDataOf(BY_COUNTRY, period).then((response) => {
                        // countryPie
                        let data = response.reduce((data, element) => {
                            data.push([element.owner__country__short_name, element.total]);
                            return data;
                        }, []);
                        let maxText = _.max(response, 'total').owner__country__short_name;
                        var countryPie = {
                            id: 'countryPie',
                            title: {
                                text: 'COUNTRY'
                            },
                            series: [
                                {
                                    name: 'Percent',
                                    data: data
                                }
                            ],
                            credits: {
                                enabled: false
                            },
                            image: '/assets/images/analytics/pieImages/globe_icon.svg',
                            max: maxText
                                ? maxTextCountry(maxText)
                                : 'None'
                        };
                        $scope.countryPie = countryPie;
                        drawPieChart($scope.countryPie);
                    });

                    // Change sort country for the USA and the UK
                    function maxTextCountry(maxText) {
                        var country = '';
                        switch (maxText) {
                            case 'United Kingdom of Great Britain and Northern Ireland':
                                country = 'The UK';
                                break;
                            case 'United States of America':
                                country = 'The USA';
                                break;
                            default:
                                country = maxText;
                        }
                        return country;
                    }
                    // End change sort country for the USA and the UK

                    service.getDataOf(BY_DEVICE_OS, period).then((response) => {
                        // devicePie
                        let data = response.reduce((data, element) => {
                            data.push([element.phone_type, element.total]);
                            return data;
                        }, []);
                        let maxText = _.max(response, 'total').phone_type;
                        let maxImage;
                        switch (maxText) {
                            case 'iOS':
                                maxImage = '/assets/images/analytics/pieImages/apple_icon.svg';
                                break;
                            case 'Android':
                                maxImage = '/assets/images/analytics/pieImages/android_icon.svg';
                                break;
                            default:
                                maxImage = '/assets/images/analytics/pieImages/apple_icon.svg';
                                break;
                        }
                        var devicePie = {
                            id: 'devicePie',
                            title: {
                                text: 'DEVICE'
                            },
                            series: [
                                {
                                    name: 'Percent',
                                    data: data
                                }
                            ],
                            credits: {
                                enabled: false
                            },
                            image: maxImage,
                            max: maxText
                                ? maxText
                                : 'None',
                            x: 126
                        };
                        $scope.devicePie = devicePie;
                        drawPieChart($scope.devicePie);
                    });

                    drawLineChart($scope.activeUsers);
                    drawLineChart($scope.conversion);
                    drawLineChart($scope.daytimesSales);
                    drawLineChart($scope.daytimesTransactions);

                    // drawPieChart($scope.agePie);
                    // drawPieChart($scope.genderPie);
                    // drawPieChart($scope.countryPie);
                    // drawPieChart($scope.devicePie);
                }

                function drawLineChart(chart) {
                    const c = chart;
                    var lineChart = Highcharts.stockChart(c.id, {
                        title: {
                            text: ''
                        },
                        xAxis: {
                            tickmarkPlacement: 'on',
                            type: 'datetime',
                            tickInterval: 24 * 3600 * 1000
                        },
                        yAxis: {
                            title: {
                                text: ''
                            },
                            opposite: false
                        },
                        rangeSelector: {
                            enabled: false
                        },
                        navigator: {
                            enabled: false
                        },
                        exporting: {
                            enabled: false
                        },
                        rangeSelectorZoom: {
                            enabled: false
                        },
                        scrollbar: {
                            enabled: false
                        },
                        series: [{
                            name: c.name,
                            data: c.data,
                            pointStart: c.pointStart,
                            pointInterval: c.pointInterval
                        }],
                        credits: {
                            enabled: false
                        },
                        legend: {
                            enabled: true,
                        }
                    });
                }

                function drawPieChart(chart) {
                    const c = chart;
                    var pieChart = Highcharts.chart(c.id, {
                        chart: {
                            marginTop: -90,
                            height: 200
                        },
                        title: {
                            text: c.title.text, //'Browser<br>shares<br>2015',
                            align: 'center', //'center',
                            verticalAlign: 'bottom', //'bottom',
                            y: -5 //40
                        },
                        subtitle: {
                            text: '<div class="box-icon-pie" style="width:25%;"><img src="' + kachingAppConfig.wpTemplateUri + c.image + '" /></div><div class="box-num-pie align-center">' + c.max + '</div>',
                            align: 'center',
                            verticalAlign: 'middle',
                            useHTML: true,
                            y: -30
                        },
                        tooltip: {
                            // pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
                            useHTML: true,
                            formatter: function() {
                                let name = this.point.name !== 'Slice' ? this.point.name : 'Other';
                                return ('<div>' + name + ' : ' + this.point.percentage.toFixed(2) + '%' + '</div>')
                            }
                        },
                        plotOptions: {
                            pie: {
                                dataLabels: {
                                    enabled: false, //true,
                                    distance: -50, //-50,
                                    style: {
                                        fontWeight: 'bold', //'bold',
                                        color: 'white'
                                    }
                                },
                                startAngle: 0, //0,
                                endAngle: 360, //360,
                                center: [
                                    '50%', '65%'
                                ],
                                showInLegend: true,
                                size: '50%'
                            }
                        },
                        legend: {
                            enabled: false
                            //     align: 'right',
                            //     verticalAlign: 'middle',
                            //     layout: 'vertical',
                            //     symbolRadius: 100,
                            //     symbolPadding: 5,
                            //     itemMarginBottom: 10,
                            //     itemStyle: {
                            //         fontWeight: 100
                            //     },
                            //     symbolWidth: 16,
                            //     symbolHeight: 16,
                            //     y: 50
                        },
                        exporting: {
                            enabled: false
                        },
                        series: [
                            {
                                type: 'pie',
                                name: c.series[0].name, //'Browser share',
                                innerSize: '70%',
                                data: c.series[0].data
                            }
                        ],
                        credits: {
                            enabled: false
                        }
                    });
                }

                init();
            }
        ]);
})();
