import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async editProfile(profileId: string, dto: EditUserDto) {
    const profile = await this.prisma.profile.update({
      where: {
        userId: profileId,
      },
      data: {
        ...dto,
      },
    });

    return profile;
  }
}
