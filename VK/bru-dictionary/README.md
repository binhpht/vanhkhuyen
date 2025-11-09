# 📚 Từ điển Brũ Vân Kiều (Bru Dictionary)

Bộ từ điển song ngữ Việt-Brũ và Brũ-Việt toàn diện với **3,682 từ** được trích xuất từ các tài liệu từ điển Brũ Vân Kiều.

---

## 📊 Thống kê

- **Tổng số từ:** 3,682 unique entries
- **Nguồn dữ liệu:** 
  - Bru.txt: 3,644 entries
  - Bru2.txt: 1,137 entries  
  - Bruh.txt: 3,646 entries
- **Định dạng hỗ trợ:** JSON, CSV, StarDict, HTML
- **Ngôn ngữ:** Vietnamese ⇄ Bru (Brũ Vân Kiều)

---

## 🎯 Các định dạng có sẵn

### 1. **JSON Format** (Lập trình & API)
```
📁 bru_dictionary.json
```
- ✅ Dễ dàng tích hợp vào ứng dụng web/mobile
- ✅ Có đầy đủ thông tin: từ, phiên âm, ví dụ
- ✅ Cấu trúc chuẩn cho machine learning

**Cấu trúc:**
```json
{
  "vietnamese": "Chào",
  "bru": "Bánh hỡ",
  "pronunciation": "Bánh - hơ",
  "example_bru": "Bánh hỡ Avia karu",
  "example_pronunciation": "Bánh hơ a-via cà -rù",
  "example_vietnamese": "Chúng em chào cô ạ!",
  "source_file": "Bru2.txt"
}
```

### 2. **CSV Format** (Excel/Google Sheets)
```
📁 bru_dictionary.csv
```
- ✅ Mở bằng Excel, Google Sheets
- ✅ Dễ chỉnh sửa và quản lý
- ✅ Import vào database dễ dàng

### 3. **StarDict Format** (Ứng dụng từ điển)
```
📁 stardict/
  ├── vi-bru.ifo     (Vietnamese → Bru)
  ├── vi-bru.idx
  ├── vi-bru.dict
  ├── bru-vi.ifo     (Bru → Vietnamese)
  ├── bru-vi.idx
  └── bru-vi.dict
```

**Ứng dụng hỗ trợ:**
- 🖥️ **GoldenDict** (Windows/Mac/Linux) - RECOMMENDED
- 📱 **BlueDict** (Android)
- 📱 **GoldenDict Mobile** (iOS)
- 🐧 **StarDict** (Linux)

**Cách cài đặt:**
1. Tải GoldenDict: https://github.com/goldendict/goldendict/wiki/Early-Access-Builds-for-Windows
2. Copy thư mục `stardict` vào thư mục từ điển của GoldenDict
3. Restart GoldenDict
4. Bắt đầu tra từ!

### 4. **HTML Web Dictionary** (Trình duyệt)
```
📁 html/index.html
```
- ✅ Mở trực tiếp trên trình duyệt
- ✅ Không cần cài đặt
- ✅ Tìm kiếm nhanh real-time
- ✅ Responsive - hoạt động trên mobile
- ✅ Hoạt động offline

**Cách sử dụng:**
- Mở file `html/index.html` bằng Chrome/Firefox/Safari
- Hoặc truy cập: `file:///Users/binhpht/Developer/VK/bru-dictionary/html/index.html`

---

## 🚀 Hướng dẫn sử dụng nhanh

### Cho người dùng thông thường

**1. Tra từ trên Web (Đơn giản nhất)**
```bash
# Mở file này trong trình duyệt
open html/index.html
```

**2. Tra từ bằng GoldenDict (Chuyên nghiệp)**
- Cài GoldenDict
- Settings → Dictionaries → Add → Chọn thư mục `stardict`
- Tra từ như bình thường

### Cho lập trình viên

**1. Sử dụng Python**
```python
import json

# Load dictionary
with open('bru_dictionary.json', 'r', encoding='utf-8') as f:
    dictionary = json.load(f)

# Search for a word
def search_word(query):
    results = [
        entry for entry in dictionary 
        if query.lower() in entry['vietnamese'].lower() 
        or query.lower() in entry['bru'].lower()
    ]
    return results

# Example
results = search_word("chào")
for entry in results:
    print(f"{entry['vietnamese']} = {entry['bru']}")
```

**2. Sử dụng JavaScript (Web/Node.js)**
```javascript
// Load dictionary
const dictionary = require('./bru_dictionary.json');

// Search function
function searchWord(query) {
    return dictionary.filter(entry => 
        entry.vietnamese.toLowerCase().includes(query.toLowerCase()) ||
        entry.bru.toLowerCase().includes(query.toLowerCase())
    );
}

// Example
const results = searchWord("chào");
results.forEach(entry => {
    console.log(`${entry.vietnamese} = ${entry.bru}`);
});
```

**3. Tích hợp vào Mobile App**
- Copy file `bru_dictionary.json` vào assets của app
- Parse JSON và load vào SQLite hoặc realm
- Implement search functionality

---

## 📱 Đề xuất nền tảng từ điển mã nguồn mở

### 1. **GoldenDict** ⭐ RECOMMENDED
- **Platform:** Windows, macOS, Linux
- **Format:** StarDict, DSL, XDXF
- **Features:** 
  - Popup translation
  - Multiple dictionaries
  - Audio support
  - Full-text search
- **Link:** https://github.com/goldendict/goldendict

### 2. **BlueDict**
- **Platform:** Android
- **Format:** StarDict
- **Features:** 
  - Offline dictionary
  - Fast search
  - Beautiful UI
- **Link:** https://play.google.com/store/apps/details?id=cn.ssdl.bluedict

### 3. **Aard 2**
- **Platform:** Android, Desktop
- **Format:** SLOB
- **Features:**
  - Wikipedia-style
  - Offline
  - Multi-dictionary
- **Link:** http://aarddict.org/

### 4. **Kiwix**
- **Platform:** All platforms
- **Format:** ZIM
- **Features:**
  - Offline Wikipedia
  - Educational content
  - Large content support
- **Link:** https://www.kiwix.org/

### 5. **Custom Web App**
- **Platform:** Web (All devices)
- **Format:** JSON/HTML
- **Features:**
  - Full control
  - Custom features
  - Progressive Web App
- **Examples:** Provided HTML dictionary

---

## 🛠️ Scripts có sẵn

### 1. Extract Dictionary
```bash
python3 extract_dictionary.py
```
Trích xuất từ các file .txt và tạo JSON/CSV

### 2. Create StarDict
```bash
python3 create_stardict.py
```
Tạo dictionary format cho GoldenDict, BlueDict

### 3. Create HTML Dictionary
```bash
python3 create_html_dictionary.py
```
Tạo web dictionary có thể mở bằng browser

### 4. Create All Formats
```bash
python3 extract_dictionary.py
python3 create_stardict.py
python3 create_html_dictionary.py
```

---

## 📖 Cấu trúc dữ liệu

Mỗi entry trong từ điển có các trường sau:

| Field | Description | Example |
|-------|-------------|---------|
| `vietnamese` | Từ tiếng Việt | "Chào" |
| `bru` | Từ tiếng Brũ | "Bánh hỡ" |
| `pronunciation` | Phiên âm | "Bánh - hơ" |
| `example_bru` | Câu ví dụ Brũ | "Bánh hỡ Avia karu" |
| `example_pronunciation` | Phát âm ví dụ | "Bánh hơ a-via cà -rù" |
| `example_vietnamese` | Nghĩa ví dụ | "Chúng em chào cô ạ!" |
| `source_file` | Nguồn | "Bru2.txt" |

---

## 🔄 Tích hợp vào hệ thống

### A. Tích hợp vào Website

```html
<!-- Load dictionary -->
<script src="bru_dictionary.json"></script>

<!-- Search box -->
<input type="text" id="search" placeholder="Tìm từ...">
<div id="results"></div>

<script>
fetch('bru_dictionary.json')
  .then(r => r.json())
  .then(dict => {
    document.getElementById('search').addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const results = dict.filter(entry => 
        entry.vietnamese.toLowerCase().includes(query) ||
        entry.bru.toLowerCase().includes(query)
      );
      displayResults(results);
    });
  });
</script>
```

### B. Tích hợp vào React Native

```javascript
import dictionary from './bru_dictionary.json';
import { useState } from 'react';

function DictionaryScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  
  const searchWord = (text) => {
    setQuery(text);
    const filtered = dictionary.filter(entry =>
      entry.vietnamese.toLowerCase().includes(text.toLowerCase()) ||
      entry.bru.toLowerCase().includes(text.toLowerCase())
    );
    setResults(filtered);
  };
  
  return (
    <View>
      <TextInput 
        placeholder="Tìm từ..."
        onChangeText={searchWord}
        value={query}
      />
      <FlatList
        data={results}
        renderItem={({item}) => (
          <View>
            <Text>{item.vietnamese} = {item.bru}</Text>
          </View>
        )}
      />
    </View>
  );
}
```

### C. Tích hợp vào Flutter

```dart
import 'dart:convert';
import 'package:flutter/services.dart';

class DictionaryService {
  List<dynamic> dictionary = [];
  
  Future<void> loadDictionary() async {
    String data = await rootBundle.loadString('assets/bru_dictionary.json');
    dictionary = json.decode(data);
  }
  
  List<dynamic> searchWord(String query) {
    return dictionary.where((entry) =>
      entry['vietnamese'].toLowerCase().contains(query.toLowerCase()) ||
      entry['bru'].toLowerCase().contains(query.toLowerCase())
    ).toList();
  }
}
```

---

## 📝 Đóng góp

Nếu bạn muốn đóng góp:

1. **Thêm từ mới:** Thêm vào file JSON theo cấu trúc hiện có
2. **Sửa lỗi:** Chỉnh sửa entries không chính xác
3. **Thêm phiên âm:** Bổ sung pronunciation cho từ thiếu
4. **Thêm ví dụ:** Bổ sung examples cho từ

### Format khi thêm từ:
```json
{
  "vietnamese": "Từ tiếng Việt",
  "bru": "Từ tiếng Brũ",
  "pronunciation": "Phiên âm",
  "example_bru": "Câu ví dụ Brũ",
  "example_pronunciation": "Phát âm ví dụ",
  "example_vietnamese": "Dịch nghĩa ví dụ",
  "source_file": "manual_addition"
}
```

---

## 📜 Giấy phép

Dự án này được phát hành theo giấy phép **CC BY-SA 4.0** (Creative Commons Attribution-ShareAlike 4.0)

- ✅ Tự do sử dụng
- ✅ Tự do chia sẻ
- ✅ Tự do chỉnh sửa
- ⚠️ Phải ghi nguồn
- ⚠️ Phải dùng cùng license

---

## 🌟 Tính năng nổi bật

- ✅ **3,682 từ** được xác thực
- ✅ **Phiên âm đầy đủ** cho mỗi từ
- ✅ **Ví dụ thực tế** với cách đọc
- ✅ **Đa định dạng** (JSON, CSV, StarDict, HTML)
- ✅ **Hỗ trợ 2 chiều** (Việt→Brũ và Brũ→Việt)
- ✅ **Tìm kiếm nhanh** trong tất cả định dạng
- ✅ **Offline** - không cần internet
- ✅ **Mã nguồn mở** - free forever

---

## 📞 Liên hệ & Hỗ trợ

Nếu bạn gặp vấn đề hoặc có câu hỏi:
- 📧 Email: bru-dictionary@example.com
- 🐛 Issues: GitHub Issues
- 💬 Discussions: GitHub Discussions

---

## 🙏 Cảm ơn

Cảm ơn các tài liệu từ điển Brũ-Việt đã cung cấp dữ liệu quý báu để xây dựng dự án này.

**Bảo tồn ngôn ngữ là bảo tồn văn hóa!** 🌏

---

© 2025 Bru Dictionary Project | Vietnamese-Bru Dictionary

