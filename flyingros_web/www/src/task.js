// task

Array.prototype.last = function() {
  return this[this.length-1];
};

var taskHelper = new function(){
  var self = this;

  self.type = {
    NULL : 0,
    INIT_UAV : 9,
    ARM : 13,
    DISARM : 11,
    LOITER : 121,
    TAKEOFF : 122,
    LAND : 123,
    TARGET : 124,
    GRAB : 193,
    TEST : 254
  },

  self.getMissionFromSelect = function(select){
    console.log(select);
    var name = select.selectedOptions[0].value.toUpperCase();
    mission_type = self.type[name];
    mission_type = mission_type ? mission_type : self.type.TEST;
    return mission_type;
  },

  self.toList = function (task, i) {
    if(mission.items.length > 0){
      i = isFinite(i) ? i : Number(mission.items.last()._values.i);
    }
    i = isFinite(i) ? i : mission.items.length;
    var specific = self.idSpecificData(task);
    return {
      type : task.mission_type ? specific.fa : specific.fa,
      name : specific.name,
      target : task.position? "( " + task.position.x + ", " + task.position.y + ", " + task.position.z +")" : "NoTarget",
      index : i,
      ID : task.ID || "",
      data : task.data || "",
      bonus : specific.bonus
    };
  },

  self.sendNew = function(task){
    task.ID = 0;
    cmd.task.add.callService({task: task}, function(result){
      task.ID = Number(result.message);
      mission.add([self.toList(task)])
    });
  },

  self.idSpecificData = function(task){
    var data = { fa : '', bonus : '', name: ''};

    switch(task.mission_type){
      case self.type.NULL :
      data.fa =  '<i class="fa fa-question-circle" aria-hidden="true"></i>';
      data.name = task.name ? task.name : "Null";
      break;
      case self.type.INIT_UAV :
      data.fa = '<i class="fa fa-list" aria-hidden="true"></i>';
      data.bonus = 'sleep : ' + Number(task.data[0]).toFixed(2) + 's';
      data.name = task.name ? task.name : "Init_uav";
      break;
      case self.type.ARM :
      data.fa = '<i class="fa fa-repeat faa-spin animated" aria-hidden="true"></i><i class="fa fa-undo faa-spin-reverse animated" aria-hidden="true"></i>';
      data.bonus = 'timeout : ' + Number(task.data[0]).toFixed(2) + 's';
      data.name = task.name ? task.name : "Arm";
      break;
      case self.type.DISARM :
      data.fa = '<i class="fa fa-stop" aria-hidden="true"></i>';
      data.bonus = 'timeout : ' + Number(task.data[0]).toFixed(2) + 's';
      data.name = task.name ? task.name : "Disarm";
      break;
      case self.type.LOITER :
      data.fa = '<i class="fa fa-pause" aria-hidden="true"></i>';
      data.bonus = 'sleep : ' + Number(task.data[0]).toFixed(2) + 's';
      data.name = task.name ? task.name : "Loiter";
      break;
      case self.type.TAKEOFF :
      data.fa = '<i class="fa fa-play" aria-hidden="true"></i>';
      data.bonus = 'precision Z : ' + Number(task.data[0]).toFixed(2) + 'm';
      data.name = task.name ? task.name : "Takeoff";
      break;
      case self.type.LAND :
      data.fa = '<i class="fa fa-minus-circle" aria-hidden="true"></i>';
      data.bonus = 'precision Z : ' + Number(task.data[0]).toFixed(2) + 'm';
      data.name = task.name ? task.name : "Land";
      break;
      case self.type.TARGET :
      data.fa = '<i class="fa fa-bullseye" aria-hidden="true"></i>';
      data.bonus = 'precision(' + Number(task.data[0]).toFixed(2) + ', ' + Number(task.data[0]).toFixed(2) + ', ' + Number(task.data[1]).toFixed(2) + ', ' + Number(task.data[2]).toFixed(2) + ')';
      data.name = task.name ? task.name : "Target";
      break;
      case self.type.GRAB :
      data.fa = '<i class="fa fa-hand-rock-o" aria-hidden="true"></i>';
      data.bonus = Number(task.data[0]).toFixed(2) ? 'ON' : 'OFF';
      data.name = task.name ? task.name : "Grab";
      break;
      case self.type.TEST :
      data.fa = '<i class="fa fa-bomb" aria-hidden="true"></i>';
      data.name = task.name ? task.name : "Test";
      break;
    }
    return data;
  }
}();
