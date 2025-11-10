'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

export type SkillProgress = {
  skillId: string
  completed: boolean
  correctCount: number
  incorrectCount: number
  lastPracticed: string
}

export type CourseProgress = {
  [courseId: string]: {
    [skillId: string]: SkillProgress
  }
}

export function useProgress(courseId: string, skillId: string) {
  const { data: session } = useSession()
  const [progress, setProgress] = useState<SkillProgress | null>(null)

  useEffect(() => {
    if (!session?.user?.id) return

    const key = `progress_${session.user.id}`
    const stored = localStorage.getItem(key)
    
    if (stored) {
      try {
        const allProgress: CourseProgress = JSON.parse(stored)
        const skillProgress = allProgress[courseId]?.[skillId]
        if (skillProgress) {
          setProgress(skillProgress)
        }
      } catch (error) {
        console.error('Error loading progress:', error)
      }
    }
  }, [session, courseId, skillId])

  const saveProgress = (correctCount: number, incorrectCount: number, completed: boolean) => {
    if (!session?.user?.id) return

    const key = `progress_${session.user.id}`
    const stored = localStorage.getItem(key)
    let allProgress: CourseProgress = {}

    if (stored) {
      try {
        allProgress = JSON.parse(stored)
      } catch (error) {
        console.error('Error parsing progress:', error)
      }
    }

    if (!allProgress[courseId]) {
      allProgress[courseId] = {}
    }

    allProgress[courseId][skillId] = {
      skillId,
      completed,
      correctCount,
      incorrectCount,
      lastPracticed: new Date().toISOString(),
    }

    localStorage.setItem(key, JSON.stringify(allProgress))
    setProgress(allProgress[courseId][skillId])
  }

  return { progress, saveProgress }
}

export function useAllCourseProgress(courseId: string) {
  const { data: session } = useSession()
  const [progress, setProgress] = useState<{ [skillId: string]: SkillProgress }>({})

  useEffect(() => {
    if (!session?.user?.id) return

    const key = `progress_${session.user.id}`
    const stored = localStorage.getItem(key)
    
    if (stored) {
      try {
        const allProgress: CourseProgress = JSON.parse(stored)
        const courseProgress = allProgress[courseId] || {}
        setProgress(courseProgress)
      } catch (error) {
        console.error('Error loading progress:', error)
      }
    }
  }, [session, courseId])

  return progress
}

