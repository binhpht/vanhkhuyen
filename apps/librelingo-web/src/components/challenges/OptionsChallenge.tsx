'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useState, useEffect } from "react"

type OptionsChallengeProps = {
  challenge: {
    type: 'options'
    formInTargetLanguage: string
    meaningInSourceLanguage: string
    options: Array<{
      answer: string
      correct: boolean
    }>
  }
  onCorrect: () => void
  onIncorrect: () => void
}

export function OptionsChallenge({ challenge, onCorrect, onIncorrect }: OptionsChallengeProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isChecked, setIsChecked] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  // Reset state when challenge changes
  useEffect(() => {
    setSelectedOption(null)
    setIsChecked(false)
    setIsCorrect(null)
  }, [challenge])

  const handleOptionSelect = (index: number) => {
    if (!isChecked) {
      setSelectedOption(index)
    }
  }

  const handleCheck = () => {
    if (selectedOption === null) return
    
    if (isChecked) {
      // Continue to next challenge
      if (isCorrect) {
        onCorrect()
      } else {
        onIncorrect()
      }
      return
    }
    
    // First click - check answer
    const correct = challenge.options[selectedOption].correct
    setIsCorrect(correct)
    setIsChecked(true)
  }

  const getOptionColor = (index: number) => {
    if (!isChecked) {
      return selectedOption === index ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
    }
    
    if (challenge.options[index].correct) {
      return 'border-green-500 bg-green-50 dark:bg-green-900/20'
    }
    
    if (selectedOption === index && !challenge.options[index].correct) {
      return 'border-red-500 bg-red-50 dark:bg-red-900/20'
    }
    
    return 'border-border opacity-50'
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Question */}
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">Dịch câu này:</p>
        <h2 className="text-3xl font-bold">{challenge.formInTargetLanguage}</h2>
      </div>

      {/* Options */}
      <div className="grid gap-3">
        {challenge.options.map((option, index) => (
          <Card
            key={index}
            className={`p-4 cursor-pointer transition-all ${getOptionColor(index)}`}
            onClick={() => handleOptionSelect(index)}
          >
            <p className="text-lg">{option.answer}</p>
          </Card>
        ))}
      </div>

      {/* Feedback */}
      {isChecked && (
        <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50 dark:bg-green-900/20 border border-green-200' : 'bg-red-50 dark:bg-red-900/20 border border-red-200'}`}>
          <p className={`text-lg font-semibold ${isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
            {isCorrect ? '✓ Đúng rồi!' : '✗ Chưa đúng'}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Đáp án đúng: {challenge.meaningInSourceLanguage}
          </p>
        </div>
      )}

      {/* Check/Continue Button */}
      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={handleCheck}
          disabled={selectedOption === null && !isChecked}
          className="min-w-[200px]"
        >
          {isChecked ? 'Tiếp tục' : 'Kiểm tra'}
        </Button>
      </div>
    </div>
  )
}

