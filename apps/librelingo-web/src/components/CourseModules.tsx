'use client'

import { SkillCard } from './SkillCard'

type Skill = {
  id: string
  title: string
  levels: number
  summary: string[]
  practiceHref: string
}

type Module = {
  title: string
  skills: Skill[]
}

type CourseModulesProps = {
  modules: Module[]
  courseId: string
  sourceLanguageCode: string
  targetLanguageCode: string
}

// Get module icon based on title
function getModuleIcon(title: string): string {
  const titleLower = title.toLowerCase()
  
  if (titleLower.includes('cơ bản') || titleLower.includes('basic')) return '🎯'
  if (titleLower.includes('gia đình') || titleLower.includes('family')) return '👨‍👩‍👧‍👦'
  if (titleLower.includes('số') || titleLower.includes('number')) return '🔢'
  if (titleLower.includes('động vật') || titleLower.includes('animal')) return '🐾'
  if (titleLower.includes('ăn uống') || titleLower.includes('food')) return '🍽️'
  if (titleLower.includes('thiên nhiên') || titleLower.includes('nature')) return '🌿'
  if (titleLower.includes('sinh hoạt') || titleLower.includes('daily') || titleLower.includes('life')) return '🏠'
  
  return '📖'
}

export function CourseModules({ modules, courseId, sourceLanguageCode, targetLanguageCode }: CourseModulesProps) {
  return (
    <div className="space-y-10">
      {modules.map((module, moduleIndex) => (
        <div key={moduleIndex} className="border-l-4 border-primary/30 pl-4">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{getModuleIcon(module.title)}</span>
            <h2 className="text-2xl font-semibold">{module.title}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {module.skills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                courseId={courseId}
                sourceLanguageCode={sourceLanguageCode}
                targetLanguageCode={targetLanguageCode}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

