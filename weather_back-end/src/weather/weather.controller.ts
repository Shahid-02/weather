import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  Param,
  ParseIntPipe,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { WeatherService } from './weather.service';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { UpdateWeatherDto } from './dto/update-weather.dto';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  // Find All Data Router
  @Get('all')
  async findAll() {
    return this.weatherService.findAll();
  }

  // Find location And Fetch Data Router
  @Get('city/:location')
  async getWeather(
    @Param(
      'location',
      new ValidationPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    location: string,
  ) {
    return this.weatherService.getWeatherByLocation(location);
  }

  // Create a New Weather Data Router
  @Post()
  async create(@Body() createWeatherDto: CreateWeatherDto) {
    return this.weatherService.create(createWeatherDto);
  }

  // Find By Id Router
  @Get(':id')
  async findOne(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return this.weatherService.findOne(id);
  }

  // Update a Weather Data By Id Router
  @Put(':id')
  async update(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
    @Body()
    updateWeatherDto: UpdateWeatherDto,
  ) {
    return this.weatherService.update(id, updateWeatherDto);
  }

  // Delete a Weather Data By Id Router
  @Delete(':id')
  async remove(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return this.weatherService.remove(id);
  }
}
