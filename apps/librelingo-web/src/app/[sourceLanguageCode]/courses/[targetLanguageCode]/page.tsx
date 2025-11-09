import { getCourseDetail, getCourseId, listAvailableCourses, getCourseData } from "@/data/course"
import { CourseModules } from "@/components/CourseModules"

export async function generateStaticParams() {
  const courses = await listAvailableCourses()

  return courses.map((course) => ({
    sourceLanguageCode: course.uiLanguage,
    targetLanguageCode: course.languageCode,
  }))
}

type Props = {
  params: {
    sourceLanguageCode: string
    targetLanguageCode: string
  }
}

export default async function CourseHomePage({params}: Props) {
  const courseId = await getCourseId(params)
  const detail = await getCourseDetail(courseId)
  const courseData = await getCourseData(courseId)

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{detail.targetLanguage.name}</h1>
        <p className="text-muted-foreground">
          Học {detail.targetLanguage.name} qua các bài học tương tác
        </p>
      </div>

      <CourseModules
        modules={courseData.modules}
        courseId={courseId}
        sourceLanguageCode={params.sourceLanguageCode}
        targetLanguageCode={params.targetLanguageCode}
      />
    </div>
  )
}
