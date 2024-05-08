import { axiosInstance } from "../axiosIntance";
import { IUser } from "./types";

export const getAllUsers = async (): Promise<IUser[] | undefined> => {
  try {
    const response = await axiosInstance.get("/user", { params: { select: "*,owner:owner_id(token)" } });

    if (response.status === 200 && response) return response.data;
  } catch (error) {
    throw new Error("Error");
  }
};

export const loginUser = async ({ user, password }: { user: string; password: string }): Promise<IUser | undefined> => {
  try {
    const response = await axiosInstance.get("/user", { params: { select: "*,owner:owner_id(token)", user: `eq.${user}`, password: `eq.${password}` } });
    if (response.status === 200 && response?.data?.length !== 0) return response?.data?.[0];
  } catch (error) {
    throw new Error("Error");
  }
};

export const getUser = async ({ token }: { token: string }): Promise<IUser | undefined> => {
  try {
    const response = await axiosInstance.get("/user", { params: { select: "*,owner:owner_id(token)", "owner.token": `eq.${token}` } });

    if (response.status === 200 && response) return response.data?.[0];
  } catch (error) {
    throw new Error("Error");
  }
};
