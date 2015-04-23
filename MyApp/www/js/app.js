// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

var app = angular.module('starter', []);



var connectionString = "Endpoint=sb://austinsnotificationhub-ns.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=K1BHBaYdrTMECXFKA68uhLEuaQ9wyNuIWWZXI1Ksl6Q=",
    notificationHubPath = "austinsnotificationhub-ns";

var hub = new WindowsAzure.Messaging.NotificationHub(notificationHubPath, connectionString);

hub.registerApplicationAsync().then(function (result) {
	alert("register complete");
    console.log("Registration successful: " + result.registrationId);
});

hub.onPushNotificationReceived = function (msg) {
	alert("push received");
    console.log("Push Notification received: " + msg);
};





app.service('SaveService', function() {
	var token = "";
	this.setToken = function(tokenInput) {
		token = tokenInput;
	};
	this.getToken = function() {
		return token;
	};
});

app.service('SendService', function($http, SaveService) {
	this.callAPI = function(sendMethod, url, headers, data) {
		var send = ({
				method: sendMethod,
				url: url,
				headers: headers,
				data: data,
			})
		$http(send)
			.success(function(data){
				console.log(data);
				if (data.hasOwnProperty("access_token"))
					SaveService.setToken(data.access_token);
				return "SUCCESS";
			})
			.error(function(error){
				console.log(error);				
				return "FAILED";

			});
	};
});	

app.service("SimpleSendService", function($http, SaveService){
	this.callAPI = function(sendMethod, url, headers, data) {
			$http.get(url, { 
				headers: { 
					'Authorization' : 'Bearer ' + SaveService.getToken(), 
					'Content-Type': 'application/json',
					
				} 
			})
			.success(function(data){
				console.log(data);
				return "SUCCESS";
			})
			.error(function(error){
				console.log(error);				
				return "FAILED";

			});
	};
})		
//gets token
app.controller("GetTokenController", function($scope, $http, SendService, SaveService){
	$scope.sendMethod = 'POST';
	$scope.url = 'https://snap-dev.com/api/Account/Token';
	$scope.headers = {'Content-Type': 'application/x-www-form-urlencoded'};
	$scope.data = "email=ben.ross.310.95348@gmail.com&password=Password@123&hospitalId=126&userTypeId=1";
	
	$scope.testAPI = function() { 
		SendService.callAPI($scope.sendMethod, $scope.url, $scope.headers, $scope.data);
		$scope.tokenResponse = SaveService.getToken();
		};
});

//hello api
app.controller("GetHelloController", function($scope, $http, SendService, SimpleSendService, SaveService){
	$scope.sendMethod = 'GET';
	$scope.url = 'https://snap-dev.com/api/hello';
	$scope.data = "";
	
	$scope.testAPI = function() {
		$scope.response = SimpleSendService.callAPI($scope.sendMethod, $scope.url, $scope.headers, $scope.data);
		};
});
//patients


//Schedule
app.controller("GetAllDoctorsController", function($scope, $http, SendService, SimpleSendService){
	$scope.sendMethod = 'GET';
	$scope.url = 'https://snap-dev.com/api/admin/schedule/list/doctors';
	$scope.headers = {'Content-Type': 'application/json',
						'Authorization': 'Bearer M-qZ6D9sPokVfGUSPRKHnABPYyJ6FOegMFR4vcdCLljNkpo9CitE_1iRU6VJNixGvmvUJ4h5GTfRUB3x7qS3s2hB4I9zweoQoUnlTEdB-Ks-wuMlVKACrnWippSRHg-2swPOVAUxsA6SScZ5LI7MRxLsGmqK593G14vPavt5FFmhUgspN9MtjxRHjl_6bghKqI7AtO_afwXgv2xqbQt4zG1jFXojuyrlV-L6SHlFsOoNjX1c7O7o91YFV36eDfF9eeC8XLvSEv0w5H8toROMjI3wcPNU6jfXBn2t0UAMXzT3nrCxzBoaxy-06vRsQbvfRPgyDktJDIQzfmt1RTRS48EXT47e9L58BA-yiUz1Szkp6I29ZT62JyqBX2T0x2-IbedgCL0gxMIfTyOL9Nb8EQ'};
	$scope.data = "";
	
	$scope.testAPI = function() { 
		SimpleSendService.callAPI($scope.sendMethod, $scope.url, $scope.headers, $scope.data);
		
		};
});
