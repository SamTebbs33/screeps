const b = require("behaviours");
const u = require("utils");

const builderRole = {
    run: function(creep) {
        if (!creep.memory.source) creep.memory.source = 0;
        if (!creep.memory.mode) creep.memory.mode = "building";
        if (!creep.memory.dest) creep.memory.dest = 0;

        const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        const spawns = b.findEnergyStorage(creep.room);
        
        if (Object.keys(targets).length == 0)
            creep.memory.mode = "";
        else if (creep.memory.mode === "building" && creep.store[RESOURCE_ENERGY] == 0)
            creep.memory.mode = "filling";
        else if (creep.memory.mode === "filling" && creep.store[RESOURCE_ENERGY] == creep.store.getCapacity())
            creep.memory.mode = "building";
        
        creep.memory.dest = u.clampLength(creep.memory.dest, targets);
        
        if (creep.memory.mode === "filling") {
            creep.memory.source = b.findAndWithdrawEnergy(creep, creep.memory.source);
        } else if (creep.memory.mode === "building") {
            const site = targets[creep.memory.dest];
            if (creep.build(site) == ERR_NOT_IN_RANGE)
                if (creep.moveTo(site, { visualizePathStyle: { stroke: "#fff" } }) == ERR_NO_PATH)
                    creep.memory.dest = u.clampLength(creep.memory.dest + 1, targets);
        }
    }
}

module.exports = builderRole;
