import { getCourseId, listAvailableCourses, getCourseData } from "@/data/course"
import { notFound } from "next/navigation"
import fs from "node:fs"
import path from "node:path"
import { PracticeSession } from "@/components/PracticeSession"

export async function generateStaticParams() {
  const courses = await listAvailableCourses()
  const params = []

  for (const course of courses) {
    const courseData = await getCourseData(course.id)
    
    for (const module of courseData.modules) {
      for (const skill of module.skills) {
        params.push({
          sourceLanguageCode: course.uiLanguage,
          targetLanguageCode: course.languageCode,
          skillId: skill.practiceHref,
        })
      }
    }
  }

  return params
}

type Props = {
  params: {
    sourceLanguageCode: string
    targetLanguageCode: string
    skillId: string
  }
}

async function getSkillChallenges(courseId: string, skillId: string) {
  const challengesPath = path.join(
    process.cwd(),
    'src',
    'courses',
    courseId,
    'challenges',
    `${skillId}.json`
  )

  if (!fs.existsSync(challengesPath)) {
    return null
  }

  const fileContent = await fs.promises.readFile(challengesPath, 'utf8')
  return JSON.parse(fileContent)
}

async function getSkillTitle(courseId: string, skillId: string) {
  const courseData = await getCourseData(courseId)
  
  for (const module of courseData.modules) {
    for (const skill of module.skills) {
      if (skill.practiceHref === skillId) {
        return skill.title
      }
    }
  }
  
  return 'Practice Skill'
}

// Deterministic seeded random function
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

// Generate wrong options for challenges (deterministic)
function generateOptions(challenge: any, allChallenges: any[]) {
  if (challenge.type !== 'options') return challenge

  const correctAnswer = challenge.meaningInSourceLanguage
  const challengeId = challenge.id || ''
  const random = seededRandom(challengeId)
  
  // Get other answers from similar challenges
  const otherAnswers = allChallenges
    .filter(c => c.meaningInSourceLanguage && c.meaningInSourceLanguage !== correctAnswer)
    .map(c => c.meaningInSourceLanguage)
    .filter((value, index, self) => self.indexOf(value) === index) // unique
  
  // Deterministic shuffle
  const shuffledOthers = [...otherAnswers].sort((a, b) => {
    const aHash = a.charCodeAt(0)
    const bHash = b.charCodeAt(0)
    return aHash - bHash
  })
  
  // Select 3 wrong answers deterministically
  const wrongAnswers = shuffledOthers.slice(0, 3)
  
  // Create all options
  const allOptions = [
    { answer: correctAnswer, correct: true },
    ...wrongAnswers.map(answer => ({ answer, correct: false }))
  ]
  
  // Deterministic shuffle based on challenge ID
  const shuffled = allOptions.sort((a, b) => {
    const aVal = random()
    const bVal = random()
    return aVal - bVal
  })
  
  return {
    ...challenge,
    options: shuffled
  }
}

export default async function SkillPracticePage({ params }: Props) {
  const courseId = await getCourseId(params)
  const skillData = await getSkillChallenges(courseId, params.skillId)
  const skillTitle = await getSkillTitle(courseId, params.skillId)

  if (!skillData) {
    notFound()
  }

  const courseUrl = `/${params.sourceLanguageCode}/courses/${params.targetLanguageCode}`

  return (
    <PracticeSession
      challenges={skillData.challenges}
      skillTitle={skillTitle}
      skillId={params.skillId}
      courseId={courseId}
      courseUrl={courseUrl}
    />
  )
}

