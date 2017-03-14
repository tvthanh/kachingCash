(function(){
    'use strict';

    angular.module('panelApp')
        .controller( 'payoutCtrl', [
            '$scope',
            'analyticsService',
        function ($scope, analyticsService) {

            var dataPayoutDetails = [
                {
                    srcImg: 'https://www.ccep.com/system/image_block/2941/Coca-Cola.jpg',
                    title: 'Coca Cola',
                    subTitle: 'Coke Studio Season 8',
                    hours: '23:13',
                    date: '20 Oct 2016',
                    name: 'John Appleseed',
                    coin: '1',
                    totalCoin: '5',
                    dollars: '100',
                    month: '',
                    hrefReview: 'http://www.coca-colacompany.com/'
                },
                {
                    srcImg: 'http://theshoegame.com/wp-content/uploads/2015/01/nike-logo-copy.jpg',
                    title: 'Nike',
                    subTitle: 'Nike Air Max Campaign',
                    hours: '12:24',
                    date: '16 Oct 2016',
                    name: 'Ricardo Hall',
                    coin: '1',
                    totalCoin: '1',
                    dollars: '',
                    month: '',
                    hrefReview: 'http://www.nike.com/us/en_us/'
                },
                {
                    srcImg: 'http://www.kowalskis.com/sites/kowalskis.com/files/images/departments/starbucks-logo-trans.png',
                    title: 'Starbucks',
                    subTitle: 'Nitro Cold Brew',
                    hours: '02:25',
                    date: '24 Nov 2016',
                    name: 'Viola Wade',
                    coin: '1',
                    totalCoin: '12',
                    dollars: '100',
                    month: '',
                    hrefReview: 'http://www.starbucks.vn/'
                },
                {
                    srcImg: 'http://vector.me/files/images/7/3/73419/nikon.png',
                    title: 'Nikon',
                    subTitle: 'Nikon 1 J5 Product Launch',
                    hours: '12:54',
                    date: '05 Oct 2016',
                    name: 'Mario Hardy',
                    coin: '1',
                    totalCoin: '8',
                    dollars: '200',
                    month: '',
                    hrefReview: 'http://www.nikon.com.vn/vi_VN'
                },
                {
                    srcImg: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQRlV2lijfvgaPUFrfCrp0l4lxiT_dYcj_6El3HGaS50i_yz1EFEg',
                    title: 'LG',
                    subTitle: 'LG G5',
                    hours: '23:13',
                    date: '15 Feb 2016',
                    name: 'Lida Valdez',
                    coin: '1',
                    totalCoin: '7',
                    dollars: '10,000',
                    month: '',
                    hrefReview: 'http://www.lg.com/vn'
                },
                {
                    srcImg: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRI5hwT454_ibBEE1HoYkSvJfRI2PS8jQ07-a9EJegFistqkSer',
                    title: 'Leica',
                    subTitle: 'Leica M-D Launch',
                    hours: '12:24',
                    date: '18 Dec 2016',
                    name: 'Ricardo Hall',
                    coin: '1',
                    totalCoin: '5',
                    dollars: '100',
                    month: '',
                    hrefReview: 'https://us.leica-camera.com/'
                }
            ];

            var itemsPerPage = 10;
            var maxSize = 10;

            $scope.view = {
                itemsPerPage: itemsPerPage,
                maxSize: maxSize,
                currentPage: 1
            };

            $scope.data = {
                campaignsCount: 0,
                campaigns: []
            };

            $scope.changePage = function() {
                getStatisticCampaigns();
            };

            var getStatisticCampaigns = function() {

                var params = {
                    page_size: itemsPerPage,
                    page: $scope.view.currentPage
                };

                analyticsService.getStatisticCampaigns(params).then(
                    function(data) {
                        $scope.data.campaignsCount = data.count;
                        $scope.data.campaigns = [];
                        angular.forEach(data.items, function (value, key) {
                            var item = dataPayoutDetails[Math.floor(Math.random()*dataPayoutDetails.length)];
                            var dataItem = {
                                srcImg: item.srcImg,
                                title: item.title,
                                subTitle: item.subTitle,
                                recent_view_on: value.recent_view_on === null ? '-' : moment(value.recent_view_on).format('H:mm:ss D MMM YYYY'),
                                recent_user: value.recent_user,
                                coin_earned: value.coin_earned,
                                totalCoin: item.totalCoin,
                                dollars: item.dollars,
                                month: '',
                                hrefReview: item.hrefReview
                            };
                            $scope.data.campaigns.push(dataItem);
                        });
                    },
                    function(response) {
                    }
                );
            }

            var init = function() {
                getStatisticCampaigns();
            };

            init();

        }]);
})();
