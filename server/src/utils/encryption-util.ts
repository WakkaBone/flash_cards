import bcrypt from "bcrypt";

export const encrypt = async (string: string) => await bcrypt.hash(string, 10);
