import {
    Body,
    Controller,
    Param,
    Post,
    Req,
    UseGuards,
  } from '@nestjs/common';
  
  
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  import { ProductTypesService } from './product-types.service';
import { CreateProductTypeDto } from './dto/create-product-type.dto';
  
  @Controller('projects/:projectId/analysis')
  // @UseGuards(JwtAuthGuard)
  export class ProductTypesController {
    constructor(
      private readonly productTypesService: ProductTypesService,
    ) {}
  
    @Post('product-types')
    createProductType(
      @Param('projectId') projectId: string,
      @Body() createProductTypeDto: CreateProductTypeDto,
      @Req() request: any,
    ) {
      const userId = request.user.sub;
  
      // Temporary: we will use projectId and userId
      // to find the correct Analysis in the service.
      return this.productTypesService.createProductType(
        Number(projectId),
        userId,
        createProductTypeDto,
      );
    }
  }