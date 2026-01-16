import { getIO } from "./index";

export const adminSocket = {
  userSignedUp(payload: any) {
    getIO().to("admins").emit("user:signed-up", payload);
  },
};