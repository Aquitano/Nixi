import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import type { User } from 'supertokens-node/recipe/thirdpartyemailpassword';
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
		@GetUser() user: User,
		/* @Session() session: SessionContainer @GetUser('email') _email: string */
	) {
		return user;
	}

	@Patch('')
	editUser(@GetUser('id') profileId: string, @Body() dto: EditUserDto) {
		return this.userService.editProfile(profileId, dto);
	}
}
