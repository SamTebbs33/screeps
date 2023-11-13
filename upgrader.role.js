const upgraderRole = {
    run: function(creep) {
        if (!creep.memory.source) creep.memory.source = 0;
        if (!creep.memory.mode) creep.memory.mode = "upgrading";

        const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        const spawns = creep.room.find(FIND_MY_SPAWNS);
        
        if (creep.memory.mode == "upgrading" && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.mode = "filling";
        } else if (creep.memory.mode == "filling" && creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()){
            creep.memory.mode = "upgrading";
        }
        
        
        if (creep.memory.mode == "filling") {
            var bestSpawn = 0;
            var mostSpawn = 0;
            for (var x in spawns) {
                const energy = spawns[x].store[RESOURCE_ENERGY];
                if (energy > mostSpawn) {
                    bestSpawn = x;
                    mostSpawn = energy;
                }
            }
            creep.memory.source = bestSpawn;
            const src = spawns[creep.memory.source];
            if (creep.withdraw(src, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                if (creep.moveTo(src, { visualizePathStyle: { stroke: "#fff" } }) == ERR_NO_PATH) {
                    creep.memory.source++;
                    if (creep.memory.source >= spawns.length)
                        creep.mmeory.source = 0;
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
