const harvesterRole = {
    run: function(creep) {
        if (!creep.memory.source) creep.memory.source = 0;

        var sources = creep.room.find(FIND_SOURCES);
        var targets = creep.room.find(FIND_MY_STRUCTURES);
        targets = _.filter(targets, function (struct) {
            return struct.structureType == STRUCTURE_SPAWN || struct.structureType == STRUCTURE_EXTENSION;
        });
        if (creep.store[RESOURCE_ENERGY] < creep.store.getCapacity()) {
            if (creep.harvest(sources[creep.memory.source]) == ERR_NOT_IN_RANGE)
                creep.moveTo(sources[creep.memory.source], { visualizePathStyle: { stroke: "#fff" } });
        } else {
            var target = 0;
            var targetSpace = 0;
            for (var t in targets) {
                var space = targets[t].store.getFreeCapacity(RESOURCE_ENERGY);
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
