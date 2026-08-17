// src/shared/types/identity.types.ts
export interface IdentityProfile {
  id: string
  displayName: string
  identityStatement: string
  photoPath: string | null
  coreValues: string // JSON
  xpPoints: number
  level: number
  createdAt: Date | string
  updatedAt: Date | string
}

export interface FutureSelf {
  id: string
  profileId: string
  visionText: string
  photoPath: string | null
  targetDate: string | null
  keyTraits: string // JSON
  letterToSelf: string | null
  isActive: boolean
  createdAt: Date | string
}

export interface IdentityStatement {
  id: string
  profileId: string
  text: string
  category: string
  isActive: boolean
  displayOrder: number
  createdAt: Date | string
}
