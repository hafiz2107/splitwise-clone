const { ObjectID } = require("bson");
const responses = require("../utils/responses");
const { friendLookup, listUsers } = require("../helpers/lookupHelper");
const { createIndividualExpense } = require("../helpers/expenseHelper");
const {
  getDashboard,
  createUserHelper,
  getUserHelper,
  addFriendsHelper,
} = require("../helpers/userHelper");

exports.createUser = async (req, res) => {
  try {
    const result = await createUserHelper(req.body);
    if (result) {
      responses.success(res, "Successfully Inserted !", null);
    } else {
      responses.failed(res, "Something went wrong");
    }
  } catch (err) {
    responses.failed(res, "Something went Wrong", err);
  }
};

exports.getUser = async (req, res) => {
  try {
    const result = await getUserHelper(req.body);
    if (result) {
      return responses.success(res, "Successfully loggedin", result);
    } else {
      return responses.failed(res, "No user found", null);
    }
  } catch (err) {
    return responses.failed(res, "Something went wrong", err);
  }
};

exports.lookup = async (req, res) => {
  const { entity, userId } = req.body;
  if (entity === "friend") {
    try {
      const result = await friendLookup(userId);
      return responses.success(res, "Successfully", result);
    } catch (err) {
      if (err.reason == "NOREC")
        return responses.noRecords(res, "No records found", null);
      if (err.reason == "ERR")
        return responses.failed(res, "Something went wrong", err.data);
    }
  }

  if (entity === "list-user") {
    try {
      const result = await listUsers(userId);
      return responses.success(res, "Successfull", result);
    } catch (err) {
      if (err.reason == "NOREC")
        return responses.noRecords(res, "No records found", null);
      if (err.reason == "ERR")
        return responses.failed(res, "Something went wrong", err.data);
    }
  }
};

exports.addFriends = async (req, res) => {
  let { friendsList, userId } = req.body;

  friendsList = friendsList.map((eachObj) => {
    return ObjectID(eachObj._id); 
  });
  try {
    const result = await addFriendsHelper(friendsList, userId );
    if (result) {
      return responses.success(res, "Successfully added Friends", null);
    } else {
      responses.noRecords(res);
    }
  } catch (err) {
    return responses.failed(res, "Something Went wrong", err);
  }
};

exports.createIndividualExpense = async (req, res) => {
  try {
    result = await createIndividualExpense(req.body);
    if (result) {
      res.success(res);
    } else {
      responses.failed(res);
    }
  } catch (err) {
    responses.failed(res, err);
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const result = await getDashboard(req.query);
    if (result) {
      responses.success(res, "Success", result);
    } else {
      responses.failed(res);
    }
  } catch (err) {
    if (err.reason === "NOREC") {
      responses.noRecords(res);
    } else {
      responses.failed(res, "", err);
    }
  }
};
