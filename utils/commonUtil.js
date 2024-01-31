import bcrypt from "bcryptjs";

const verifyCredentials = async (password, savedEncryptedPassword) => {
  const ismatch = await bcrypt.compare(password, savedEncryptedPassword);
  return ismatch;
};

export { verifyCredentials };
