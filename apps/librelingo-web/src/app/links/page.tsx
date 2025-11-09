import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Liên kết website - Vành Khuyên',
  description: 'Các website và tài nguyên học tập hữu ích',
}

export default function LinksPage() {
  const links = [
    {
      title: 'Bộ Giáo dục và Đào tạo',
      description: 'Website chính thức của Bộ GD&ĐT Việt Nam',
      url: 'https://moet.gov.vn',
      icon: '🏛️'
    },
    {
      title: 'Sở GD&ĐT Quảng Trị',
      description: 'Sở Giáo dục và Đào tạo tỉnh Quảng Trị',
      url: 'https://sgddt.quangtri.gov.vn',
      icon: '🏫'
    },
    {
      title: 'Ethnologue - Bru',
      description: 'Thông tin về ngôn ngữ Brũ Vân Kiều',
      url: 'https://www.ethnologue.com/language/brv/',
      icon: '🌍'
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🔗</div>
          <h1 className="text-4xl font-bold mb-2">Liên kết website</h1>
          <p className="text-muted-foreground">
            Các trang web và tài nguyên hữu ích
          </p>
        </div>

        {/* Links Grid */}
        <div className="grid gap-4">
          {links.map((link, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{link.icon}</span>
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">{link.title}</CardTitle>
                    <CardDescription>{link.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    Truy cập website →
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Note */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg text-center text-sm text-muted-foreground">
          <p>
            💡 Các liên kết bên ngoài sẽ mở trong tab mới
          </p>
        </div>
      </div>
    </div>
  )
}

