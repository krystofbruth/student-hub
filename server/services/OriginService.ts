import mongoose from "mongoose";
import { IOrigin, Origin } from "../models/Origin";
import { Result } from "../helpers/Result";
import { UnknownException } from "../exceptions/UnknownException";
import { NotFoundException } from "../exceptions/NotFoundException";

export const getOrigin = async (
  originId: mongoose.Types.ObjectId,
): Promise<Result<IOrigin>> => {
  try {
    const origin = await Origin.findById(originId).populate("providerId");
    if (!origin)
      return {
        success: false,
        error: new NotFoundException(originId.toString()),
      };

    return { success: true, data: origin };
  } catch (error) {
    return {
      success: false,
      error: new UnknownException(error),
    };
  }
};

export const getOrigins = async (
  limit: number = 50,
  offset: number = 0,
  providerIdFilter?: mongoose.Types.ObjectId,
): Promise<Result<IOrigin[]>> => {
  try {
    let filter;
    if (providerIdFilter) filter = { providerId: providerIdFilter };
    else filter = {};

    const origins = await Origin.find(filter)
      .skip(offset)
      .limit(limit)
      .populate("providerId");

    return {
      success: true,
      data: origins,
    };
  } catch (error) {
    return {
      success: false,
      error: new UnknownException(error),
    };
  }
};
