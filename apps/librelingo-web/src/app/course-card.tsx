import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Course } from '@/data/course'
import Link from 'next/link'

type Props = {
    course: Course
}

export default function CourseCard(props: Props) {
    const { course } = props
    const coursePageUrl = `/${course.uiLanguage}/courses/${course.languageCode}`

    return (
        <Card className="hover:shadow-xl transition-shadow border-2">
            <CardHeader>
                <div className="flex items-center gap-4 mb-2">
                    <div className="text-5xl">🌟</div>
                    <div className="flex-1">
                        <CardTitle className="text-2xl mb-1">{course.languageName}</CardTitle>
                        <CardDescription className="text-sm">
                            Khóa học cho người nói tiếng Việt
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">🎯</span>
                        <span>Học qua bài tập tương tác</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xl">📚</span>
                        <span>Từ vựng và cụm từ thông dụng</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xl">💾</span>
                        <span>Ghi nhớ tiến độ học tập</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button asChild className="w-full" size="lg">
                    <Link href={coursePageUrl}>Bắt đầu học →</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}
