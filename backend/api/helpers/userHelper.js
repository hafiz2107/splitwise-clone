const mongo = require("../../config/db");
const {
  expenseCollection,
  userCollection,
} = require("../../config/collection");
const { ObjectID } = require("bson");

exports.createUserHelper = (params) => {
  return new Promise((resolve, reject) => {
    try {
      mongo
        .get(userCollection)
        .insertOne(params)
        .then(() => {
          resolve(true);
        });
    } catch (err) {
      reject({ reason: "ERR", data: err.errmsg });
    }
  });
};

exports.getUserHelper = ({ username, password }) => {
  return new Promise((resolve, reject) => {
    try {
      mongo
        .get(userCollection)
        .findOne({ username: username, password: password })
        .then((result) => {
          if (result.length === 0 || result == null) resolve(false);
          resolve(result);
        })
        .catch((err) => {
          reject(err)
        });
    } catch (err) {
      reject({ reason: "ERR", data: err.errmsg });
    }
  });
};

exports.addFriendsHelper = (friendsList, userId) => {
  return new Promise((resolve, reject) => {
    try {
      mongo
        .get(userCollection)
        .update(
          { _id: ObjectID(userId) },
          {
            $addToSet: { friends: { $each: friendsList } },
            $inc: { totalFriends: friendsList.length },
          },
          true
        )
        .then(() => {
          resolve(true);
        })
        .catch((err) => {
          reject({ reason: "ERR", data: null });
        });
    } catch (err) {
      reject({ reason: "ERR", data: err.errmsg });
    }
  });
};

exports.getDashboard = ({ userId }) => {
  return new Promise((resolve, reject) => {
    try {
      mongo
        .get(expenseCollection)
        .find({
          createdBy: ObjectID(userId),
        })
        .toArray()
        .then((result) => {
          mongo
            .get(expenseCollection)
            .find({
              "friends.userId": { $all: [ObjectID(userId)] },
            })
            .toArray()
            .then((rs) => {
              rs.map((eachObj) => {
                result.push(eachObj);
              });
              if (result.length !== 0 || result !== null) {
                resolve(result);
              } else {
                reject({ reason: "NOREC", data: err.errmsg });
              }
            });
        });
    } catch (err) {
      reject({ reason: "ERR", data: err.errmsg });
    }
  });
};
