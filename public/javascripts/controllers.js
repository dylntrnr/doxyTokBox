function RoomCtrl ($scope) {
  var now = new Date(),
      hours = now.getHours() > 12 ? now.getHours() - 12 : now.getHours(),
      minutes = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes(),
      when = 0;

    //default values
    $scope.date = (now.getMonth() + 1) + '/' + now.getDate() + '/' + now.getFullYear();
    $scope.time = hours + ':' + minutes;
    $scope.ampm = now.getHours() > 12 ? 'pm' : 'am';

    //in the view the create room button's data-ng-click attribute calls this function
    $scope.createRoom = function() {
      var room = new Room();

      room.$save(function() {
        //go directly to the room
        $location.path('/room/' + room.id);
      });
    };

    //the schedule meeting button will be disabled until the user enters a valid time
    $scope.unavailable = true;

    $scope.scheduleRoom = function() {
      var room = {time: when, password: $scope.password};
      
      //an element in the view binds to this value and sets its text to it
      $scope.roomUrl = '/room/' + randomStringAndDashes();
      //the view will now show the div with link and password
      $scope.roomReady = true;
      
    };

    //every time these values change, check to see if there is a valid date for the meeting
    $scope.$watch('date', available);
    $scope.$watch('time', available);
    $scope.$watch('ampm', available);

    //set unavailble to false if a valid time in the future has been entered 
    function available() {
      try {
        when = Date.parse($scope.date + ' ' + $scope.time + ' ' + $scope.ampm);
      }
      catch (err) {
        when = 0;
        $scope.unavailable = true;
        return;
      }
      if (when > new Date()) {
        $scope.unavailable = false;
        return;
      }
      $scope.unavailable = true;
      when = 0;
    }
};

//Random Room Generator - inspired by webrtcio guys on github
function RandomRoom () {
  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var length_of_string = 9;
    var randomstring = '';
    for(var i = 0; i < length_of_string; i++) {
      var random_num = Math.floor(Math.random() * chars.length);
      randomstring += chars.substring(random_num, random_num + 1);
    }
    return randomstring;
}

// Random string of digits seperated by dashes
function randomStringAndDashes () {
  return S4() + '-' + S4() + '-' + S4();
}
// Generate random digits between 2 and 3 characters 
function S4 () {
  var min = 10;
  var max = 999;
  var num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}