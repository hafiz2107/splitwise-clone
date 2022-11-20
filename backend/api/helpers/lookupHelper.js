const mongo = require("../../config/db");
const {
  userCollection,
  friendsCollection,
} = require("../../config/collection");
const { ObjectID } = require("bson");

exports.friendLookup = (userId) => {
  return new Promise((resolve, reject) => {
    try {
      mongo
        .get(userCollection)
        .aggregate([
          {
            $facet: {
              searched_user: [
                {
                  $match: { _id: ObjectID(userId) },
                },
              ],
              other_users: [
                {
                  $match: {
                    _id: { $ne: ObjectID(userId) },
                  },
                },
              ],
            },
          },
          {
            $unwind: "$searched_user",
          },
          {
            $project: {
              friends: {
                $filter: {
                  input: "$other_users",
                  as: "other_users",
                  cond: {
                    $in: ["$$other_users._id", "$searched_user.friends"],
                  },
                },
              },
            },
          },
          {
            $unwind: "$friends",
          },
          {
            $project: {
              "friends.username": 1,
              "friends._id": 1,
            },
          },
        ])
        .toArray()
        .then((result) => {
          result = result.map((val) => val.friends);
          if (result == null || result.length == 0) {
            reject({ reason: "NOREC", data: null });
          } else {
            resolve(result);
          }
        })
        .catch((err) => {
          reject({ reason: "ERR", data: err });
        });
    } catch (err) {
      reject({ reason: "ERR", data: err.errmsg });
    }
  });
};

exports.listUsers = (userId) => {
  return new Promise((resolve, reject) => {
    mongo
      .get(userCollection)
      .find({ _id: { $ne: ObjectID(userId) } })
      .toArray()
      .then((result) => {
        if (result.length == 0) reject({ reason: "NOREC", data: null });
        resolve(result);
      })
      .catch((err) => {
        reject({ reason: "ERR", data: err });
      });
  });
};
