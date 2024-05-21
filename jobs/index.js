const agenda = require('../config/agendaConfig');
const updateMonitoredUserJob = require('./updateMonitoredUser');
const fetchFailed = require('./fetchFailed');

updateMonitoredUserJob(agenda);
fetchFailed(agenda);

agenda.start();
