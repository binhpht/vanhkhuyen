# Khóa học tiếng Brũ Vân Kiều (Bru Language Course)

Đây là khóa học tiếng Brũ Vân Kiều được xây dựng cho nền tảng LibreOLingo.

## Về ngôn ngữ Brũ

Tiếng Brũ Vân Kiều là một ngôn ngữ thiểu số ở Việt Nam, được người dân tộc Brũ Vân Kiều sử dụng chủ yếu tại khu vực miền Trung Việt Nam.

## Cấu trúc khóa học

Khóa học được chia thành 7 mô-đun chính:

### 1. **Cơ bản (Basics)**
   - Lời chào (Greetings)
   - Giới thiệu (Introductions)

### 2. **Gia đình (Family)**
   - Thành viên gia đình (Family Members)
   - Con người (People)

### 3. **Số đếm (Numbers)**
   - Số cơ bản (Basic Numbers: 1-10)
   - Đếm (Counting: 20, 30, 100, 1000)

### 4. **Động vật (Animals)**
   - Động vật nhà (Domestic Animals)
   - Động vật rừng (Wild Animals)

### 5. **Ăn uống (Food & Drink)**
   - Thức ăn cơ bản (Basic Food)
   - Hoa quả (Fruits)
   - Đồ uống (Drinks)

### 6. **Thiên nhiên (Nature)**
   - Phong cảnh (Landscape)
   - Thời tiết (Weather)
   - Cây cối (Plants)

### 7. **Sinh hoạt hàng ngày (Daily Life)**
   - Hoạt động hàng ngày (Daily Activities)
   - Ở trường (At School)

## Cách sử dụng

### Với LibreOLingo

1. Cài đặt LibreOLingo (xem hướng dẫn tại https://librelingo.app)
2. Sao chép thư mục `bru-course` vào thư mục khóa học của LibreOLingo
3. Build khóa học:
```bash
librelingo-json-export --path bru-course
```

### Cấu trúc file

```
bru-course/
├── course.yaml              # Cấu hình chính của khóa học
├── basics/                  # Mô-đun Cơ bản
│   ├── module.yaml
│   └── skills/
│       ├── greetings.yaml
│       └── introductions.yaml
├── family/                  # Mô-đun Gia đình
├── numbers/                 # Mô-đun Số đếm
├── animals/                 # Mô-đun Động vật
├── food/                    # Mô-đun Ăn uống
├── nature/                  # Mô-đun Thiên nhiên
└── daily-life/              # Mô-đun Sinh hoạt
```

## Nguồn dữ liệu

Khóa học này được xây dựng dựa trên các tài liệu từ điển Brũ-Việt, bao gồm:
- Từ vựng cơ bản
- Cụm từ thông dụng
- Phiên âm
- Ví dụ câu

## Đóng góp

Nếu bạn muốn đóng góp thêm nội dung hoặc sửa lỗi, vui lòng:
1. Kiểm tra cấu trúc YAML
2. Đảm bảo tính chính xác của từ vựng
3. Thêm ví dụ câu và ngữ cảnh sử dụng

## Giấy phép

Khóa học này được phát hành theo giấy phép Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0).

## Thông tin thêm

Để biết thêm về ngôn ngữ Brũ Vân Kiều và văn hóa của người dân tộc này, vui lòng tham khảo các nguồn tài liệu về các dân tộc thiểu số Việt Nam.

