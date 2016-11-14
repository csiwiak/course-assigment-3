(function(){
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService',MenuSearchService)
.directive('foundItems',FoundItemsDirective)
.directive('itemsLoaderIndicator',ItemsLoaderIndicatorDirective)
;


function ItemsLoaderIndicatorDirective() {
  var ddo = {
    templateUrl: 'itemsLoaderIndicator.html'
  };

  return ddo;
}

function FoundItemsDirective() {
  var ddo = {
    templateUrl: 'foundItems.html',
    scope: {
      items: '<',
      onRemove: '='
  }
  };

  return ddo;
}






NarrowItDownController.$inject = ['MenuSearchService']
function NarrowItDownController(MenuSearchService){
  var narrowItDown = this;

  narrowItDown.found = [];
  narrowItDown.showLoader = false;
  narrowItDown.search = function (searchTerm) {
    narrowItDown.showLoader = true;
    var promise = MenuSearchService.getMatchedMenuItems(searchTerm);

    console.log(searchTerm);
    promise.then(function (response) {
      narrowItDown.found = response;
      console.log(narrowItDown.found);
      narrowItDown.showLoader = false;
    })
    .catch(function (error) {
      console.log(error);
    })
  };

  narrowItDown.removeItem = function (itemIndex) {

  //  console.log(itemIndex);
    narrowItDown.found.splice(itemIndex, 1);
  };

}


MenuSearchService.$inject = ['$http']
function MenuSearchService($http){
  var service = this;
  var searchTermService = "";
  service.getMatchedMenuItems = function(searchTerm){
      searchTermService = searchTerm
      return $http.get("https://davids-restaurant.herokuapp.com/menu_items.json").then(function (result) {
        // process result and only keep items that match
        var allMenuItems = result.data.menu_items;
        var foundItems= allMenuItems.filter(containsFilter);
        // return processed items
        return foundItems;
    });
  };

  function containsFilter(value) {
    return value.description.indexOf(searchTermService) !== -1;
  }

}

})();
