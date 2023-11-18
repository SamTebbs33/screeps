const b = require("behaviours");

const haulerRole = {
    run: function(creep) {
        if (!creep.memory.source) creep.memory.source = "";
        if (!creep.memory.dest) creep.memory.dest = "";

        var source = Game.getObjectById(creep.memory.source);

        if (!source) {
            source = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, { filter: function(res) {
                return res.resourceType == RESOURCE_ENERGY;
            }});
            if (source) creep.memory.source = source.id;
        }

        if (creep.store[RESOURCE_ENERGY] == 0 && source) {
            if (creep.pickup(source) == ERR_NOT_IN_RANGE) {
                if (creep.moveTo(source, { visualizePathStyle: { stroke: "#fff" } }) == ERR_NO_PATH) {
                    source = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, { filter: function(res) {
                        return res.resourceType == RESOURCE_ENERGY && res.id !== source.id;
                    }});
                    if (source) creep.memory.source = source.id;
                }
            }
            creep.memory.dest = "";
        } else {
            creep.memory.dest = b.findAndTransferEnergy(creep, creep.memory.dest);
        }
    }
}

module.exports = haulerRole;
