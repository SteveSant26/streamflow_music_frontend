import { User } from "@app/domain/entities/user.entity";
import { UserDTO } from "../models/user.dto";

export const toUser = (dto: UserDTO): User => ({
  id: dto.id,
  email: dto.email,
  name: dto.name,
  createdAt: new Date(),
  updatedAt: new Date(),
});
