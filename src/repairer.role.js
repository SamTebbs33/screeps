const b = require("behaviours");

const repairerRole = {
    run: function(creep) {
        if (!creep.memory.source) creep.memory.source = 0;
        if (!creep.memory.mode) creep.memory.mode = "repairing";

        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: object => object.hits < object.hitsMax && object.structureType != STRUCTURE_WALL && object.structureType != STRUCTURE_RAMPART
        });
        if (Object.keys(targets).length == 0) {
            targets = creep.room.find(FIND_STRUCTURES, {
                filter: object => object.hits < object.hitsMax && (object.structureType == STRUCTURE_WALL || object.structureType == STRUCTURE_RAMPART)
            });
        }

        targets.sort((a,b) => a.hits - b.hits);
        var sources = creep.room.find(FIND_MY_STRUCTURES);
        sources = _.filter(sources, function (struct) {
            return struct.structureType == STRUCTURE_SPAWN || struct.structureType == STRUCTURE_EXTENSION;
        });
        
        if (Object.keys(targets).length == 0)
            creep.memory.mode = "";
        else if (creep.memory.mode === "repairing" && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.mode = "filling";
        } else if (creep.memory.mode === "filling" && creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()){
            creep.memory.mode = "repairing";
        }
        
        if (creep.memory.mode === "filling") {
            creep.memory.source = b.findAndWithdrawEnergy(creep, creep.memory.source);
        } else if (creep.memory.mode === "repairing") {
            const site = targets[0];
            if (creep.repair(site) == ERR_NOT_IN_RANGE) {
                creep.moveTo(site, { visualizePathStyle: { stroke: "#fff" } });
            }
        }
    }
}

module.exports = repairerRole;

