// src/shared/dtos/identity.dto.ts
import { z } from 'zod'

export const UpdateProfileDtoSchema = z.object({
  displayName: z.string().optional(),
  identityStatement: z.string().optional(),
  coreValues: z.array(z.string()).optional()
})

export type UpdateProfileDto = z.infer<typeof UpdateProfileDtoSchema>

export const UpdateFutureSelfDtoSchema = z.object({
  visionText: z.string().optional(),
  keyTraits: z.array(z.string()).optional(),
  targetDate: z.string().optional().nullable(),
  letterToSelf: z.string().optional().nullable()
})

export type UpdateFutureSelfDto = z.infer<typeof UpdateFutureSelfDtoSchema>

export const CreateStatementDtoSchema = z.object({
  text: z.string().min(1),
  category: z.string().default('RECOVERY')
})

export type CreateStatementDto = z.infer<typeof CreateStatementDtoSchema>

export const UpdateStatementDtoSchema = z.object({
  text: z.string().optional(),
  category: z.string().optional(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().optional()
})

export type UpdateStatementDto = z.infer<typeof UpdateStatementDtoSchema>
