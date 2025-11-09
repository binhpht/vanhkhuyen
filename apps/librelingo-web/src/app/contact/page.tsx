import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Liên hệ - Vành Khuyên',
  description: 'Thông tin liên hệ Trường PTDTBT TH&THCS Số 1 Kim Thủy - Quảng Trị',
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">📞</div>
          <h1 className="text-4xl font-bold mb-2">Liên hệ</h1>
          <p className="text-muted-foreground">
            Thông tin liên hệ và địa chỉ nhà trường
          </p>
        </div>

        {/* School Info Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">TRƯỜNG PTDTBT TH&THCS SỐ 1 KIM THỦY</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🏫</span>
              <div>
                <p className="font-medium mb-1">Địa chỉ</p>
                <p className="text-muted-foreground">
                  Kim Thủy - Lệ Thủy - Quảng Trị
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">📧</span>
              <div>
                <p className="font-medium mb-1">Email</p>
                <a 
                  href="mailto:th_thcsso1kimthuy@lethuy.edu.vn"
                  className="text-primary hover:underline"
                >
                  th_thcsso1kimthuy@lethuy.edu.vn
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About Project Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Về dự án Vành Khuyên</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              🐦 <strong>Vành Khuyên</strong> là nền tảng học ngôn ngữ trực tuyến được phát triển 
              bởi Trường PTDTBT TH&THCS Số 1 Kim Thủy.
            </p>
            <p>
              🎯 <strong>Mục tiêu:</strong> Gìn giữ và phát triển đa dạng ngôn ngữ Việt Nam, 
              giúp thế hệ trẻ có thể học và sử dụng tiếng mẹ đẻ một cách dễ dàng và thú vị.
            </p>
            <p>
              📚 <strong>Hiện tại:</strong> Chúng tôi cung cấp khóa học tiếng Brũ Vân Kiều với 
              hơn 3,600 từ vựng và nhiều bài tập tương tác.
            </p>
            <p>
              🌟 <strong>Tương lai:</strong> Chúng tôi sẽ tiếp tục phát triển thêm các khóa học 
              cho các ngôn ngữ khác như Chăm, Ê Đê, H'Mông, Thái, và nhiều ngôn ngữ Việt Nam khác.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

