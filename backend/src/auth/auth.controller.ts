import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/roles.decorator';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';



@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Registrar um novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiBody({
    description: 'Criação de usuário',
    examples: {
      passageiro: {
        summary: 'Usuário Passageiro',
        value: {
          name: 'Gabriel Ramos',
          email: 'gabriel@email.com',
          password: '123456',
          role: 'passageiro',
          number: '+55719999999',
        },
      },
      motorista: {
        summary: 'Usuário Motorista',
        value: {
          name: 'Gabriel Ramos - Motorista',
          email: 'motorista@email.com',
          password: '123456',
          role: 'motorista',
          vehicle: 'Fiat Uno',
          licensePlate: 'ABC-1234',
          origin: 'Salvador',
          destination: 'Itaparica',
          number: '+55719999999',
          carColor: 'Azul',
          seatsAvailable: 4,
          description: 'Transporte rápido e seguro',
          availableDays: 'Segunda a Sexta',

        },
      },
      anunciante: {
        summary: 'Usuário Anunciante',
        value: {
          name: 'Empresa X',
          email: 'contato@empresa.com',
          password: '123456',
          role: 'anunciante',
          companyName: 'Empresa X',
          cnpj: '12.345.678/0001-90',
          number: '+55719999999',
        },
      },
    },
  })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Fazer login' })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  async login(@Body() loginUserDto: LoginUserDto) {
    const user = await this.authService.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    );
    if (!user) {
      throw new HttpException('Credenciais inválidas', HttpStatus.UNAUTHORIZED);
    }
    return this.authService.login(user);
  }

  @Public()
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  
  @Public()
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.token, dto.newPassword);
  }
}
