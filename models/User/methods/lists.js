const MonitoredUser = require('../../MonitoredUser/model');

exports.addMonitoredUserToList = async function(
  listId,
  monitoredUserId,
  publicId
) {
  const list = this.lists.id(listId);
  const hoursPassed = (Date.now() - this.lastAdded) / (1000 * 60 * 60);

  if (this.totalAdded > 79) {
    if (hoursPassed < 24) {
      throw new Error(`Limit [${Math.round(24 - hoursPassed) + 1}]`);
    }
  }

  if (hoursPassed > 24) {
    this.totalAdded = 0;
  }

  if (this.totalAdded === 0) {
    this.lastAdded = Date.now();
  }

  this.totalAdded += 1;
  this.monitoredUsersPublicIds.push(publicId);

  await this.save();

  if (!list.monitoredUsers.includes(monitoredUserId)) {
    list.monitoredUsers.unshift(monitoredUserId);
    const doc = await this.save();
    return doc;
  }
};

exports.addNewList = async function(listName, loading, value) {
  const isLoading = !!loading;
  this.lists.push({
    name: listName,
    monitoredUsers: [],
    loading: isLoading,
    value
  });
  const user = await this.save();
  return user.lists.find(list => list.name === listName);
};

exports.updateListName = async function(listId, newListName) {
  this.lists.id(listId).name = newListName;
  await this.save();
  return { listId, name: newListName };
};

exports.getEngagements = async function(listId) {
  try {
    // Ensure 'this' refers to a correctly fetched document from your collection
    await this.populate({
      path: 'lists', // Assuming 'this' is a larger document containing 'lists'
      match: { _id: listId }, // Matching specific list ID
      populate: {
        path: 'engagements.monitoredUser',
        model: 'MonitoredUser',
        select: 'name headline profileImage company -_id'
      }
    }).execPopulate();

    // Find the specific list from populated data
    const list = this.lists.id(listId);
    if (!list) {
      throw new Error('List not found');
    }

    // Compile the engagements data
    const engagements = list.engagements.map(engagement => ({
      likeCount: engagement.likeCount,
      commentCount: engagement.commentCount,
      user: engagement.monitoredUser
    }));

    return engagements;
  } catch (error) {
    console.error('Error populating engagements:', error);
    throw error;
  }
};

exports.deleteList = async function(listId) {
  this.lists = this.lists.filter(list => list.id !== listId);
  await this.save();
};

exports.deleteFromList = async function(listId, userId) {
  // Find the list and populate only the specific monitoredUser with userId
  await this.populate({
    path: 'lists.monitoredUsers' // Adjust the path to target the nested document correctly
  }).execPopulate();

  const { publicId } = this.lists
    .id(listId)
    .monitoredUsers.find(m => m._id.toString() === userId);

  this.monitoredUsersPublicIds = this.monitoredUsersPublicIds.filter(
    id => id !== publicId
  );
  const filtered = this.lists
    .id(listId)
    .monitoredUsers.filter(mUser => mUser._id.toString() !== userId);

  this.lists.id(listId).monitoredUsers = filtered;
  await this.save();
};

exports.skipPost = async function(listId, urn) {
  this.lists.id(listId).skipped.push(urn);
  await this.save();
};

exports.getSkipped = function(listId) {
  return this.lists.id(listId).skipped;
};

exports.commentToProfile = async function(listId, profileUrn, postUrn) {
  const monitoredUser = await MonitoredUser.findOne({ urn: profileUrn });
  const list = this.lists.id(listId);

  const index = list.engagements.findIndex(
    engagement =>
      engagement.monitoredUser.toString() === monitoredUser._id.toString()
  );

  if (index !== -1) {
    if (
      list.engagements[index].commentPostUrns.findIndex(
        pUrn => pUrn === postUrn
      ) === -1
    ) {
      list.engagements[index].commentCount += 1;
      list.engagements[index].commentPostUrns.push(postUrn);
    } else return;
  } else {
    list.engagements.push({
      monitoredUser: monitoredUser._id,
      commentCount: 1,
      commentPostUrns: [postUrn]
    });
  }

  await this.save();
};

exports.likeToProfile = async function(listId, profileUrn, postUrn) {
  const monitoredUser = await MonitoredUser.findOne({ urn: profileUrn });
  const list = this.lists.id(listId);

  const index = list.engagements.findIndex(
    engagement =>
      engagement.monitoredUser.toString() === monitoredUser._id.toString()
  );

  if (index !== -1) {
    if (
      list.engagements[index].likePostUrns.findIndex(
        pUrn => pUrn === postUrn
      ) === -1
    ) {
      list.engagements[index].likeCount += 1;
      list.engagements[index].likePostUrns.push(postUrn);
    } else return;
  } else {
    list.engagements.push({
      monitoredUser: monitoredUser._id,
      likeCount: 1,
      likePostUrns: [postUrn]
    });
  }

  await this.save();
};

exports.getListUrl = async function(listId, date = 'past-24h') {
  await this.populate({
    path: 'lists.monitoredUsers',
    match: { _id: { $in: this.lists.id(listId).monitoredUsers } }
  });

  const uniqueUrnsSet = new Set(
    this.lists.id(listId).monitoredUsers.map(user => `"${user.urn}"`)
  );

  // Step 2: Convert the Set back to an array and limit the number of items to 30
  const uniqueUrns = Array.from(uniqueUrnsSet).filter(Boolean);

  const encodedUrns = uniqueUrns.join('%2C');

  const url = `https://www.linkedin.com/search/results/content/?datePosted="${date}"&fromMember=[${encodedUrns}]&origin=FACETED_SEARCH&sid=2oz&sortBy="date_posted"`;
  return url;
};

exports.getMonitoredUsersFromList = async function(userId, listId) {
  const user = await this.findById(userId);

  const listIndex = user.lists.findIndex(
    list => list._id.toString() === listId
  );

  const populatePath = `lists.${listIndex}.monitoredUsers`;
  await this.populate(user, {
    path: populatePath,
    model: 'MonitoredUser' // Ensure this model is defined and corresponds to the collection
  });

  const listWithMonitoredUsers = user.lists[listIndex].monitoredUsers.map(
    mUser => ({
      name: mUser.name,
      headline: mUser.headline,
      profileImage: mUser.profileImage,
      id: mUser._id,
      urn: mUser.urn,
      company: mUser.company,
      publicId: mUser.publicId
    })
  );

  return listWithMonitoredUsers;
};
