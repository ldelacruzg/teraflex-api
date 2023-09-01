import { Controller, Get, Redirect } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  @Redirect()
  getHello() {
    return { url: 'https://fyc.uteq.edu.ec:4000' };
  }
}
