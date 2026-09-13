import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Authentification')
export class AuthController {
  constructor(private authSer: AuthService) {}

  @ApiCreatedResponse({
    description: 'Un nouveau utilisateur est crée',
    example: {
      email: 'nidhal@gmail.com',
      username: 'nj',
    },
  })
  @ApiBadRequestResponse({
    description: 'Requête mal formulée',
  })
  @Post('signup')
  async signup(@Body() credentials) {
    let data = await this.authSer.inscription(credentials);
    return {
      message: "User d'id " + data.id + ' créé avec succès',
      result: data,
    };
  }

  @Post('signin')
  async sigin(@Body() credentials) {
    let response = await this.authSer.seConnecter(credentials);

    return {
      message: 'User authentifé',
      ...response,
    };
  }
}
