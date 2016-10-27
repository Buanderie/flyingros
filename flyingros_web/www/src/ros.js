// ros

var cmd = {}

function ros_init(){
  var ros = new ROSLIB.Ros({
    url: 'ws://' + config.ros.ip + ':9090'
  });

  ros.on('connection', function() {
    console.info('Connected to the ROS server.');
  });

  ros.on('error', function(error) {
    console.error('Error connecting to websocket server: ', error);
  });

  ros.on('close', function() {
    console.warn("Connection to ROS server closed.");
  });

  var reportListener = new ROSLIB.Topic({
    ros: ros,
    name: 'web/report',
    messageType: 'flyingros_msgs/Report'
  });

  var odomListener = new ROSLIB.Topic({
    ros: ros,
    name: 'gps/rtkfix',
    messageType: 'nav_msgs/Odometry'
  });

  var currentListener = new ROSLIB.Topic({
    ros: ros,
    name: 'flyingros/controller/task/current',
    messageType: 'flyingros_msgs/Task'
  });

  var taskAdd = new ROSLIB.Service({
    ros : ros,
    name : '/flyingros/controller/task/add',
    serviceType : 'flyingros_msgs/TaskHandle'
  });

  var taskRemove = new ROSLIB.Service({
    ros : ros,
    name : '/flyingros/controller/task/remove',
    serviceType : 'flyingros_msgs/TaskHandle'
  });

  var missionAdd = new ROSLIB.Service({
    ros : ros,
    name : '/flyingros/controller/mission/add',
    serviceType : 'flyingros_msgs/MissionHandle'
  });

  var missionGet = new ROSLIB.Service({
    ros : ros,
    name : '/flyingros/controller/mission/get',
    serviceType : 'flyingros_msgs/MissionRequest'
  });

  var missionRemove = new ROSLIB.Service({
    ros : ros,
    name : '/flyingros/controller/mission/remove',
    serviceType : 'flyingros_msgs/MissionRequest'
  });

  reportListener.subscribe(function(message) {
    console.log(message);
  });

  odomListener.subscribe(function(message) {
    console.log(message);
  });

  currentListener.subscribe(function(message) {
    console.log(message);
  });

  cmd = {
    mission : {
      add : missionAdd,
      get : missionGet,
      remove: missionRemove
    },
    task : {
      add : taskAdd,
      current : currentListener,
      remove : taskRemove
    },
    report: reportListener,
    odometry: odomListener
  };
}

function subscribe_topics(){
  cmd.task.current.subscribe(function(task) {
// Do it only if we change the task
if(modal.dynamicData.currentTask.ID == task.ID) return;
// First remove classes of the old task
var oldTask = mission.get('ID', modal.dynamicData.currentTask.ID);

if(oldTask.length == 1){
  oldTask[0].elm.classList.remove('active');
}

var newTask = mission.get('ID', task.ID);
if(newTask.length != 1) return;
newTask[0].elm.classList.add('active');

modal.dynamicData.currentTask = task
});


  cmd.report.subscribe(function(message) {
    console.log(message);
  });

  cmd.odometry.subscribe(function(message) {
    console.log(message);
  });
};
