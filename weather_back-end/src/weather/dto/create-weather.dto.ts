import { IsNumber, IsString, IsArray, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

class Coord {
  @IsNumber()
  lon: number;

  @IsNumber()
  lat: number;
}

class Weather {
  @IsString()
  main: string;

  @IsString()
  description: string;

  @IsString()
  icon: string;
}

class Main {
  @IsNumber()
  temp: number;

  @IsNumber()
  feels_like: number;

  @IsNumber()
  temp_min: number;

  @IsNumber()
  temp_max: number;

  @IsNumber()
  pressure: number;

  @IsNumber()
  humidity: number;

  @IsNumber()
  sea_level: number;

  @IsNumber()
  grnd_level: number;
}

class Wind {
  @IsNumber()
  speed: number;

  @IsNumber()
  deg: number;

  @IsNumber()
  gust: number;
}

class Clouds {
  @IsNumber()
  all: number;
}

class Sys {
  @IsString()
  country: string;

  @IsNumber()
  sunrise: number;

  @IsNumber()
  sunset: number;
}

export class CreateWeatherDto {
  @IsObject()
  @ValidateNested()
  @Type(() => Coord)
  coord: Coord;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Weather)
  weather: Weather[];

  @IsString()
  base: string;

  @IsObject()
  @ValidateNested()
  @Type(() => Main)
  main: Main;

  @IsNumber()
  visibility: number;

  @IsObject()
  @ValidateNested()
  @Type(() => Wind)
  wind: Wind;

  @IsObject()
  @ValidateNested()
  @Type(() => Clouds)
  clouds: Clouds;

  @IsNumber()
  dt: number;

  @IsObject()
  @ValidateNested()
  @Type(() => Sys)
  sys: Sys;

  @IsNumber()
  timezone: number;

  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsNumber()
  cod: number;
}
