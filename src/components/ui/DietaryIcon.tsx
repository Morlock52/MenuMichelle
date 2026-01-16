'use client'

import { clsx } from 'clsx'
import { Leaf, Wheat, Fish, Flame } from 'lucide-react'

type DietaryType = 'vegetarian' | 'vegan' | 'glutenFree' | 'halal' | 'dairyFree' | 'nutFree' | 'spicy'

interface DietaryIconProps {
  type: DietaryType
  level?: 1 | 2 | 3
  size?: 'sm' | 'md'
  showLabel?: boolean
}

const iconConfig: Record<DietaryType, {
  icon: typeof Leaf
  color: string
  bgColor: string
  label: string
}> = {
  vegetarian: {
    icon: Leaf,
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    label: 'Vegetarian',
  },
  vegan: {
    icon: Leaf,
    color: 'text-green-700',
    bgColor: 'bg-green-200 dark:bg-green-900/50',
    label: 'Vegan',
  },
  glutenFree: {
    icon: Wheat,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    label: 'Gluten-Free',
  },
  halal: {
    icon: Fish, // Placeholder - would use proper halal icon
    color: 'text-teal-600',
    bgColor: 'bg-teal-100 dark:bg-teal-900/30',
    label: 'Halal',
  },
  dairyFree: {
    icon: Fish, // Placeholder
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    label: 'Dairy-Free',
  },
  nutFree: {
    icon: Fish, // Placeholder
    color: 'text-purple-600',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    label: 'Nut-Free',
  },
  spicy: {
    icon: Flame,
    color: 'text-red-500',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    label: 'Spicy',
  },
}

const sizes = {
  sm: 'w-5 h-5',
  md: 'w-6 h-6',
}

const iconSizes = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
}

export function DietaryIcon({
  type,
  level = 1,
  size = 'sm',
  showLabel = false,
}: DietaryIconProps) {
  const config = iconConfig[type]
  if (!config) return null

  const Icon = config.icon

  // For spicy, show multiple flame icons based on level
  if (type === 'spicy' && level > 1) {
    return (
      <div
        className={clsx(
          'flex items-center gap-0.5 px-1.5 py-0.5 rounded-full',
          config.bgColor
        )}
        title={`${config.label} Level ${level}`}
      >
        {Array.from({ length: level }).map((_, i) => (
          <Flame key={i} className={clsx('w-3 h-3', config.color)} />
        ))}
        {showLabel && (
          <span className={clsx('text-small ml-1', config.color)}>
            {config.label}
          </span>
        )}
      </div>
    )
  }

  return (
    <div
      className={clsx(
        'flex items-center justify-center rounded-full',
        config.bgColor,
        sizes[size],
        showLabel && 'px-2 gap-1'
      )}
      title={config.label}
    >
      <Icon className={clsx(iconSizes[size], config.color)} />
      {showLabel && (
        <span className={clsx('text-small', config.color)}>
          {config.label}
        </span>
      )}
    </div>
  )
}

interface DietaryIconsProps {
  dietary: {
    vegetarian?: boolean
    vegan?: boolean
    glutenFree?: boolean
    halal?: boolean
    dairyFree?: boolean
    nutFree?: boolean
    spicy?: 1 | 2 | 3
  }
  size?: 'sm' | 'md'
}

export function DietaryIcons({ dietary, size = 'sm' }: DietaryIconsProps) {
  const icons: { type: DietaryType; level?: 1 | 2 | 3 }[] = []

  if (dietary.vegan) icons.push({ type: 'vegan' })
  else if (dietary.vegetarian) icons.push({ type: 'vegetarian' })
  if (dietary.glutenFree) icons.push({ type: 'glutenFree' })
  if (dietary.halal) icons.push({ type: 'halal' })
  if (dietary.dairyFree) icons.push({ type: 'dairyFree' })
  if (dietary.nutFree) icons.push({ type: 'nutFree' })
  if (dietary.spicy) icons.push({ type: 'spicy', level: dietary.spicy })

  if (icons.length === 0) return null

  return (
    <div className="flex items-center gap-1">
      {icons.map(({ type, level }) => (
        <DietaryIcon key={type} type={type} level={level} size={size} />
      ))}
    </div>
  )
}
