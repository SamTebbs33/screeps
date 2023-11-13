const builderRole = {
    run: function(creep) {
        if (!creep.memory.source) creep.memory.source = 0;
        if (!creep.memory.mode) creep.memory.mode = "building";
        if (!creep.memory.dest) creep.memory.dest = 0;

        const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        var spawns = creep.room.find(FIND_MY_STRUCTURES);
        spawns = _.filter(spawns, function (struct) {
            return struct.structureType == STRUCTURE_SPAWN || struct.structureType == STRUCTURE_EXTENSION;
        });
        
        if (Object.keys(targets).length == 0)
            creep.memory.mode = "";
        else if (creep.memory.mode == "building" && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.mode = "filling";
        } else if (creep.memory.mode == "filling" && creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()){
            creep.memory.mode = "building";
        }
        
        if (creep.memory.dest >= targets.length) {
            creep.memory.dest++;
            if (creep.memory.dest >= targets.length) creep.memory.dest = 0;
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
                        creep.memory.source = 0;
                }
            }
        } else if (creep.memory.mode == "building") {
            const site = targets[creep.memory.dest];
            if (creep.build(site) == ERR_NOT_IN_RANGE) {
                if (creep.moveTo(site, { visualizePathStyle: { stroke: "#fff" } }) == ERR_NO_PATH) {
                    creep.memory.dest++;
                    if (creep.memory.dest >= targets.length)
                        creep.memory.dest = 0;
                }
            }
        }
    }
}

module.exports = builderRole;
