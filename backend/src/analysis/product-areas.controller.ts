import {
    Body,
    Controller,
    Param,
    Post,
    Req,
    UseGuards,
  } from '@nestjs/common';
  
  import { CreateProductAreaDto } from './dto/create-product-area.dto';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProductAreasService } from './product-areas.service';

  @Controller('projects/:projectId/analysis')
  // @UseGuards(JwtAuthGuard)
  export class ProductAreasController {
    constructor(
      private readonly productAreasService: ProductAreasService,
    ) {}
  
    @Post('product-areas')
    createProductArea(
      @Param('projectId') projectId: string,
      @Body() createProductAreaDto: CreateProductAreaDto,
      @Req() request: any,
    ) {
      const userId = request.user.sub;
  
      return this.productAreasService.createProductArea(
        Number(projectId),
        userId,
        createProductAreaDto,
      );
    }
  }