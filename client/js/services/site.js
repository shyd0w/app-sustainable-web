(function () {
    angular.module('SiteDataService', [])
        .service('SiteDataService', function () {
            //Site Data Service
            this.getSiteData = function (siteData) {
                var siteDataObj = {
                    "title": "Sustainable Web",
                    "author": {
                        "name": "Sean Vazquez",
                        "contact": "sean.vazquez@sustainableweb.biz"
                    }
                };
                return siteDataObj;
            }
            return.this;
        });
})();