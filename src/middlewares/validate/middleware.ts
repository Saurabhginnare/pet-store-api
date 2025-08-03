import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

export function validateRequest<T extends object>(DTOClass: new () => T) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const instance = plainToInstance(DTOClass, req.body, {
      enableImplicitConversion: true,
      excludeExtraneousValues: false,
    });

    const errors = await validate(instance);

    if (errors.length > 0) {
      const messages = errors.map(err => Object.values(err.constraints || {})).flat();
      return res.status(400).json({ errors: messages });
    }

    next();
  };
}
