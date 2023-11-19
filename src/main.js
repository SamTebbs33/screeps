const builderRole = require("builder.role");
const upgraderRole = require("upgrader.role");
const repairerRole = require("repairer.role");
const haulerRole = require("hauler.role");
const minerRole = require("miner.role");
const scavengerRole = require("scavenger.role");

const u = require("utils");

const numHaulers = 8;
const numUpgraders = 5;
const numBuilders = 2;
const numRepairers = 1;
const numScavengers = 1;


function runTowers(spawn) {
    const towers = spawn.room.find(FIND_MY_STRUCTURES, { filter: struct => struct.structureType == STRUCTURE_TOWER });
    for (var x in towers) {
        const tower = towers[x];
        const target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target) tower.attack(target);
    }

}

function updateResourceTracking() {
    for (var name in Game.rooms) {
        var room = Game.rooms[name];
        if (room.energyCapacityAvailable == 0) continue;
        const currentEnergy = room.energyAvailable / room.energyCapacityAvailable;

        if (!room.memory.meanEnergy) room.memory.meanEnergy = currentEnergy;
        else room.memory.meanEnergy += currentEnergy;
        console.log("Energy update: " + (currentEnergy * 100) + "%, running total: " + (room.memory.meanEnergy * 100) + "%");
    }
}

function updateRoleDemands() {
    for (var name in Game.rooms) {
        var room = Game.rooms[name];
        if (!room.memory.numUpgraders) room.memory.numUpgraders = 0;
        if (room.memory.meanEnergy > 0.5) {
            room.memory.numUpgraders++;
            console.log("Increasing number of upgraders to " + room.memory.numUpgraders);
        } else {
            room.memory.numUpgraders = u.clamp(room.memory.numUpgraders - 1, 0, room.memory.numUpgraders);
            console.log("Decreasing number of upgraders to " + room.memory.numUpgraders);
        }
    }
}

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

    runTowers(spawn1);

    if (Game.time % 50 == 0)
        updateResourceTracking();

    if (Game.time % 500 == 0) {
        for (var name in Game.rooms) {
            var room = Game.rooms[name];
            room.memory.meanEnergy = room.memory.meanEnergy / 10;
            console.log("Big energy update: " + (room.memory.meanEnergy * 100) + "%");
        }
        updateRoleDemands();
        room.memory.meanEnergy = 0;
    }

    const builders = _.filter(Game.creeps, function(creep){
        return creep.memory.role === "builder";
    });
    const upgraders = _.filter(Game.creeps, function(creep){
        return creep.memory.role === "upgrader";
    });
    const repairers = _.filter(Game.creeps, function(creep){
        return creep.memory.role === "repairer";
    });
    const haulers = _.filter(Game.creeps, function(creep){
        return creep.memory.role === "hauler";
    });
    const miners = _.filter(Game.creeps, function(creep){
        return creep.memory.role === "miner";
    });
    const scavengers = _.filter(Game.creeps, function(creep){
        return creep.memory.role === "scavenger";
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
    } else if (Object.keys(upgraders).length < spawn1.room.memory.numUpgraders) {
        const name = "Upgrader" + Game.time;
        spawn1.spawnCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE], name, {memory: { role: "upgrader", enabled: true }});
    } else if (Object.keys(builders).length < numBuilders) {
        const name = "Builder" + Game.time;
        spawn1.spawnCreep([WORK, CARRY, WORK, CARRY, MOVE], name, {memory: { role: "builder", enabled: true }});
    } else if (Object.keys(repairers).length < numRepairers) {
        const name = "Repairer" + Game.time;
        spawn1.spawnCreep([WORK, CARRY, MOVE], name, {memory: { role: "repairer", enabled: true }});
    } else if (Object.keys(scavengers).length < numScavengers) {
        const name = "Scavenger" + Game.time;
        spawn1.spawnCreep([CARRY, CARRY, MOVE], name, {memory: { role: "scavenger", enabled: true }});
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
    for (var name in scavengers) {
        var creep = scavengers[name];
        if (creep.memory.enabled) scavengerRole.run(creep);
    }
}
