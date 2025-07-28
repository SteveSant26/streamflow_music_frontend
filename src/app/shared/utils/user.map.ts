import { User } from "app/core/entities/user.entity";
import { UserDTO } from "../models/user.dto";

export const toUser = (dto: UserDTO) => new User(dto);
