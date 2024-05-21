const { MonitoredUser } = require('../models');
const filterBadFeed = require('../utils/feed/filterBadFeed');

module.exports = agenda => {
  agenda.define('update monitored user', async job => {
    const { monitoredUserId } = job.attrs.data;
    const monitoredUser = await MonitoredUser.findById(monitoredUserId);
    const filteredActivityUrns = await filterBadFeed(
      monitoredUser.activityUrns
    );
    monitoredUser.activityUrns = filteredActivityUrns;
    monitoredUser.needsUpdate = false;
    await monitoredUser.save();
  });
};
