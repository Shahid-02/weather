import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import { Weather } from './entities/weather.entity';
import { HttpService } from '@nestjs/axios';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { UpdateWeatherDto } from './dto/update-weather.dto';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class WeatherService {
  private readonly apiKey = 'd37796aee0e79eef731699993b7be143';

  constructor(
    @InjectRepository(Weather)
    private weatherRepository: Repository<Weather>,
    private httpService: HttpService,
    private redisService: RedisService,
  ) {}

  async getWeatherByLocation(location: string) {
    try {
      const client = this.redisService.getClient();

      // Check cache first
      const cachedData = await client.get(location);
      if (cachedData) {
        return {
          result: {
            message: 'Weather Data Fetched Successfully (from cache)',
            data: JSON.parse(cachedData),
          },
        };
      }
      // fetch Api weather data
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${this.apiKey}&units=metric`;
      const response = await firstValueFrom(this.httpService.get(url));

      if (!response.data) {
        throw new HttpException('City Not Found', HttpStatus.NOT_FOUND);
      }

      const data = response.data;

      // find Location from Database
      let weather = await this.weatherRepository.findOne({
        where: { location },
      });

      if (weather) {
        await this.weatherRepository.remove(weather);
        await client.del(location);
      }

      weather = new Weather();
      weather.location = location;
      weather.data = data;
      weather.fetchedAt = new Date();

      await this.weatherRepository.save(weather);

      await client.set(location, JSON.stringify(data), 'EX', 3600);

      return {
        result: {
          message: 'Weather Data Fetched Successfully',
          data,
        },
      };
    } catch (error) {
      console.log(error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async create(createWeatherDto: CreateWeatherDto) {
    try {
      const weatherExit = await this.weatherRepository.findOne({
        where: { location: createWeatherDto.name },
      });

      if (!weatherExit) {
        throw new HttpException(
          'weather in already in the database',
          HttpStatus.FOUND,
        );
      }

      //  weather data new data created in the database
      const weather = this.weatherRepository.create(createWeatherDto);

      if (!weather) {
        throw new HttpException(
          'Failed to create weather',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      // save data in database
      await this.weatherRepository.save(weather);

      return {
        message: 'Weather Data created successfully',
        weather,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll() {
    try {
      // Find all data in database
      const weather = await this.weatherRepository.find();

      return {
        message: 'All Weather Data fetched successfully',
        weather,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: number) {
    try {
      // Check the id and find the weather data
      const weather = await this.weatherRepository.findOne({ where: { id } });

      if (!weather) {
        throw new HttpException(
          `Weather with ID ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        message: `Weather Data fetched successfully By ID ${id}`,
        weather,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: number, updateWeatherDto: UpdateWeatherDto) {
    try {
      const weather = await this.weatherRepository.findOne({ where: { id } });

      if (!weather) {
        throw new HttpException(
          `Weather with ID ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      this.weatherRepository.merge(weather, updateWeatherDto);
      const updatedWeather = await this.weatherRepository.save(weather);

      return {
        message: 'Weather Data updated successfully',
        weather: updatedWeather,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: number) {
    try {
      const weather = await this.weatherRepository.findOne({ where: { id } });

      if (!weather) {
        throw new HttpException(
          `Weather Data with ID ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      await this.weatherRepository.delete(id);

      return {
        message: 'Weather Data deleted successfully',
        weather,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
