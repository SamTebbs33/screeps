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

        if (creep.store[RESOURCE_ENERGY] < creep.store.getCapacity() && source) {
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
            var target = Game.getObjectById(creep.memory.dest);
            if (!target) {
                target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, { filter: function(res) {
                    const type = res.structureType;
                    return (type == STRUCTURE_SPAWN || type == STRUCTURE_EXTENSION) && res.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }});
                if (target) creep.memory.dest = target.id;
                else return;
            }
            const err = creep.transfer(target, RESOURCE_ENERGY);
            if (err == ERR_NOT_IN_RANGE) {
                if (creep.moveTo(target, { visualizePathStyle: { stroke: "#fff" } }) == ERR_NO_PATH) {
                    target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, { filter: function(res) {
                        const type = res.structureType;
                        return (type == STRUCTURE_SPAWN || type == STRUCTURE_EXTENSION) && res.id !== target.id && res.store.getFreeCapacity(RESOURCE_ENERGY) > 0; 
                    }});
                    if (target) creep.memory.dest = target.id;
                }
            } else if (err == ERR_FULL) {
                target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, { filter: function(res) {
                    const type = res.structureType;
                    return (type == STRUCTURE_SPAWN || type == STRUCTURE_EXTENSION) && res.id !== target.id && res.store.getFreeCapacity(RESOURCE_ENERGY) > 0; 
                }});
                if (target) creep.memory.dest = target.id;
            }
        }
    }
}

module.exports = haulerRole;
