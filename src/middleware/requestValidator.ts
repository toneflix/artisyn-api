// src/middleware/requestValidator.ts
import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';

export function validate(rules: ValidationChain[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    for (const rule of rules) {
      await rule.run(req);
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  };
}
