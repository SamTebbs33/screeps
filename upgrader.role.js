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
            const spawns = creep.room.find(FIND_MY_STRUCTURES, { filter: structure => structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION && structure.store[RESOURCE_ENERGY] > 0 });
            const src = spawns[creep.memory.source];
            if (creep.withdraw(src, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                if (creep.moveTo(src, { visualizePathStyle: { stroke: "#fff" } }) == ERR_NO_PATH) {
                    creep.memory.source++;
                    if (creep.memory.source >= Object.keys(spawns).length)
                        creep.memory.source = 0;
                }
            }
        } else if (creep.memory.mode == "upgrading") {
            if (creep.upgradeController (creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: "#fff" } });
            }
        }
    }
}

module.exports = upgraderRole;
