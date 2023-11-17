const b = require("behaviours");

const haulerRole = {
    run: function(creep) {
        if (!creep.memory.source) creep.memory.source = "";

        var source = Game.getObjectById(creep.memory.source);

        if (!source) {
            source = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, { filter: function(res) {
                return res.resourceType == RESOURCE_ENERGY;
            }});
            if (source) creep.memory.source = source.id;
        }

        if (creep.store[RESOURCE_ENERGY] < creep.store.getCapacity() && source) {
            if (creep.pickup(source) == ERR_NOT_IN_RANGE)
                creep.moveTo(source, { visualizePathStyle: { stroke: "#fff" } });
        } else {
            const targets = b.findEnergyStorage(creep.room);
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
