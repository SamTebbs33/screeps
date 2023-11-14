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
        else if (creep.memory.mode == "repairing" && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.mode = "filling";
        } else if (creep.memory.mode == "filling" && creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()){
            creep.memory.mode = "repairing";
        }
        
        if (creep.memory.mode == "filling") {
            var bestSpawn = 0;
            var mostSpawn = 0;
            for (var x in sources) {
                const energy = sources[x].store[RESOURCE_ENERGY];
                if (energy > mostSpawn) {
                    bestSpawn = x;
                    mostSpawn = energy;
                }
            }
            creep.memory.source = bestSpawn;
            const src = sources[creep.memory.source];
            if (creep.withdraw(src, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                if (creep.moveTo(src, { visualizePathStyle: { stroke: "#fff" } }) == ERR_NO_PATH) {
                    creep.memory.source++;
                    if (creep.memory.source >= sources.length)
                        creep.memory.source = 0;
                }
            }
        } else if (creep.memory.mode == "repairing") {
            const site = targets[0];
            if (creep.repair(site) == ERR_NOT_IN_RANGE) {
                creep.moveTo(site, { visualizePathStyle: { stroke: "#fff" } });
            }
        }
    }
}

module.exports = repairerRole;

