import jwt from "jsonwebtoken";
import UserDTO from "./UserDto";

type TokensReturn = {
  accessToken: string;
  refreshToken: string;
};

interface ITokenService {
  generateTokens(user: UserDTO): TokensReturn;
}

class TokenService implements ITokenService {
  generateTokens(user: UserDTO): TokensReturn {
    const accessToken = jwt.sign({ ...user }, process.env.ACCESS_TOKEN as string, {
      expiresIn: "5m",
    });
    const refreshToken = jwt.sign({ ...user }, process.env.REFRESH_TOKEN as string, {
      expiresIn: "1d",
    });
    return { accessToken, refreshToken };
  }
}

export default new TokenService();
