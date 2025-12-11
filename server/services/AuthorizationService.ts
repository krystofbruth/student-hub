import { IUser, User } from "../models/User";
import { ISession, Session } from "../models/Session";
import { AccessTokenPayload } from "../models/AccessTokenPayload";
import jwt from "jsonwebtoken";
import { StringValue } from "ms";
import { randomBytes, hash, createHash } from "crypto";
import { Result } from "../helpers/Result";
import { UnknownException } from "../exceptions/UnknownException";
import { ImplementationException } from "../exceptions/ImplementationException";
import { NotFoundException } from "../exceptions/NotFoundException";
import { AuthorizationException } from "../exceptions/AuthorizationException";

// Config
//
let accessTokenSecret: string;
if (!process.env.ACCESS_TOKEN_SECRET) {
  if (process.env.NODE_ENV === "development") {
    console.warn(
      "No access token secret present - this will not work in prod!"
    );
    accessTokenSecret = "test123";
  } else {
    throw new Error("No access token secret present!");
  }
}
const accessTokenExpiration: StringValue = "1h";

// Methods
//
export const createAccessToken = async (
  user: IUser
): Promise<Result<string>> => {
  try {
    const payload: AccessTokenPayload = { userId: user._id.toString("hex") };
    const token = jwt.sign(payload, accessTokenSecret, {
      expiresIn: accessTokenExpiration,
    });

    return { success: true, data: token };
  } catch (err) {
    return { success: false, error: new UnknownException(err) };
  }
};

export const verifyAccessToken = async (
  accessToken: string
): Promise<Result<AccessTokenPayload>> => {
  try {
    const verification = jwt.verify(accessToken, accessTokenSecret);
    // Versioning? 😥
    return { success: true, data: verification as AccessTokenPayload };
  } catch (err) {
    return { success: false, error: new AuthorizationException(err) };
  }
};

export const createSession = async (
  user: IUser,
  details?: object
): Promise<Result<{ session: ISession } & { accessToken: string }>> => {
  const refreshTokenAttempt = await createRefreshToken();
  if (!refreshTokenAttempt.success) return refreshTokenAttempt;
  const refreshToken = refreshTokenAttempt.data;

  const accessTokenAttempt = await createAccessToken(user);
  if (!accessTokenAttempt.success) return accessTokenAttempt;
  const accessToken = accessTokenAttempt.data;

  const session = new Session({ userId: user._id, refreshToken, details });
  try {
    await session.save();
  } catch (error) {
    return { success: false, error: new UnknownException(error) };
  }

  return { success: true, data: { accessToken, session } };
};

export const refreshSession = async (
  refreshToken: string
): Promise<Result<{ session: ISession } & { accessToken: string }>> => {
  try {
    const session = await Session.findOne({ refreshToken });
    if (!session)
      return { success: false, error: new NotFoundException(refreshToken) };

    const user = await User.findById(session.userId);
    if (!user) {
      await session.deleteOne();
      return { success: false, error: new NotFoundException(refreshToken) };
    }

    const newRefreshTokenAttempt = await createRefreshToken();
    if (!newRefreshTokenAttempt.success) return newRefreshTokenAttempt;

    const newAccessTokenAttempt = await createAccessToken(user);
    if (!newAccessTokenAttempt.success) return newAccessTokenAttempt;

    session.refreshToken = newRefreshTokenAttempt.data;
    await session.save();

    return {
      success: true,
      data: { session, accessToken: newAccessTokenAttempt.data },
    };
  } catch (error) {
    return { success: false, error: new UnknownException(error) };
  }
};

export const deleteSession = async (refreshToken: string) => {};

const createRefreshToken = async (): Promise<Result<string>> => {
  try {
    const random = randomBytes(16);
    const hash = createHash("sha256");
    hash.update(random);
    return { success: true, data: hash.digest("hex") };
  } catch (error) {
    return { success: false, error: new UnknownException(error) };
  }
};
