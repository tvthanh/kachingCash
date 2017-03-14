(function(_) {
    'use strict';

    angular.module('panelApp').controller('scans', [
        '$scope',
        'scansService',
        function($scope, scansService) {
            var service = scansService;
            const WEEK = 'week';
            const MONTH = 'month';

            const BY_AGE = 'byAge';
            const BY_DEVICE_OS = 'byDeviceOS';
            const BY_COUNTRY = 'byCountry';
            const BY_GENDER = 'byGender';
            const TRIGGER_ACTION = 'triggerAction';
            const TOP_CAMPAIGN_BY_SPEND = 'topCampaignBySpend';
            const ACTIVE_USER_HOURS = 'activeUserByHours';
            const ACTIVE_USER_BY_DAY = 'activeUserByDay';
            const TOP_CAMPAIGN_BY_TRIGGER = 'topCampaignByTrigger';
            const ACTIVE_CAMPAIGN_IN_PERIOD = 'activeCampaignInPeriod';
            const SCAN_IN_PERIOD = 'scanInPeriod';

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
                    'pane': {},
                    'tooltip': {},
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
                    'height': 130
                },
                'tooltip': {},
                'useHighStocks': false,
                func: function(chart) {}
            };

            // ScanThisWeek
            var increaseColor = '#0fbd66';
            var decreaseColor = '#E6315E';
            $scope.$watch('analytic.filter', (newVal, oldVal) => {
                init();
            });

            // ActiveTriggers
            $scope.chartconfigActiveTriggers = angular.copy($scope.chartConfig);
            $scope.chartconfigActiveTriggers.options.chart.type = 'line';
            $scope.chartconfigActiveTriggers.size.height = 50;
            $scope.chartconfigActiveTriggers.options.xAxis = {
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
            $scope.chartconfigActiveTriggers.series = [
                {
                    name: '',
                    showInLegend: false,
                    data: [
                        2,
                        2,
                        3,
                        2,
                        1,
                        4,
                        5,
                        7,
                        1,
                        5,
                        4
                    ],
                    color: decreaseColor
                }
            ];

            // // topCamapaign
            // service.getDataOf(TOP_CAMPAIGN_BY_SPEND, period).then((response) => {
            //
            //     let topCampaigns = response.reduce((data, element) => {
            //         data.push({
            //             title:      element.campaign_name,
            //             percent:    element.percentage
            //         });
            //         return data;
            //     }, []);
            //     $scope.topCampaigns = topCampaigns;
            // });
            // var topCampaigns = [{
            //     title: 'RayBan Glasses RB7056',
            //     percent: '70',
            //     no_searches: '4',
            //     start_date: '2016-12-01',
            //     end_date: '2016-12-07',
            //     // nowDateLive:    '7'
            // }, {
            //     title: 'Drake - Hotline Bling.Mp4',
            //     percent: '50',
            //     no_searches: '2',
            //     start_date: '2016-12-01',
            //     end_date: '2016-12-07',
            //     // nowDateLive:    '7'
            // }, {
            //     title: '3 Hpbd Minion.Mp4',
            //     percent: '25',
            //     no_searches: '1',
            //     start_date: '2016-12-01',
            //     end_date: '2016-12-07',
            //     // nowDateLive:    '7'
            // }, {
            //     title: 'RayBan Glasses RB7056',
            //     percent: '10',
            //     no_searches: '3',
            //     start_date: '2016-12-01',
            //     end_date: '2016-12-07',
            //     // nowDateLive:    '7'
            // }];
            // $scope.topCampaigns = topCampaigns;

            // // topWorstCampaign
            // var topWorstCampaigns = [{
            //     title: 'RayBan Glasses RB7056',
            //     percent: '12',
            //     no_searches: '4',
            //     start_date: '2016-12-01',
            //     end_date: '2016-12-07',
            //     // nowDateLive:    '7'
            // }, {
            //     title: 'Drake - Hotline Bling.Mp4',
            //     percent: '23',
            //     no_searches: '2',
            //     start_date: '2016-12-01',
            //     end_date: '2016-12-07',
            //     // nowDateLive:    '7'
            // }, {
            //     title: '3 Hpbd Minion.Mp4',
            //     percent: '26',
            //     no_searches: '1',
            //     start_date: '2016-12-01',
            //     end_date: '2016-12-07',
            //     // nowDateLive:    '7'
            // }, {
            //     title: 'RayBan Glasses RB7056',
            //     percent: '36',
            //     no_searches: '3',
            //     start_date: '2016-12-01',
            //     end_date: '2016-12-07',
            //     // nowDateLive:    '7'
            // }];
            // $scope.topWorstCampaigns = topWorstCampaigns;

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
                service.getDataOf(SCAN_IN_PERIOD, period).then((response) => {
                    $scope.chartconfigScanThisWeek = angular.copy($scope.chartConfig);
                    $scope.chartconfigScanThisWeek.options.chart.type = 'line';
                    $scope.chartconfigScanThisWeek.size.height = 50;
                    $scope.chartconfigScanThisWeek.options.xAxis = {
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
                    $scope.scanThisWeek = {};
                    $scope.scanThisWeek.data = response.by_days.map((element) => {
                        return element.amount;
                    });
                    response.percentage
                        ? $scope.scanThisWeek.percentage = response.percentage.toFixed(2)
                        : $scope.scanThisWeek.percentage = 100;
                    $scope.scanThisWeek.total = response.total;

                    $scope.chartconfigScanThisWeek.series = [
                        {
                            name: '',
                            showInLegend: false,
                            data: $scope.scanThisWeek.data,
                            color: $scope.scanThisWeek.percentage > 0
                                ? increaseColor
                                : decreaseColor
                        }
                    ];
                    $scope.view.busy = false;
                }, (error) => {
                    console.error(error);
                    $scope.view.busy = false;
                });

                service.getDataOf(ACTIVE_USER_BY_DAY, period).then((response) => {
                    // ActiveUser
                    $scope.chartconfigActiveUser = angular.copy($scope.chartConfig);
                    $scope.chartconfigActiveUser.options.chart.type = 'line';
                    $scope.chartconfigActiveUser.size.height = 50;
                    $scope.chartconfigActiveUser.options.xAxis = {
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
                    $scope.activeUser = {};
                    $scope.activeUser.data = response.by_days.map((element) => {
                        return element.amount;
                    });
                    response.percentage
                        ? $scope.activeUser.percentage = response.percentage.toFixed(2)
                        : $scope.activeUser.percentage = 100;
                    $scope.activeUser.total = response.total;
                    $scope.chartconfigActiveUser.series = [
                        {
                            name: '',
                            showInLegend: false,
                            data: $scope.activeUser.data,
                            color: $scope.activeUser.percentage > 0
                                ? increaseColor
                                : decreaseColor
                        }
                    ];
                });

                service.getDataOf(ACTIVE_CAMPAIGN_IN_PERIOD, period).then((response) => {
                    // ActiveCampaigns
                    $scope.chartconfigActiveCampaigns = angular.copy($scope.chartConfig);
                    $scope.chartconfigActiveCampaigns.options.chart.type = 'line';
                    $scope.chartconfigActiveCampaigns.size.height = 50;
                    $scope.chartconfigActiveCampaigns.options.xAxis = {
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
                    $scope.activeCampaignInPeriod = {};
                    $scope.activeCampaignInPeriod.data = response.by_days.map((element) => {
                        return element.amount;
                    });
                    response.percentage
                        ? $scope.activeCampaignInPeriod.percentage = response.percentage.toFixed(2)
                        : $scope.activeCampaignInPeriod.percentage = 100;
                    $scope.activeCampaignInPeriod.total = response.total;
                    $scope.chartconfigActiveCampaigns.series = [
                        {
                            name: '',
                            showInLegend: false,
                            data: $scope.activeCampaignInPeriod.data,
                            color: $scope.activeCampaignInPeriod.percentage > 0
                                ? increaseColor
                                : decreaseColor
                        }
                    ];
                });

                service.getDataOf(BY_AGE, period).then((response) => {
                    // agePie
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

                service.getDataOf(BY_DEVICE_OS, period).then((response) => {
                    // devicePie
                    let data = response.reduce((data, element) => {
                        data.push([element.participant__device_os, element.total]);
                        return data;
                    }, []);
                    let maxText = _.max(response, 'total').participant__device_os;
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

                service.getDataOf(BY_COUNTRY, period).then((response) => {
                    // countryPie
                    let data = response.reduce((data, element) => {
                        data.push([element.participant__country__short_name, element.total]);
                        return data;
                    }, []);
                    let maxText = _.max(response, 'total').participant__country__short_name;
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

                service.getDataOf(ACTIVE_USER_HOURS, period).then((response) => {
                    // activeUsersLineChart
                    let reverseResponse = response.reverse();
                    let yearStart = reverseResponse[0].hour.split('T')[0].split('-')[0];
                    let monthStart = reverseResponse[0].hour.split('T')[0].split('-')[1] - 1;
                    let dayStart = reverseResponse[0].hour.split('T')[0].split('-')[2];
                    let hourStart = reverseResponse[0].hour.split('T')[1].split(':')[0];
                    let pointStart = Date.UTC(yearStart, monthStart, dayStart, hourStart);
                    let data = reverseResponse.reduce((data, element) => {
                        data.push(element.amount);
                        return data;
                    }, []);
                    var activeUsers = {
                        id: 'activeUsersLineChart',
                        name: 'Weekly Users',
                        data: data,
                        pointStart: pointStart,
                        pointInterval: 3600 * 1000
                    };
                    $scope.activeUsers = activeUsers;
                    drawLineChart($scope.activeUsers);
                });

                service.getDataOf(TOP_CAMPAIGN_BY_SPEND, period).then((response) => {

                    let topCampaigns = response.reduce((data, element) => {
                        data.push({
                            title: element.campaign_name,
                            percent: element.percentage
                                ? element.percentage.toFixed(2)
                                : 0
                        });
                        return data;
                    }, []);
                    $scope.topCampaigns = topCampaigns;
                });

                service.getDataOf(TOP_CAMPAIGN_BY_SPEND, period).then((response) => {
                    let reverseResponse = response.reverse();
                    let topWorstCampaigns = reverseResponse.reduce((data, element) => {
                        data.push({
                            title: element.campaign_name,
                            percent: element.percentage
                                ? element.percentage.toFixed(2)
                                : 0
                        });
                        return data;
                    }, []);
                    $scope.topWorstCampaigns = topWorstCampaigns;
                });

                service.getDataOf(TRIGGER_ACTION, period).then((response) => {
                    let triggerAction = response.reduce((data, element) => {
                        data.push({
                            action: element.action,
                            total: element.total,
                            percentage: element.percentage
                                ? element.percentage.toFixed(2)
                                : 0
                        });
                        return data;
                    }, []);
                    triggerAction.map((action) => {
                        switch (action.action) {
                            case 'share':
                                action.icon = 'fa fa-share';
                                break;
                            case 'scan':
                                action.icon = 'fa fa-qrcode';
                                break;
                            case 'buy_product':
                                action.icon = 'fa fa-cubes';
                                break;
                            default:
                        }
                        return action;
                    });
                    $scope.triggerAction = triggerAction;
                });

                service.getDataOf(TOP_CAMPAIGN_BY_TRIGGER, period).then((response) => {
                    let topTriggers = response.reduce((data, element) => {
                        data.push({
                            image: element.campaign_header_image,
                            title: element.campaign_name,
                            percent: element.percentage
                                ? element.percentage.toFixed(2)
                                : 0,
                            total: element.total
                        });
                        return data;
                    }, []);
                    $scope.topTriggers = topTriggers;
                });
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
                    series: [
                        {
                            name: c.name,
                            data: c.data,
                            pointStart: c.pointStart,
                            pointInterval: c.pointInterval
                        }
                    ],
                    credits: {
                        enabled: false
                    },
                    legend: {
                        enabled: true
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
                            return ('<div>' + this.point.name + ' : ' + this.point.percentage.toFixed(2) + '%' + '</div>')
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
})(_);
