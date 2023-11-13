const harvesterRole = {
    run: function(creep) {
        var sources = creep.room.find(FIND_SOURCES);
        var targets = creep.room.find(FIND_MY_STRUCTURES);
        targets = _.filter(targets, function (struct) {
            return struct.structureType == STRUCTURE_SPAWN || struct.structureType == STRUCTURE_EXTENSION;
        });
        if (creep.store[RESOURCE_ENERGY] < creep.store.getCapacity()) {
            if (creep.harvest(sources[creep.memory.sourceDest]) == ERR_NOT_IN_RANGE) {
                if (creep.moveTo(sources[creep.memory.sourceDest], { visualizePathStyle: { stroke: "#fff" } }) == ERR_NO_PATH) {
                    creep.memory.sourceDest++;
                    if (creep.memory.sourceDest >= sources.length)
                        creep.memory.sourceDest = 0;
                }
            }
        } else {
            var target = 0;
            var targetSpace = 0;
            for (var t in targets) {
                var space = targets[t].store.getFreeCapacity();
                if (space > targetSpace) {
                    target = t;
                    targetSpace = space;
                }
            }

            if (creep.transfer(targets[target], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                creep.moveTo(targets[target], { visualizePathStyle: { stroke: "#fff" } });
        }
    }
}

module.exports = harvesterRole;
