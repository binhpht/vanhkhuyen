import { SignInForm } from '@/components/auth/SignInForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-background to-muted/20">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="text-6xl mb-4">🐦</div>
          <CardTitle className="text-3xl">Chào mừng đến Vành Khuyên</CardTitle>
          <CardDescription className="text-base mb-2">
            Cùng khám phá đa dạng ngôn ngữ
          </CardDescription>
          <CardDescription className="text-sm">
            Đăng nhập để lưu tiến độ học tập của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignInForm />
        </CardContent>
      </Card>
    </div>
  )
}

