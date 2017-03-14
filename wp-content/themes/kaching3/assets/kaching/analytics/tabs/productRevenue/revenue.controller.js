(function() {
    'use strict';

    angular.module('panelApp')
        .controller('revenueCtrl', [
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

                // Data Prduct Revenue Details
                var dataProductRevenueDetails = [
                    {
                        srcImg: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRa_pyRU_WvbQ0QtxuyPYZq_5G5Pf_XxkCuYLmg3mNzfGwPrvpk',
                        title: 'Rabbit hole London',
                        subTitle: 'Oversized Hoodie',
                        price: 'USD 230.00',
                        payment: 'Credit Card',
                        hoursOfView: '23:13',
                        dateOfView: '24 Nov 2016',
                        hoursOfSale: '23:13',
                        dateOfSale: '24 Nov 2016',
                        userName: 'John Appleseed',
                        sex: 'Male',
                        age: '18-24',
                        country: 'Beattyhaven Canada',
                        companyName: 'Nike',
                        hrefReview: 'http://www.nike.com/us/en_us/'
                    },
                    {
                        srcImg: 'https://cdn.shopify.com/s/files/1/1202/6102/products/stussy-world-tour-t-shirt-fa15-navy-1_1_grande.jpeg?v=1462801097',
                        title: 'Stussy',
                        subTitle: 'Bills T-shirt',
                        price: 'USD 150.00',
                        payment: 'Credit Card',
                        hoursOfView: '12:24',
                        dateOfView: '24 Nov 2016',
                        hoursOfSale: '12:24',
                        dateOfSale: '24 Nov 2016',
                        userName: 'Ricardo Hall',
                        sex: 'Male',
                        age: '45-50',
                        country: 'South Aditya French Guiana',
                        companyName: 'Nike',
                        hrefReview: 'http://www.nike.com/us/en_us/'
                    },
                    {
                        srcImg: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXBBjCCRVbMx6LeQMzYKSDq1C-NAlOpTF6FXWMfZe-e69_eDFm',
                        title: 'Billionaire Boys Club',
                        subTitle: 'Motm Starfield T-Shirt',
                        price: 'USD 80.00',
                        payment: 'Paypal',
                        hoursOfView: '02:25',
                        dateOfView: '24 Nov 2016',
                        hoursOfSale: '02:25',
                        dateOfSale: '24 Nov 2016',
                        userName: 'Viola Wade',
                        sex: 'Female',
                        age: '18-24',
                        country: 'Port Erickmouth Sweden',
                        companyName: 'Coke',
                        hrefReview: 'http://www.coca-colacompany.com/'
                    },
                    {
                        srcImg: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQC7B1qC3EfAnnCqE-Ku58xyN0cN03s9sHGdkOl-IJwS-7P7wHYsA',
                        title: 'A.P.C',
                        subTitle: 'Petit New Standard',
                        price: 'USD 180.00',
                        payment: 'Credit Card',
                        hoursOfView: '12:54',
                        dateOfView: '05 Oct 2016',
                        hoursOfSale: '12:54',
                        dateOfSale: '05 Oct 2016',
                        userName: 'Mario Hardy',
                        sex: 'Male',
                        age: '18-24',
                        country: 'North Annie Aruba',
                        companyName: 'Nikon',
                        hrefReview: 'http://www.nikon.com.vn/vi_VN'
                    },
                    {
                        srcImg: 'data:image/jpeg;base64,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',
                        title: 'Silas',
                        subTitle: 'Tokyo/London Print Yoke…',
                        price: 'USD 170.00',
                        payment: 'Apple Pay',
                        hoursOfView: '23:13',
                        dateOfView: '05 Oct 2016',
                        hoursOfSale: '23:13',
                        dateOfSale: '05 Oct 2016',
                        userName: 'Ricardo Hall',
                        sex: 'Male',
                        age: '35-44',
                        country: 'Danstad Russian Federation',
                        companyName: 'Nike',
                        hrefReview: 'http://www.nike.com/us/en_us/'
                    }
                ];

                // Begin: variable zone //
                var revenueSeries = {
                    id: 'revenueChart',
                    name: 'Revenue',
                    data: [2000, 1000, 4000, 3500, 10000, 6000, 5500, 7500, 4500, 6750, 8540, 9000, 8000, 6500, 4000, 4750, 2750, 8750],
                    pointStart: Date.UTC(2016, 0, 1),
                    pointInterval: 24 * 3600 * 1000
                };
                var revenueData = [{
                    title: 'REVENUE',
                    value: '$37.5k'
                }, {
                    title: 'UNIT SOLD',
                    value: '890'
                }, {
                    title: 'ORDERS',
                    value: '381'
                }, {
                    title: 'VIEWS',
                    value: '13.2k'
                }, {
                    title: 'CONV.RATE',
                    value: '4.32%'
                }, {
                    title: 'AOV',
                    value: '$24.9'
                }, {
                    title: 'RPV',
                    value: '$8.9'
                }];
                var revenuePieProduct = {
                    id: 'revenuePieProduct',
                    title: {
                        text: 'Revenue by <strong>Product</strong>',
                    },
                    series: [{
                        name: 'Revenue by Product',
                        data: [
                            ['<strong>Hoodie</strong><br/>USD 3689.80', 3689.80],
                            ['<strong>T-Shirt</strong><br/>USD 980.20', 980.20],
                            ['<strong>Skate T-Shirt</strong><br/>USD 770.20', 770.20],
                        ]
                    }],
                    credits: {
                        enabled: false
                    }
                };
                var revenuePieSource = {
                    id: 'revenuePieSource',
                    title: {
                        text: 'Revenue by <strong>Source</strong>',
                    },
                    series: [{
                        name: 'Revenue by Source',
                        data: [
                            ['<strong>Amazon</strong><br/>USD 339.80', 339.80],
                            ['<strong>Walmart</strong><br/>USD 680.20', 680.20],
                            ['<strong>Ebay</strong><br/>USD 120.20', 120.20],
                        ]
                    }],
                    credits: {
                        enabled: false
                    }
                };
                var revenuePieCountry = {
                    id: 'revenuePieCountry',
                    title: {
                        text: 'Revenue by <strong>Country</strong>',
                    },
                    series: [{
                        name: 'Revenue by Country',
                        data: [
                            ['<strong>Canada</strong><br/>USD 2358.85', 2358.85],
                            ['<strong>Sweden</strong><br/>USD 7583.10', 7583.10],
                            ['<strong>Singapore</strong><br/>USD 5461.28', 5461.28],
                        ]
                    }],
                    credits: {
                        enabled: false
                    }
                };
                var productViewRate = {
                    id: 'productViewRate',
                    title: 'Product View Rate',
                    categories: [
                        '<strong>UNDEFEATED</strong> Full Zip Jacket',
                        '<strong>STUSSY</strong> T-Shirt',
                        '<strong>HUF</strong> T-Shirt',
                        '<strong>STAMPD</strong> Warm Up Pants'
                    ],
                    logos: [
                        'https://image.freepik.com/free-icon/domain_318-32028.jpg',
                        'http://www.albany.edu/ims/Images/youtubelink.png',
                        'https://maxcdn.icons8.com/Share/icon/Network//domain1600.png',
                        'http://static.wixstatic.com/media/1a7da0_4c725e80c78c4e9893caf308e1a389c5.png'
                    ],
                    series: {
                        data: [{
                            y: 500,
                            color: '#2097f0'
                        }, {
                            y: 300,
                            color: '#8d74e5'
                        }, {
                            y: 400,
                            color: '#3FC42A'
                        }, {
                            y: 700,
                            color: '#FAC739'
                        }]
                    },
                    credits: {
                        enabled: false
                    },
                    exporting: {
                        enabled: false
                    }
                };
                var productSpending = {
                    id: 'productSpending',
                    title: {
                        text: 'Product Spending',
                    },
                    series: [{
                        name: 'Product Spending',
                        data: [
                            ['<strong>ROLEX</strong> USD ', 1396],
                            ['<strong>VANS</strong> USD ', 501],
                            ['<strong>INCASE</strong> USD ', 465],
                            ['<strong>GUCCI</strong> USD ', 430],
                            ['<strong>LV</strong> USD ', 215],
                            ['<strong>INCASE</strong> USD ', 573]
                        ]
                    }],
                    credits: {
                        enabled: false
                    }
                };
                var dailySaleData = [{
                    y: 50,
                }, {
                    y: 30,
                }, {
                    y: 10,
                }, {
                    y: 25,
                }, {
                    y: 60,
                }, {
                    y: 75,
                }, {
                    y: 45,
                }, {
                    y: 70,
                }, {
                    y: 50,
                }, {
                    y: 45,
                }, {
                    y: 90,
                }, {
                    y: 80,
                }, {
                    y: 76,
                }, {
                    y: 21,
                }, {
                    y: 80,
                }, {
                    y: 45,
                }, {
                    y: 30,
                }, {
                    y: 24,
                }, {
                    y: 15,
                }, {
                    y: 45,
                }];
                var maxDailySale = findMaxDailySale(dailySaleData);
                var dailySale = {
                    id: 'dailySale',
                    title: 'Daily Sale',
                    series: {
                        data: dailySaleData
                    },
                    maxValue: maxDailySale,
                    increaseValue: '+32'
                };
                var customer = {
                    id: 'customerPie',
                    title: {
                        text: 'Customer',
                    },
                    series: [{
                        name: 'Revenue by Product',
                        data: [
                            ['NEW', 3689.80],
                            ['RETURNING', 1280.20],
                            ['REFERRALS', 770.20],
                        ]
                    }],
                    maxValue: 271,
                    increaseValue: '+9.3',
                    total: function() {
                        var sum = 0;
                        var data = this.series[0].data;
                        for (var i = 1; i < data.length; i++) {
                            sum += data[i][1];
                        }
                        return sum;
                    }
                };
                var monthRevenue = {
                    id: 'monthRevenue',
                    name: 'Month',
                    data: [
                        [Date.UTC(2016, 1),1000,'12'],
                        [Date.UTC(2016, 2),4000,'-4'],
                        [Date.UTC(2016, 3),2500,'21'],
                        [Date.UTC(2016, 4),6500,'7'],
                        [Date.UTC(2016, 5),1500,'4.3']
                    ],
                    total: function() {
                        var sum = 0;
                        var data = this.data;
                        for(var i = 0; i < data.length; i++) {
                            sum += data[i][1];
                        }
                        return sum;
                    },
                    increaseValue: '+32',
                    pointStart: Date.UTC(2016, 0, 1),
                    pointInterval: 24 * 3600 * 1000 * 30
                };
                // End: variable zone //

                // Begin: Angular Scope zone //
                $scope.dataProductRevenueDetails = dataProductRevenueDetails;
                $scope.revenueSeries = revenueSeries;
                $scope.revenueData = revenueData;
                $scope.revenuePieProduct = revenuePieProduct;
                $scope.revenuePieSource = revenuePieSource;
                $scope.revenuePieCountry = revenuePieCountry;
                $scope.productViewRate = productViewRate;
                $scope.productSpending = productSpending;
                $scope.dailySale = dailySale;
                $scope.customer = customer;
                $scope.monthRevenue = monthRevenue;
                // End: Angular Scope zone //

                // Begin: Function Zone //
                function init() {

                    drawLineChart($scope.revenueSeries);
                    drawPieChart($scope.revenuePieProduct);
                    drawPieChart($scope.revenuePieSource);
                    drawPieChart($scope.revenuePieCountry);
                    // drawVerticalBarChart($scope.productViewRate);
                    // drawPieTwoLegendColumnChart($scope.productSpending);
                    // drawBarChart($scope.dailySale);
                    // drawCustomerPieChart($scope.customer);
                    // drawMonthRevenueLineChart($scope.monthRevenue);
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
                        }
                    });
                }

                function drawPieChart(chart) {
                    const c = chart;
                    var pieChart = Highcharts.chart(c.id, {
                        title: {
                            text: c.title.text, //'Browser<br>shares<br>2015',
                            align: 'center', //'center',
                            verticalAlign: 'middle', //'middle',
                            y: -130 //40
                        },
                        tooltip: {
                            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>' //'{series.name}: <b>{point.percentage:.1f}%</b>'
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
                                center: ['50%', '65%'],
                                showInLegend: true
                            }
                        },
                        legend: {
                            align: 'right',
                            verticalAlign: 'middle',
                            layout: 'vertical',
                            symbolRadius: 100,
                            symbolPadding: 5,
                            itemMarginBottom: 10,
                            itemStyle: {
                                fontWeight: 100
                            },
                            symbolWidth: 16,
                            symbolHeight: 16,
                            y: 50
                        },
                        exporting: {
                            enabled: false
                        },
                        series: [{
                            type: 'pie',
                            name: c.series[0].name, //'Browser share',
                            innerSize: '70%',
                            data: c.series[0].data
                        }],
                        credits: {
                            enabled: false
                        }
                    });
                }

                function drawVerticalBarChart(chart) {
                    const c = chart;
                    var barChart = Highcharts.chart(c.id, {
                        chart: {
                            type: 'bar'
                        },
                        title: {
                            text: c.title
                        },
                        xAxis: {
                            categories: c.categories,
                            labels: {
                                x: 5,
                                y: -25,
                                align: 'left'
                            },
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: ' '
                            },
                            gridLineWidth: 0,
                            stackLabels: {
                                enabled: true,
                                x: -40,
                                style: {
                                    color: 'white',
                                    textShadow: undefined
                                }
                            }
                        },
                        legend: {
                            reversed: true,
                            enabled: false
                        },
                        plotOptions: {
                            series: {
                                stacking: 'normal'
                            },
                            bar: {
                                zones: [{
                                    fillColor: 'red'
                                }]
                            }
                        },
                        series: [{
                            name: 'Price',
                            data: c.series.data,
                            borderRadius: 25
                        }],
                        credits: {
                            enabled: false
                        },
                        exporting: {
                            enabled: false
                        }
                    });
                }

                function drawPieTwoLegendColumnChart(chart) {
                    const c = chart;
                    var pieChart = Highcharts.chart(c.id, {
                        title: {
                            text: c.title.text,
                            align: 'center',
                            verticalAlign: 'middle',
                            y: -150
                        },
                        tooltip: {
                            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                        },
                        plotOptions: {
                            pie: {
                                dataLabels: {
                                    enabled: false,
                                    distance: -50,
                                    style: {
                                        fontWeight: 'bold',
                                        color: 'white'
                                    }
                                },
                                startAngle: 0,
                                endAngle: 360,
                                center: ['50%', '65%'],
                                showInLegend: true
                            }
                        },
                        legend: {
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
                            itemMarginBottom: 14,
                            itemDistance: 50,
                            width: 300,
                            maxHeight: 500,
                            itemWidth: 130,
                            itemStyle: {
                                fontWeight: 100
                            },
                            symbolWidth: 16,
                            symbolHeight: 16,
                            y: 50
                        },
                        exporting: {
                            enabled: false
                        },
                        series: [{
                            type: 'pie',
                            name: c.series[0].name,
                            innerSize: '70%',
                            data: c.series[0].data
                        }],
                        credits: {
                            enabled: false
                        }
                    });
                }

                function drawBarChart(chart) {
                    const c = chart;
                    var barChart = Highcharts.chart(c.id, {
                        chart: {
                            type: 'column'
                        },
                        title: {
                            text: ' '
                        },
                        xAxis: {
                            categories: c.categories,
                            labels: {
                                formatter: function() {
                                    return ' ';
                                }
                            },
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: ' '
                            },
                            labels: {
                                formatter: function() {
                                    return ' ';
                                }
                            },
                            gridLineWidth: 0
                        },
                        legend: {
                            enabled: false
                        },
                        plotOptions: {
                            series: {
                                stacking: 'normal'
                            },
                            bar: {
                                zones: [{
                                    fillColor: 'red'
                                }]
                            }
                        },
                        series: [{
                            name: 'Price',
                            data: c.series.data
                        }],
                        credits: {
                            enabled: false
                        },
                        exporting: {
                            enabled: false
                        }
                    });
                }

                function findMaxDailySale(arr) {
                    var max = arr[0].y;
                    var indexOfMax = 0;
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i].y >= max) {
                            max = arr[i].y;
                            indexOfMax = i;
                        }
                    }
                    arr[indexOfMax].color = '#F7BE00';
                    return max;
                }

                function drawCustomerPieChart(chart) {
                    const c = chart;
                    var pieChart = Highcharts.chart(c.id, {
                        title: {
                            text: ' ',
                            align: 'center', //'center',
                            verticalAlign: 'middle', //'middle',
                            y: -100 //40
                        },
                        tooltip: {
                            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>' //'{series.name}: <b>{point.percentage:.1f}%</b>'
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
                                center: ['25%', '65%'],
                                showInLegend: true,
                                size: '50%'
                            }
                        },
                        legend: {
                            align: 'center',
                            verticalAlign: 'bottom',
                            layout: 'horizontal',
                            symbolRadius: 100,
                            symbolPadding: 5,
                            itemMarginBottom: 10,
                            itemStyle: {
                                fontWeight: 100
                            },
                            symbolWidth: 16,
                            symbolHeight: 16
                        },
                        exporting: {
                            enabled: false
                        },
                        series: [{
                            type: 'pie',
                            name: c.series[0].name, //'Browser share',
                            innerSize: '70%',
                            data: c.series[0].data
                        }]
                    });
                }

                function drawMonthRevenueLineChart(chart) {
                    const c = chart;
                    var lineChart = Highcharts.chart(c.id, {
                        chart: {
                            type: 'area'
                        },
                        title: {
                            text: ''
                        },
                        xAxis: {
                            tickmarkPlacement: 'on',
                            type: 'datetime',
                            // tickInterval: 24 * 3600 * 1000 * 30
                        },
                        yAxis: {
                            title: {
                                text: ''
                            },
                            gridLineWidth: 0,
                            opposite: false,
                            labels: {
                                enabled: false
                            }
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
                            pointInterval: c.pointInterval,
                            fillColor: {
                                linearGradient: [0, 0, 0, 500],
                                stops: [
                                    [0, Highcharts.getOptions().colors[0]],
                                    [1, 'rgba(255,255,255,0)']
                                ]
                            },
                        }],
                        credits: {
                            enabled: false
                        }
                    });
                }
                // End: Function Zone //

                init();
            }
        ]);
})();
