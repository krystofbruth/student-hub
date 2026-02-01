import mongoose from "mongoose";
import { Result } from "../helpers/Result";
import { IProvider, Provider } from "../models/Provider";
import { UnknownException } from "../exceptions/UnknownException";
import { NotFoundException } from "../exceptions/NotFoundException";

export const getProvider = async (
  providerId: mongoose.Types.ObjectId,
): Promise<Result<IProvider>> => {
  try {
    const provider = await Provider.findById(providerId);
    if (!provider)
      return {
        success: false,
        error: new NotFoundException(providerId.toString()),
      };

    return { success: true, data: provider };
  } catch (error) {
    return { success: false, error: new UnknownException(error) };
  }
};

export const getProviders = async (
  limit: number = 50,
  offset: number = 0,
  partnership: boolean | undefined = undefined,
  query: string = "",
): Promise<Result<IProvider[]>> => {
  let partnershipFilter = {};
  if (typeof partnership !== "undefined")
    partnershipFilter = {
      partnership,
    };

  try {
    // TODO: take into account the query!
    const res = await Provider.find(partnershipFilter)
      .skip(offset)
      .limit(limit);
    return { success: true, data: res };
  } catch (error) {
    return { success: false, error: new UnknownException(error) };
  }
};
