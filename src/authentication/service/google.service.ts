import { Injectable } from '@nestjs/common';
import { LoginTicket, OAuth2Client, TokenPayload } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { GoogleLoginInput } from 'src/schema/graphql.schema';

@Injectable()
export class GoogleAuthService {
  constructor(private readonly configService: ConfigService) {}
  async login(googleLoginInput: GoogleLoginInput) {
    const CLIENT_ID = this.configService.get('GOOGLE_CLIENT_ID');
    const { idToken } = googleLoginInput;
    const client: OAuth2Client = new OAuth2Client(CLIENT_ID);
    const ticket: LoginTicket = await client.verifyIdToken({
      idToken,
      audience: CLIENT_ID,
    });
    const payload: TokenPayload | undefined = ticket.getPayload();

    return {
      service: 'google',
      picture: payload?.picture,
      id: payload?.sub,
      name: payload?.name,
      email: payload?.email,
    };
  }
}
