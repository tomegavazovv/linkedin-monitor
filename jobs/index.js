const agenda = require('../config/agendaConfig');
const updateMonitoredUserJob = require('./updateMonitoredUser');

updateMonitoredUserJob(agenda);

agenda.start();
