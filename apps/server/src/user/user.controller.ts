import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { all_auth_recipe_users } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { AuthGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  // eslint-disable-next-line class-methods-use-this
  @Get('me')
  async getMe(
    @GetUser() user: all_auth_recipe_users,
    /* @Session() session: SessionContainer @GetUser('email') _email: string */
  ): Promise<object> {
    return user;
  }

  @Patch('')
  // TODO: Replace User by Profile
  editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
    return this.userService.editProfile(userId, dto);
  }
}
