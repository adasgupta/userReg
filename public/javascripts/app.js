

(function(){

var app =  angular.module('regTodo', ['ngRoute'])

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/successPage', {
        templateUrl: 'successPage',
        controller: 'mainController'
          });
}]); 

app.controller('mainController',  function($scope, $http, $location) {

    $scope.formData = {};
    $scope.regData = {};
    $scope.isUniq = false;
    $scope.showForm = true;

    // Get all user data
    $http.get('/api/v1/userData')
        .success(function(data) {
            $scope.regData = data;
            console.log(data);
        })
        .error(function(error) {
            console.log('Error: ' + error);
        });

        //go to success page

        $scope.goNext = function (hash) { 
            $location.path(hash);
             }
 

        // Create a new user
        
        $scope.createUser= function() {


          $http.post('/emailCheck', $scope.formData)
                .success(function(data) {
                 
                console.log(data)  
                    if(data.uniqueEmail=="yes"){
                        $scope.isUniq = false;

                        $http.post('/pipe', $scope.formData)
                        .success(function(data) {
                            $scope.formData = {};
                            $scope.regData = data;
                            console.log(data);
                            $scope.showForm = false;
                            $scope.goNext('/successPage');
                        })
                        .error(function(error) {
                            console.log('Error: ' + error);
                        });

                      }
                    else if(data.uniqueEmail=="no"){
                        $scope.isUniq = true;
                        console.log('------email is not unique!----')
                      }
                    else{

                        //do nothing!
                    }

                 })

                 .error(function(error) {
                    console.log('Error: ' + error);
                });
            
                
            
        };


});

})();