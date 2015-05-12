

(function(){

var app =  angular.module('regTodo', ['ngRoute'])

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/successPage', {
        templateUrl: 'successPage',
        controller: 'mainController'
          }).
      when('/updateSuccessPage', {
        templateUrl: 'updateSuccessPage',
        controller: 'mainController'
      }).
      when('/userRegPage', {
        templateUrl: 'userRegPage',
        controller: 'mainController'
      }).
      when('/userUpdatePage', {
        templateUrl: 'userUpdatePage',
        controller: 'mainController'
      }).
      when('/authUser', {
        templateUrl: 'authUser',
        controller: 'mainController'
      }).
      when('/viewUsersPage', {
        templateUrl: 'viewUsersPage',
        controller: 'mainController'
      }).
      when('/noAccess', {
        templateUrl: 'noAccess',
        controller: 'mainController'
      }).
      otherwise({
        redirectTo: '/'
      });
}]); 

app.controller('mainController',  function($scope, $http, $location) {

    $scope.formData = {};
    $scope.regData = {};
    $scope.isUniq = false;
    $scope.showForm = true;
    $scope.updateForm = true;
    $scope.showUpdateForm = false;
    $scope.isAdmin = false;
    $scope.loginShow = true;
    $scope.emailInvalid = false;
    
    

    // Get all user data
    
     
    $http.get('/api/v1/userData')
        .success(function(data) {
            $scope.regData = data;
            console.log(data);
        })
        .error(function(error) {
            console.log('Error: ' + error);
        });
        

        //go to next page

        $scope.goNext = function (hash) { 
            $location.path(hash);
             }
 
       

        // Create a new user
        
        $scope.createUser= function() {

          console.log('--------inside create user------------');
          $http.post('/emailCheck', $scope.formData)
                .success(function(data) {
                 
                console.log(data)  
                    if(data.uniqueEmail=="yes"){
                        $scope.isUniq = false;

                        $http.post('/api/v1/registerUser', $scope.formData)
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
     $scope.updateForm = function(){

            $scope.showUpdateForm = true;
            console.log('========inside====='+$scope.showUpdateForm)

     }
    
    //update user info by passing in the email id

      $scope.updateUser = function() {
        $http.post('/api/v1/updateUser' ,$scope.formData)
            .success(function(data) {
              if (data.existsEmail=="yes") {
               // $scope.regData = data;
                console.log('==========updation done successfully----------');
                $scope.updateForm = false;
                $scope.emailInvalid = false;
                $scope.goNext('/updateSuccessPage');
              }
              else{
                $scope.emailInvalid = true;

              }
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };  


    //check for Admin user
   
     
    $scope.checkAdmin = function() {
        console.log('=========inside checkadmin=======');
        $http.post('/api/v1/authorizeUser' ,$scope.formData)
            .success(function(data) {
              //  $scope.regData = data;
                console.log(data);
                if(data.isAdmin =="yes"){
                 $scope.isAdmin = true;
                 $scope.loginShow = false;
                 $scope.goNext('/viewUsersPage');
              }else{
                  console.log(data);
                //  $scope.isAdmin = false;
                //  $scope.loginShow = true;
                  $scope.goNext('/noAccess');
              }
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    }; 

}); 

})();