'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAllCourseProgress } from "@/hooks/useProgress"

type Skill = {
  id: string
  title: string
  levels: number
  summary: string[]
  practiceHref: string
}

type SkillCardProps = {
  skill: Skill
  courseId: string
  sourceLanguageCode: string
  targetLanguageCode: string
}

// Get icon based on skill title
function getSkillIcon(title: string): string {
  const titleLower = title.toLowerCase()
  
  // Greetings/Basics
  if (titleLower.includes('chào') || titleLower.includes('greeting')) return '👋'
  if (titleLower.includes('giới thiệu') || titleLower.includes('introduction')) return '🙋'
  
  // Family
  if (titleLower.includes('gia đình') || titleLower.includes('family')) return '👨‍👩‍👧‍👦'
  if (titleLower.includes('người') || titleLower.includes('people')) return '👥'
  
  // Numbers
  if (titleLower.includes('số') || titleLower.includes('number') || titleLower.includes('đếm')) return '🔢'
  
  // Animals
  if (titleLower.includes('động vật nhà') || titleLower.includes('domestic')) return '🐄'
  if (titleLower.includes('động vật rừng') || titleLower.includes('wild')) return '🦁'
  if (titleLower.includes('động vật')) return '🐾'
  
  // Food
  if (titleLower.includes('thức ăn') || titleLower.includes('food')) return '🍚'
  if (titleLower.includes('hoa quả') || titleLower.includes('fruit')) return '🍎'
  if (titleLower.includes('đồ uống') || titleLower.includes('drink')) return '🥤'
  
  // Nature
  if (titleLower.includes('phong cảnh') || titleLower.includes('landscape')) return '⛰️'
  if (titleLower.includes('thời tiết') || titleLower.includes('weather')) return '🌤️'
  if (titleLower.includes('cây') || titleLower.includes('plant')) return '🌳'
  
  // Daily Life
  if (titleLower.includes('hoạt động') || titleLower.includes('activit')) return '🏃'
  if (titleLower.includes('trường') || titleLower.includes('school')) return '🏫'
  
  return '📚'
}

export function SkillCard({ skill, courseId, sourceLanguageCode, targetLanguageCode }: SkillCardProps) {
  const allProgress = useAllCourseProgress(courseId)
  const skillProgress = allProgress[skill.practiceHref]
  const isCompleted = skillProgress?.completed || false
  const icon = getSkillIcon(skill.title)

  return (
    <Card className="relative hover:shadow-lg transition-shadow">
      {isCompleted && (
        <div className="absolute top-4 right-4 bg-green-500 text-white rounded-full p-2 shadow-lg z-10">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
      
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="text-4xl">{icon}</div>
          <CardTitle className="text-lg flex-1">{skill.title}</CardTitle>
        </div>
        <CardDescription>
          <div className="flex items-center gap-1 mb-1">
            {Array.from({ length: skill.levels }).map((_, i) => (
              <span key={i} className="text-yellow-500">⭐</span>
            ))}
            <span className="ml-1 text-xs">{skill.levels} cấp độ</span>
          </div>
          {skillProgress && (
            <div className="text-xs text-green-600 font-medium">
              ✓ {Math.round((skillProgress.correctCount / (skillProgress.correctCount + skillProgress.incorrectCount)) * 100)}% độ chính xác
            </div>
          )}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
          {skill.summary.length > 0 && (
            <p className="mb-0">
              📝 <strong>Học:</strong> {skill.summary.slice(0, 3).join(', ')}
              {skill.summary.length > 3 && '...'}
            </p>
          )}
        </div>
      </CardContent>
      
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/${sourceLanguageCode}/courses/${targetLanguageCode}/skill/${skill.practiceHref}`}>
            {isCompleted ? 'Luyện tập lại' : 'Bắt đầu học'}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

