const builderRole = require("builder.role");
const upgraderRole = require("upgrader.role");
const repairerRole = require("repairer.role");
const haulerRole = require("hauler.role");
const minerRole = require("miner.role");

const numHaulers = 8;
const numUpgraders = 5;
const numBuilders = 1;
const numRepairers = 1;

module.exports.loop = function () {
    const spawn1 = Game.spawns["Spawn1"];
    var sources = spawn1.room.find(FIND_SOURCES);
    const numMiners = Object.keys(sources).length;

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    
    const builders = _.filter(Game.creeps, function(creep){
        return creep.memory.role == "builder";
    });
    const upgraders = _.filter(Game.creeps, function(creep){
        return creep.memory.role == "upgrader";
    });
    const repairers = _.filter(Game.creeps, function(creep){
        return creep.memory.role == "repairer";
    });
    const haulers = _.filter(Game.creeps, function(creep){
        return creep.memory.role == "hauler";
    });
    const miners = _.filter(Game.creeps, function(creep){
        return creep.memory.role == "miner";
    });
    
    var miners1 = 0;
    var miners0 = 0;
    for (var miner in miners) {
        if (miners[miner].memory.source == 0) miners0++;
        else miners1++;
    }
    
    const disableBuilders = Object.keys(miners).length < numMiners || Object.keys(haulers).length < numHaulers;
    const disableUpgraders = disableBuilders;
    
    if (Object.keys(miners).length < numMiners) {
        const name = "Miner" + Game.time;
        spawn1.spawnCreep([WORK, WORK, WORK, WORK, WORK, MOVE], name, {memory: { role: "miner", enabled: true, source: miners1 > miners0 ? 0 : 1 }});
    } else if (Object.keys(haulers).length < numHaulers) {
        const name = "Hauler" + Game.time;
        spawn1.spawnCreep([MOVE, CARRY, CARRY, CARRY, MOVE], name, {memory: { role: "hauler", enabled: true }});
    } else if (Object.keys(upgraders).length < numUpgraders) {
        const name = "Upgrader" + Game.time;
        spawn1.spawnCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE], name, {memory: { role: "upgrader", enabled: true }});
    } else if (Object.keys(builders).length < numBuilders) {
        const name = "Builder" + Game.time;
        spawn1.spawnCreep([WORK, CARRY, MOVE], name, {memory: { role: "builder", enabled: true }});
    } else if (Object.keys(repairers).length < numRepairers) {
        const name = "Repairer" + Game.time;
        spawn1.spawnCreep([WORK, CARRY, MOVE], name, {memory: { role: "repairer", enabled: true }});
    }

    if (!disableBuilders) {
        for (var name in builders) {
            var creep = builders[name];
            if (creep.memory.enabled) builderRole.run(creep);
        }
    }
    if (!disableUpgraders) {
        for (var name in upgraders) {
            var creep = upgraders[name];
            if (creep.memory.enabled) upgraderRole.run(creep);
        }
    }
    for (var name in repairers) {
        var creep = repairers[name];
        if (creep.memory.enabled) repairerRole.run(creep);
    }
    for (var name in haulers) {
        var creep = haulers[name];
        if (creep.memory.enabled) haulerRole.run(creep);
    }
    for (var name in miners) {
        var creep = miners[name];
        if (creep.memory.enabled) minerRole.run(creep);
    }
}
