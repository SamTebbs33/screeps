const u = require("utils");

/**
 * Find all energy storage structures in the room.
 **/
function findEnergyStorage(room) {
    return room.find(FIND_MY_STRUCTURES, { filter: struct => struct.structureType == STRUCTURE_SPAWN || struct.structureType == STRUCTURE_EXTENSION });
}

/**
 * Move to the energy store with the most energy and withdraw some from it.
 **/
function findAndWithdrawEnergy(creep, id) {
    var target = Game.getObjectById(id);
    if (!target) {
        target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, { filter: function(res) {
            const type = res.structureType;
            return (type == STRUCTURE_SPAWN || type == STRUCTURE_EXTENSION) && res.store[RESOURCE_ENERGY] > 0;
        }});
        if(!target) return "";
    }
    const err = creep.withdraw(target, RESOURCE_ENERGY);
    if (err == ERR_FULL) {
        return target.id;
    } else {
        if (err == ERR_NOT_ENOUGH_RESOURCES || creep.moveTo(target, { visualizePathStyle: { stroke: "#fff" } }) == ERR_NO_PATH) {
            target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, { filter: function(res) {
                const type = res.structureType;
                return (type == STRUCTURE_SPAWN || type == STRUCTURE_EXTENSION) && res.id !== target.id && res.store[RESOURCE_ENERGY] > 0;
            }});
        }
    }
    return target ? target.id : "";
}

function findAndTransferEnergy(creep, id) {
    var target = Game.getObjectById(id);
    if (!target) {
        target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, { filter: function(res) {
            const type = res.structureType;
            return (type == STRUCTURE_SPAWN || type == STRUCTURE_EXTENSION || type == STRUCTURE_TOWER) && res.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }});
        if(!target) return "";
    }
    const err = creep.transfer(target, RESOURCE_ENERGY);
    if (err == ERR_FULL || (err == ERR_NOT_IN_RANGE && creep.moveTo(target, { visualizePathStyle: { stroke: "#fff" } }) == ERR_NO_PATH)) {
        target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, { filter: function(res) {
            const type = res.structureType;
            return (type == STRUCTURE_SPAWN || type == STRUCTURE_EXTENSION || type == STRUCTURE_TOWER) && res.id !== target.id && res.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }});
    }
    return target ? target.id : "";
}

module.exports = {
    findEnergyStorage: findEnergyStorage,
    findAndWithdrawEnergy: findAndWithdrawEnergy,
    findAndTransferEnergy: findAndTransferEnergy,
};
