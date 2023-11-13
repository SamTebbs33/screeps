const harvesterRole = require("harvester.role");
const builderRole = require("builder.role");
const upgraderRole = require("upgrader.role");
const repairerRole = require("repairer.role");

module.exports.loop = function () {
    const spawn1 = Game.spawns["Spawn1"];

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    
    const harvesters = _.filter(Game.creeps, function(creep){
        return creep.memory.role == "harvester";
    });
    const builders = _.filter(Game.creeps, function(creep){
        return creep.memory.role == "builder";
    });
    const upgraders = _.filter(Game.creeps, function(creep){
        return creep.memory.role == "upgrader";
    });
    const repairers = _.filter(Game.creeps, function(creep){
        return creep.memory.role == "repairer";
    });
    
    if (Object.keys(harvesters).length < 6) {
        const name = "Harvester" + Game.time;
        spawn1.spawnCreep([MOVE, WORK, CARRY, MOVE], name, {memory: { role: "harvester", enabled: true, sourceDest: 0 }});
    } else if (Object.keys(upgraders).length < 2) {
        const name = "Upgrader" + Game.time;
        spawn1.spawnCreep([WORK, CARRY, MOVE], name, {memory: { role: "upgrader", enabled: true }});
    } else if (Object.keys(builders).length < 1) {
        const name = "Builder" + Game.time;
        spawn1.spawnCreep([WORK, CARRY, MOVE], name, {memory: { role: "builder", enabled: true }});
    } else if (Object.keys(repairers).length < 1) {
        const name = "Repairer" + Game.time;
        spawn1.spawnCreep([WORK, CARRY, MOVE], name, {memory: { role: "repairer", enabled: true }});
    }

    for (var name in harvesters) {
        var creep = harvesters[name];
        if (creep.memory.enabled) harvesterRole.run(creep);
    }
    for (var name in builders) {
        var creep = builders[name];
        if (creep.memory.enabled) builderRole.run(creep);
    }
    for (var name in upgraders) {
        var creep = upgraders[name];
        if (creep.memory.enabled) upgraderRole.run(creep);
    }
    for (var name in repairers) {
        var creep = repairers[name];
        if (creep.memory.enabled) repairerRole.run(creep);
    }
}
