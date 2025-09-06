import { z } from 'zod';

export const categoryFormSchema = z
  .object({
    rateNormal: z
      .number()
      .positive('Normal rate must be greater than 0')
      .max(1000, 'Normal rate must be less than $1000/hr'),
    rateSpecial: z
      .number()
      .positive('Special rate must be greater than 0')
      .max(1000, 'Special rate must be less than $1000/hr'),
  })
  .refine((data) => data.rateSpecial >= data.rateNormal, {
    message: 'Special rate should typically be higher than normal rate',
    path: ['rateSpecial'],
  });
