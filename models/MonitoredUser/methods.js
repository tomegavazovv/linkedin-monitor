exports.findOneOrCreate = async function(body) {
  let monitoredUser = await this.findOne({ urn: body.urn });
  if (!monitoredUser) {
    body.needsUpdate = true;
    monitoredUser = await this.create(body);
  } else {
    monitoredUser.urn = body.urn;
  }
  return monitoredUser;
};
