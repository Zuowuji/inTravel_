import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class DownImageDto {
  @IsNotEmpty()
  @IsNumber()
  imageId: number;
  @IsNotEmpty()
  @IsString()
  imageFileName: string;
}

export class DownExcelDto {
  @IsNotEmpty()
  @IsNumber()
  excelId: number;
  @IsNotEmpty()
  @IsString()
  excelFileName: string;
}
