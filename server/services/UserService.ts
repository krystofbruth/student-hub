import { IUser, User, UserState } from "../models/User";
import { CreateUserRequest } from "#shared/types/CreateUserRequest";
import { Result } from "../helpers/Result";
import mongoose from "mongoose";
import { NotFoundException } from "../exceptions/NotFoundException";
import { UnknownException } from "../exceptions/UnknownException";
import { generatePasswordHash } from "./PasswordService";
import { ImplementationException } from "../exceptions/ImplementationException";
import { MongoServerError } from "mongodb";
import { ConflictException } from "../exceptions/ConflictException";

/** Registers an initially unverified User. */
export const registerUser = async (
  username: string,
  displayName: string,
  email: string,
  password: string,
  state?: UserState,
): Promise<Result<IUser>> => {
  let user: IUser;

  try {
    const passwordHashAttempt = await generatePasswordHash(password);
    if (!passwordHashAttempt.success) return passwordHashAttempt;

    if (useRuntimeConfig().emailVerification)
      throw new ImplementationException(
        "Email verification currently not implemented.",
      );

    // Beware - this also checks for conflicts, part of the business logic!
    user = await User.create({
      displayName,
      passwordHash: passwordHashAttempt.data,
      email: email,
      username: email,
      // Will be changed once email verification implemented
      state: UserState.ACTIVE,
    });
  } catch (err) {
    if (err instanceof MongoServerError && err.code === 11000)
      return { success: false, error: new ConflictException() };
    return { success: false, error: new UnknownException(err) };
  }

  return { success: true, data: user };
};

export const verifyUser = async (userId: string): Promise<Result<void>> => {
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

type UserLookup =
  | {
      email: string;
    }
  | { _id: string }
  | { username: string };

export const findUser = async (query: UserLookup): Promise<Result<IUser>> => {
  try {
    const user = await User.findOne(query);
    if (!user)
      return {
        success: false,
        error: new NotFoundException(JSON.stringify(query)),
      };

    return { success: true, data: user };
  } catch (err) {
    if (err instanceof mongoose.Error.CastError)
      return {
        success: false,
        error: new NotFoundException(JSON.stringify(query)),
      };
    else return { success: false, error: new UnknownException(err) };
  }
};

export default { registerUser, verifyUser };
