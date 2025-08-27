import User from "./user.model.js";

export const createUser = async (data) => {
  const user = new User(data);
  return await user.save();
};

export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};
