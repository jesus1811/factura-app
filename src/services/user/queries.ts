import { axiosInstance, getAxiosConfig } from "../axiosIntance";
import { IUser } from "./types";

export const loginUser = async ({ user, password }: { user: string; password: string }): Promise<IUser | undefined> => {
  const axiosInstance = getAxiosConfig();
  try {
    const response = await axiosInstance.get("/user", { params: { user, password } });
    if (response.status === 200 && response?.data?.length !== 0) return response?.data?.[0];
  } catch (error) {
    throw error;
  }
};

export const getUser = async ({ token }: { token: string }): Promise<IUser | undefined> => {
  try {
    const response = await axiosInstance.get("/owner", { params: { select: "token", token: `eq.${token}` } });
    if (response.status === 200 && response) return response.data?.[0];
  } catch (error) {
    throw error;
  }
};
