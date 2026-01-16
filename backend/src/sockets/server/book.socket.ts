import { getIO } from "./index";

export const bookSocket = {
  bookAdded(payload: any) {
    getIO().to("admins").emit("book:added", payload);
  },
};