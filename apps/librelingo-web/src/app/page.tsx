import type { Metadata } from 'next'
import { Course, listAvailableCourses } from '@/data/course'
import CourseCard from './course-card'

export const metadata: Metadata = {
    title: 'Vành Khuyên - Cùng khám phá đa dạng ngôn ngữ',
    description: 'Vành Khuyên - Cùng khám phá đa dạng ngôn ngữ Việt Nam. Học tiếng Brũ, Chăm, Ê Đê và nhiều ngôn ngữ khác.',
}

export default async function Home() {
    const courseData = await listAvailableCourses()

    return (
        <div className="container mx-auto">
            <div className="py-8 text-center">
                <div className="text-6xl mb-4">🐦</div>
                <h1 className="text-5xl font-bold mb-3">Vành Khuyên</h1>
                <p className="text-xl text-primary font-medium mb-2">
                    Cùng khám phá đa dạng ngôn ngữ
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                    Học và trải nghiệm các ngôn ngữ Việt Nam
                </p>
            </div>
            <ul className="flex space-y-6 flex-col pb-6">
                {courseData.map((course) => (
                    <li key={course.id}>
                        <CourseCard course={course} />
                    </li>
                ))}
            </ul>
        </div>
    )
}
