import { IsString, IsNotEmpty, IsObject, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class StudentInfoDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  email: string;
}

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  school_id: string;

  @IsString()
  @IsNotEmpty()
  amount: string;

  @IsString()
  @IsNotEmpty()
  trustee_id: string;

  @IsObject()
  @ValidateNested()
  @Type(() => StudentInfoDto)
  student_info: StudentInfoDto;

  @IsString()
  @IsOptional()
  gateway_name?: string;
}
