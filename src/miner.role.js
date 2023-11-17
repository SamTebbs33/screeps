const minerRole = {
    run: function(creep) {
        if (!creep.memory.source) creep.memory.source = 0;

        var sources = creep.room.find(FIND_SOURCES);
        if (creep.harvest(sources[creep.memory.source]) == ERR_NOT_IN_RANGE)
            creep.moveTo(sources[creep.memory.source], { visualizePathStyle: { stroke: "#fff" } });
    }
}

module.exports = minerRole;
