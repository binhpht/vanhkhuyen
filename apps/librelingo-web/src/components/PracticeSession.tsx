'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { OptionsChallenge } from './challenges/OptionsChallenge'
import { Card } from './ui/card'
import { Button } from './ui/button'
import Link from 'next/link'
import { useProgress } from '@/hooks/useProgress'

type Challenge = {
  type: string
  formInTargetLanguage?: string
  meaningInSourceLanguage?: string
  options?: Array<{
    answer: string
    correct: boolean
  }>
  [key: string]: any
}

type PracticeSessionProps = {
  challenges: Challenge[]
  skillTitle: string
  skillId: string
  courseId: string
  courseUrl: string
}

// Deterministic seeded random for client-side
function seededRandom(seed: string) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i)
    hash = hash & hash
  }
  return function() {
    hash = (hash * 9301 + 49297) % 233280
    return hash / 233280
  }
}

// Generate options for a challenge
function generateChallengeOptions(challenge: Challenge, allChallenges: Challenge[]) {
  if (challenge.type !== 'options' || !challenge.meaningInSourceLanguage) return challenge

  const correctAnswer = challenge.meaningInSourceLanguage
  const challengeId = (challenge as any).id || Math.random().toString()
  const random = seededRandom(challengeId)
  
  // Get other answers
  const otherAnswers = allChallenges
    .filter(c => c.meaningInSourceLanguage && c.meaningInSourceLanguage !== correctAnswer)
    .map(c => c.meaningInSourceLanguage!)
    .filter((value, index, self) => self.indexOf(value) === index)
  
  // Select 3 wrong answers
  const shuffledOthers = [...otherAnswers].sort((a, b) => a.localeCompare(b))
  const wrongAnswers = shuffledOthers.slice(0, 3)
  
  // Create options
  const allOptions = [
    { answer: correctAnswer, correct: true },
    ...wrongAnswers.map(answer => ({ answer, correct: false }))
  ]
  
  // Shuffle deterministically
  const shuffled = allOptions.sort(() => random() - 0.5)
  
  return {
    ...challenge,
    options: shuffled
  }
}

export function PracticeSession({ challenges, skillTitle, skillId, courseId, courseUrl }: PracticeSessionProps) {
  const { data: session } = useSession()
  const { saveProgress } = useProgress(courseId, skillId)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [incorrectCount, setIncorrectCount] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)

  // Generate options for challenges on client side
  const [processedChallenges] = useState(() => {
    return challenges.map(c => generateChallengeOptions(c, challenges))
  })

  // Save progress when completed
  useEffect(() => {
    if (isCompleted && session?.user) {
      saveProgress(correctCount, incorrectCount, true)
    }
  }, [isCompleted, session, correctCount, incorrectCount, saveProgress])

  // Filter only options challenges for now
  const optionsChallenges = processedChallenges.filter(c => c.type === 'options' && c.options)
  const currentChallenge = optionsChallenges[currentIndex]

  const handleCorrect = () => {
    setCorrectCount(prev => prev + 1)
    moveToNext()
  }

  const handleIncorrect = () => {
    setIncorrectCount(prev => prev + 1)
    moveToNext()
  }

  const moveToNext = () => {
    if (currentIndex < optionsChallenges.length - 1) {
      setCurrentIndex(prev => prev + 1)
    } else {
      setIsCompleted(true)
    }
  }

  if (isCompleted) {
    const accuracy = Math.round((correctCount / (correctCount + incorrectCount)) * 100)
    
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-8 text-center space-y-6">
          <div className="text-6xl">🎉</div>
          <h1 className="text-3xl font-bold">Hoàn thành!</h1>
          <div className="space-y-2">
            <p className="text-lg">Bạn đã hoàn thành: <strong>{skillTitle}</strong></p>
            <div className="flex justify-center gap-8 text-center pt-4">
              <div>
                <div className="text-3xl font-bold text-green-600">{correctCount}</div>
                <div className="text-sm text-muted-foreground">Đúng</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-600">{incorrectCount}</div>
                <div className="text-sm text-muted-foreground">Sai</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">{accuracy}%</div>
                <div className="text-sm text-muted-foreground">Độ chính xác</div>
              </div>
            </div>
          </div>
          <Button asChild className="w-full" size="lg">
            <Link href={courseUrl}>Quay lại khóa học</Link>
          </Button>
        </Card>
      </div>
    )
  }

  if (!currentChallenge) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-8 text-center space-y-4">
          <p className="text-muted-foreground">Chưa có bài tập tương tác cho kỹ năng này.</p>
          <Button asChild>
            <Link href={courseUrl}>Quay lại khóa học</Link>
          </Button>
        </Card>
      </div>
    )
  }

  const progress = ((currentIndex + 1) / optionsChallenges.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Progress Bar */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href={courseUrl} className="text-muted-foreground hover:text-foreground">
              ← Thoát
            </Link>
            <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm text-muted-foreground">
              {currentIndex + 1} / {optionsChallenges.length}
            </span>
          </div>
        </div>
      </div>

      {/* Challenge */}
      <div className="container mx-auto px-4 py-12">
        <OptionsChallenge
          key={currentIndex}
          challenge={currentChallenge}
          onCorrect={handleCorrect}
          onIncorrect={handleIncorrect}
        />
      </div>
    </div>
  )
}

