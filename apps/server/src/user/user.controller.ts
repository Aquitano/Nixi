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

	@Get('me')
	getMe(
		@GetUser() user: all_auth_recipe_users,
		/* @Session() session: SessionContainer @GetUser('email') _email: string */
	): all_auth_recipe_users {
		return user;
	}

	@Patch('')
	editUser(@GetUser('id') profileId: string, @Body() dto: EditUserDto) {
		return this.userService.editProfile(profileId, dto);
	}
}
