// src/renderer/src/components/ui/DynamicIcon.tsx
import * as LucideIcons from 'lucide-react'

interface DynamicIconProps extends LucideIcons.LucideProps {
  name: string
}

export function DynamicIcon({ name, ...props }: DynamicIconProps) {
  // Convert dash-case or camelCase to PascalCase for Lucide
  const pascalName = name
    .replace(/(^\w|-\w)/g, (clearAndUpper) => clearAndUpper.replace(/-/, '').toUpperCase())
    .replace(/ /g, '')
  
  const IconComponent = (LucideIcons as any)[pascalName] || LucideIcons.HelpCircle

  return <IconComponent {...props} />
}
