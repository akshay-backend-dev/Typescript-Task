import { getIO } from "./index";

export const userSocket = {
  userLoggedIn(payload: any) {
    getIO().to("admins").emit("user:logged-in", payload);
  },
};