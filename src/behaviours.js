/**
 * Find all energy storage structures in the room.
 **/
function findEnergyStorage(room) {
    return room.find(FIND_MY_STRUCTURES, { filter: struct => struct.structureType == STRUCTURE_SPAWN || struct.structureType == STRUCTURE_EXTENSION });
}

/**
 * Move to the energy store with the most energy and withdraw some from it.
 **/
function findAndWithdrawEnergy(creep, preferred) {
    const stores = findEnergyStorage(creep.room);
    var best = 0;
    var most = 0;
    for (var x in stores) {
        const energy = stores[x].store[RESOURCE_ENERGY];
        if (energy > most) {
            best = x;
            most = energy;
        }
    }
    const src = stores[preferred];
    if (creep.withdraw(src, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        if (creep.moveTo(src, { visualizePathStyle: { stroke: "#fff" } }) == ERR_NO_PATH) {
            preferred++;
            if (preferred >= stores.length)
                preferred = 0;
        }
    }
    return preferred;
}

module.exports = {
    findEnergyStorage: findEnergyStorage,
    findAndWithdrawEnergy: findAndWithdrawEnergy,
};
