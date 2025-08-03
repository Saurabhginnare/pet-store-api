import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Request, Response, NextFunction } from 'express';

import { IsString, IsInt, Min, Max } from 'class-validator';

export class PetDto {
  @IsString()
  name: string = '';

  @IsString()
  type: string = '';

  @IsInt()
  @Min(0)
  @Max(100)
  age: number = 0;

  @IsString()
  breed: string = '';
}


export const validatePet = async (req: Request, res: Response, next: NextFunction) => {
  const dto = plainToInstance(PetDto, req.body);
  const errors = await validate(dto);
  if (errors.length > 0) return res.status(400).json(errors);
  next();
};
