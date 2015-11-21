angular
    .module('app', [
    'lbServices',
    'ngResource',
    'ngSanitize',
    'angularUtils.directives.dirPagination',
    'angular-loading-bar',
    'ui.utils',
    'ui.router',
  ])
    //States
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider,
        $urlRouterProvider) {
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'views/home.html'
                    //controller: 'HomeController'
                    //Latest Posts
                    //Upcoming Events
                    //Most Popular Posts
                    //New Members
            })

        //Site Info
        .state('about', {
                url: '/about',
                templateUrl: 'views/info/about.html',
                controller: 'AboutController'
            })
            .state('contact', {
                url: '/contact',
                templateUrl: 'views/info/contact.html',
                controller: 'AboutController'
            })

        //My Stuff
        .state('myprofile', {
                url: 'my/profile',
                templateUrl: 'views/my/profile.html',
                controller: 'MyProfileController'
            })
            .state('myfriends', {
                url: 'my/friends',
                templateUrl: 'views/my/friends.html',
                controller: 'MyFriendsController'
            })
            .state('myposts', {
                url: 'my/myposts',
                templateUrl: 'views/my/myposts.html',
                controller: 'MyPostsController'
            })
            .state('mysettings', {
                url: 'my/settings',
                templateUrl: 'views/my/settings.html',
                controller: 'MySettingsController'
            })

        //Site Articles
        .state('articles', {
                url: 'articles',
                templateUrl: 'views/articles.html',
                controller: 'ArticlesController'
            })
            .state('article', {
                url: 'article',
                templateUrl: 'views/my/article.html',
                controller: 'ArticleController'
            })

        //Site Categories
        .state('categories', {
                url: 'categories',
                templateUrl: 'views/my/categories.html',
                controller: 'CategoriesController'
            })
            .state('category', {
                url: 'category',
                templateUrl: 'views/my/category.html',
                controller: 'CategoryController'
            })

        //Site Categories
        .state('events', {
                url: 'events',
                templateUrl: 'views/events.html',
                controller: 'EventsController'
            })
            .state('event', {
                url: 'event',
                templateUrl: 'views/event.html',
                controller: 'EventController'
            })
            .state('myevents', {
                url: 'my/events',
                templateUrl: 'views/events.html',
                controller: 'MyEventsController'
            })
            .state('myevent', {
                url: 'my/event',
                templateUrl: 'views/my/event.html',
                controller: 'MyEventController'
            })

        //Site Companies
        .state('companies', {
                url: 'companies',
                templateUrl: 'views/companies.html',
                controller: 'CompaniesController'
            })
            .state('company', {
                url: 'companies',
                templateUrl: 'views/company.html',
                controller: 'CompaniesController'
            })
            .state('mycompanies', {
                url: 'my/companies',
                templateUrl: 'views/companies.html',
                controller: 'MyCompaniesController'
            })
            .state('mycompany', {
                url: 'my/company',
                templateUrl: 'views/company.html',
                controller: 'MyCompaniesController'
            });
        $urlRouterProvider.otherwise('/home');
  }])
    .config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = false;
  }])
    .config(function ($sceDelegateProvider) {
        $sceDelegateProvider.resourceUrlWhitelist(['self', '*://www.youtube.com/**', '*://player.vimeo.com/video/**']);
    })
    .factory('$sWorld', ['$rootScope', '$q', 'Company', 'SusUser', 'Post', 'Article', 'Category', 'Event', 'Error', //'SiteService', 'StatisticsService',
    function ($rootScope, $q, Company, SusUser, Post, Article, Category, Event, Error, SiteDataService) { //SiteService, StatisticsService,
            /*
             * Our App :)
             */
            var sw = this;

            /*
             * Error Logging Utilities
             */
            sw.errorLog = [];
            sw.errorLogSession = [];
            sw.user; // This is the logged-in user and is accessible by any controller using this factory.
            sw.emit = function (event, optional_param_1, optional_param_2, optional_param_3) {
                $rootScope.$broadcast(event, optional_param_1, optional_param_2, optional_param_3);
            };
            // Error-handling.
            sw.handleError = function (q) {
                return function (err) {
                    sw.errorLog.push(err);
                    sw.errorLogSession.push(err);
                    $rootScope.$broadcast('onError', err);

                    //Store the Error
                    Error.create({
                            config: err.config,
                            data: err.data,
                            status: err.status,
                            statustext: err.statusText.toString(),
                        })
                        .$promise
                        .then(function (results) {
                            if (results.status == 401) {
                                console.log("eSupport Message: 'Access " + results.statustext + "'");
                            } else {
                                console.log("eSupport Message: 'Error " + results.statustext + "' has been logged.");
                            }
                            return results;
                        });

                    if ((err instanceof Object) === false && err.match(/^\{/)) {
                        err = JSON.parse(err);
                    }
                    if (q) {
                        q.reject(err);
                    }
                    if (err) {
                        setTimeout(function () {
                            sw.errorLog = [];
                        }, 3000);
                    }
                }
            };
            sw.displayErr = function (err) {
                if (err && err.data && err.data.error)
                    return err.data.error.message;
                else
                    return err.toString();
            };

            /*
             * Get Site Info
             */
            /*
             * Get App Run Info
             */
            sw.server = {
                status: {
                    percentage: 85
                }
            };
            sw.database = {
                status: {
                    percentage: 15
                }
            };
            sw.app = {
                curr: {
                    status: {
                        percentage: 65
                    }
                },
                status: {
                    percentage: 25
                }
            };

            //sw.sitData = SiteDataService.getSiteData();

            sw.facebook = {};
            sw.facebook.url = function () {
                return "https://www.facebook.com/NGSW-1436565236598473/?fref=ts";
                //return SiteService.getFacebookInformation("facebook", "url");
            };

            sw.twitter = {};
            sw.twitter.url = function () {
                return "https://twitter.com/NGSWB";
                //return SiteService.getTwitterInformation("twitter", "url");
            };

            sw.instagram = {};
            sw.instagram.url = function () {
                return "https://www.instagram.com/sustainableworld.biz/";
                //return SiteService.getInstagramInformation("instagram", "url");
            };

            sw.instagram = {};
            sw.linkedin.url = function () {
                return "https://www.linkedin.com/in/ioanna-mantzouridou-onasi-4b489093";
                //return SiteService.getLinkedinInformation("linkedin", "url");
            };

            /*
             * Get Statistics
             */
            /*
            sw.totalMembers = function () {
                return StatisticsService.getTotalMembers();
            };
            sw.totalPosts = function () {
                return StatisticsService.getTotalPosts();
            };
            sw.totalSocialMediaFollowers = function () {
                return StatisticsService.getTotalSocialMediaFollowers();
            };
            */

            /*
             * App Start Vendor Script
             */

            $(".bhide").click(function () {
                $(".hideObj").slideDown();
                $(this).hide(); //.attr()
                return false;
            });
            $(".bhide2").click(function () {
                $(".container.hideObj2").slideDown();
                $(this).hide(); // .attr()
                return false;
            });

            $('.heart').mouseover(function () {
                $(this).find('i').removeClass('fa-heart-o').addClass('fa-heart');
            }).mouseout(function () {
                $(this).find('i').removeClass('fa-heart').addClass('fa-heart-o');
            });

            function sdf_FTS(_number, _decimal, _separator) {
                var decimal = (typeof (_decimal) != 'undefined') ? _decimal : 2;
                var separator = (typeof (_separator) != 'undefined') ? _separator : '';
                var r = parseFloat(_number)
                var exp10 = Math.pow(10, decimal);
                r = Math.round(r * exp10) / exp10;
                var rr = Number(r).toFixed(decimal).toString().split('.');
                var b = rr[0].replace(/(\d{1,3}(?=(\d{3})+(?:\.\d|\b)))/g, "\$1" + separator);
                r = (rr[1] ? b + '.' + rr[1] : b);

                return r;
            }

            setTimeout(function () {
                //Total Members
                $('#counter').text('0');
                //Total Posts
                $('#counter1').text('0');
                //Total Social Media Followers
                $('#counter2').text('0');
                setInterval(function () {

                    var curval = parseInt($('#counter').text());
                    var curval1 = parseInt($('#counter1').text().replace(' ', ''));
                    var curval2 = parseInt($('#counter2').text());
                    if (curval <= sw.totalMembers) {
                        $('#counter').text(sdf_FTS((curval + 20), 0, ' '));
                    }
                    if (curval1 <= sw.totalPosts) {
                        $('#counter1').text(sdf_FTS((curval1 + 20), 0, ' '));
                    }
                    if (curval2 <= sw.totalSocialMediaFollowers) {
                        $('#counter2').text(sdf_FTS((curval2 + 20), 0, ' '));
                    }
                }, 2);

            }, 500);
            return sw;
    }])
    .controller('AppController', ['$scope', '$state', '$sWorld', '$window',
    function ($scope, $state, $sWorld, $window) {
            $scope.sw = $sWorld;
    }]);