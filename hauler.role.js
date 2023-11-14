const haulerRole = {
    run: function(creep) {
        var sources = creep.room.find(FIND_DROPPED_RESOURCES, { filter: function(res) {
            return res.resourceType == RESOURCE_ENERGY;
        }});
        sources.sort((a,b) => b.amount - a.amount);
        const source = sources[0];

        var targets = creep.room.find(FIND_MY_STRUCTURES);
        targets = _.filter(targets, function (struct) {
            return struct.structureType == STRUCTURE_SPAWN || struct.structureType == STRUCTURE_EXTENSION;
        });
        if (creep.store[RESOURCE_ENERGY] < creep.store.getCapacity() && source) {
            if (creep.pickup(source) == ERR_NOT_IN_RANGE)
                creep.moveTo(source, { visualizePathStyle: { stroke: "#fff" } });
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

module.exports = haulerRole;
