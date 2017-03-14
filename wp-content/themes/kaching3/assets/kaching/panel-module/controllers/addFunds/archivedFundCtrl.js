(function() {
    'use strict';

    angular.module('panelApp')
        .controller('archivedFundCtrl', [
            '$scope',
            function($scope) {

                var dataFundDetails = [
                    {
                        srcImg: 'https://www.ccep.com/system/image_block/2941/Coca-Cola.jpg',
                        title: 'Coca Cola',
                        subTitle: 'Coke Studio Season 8',
                        totalFund: '1,000,000',
                        totalPayout: '190,000',
                        refiledFund: '300,000',
                        totalCurrentFund: '920,000',
                        status: 'status-gray'
                    },
                    {
                        srcImg: 'http://theshoegame.com/wp-content/uploads/2015/01/nike-logo-copy.jpg',
                        title: 'Nike',
                        subTitle: 'Nike Air Max Campaign',
                        totalFund: '3,000,000',
                        totalPayout: '210,400',
                        refiledFund: '1,300,000',
                        totalCurrentFund: '2,300,000',
                        status: 'status-gray'
                    },
                    {
                        srcImg: 'http://www.kowalskis.com/sites/kowalskis.com/files/images/departments/starbucks-logo-trans.png',
                        title: 'Starbucks',
                        subTitle: 'Nitro Cold Brew',
                        totalFund: '425,000',
                        totalPayout: '19,400',
                        refiledFund: '100,000',
                        totalCurrentFund: '250,000',
                        status: 'status-gray'
                    },
                    {
                        srcImg: 'http://vector.me/files/images/7/3/73419/nikon.png',
                        title: 'Nikon',
                        subTitle: 'Nikon 1 J5 Product Launch',
                        totalFund: '17,000,000',
                        totalPayout: '721,200',
                        refiledFund: '5,000,000',
                        totalCurrentFund: '6,300,500',
                        status: 'status-gray'
                    },
                    {
                        srcImg: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQRlV2lijfvgaPUFrfCrp0l4lxiT_dYcj_6El3HGaS50i_yz1EFEg',
                        title: 'LG',
                        subTitle: 'LG G5',
                        totalFund: '800,000',
                        totalPayout: '120,000',
                        refiledFund: '1,000,000',
                        totalCurrentFund: '350,000',
                        status: 'status-gray'
                    },
                    {
                        srcImg: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRI5hwT454_ibBEE1HoYkSvJfRI2PS8jQ07-a9EJegFistqkSer',
                        title: 'Leica',
                        subTitle: 'Leica M-D Launch',
                        totalFund: '2,800,000',
                        totalPayout: '710,000',
                        refiledFund: '900,000',
                        totalCurrentFund: '1,100,000',
                        status: 'status-gray'
                    }
                ];

                $scope.dataFundDetails = dataFundDetails;

                var revenuePieProduct = {
                    id: 'revenuePieProduct',
                    title: {
                        text: 'Top Funds by <strong>Campaign</strong>'
                    },
                    series: [{
                        data: [
                            ['<strong>Nike</strong><br/>USD 3000000', 3000000],
                            ['<strong>Coca Cola</strong><br/>USD 1000000', 1000000],
                            ['<strong>Leica</strong><br/>USD 2800000', 2800000],
                        ]
                    }]
                };
                var revenuePieSource = {
                    id: 'revenuePieSource',
                    title: {
                        text: 'Top Funds by <strong>Payout</strong>'
                    },
                    series: [{
                        data: [
                            ['<strong>Nike</strong><br/>USD 210000', 210000],
                            ['<strong>Leica</strong><br/>USD 120000', 120000],
                            ['<strong>Coca Cola</strong><br/>USD 190000', 190000]
                        ]
                    }]
                };
                var revenuePieCountry = {
                    id: 'revenuePieCountry',
                    title: {
                        text: 'Top Funds by <strong>Refill</strong>',
                    },
                    series: [{
                        data: [
                            ['<strong>Nike</strong><br/>USD 210000', 210000],
                            ['<strong>Leica</strong><br/>USD 120000', 120000],
                            ['<strong>Coca Cola</strong><br/>USD 190000', 190000]
                        ]
                    }]
                };

                function init() {
                    drawPieChart(revenuePieProduct);
                    drawPieChart(revenuePieSource);
                    drawPieChart(revenuePieCountry);
                }

                function drawPieChart(chart) {
                    const c = chart;
                    var pieChart = Highcharts.chart(c.id, {
                        title: {
                            text: c.title.text,
                            align: 'left',
                            // verticalAlign: 'middle',
                            y: 20
                        },
                        tooltip: {
                            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                        },
                        credits: {
                            enabled: false
                        },
                        plotOptions: {
                            pie: {
                                dataLabels: {
                                    enabled: false,
                                    // distance: 0,
                                    // style: {
                                    //     fontWeight: 'bold',
                                    //     color: 'white'
                                    // }
                                },
                                // startAngle: 0,
                                // endAngle: 360,
                                // center: ['50%', '65%'],
                                showInLegend: true,
                                colors: ['#289df5', '#39bf23', '#8567e6'],
                                size: 220
                            }
                        },
                        legend: {
                    		align: 'right',
                            verticalAlign: 'middle',
                            layout: 'vertical',
                            symbolRadius: 100,
                            symbolPadding: 5,
                            // itemMarginBottom: 10,
                            itemStyle: {
                                fontWeight: 100
                            }
                        },
                        exporting: {
                            enabled: false
                        },
                        series: [{
                            type: 'pie',
                            name: c.series[0].name,
                            innerSize: '70%',
                            data: c.series[0].data
                        }]
                    });
                }
                init();
            }
        ]);
})();
