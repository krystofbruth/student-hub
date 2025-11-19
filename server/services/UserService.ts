import { IUser, User, UserState } from "../models/User";
import { CreateUserRequest } from "#shared/types/CreateUserRequest";
import { Result } from "../helpers/Result";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { NotFoundException } from "../exceptions/NotFoundException";
import { UnknownException } from "../exceptions/UnknownException";

const SALT_ROUNDS = 10;

/** Registers an initially unverified User. */
const registerUser = async (
  createUser: CreateUserRequest
): Promise<Result<IUser>> => {
  let user: IUser;

  try {
    const passwordHash = await bcrypt.hash(createUser.password, SALT_ROUNDS);

    user = await User.create({
      displayName: createUser.displayName,
      passwordHash,
      email: createUser.email,
      state: UserState.REGISTERED,
    });
  } catch (err) {
    return { success: false, error: new UnknownException(err) };
  }

  return { success: true, data: user };
};

const verifyUser = async (userId: string): Promise<Result<void>> => {
  try {
    const res = await User.findByIdAndUpdate(userId, {
      state: UserState.ACTIVE,
    });
    if (!res) return { success: false, error: new NotFoundException(userId) };
  } catch (err) {
    if (err instanceof mongoose.Error.CastError)
      return { success: false, error: new NotFoundException(userId) };
    return { success: false, error: new UnknownException(err) };
  }

  return { success: true, data: undefined };
};

export default { registerUser, verifyUser };
