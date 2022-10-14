import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async editProfile(profileId: number, dto: EditUserDto) {
    const user = await this.prisma.profile.update({
      where: {
        id: profileId,
      },
      data: {
        ...dto,
      },
    });

    return user;
  }
}
