export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Logo and Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🐦</span>
              <div>
                <div className="font-bold">Vành Khuyên</div>
                <div className="text-xs text-muted-foreground">Cùng khám phá ngôn ngữ</div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Nền tảng học ngôn ngữ Việt Nam<br/>
              Gìn giữ và phát triển đa dạng văn hóa ngôn ngữ
            </p>
          </div>

          {/* School Info */}
          <div className="text-sm md:text-right">
            <p className="font-bold mb-2">TRƯỜNG PTDTBT TH&THCS SỐ 1 KIM THỦY</p>
            <p className="text-muted-foreground mb-1">
              📍 Địa chỉ: Kim Thủy - Lệ Thủy - Quảng Trị
            </p>
            <p className="text-muted-foreground mb-2">
              📧 Email: <a href="mailto:th_thcsso1kimthuy@lethuy.edu.vn" className="hover:text-primary">
                th_thcsso1kimthuy@lethuy.edu.vn
              </a>
            </p>
            <p className="text-xs text-muted-foreground">
              © {currentYear} Bản quyền thuộc về nhà trường
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

