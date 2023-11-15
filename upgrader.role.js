const b = require("behaviours")

const upgraderRole = {
    run: function(creep) {
        if (!creep.memory.source) creep.memory.source = 0;
        if (!creep.memory.mode) creep.memory.mode = "filling";

        const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        
        if (creep.memory.mode == "upgrading" && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.mode = "filling";
        } else if (creep.memory.mode == "filling" && creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()){
            creep.memory.mode = "upgrading";
        }
        
        
        if (creep.memory.mode == "filling") {
            creep.memory.source = b.findAndWithdrawEnergy(creep, creep.memory.source);
        } else if (creep.memory.mode == "upgrading") {
            if (creep.upgradeController (creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: "#fff" } });
            }
        }
    }
}

module.exports = upgraderRole;
