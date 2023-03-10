import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  Body,
  Get,
  Post,
  Patch,
  Header,
  Query,
  Delete,
} from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';
import { diskStorage } from 'multer';
import { join } from 'path';
import { AuthService } from './auth.service';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { BasicsUpdateDTO } from './dto/basics-update-dto';
import { PassUpdateDTO } from './dto/pass-update.dto';
import { SignUpDTO } from './dto/sign-up.dto';
import { GetUser } from './get-user.decorator';
import { Public } from './public.decorator';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/signup')
  signup(@Body() signUpDTO: SignUpDTO): Promise<void> {
    return this.authService.signup(signUpDTO);
  }

  @Public()
  @Post('/login')
  login(
    @Body() authCredentialsDTO: AuthCredentialsDTO,
  ): Promise<{ accessToken: string }> {
    return this.authService.login(authCredentialsDTO);
  }

  @Get('/me')
  getInfo(@GetUser() user: User): User {
    return user;
  }

  @Public()
  @Get('/me/avatar')
  @Header('Content-Type', 'image/*')
  getAvatar(@Query('path') path: string): StreamableFile {
    const file = createReadStream(join(process.cwd(), path));

    return new StreamableFile(file);
  }

  @Patch('/me/basics')
  updateBasics(
    @GetUser() user: User,
    @Body() basicsUpdateDTO: BasicsUpdateDTO,
  ): Promise<{ accessToken: string }> {
    return this.authService.updateBasics(user, basicsUpdateDTO);
  }

  @Patch('/me/pass')
  updatePass(
    @GetUser() user: User,
    @Body() passUpdateDTO: PassUpdateDTO,
  ): Promise<void> {
    return this.authService.updatePass(user, passUpdateDTO);
  }

  @Patch('/me/avatar-upload')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads',
        filename(_req, file, callback) {
          callback(null, `${new Date().getTime()}_${file.originalname}`);
        },
      }),
    }),
  )
  uploadAvatar(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 15000 }),
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
      }),
    )
    avatar: Express.Multer.File,
    @GetUser() user: User,
  ): Promise<{ path: string }> {
    return this.authService.uploadAvatar(user, avatar.filename);
  }

  @Delete('/me/avatar-unlink')
  unlinkAvatar(@GetUser() user: User): Promise<void> {
    return this.authService.unlinkAvatar(user);
  }
}
