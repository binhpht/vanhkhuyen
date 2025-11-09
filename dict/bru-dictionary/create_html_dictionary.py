#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
HTML Web Dictionary Generator for Bru Language
Creates a searchable web-based dictionary
"""

import json
from pathlib import Path
from typing import List, Dict

class HTMLDictionaryGenerator:
    def __init__(self, json_path: str):
        with open(json_path, 'r', encoding='utf-8') as f:
            self.entries = json.load(f)
    
    def create_html_dictionary(self, output_dir: str):
        """Create a single-page HTML dictionary with search"""
        output_path = Path(output_dir)
        output_path.mkdir(parents=True, exist_ok=True)
        
        # Create main HTML file
        html_file = output_path / "index.html"
        
        html_content = self._generate_html()
        
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(html_content)
        
        print(f"✅ HTML dictionary created: {html_file}")
        print(f"   📄 {len(self.entries)} entries")
        print(f"   🌐 Open in browser: file://{html_file.absolute()}")
    
    def _generate_html(self) -> str:
        """Generate complete HTML page"""
        # Sort entries
        sorted_entries = sorted(self.entries, key=lambda x: x['vietnamese'].lower())
        
        # Generate entries HTML
        entries_html = []
        for entry in sorted_entries:
            entry_html = self._format_entry_html(entry)
            entries_html.append(entry_html)
        
        # Create full HTML page
        html = f"""<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Từ điển Việt-Brũ Vân Kiều | Vietnamese-Bru Dictionary</title>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            min-height: 100vh;
        }}
        
        .container {{
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            overflow: hidden;
        }}
        
        header {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }}
        
        h1 {{
            font-size: 2.5em;
            margin-bottom: 10px;
        }}
        
        .subtitle {{
            font-size: 1.1em;
            opacity: 0.9;
        }}
        
        .search-container {{
            padding: 30px;
            background: #f8f9fa;
            border-bottom: 2px solid #e9ecef;
        }}
        
        .search-box {{
            width: 100%;
            padding: 15px 20px;
            font-size: 1.1em;
            border: 2px solid #667eea;
            border-radius: 50px;
            outline: none;
            transition: all 0.3s;
        }}
        
        .search-box:focus {{
            border-color: #764ba2;
            box-shadow: 0 0 0 3px rgba(118, 75, 162, 0.1);
        }}
        
        .stats {{
            padding: 20px 30px;
            background: #e7f3ff;
            color: #0066cc;
            text-align: center;
            font-weight: bold;
        }}
        
        .dictionary-content {{
            padding: 30px;
            max-height: 600px;
            overflow-y: auto;
        }}
        
        .entry {{
            padding: 20px;
            margin-bottom: 15px;
            border: 1px solid #e9ecef;
            border-radius: 10px;
            transition: all 0.3s;
        }}
        
        .entry:hover {{
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            transform: translateY(-2px);
        }}
        
        .entry.hidden {{
            display: none;
        }}
        
        .headword {{
            font-size: 1.5em;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 5px;
        }}
        
        .bru-word {{
            font-size: 1.3em;
            color: #764ba2;
            font-weight: bold;
            margin-bottom: 8px;
        }}
        
        .pronunciation {{
            color: #666;
            font-style: italic;
            margin-bottom: 10px;
        }}
        
        .example-section {{
            margin-top: 15px;
            padding: 15px;
            background: #f8f9fa;
            border-left: 4px solid #667eea;
            border-radius: 5px;
        }}
        
        .example-title {{
            font-weight: bold;
            color: #333;
            margin-bottom: 8px;
        }}
        
        .example-line {{
            margin: 5px 0;
            padding-left: 10px;
        }}
        
        .no-results {{
            text-align: center;
            padding: 40px;
            color: #999;
            font-size: 1.2em;
            display: none;
        }}
        
        footer {{
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #666;
            border-top: 1px solid #e9ecef;
        }}
        
        .toggle-buttons {{
            padding: 20px 30px;
            text-align: center;
            background: #f8f9fa;
        }}
        
        .toggle-btn {{
            padding: 10px 20px;
            margin: 0 10px;
            border: 2px solid #667eea;
            background: white;
            color: #667eea;
            border-radius: 25px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s;
        }}
        
        .toggle-btn.active {{
            background: #667eea;
            color: white;
        }}
        
        .toggle-btn:hover {{
            transform: translateY(-2px);
            box-shadow: 0 5px 10px rgba(0,0,0,0.1);
        }}
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>🌏 Từ điển Brũ Vân Kiều</h1>
            <p class="subtitle">Vietnamese ⇄ Bru (Brũ Vân Kiều) Dictionary</p>
        </header>
        
        <div class="stats">
            📚 Tổng số từ: {len(self.entries)} entries | Total words: {len(self.entries)}
        </div>
        
        <div class="search-container">
            <input type="text" 
                   class="search-box" 
                   id="searchInput" 
                   placeholder="🔍 Tìm kiếm từ tiếng Việt hoặc Brũ... (Search Vietnamese or Bru words...)"
                   autocomplete="off">
        </div>
        
        <div class="toggle-buttons">
            <button class="toggle-btn active" id="btnShowAll">Hiển thị tất cả</button>
            <button class="toggle-btn" id="btnShowWithExamples">Chỉ từ có ví dụ</button>
        </div>
        
        <div class="dictionary-content" id="dictionaryContent">
            {''.join(entries_html)}
        </div>
        
        <div class="no-results" id="noResults">
            ❌ Không tìm thấy kết quả / No results found
        </div>
        
        <footer>
            <p><strong>Từ điển Brũ Vân Kiều</strong> - Bảo tồn và phát triển ngôn ngữ dân tộc</p>
            <p>Vietnamese-Bru Dictionary - Preserving and developing minority languages</p>
            <p style="margin-top: 10px; font-size: 0.9em;">
                © 2025 Bru Dictionary Project | Dữ liệu từ các tài liệu từ điển Brũ-Việt
            </p>
        </footer>
    </div>
    
    <script>
        const searchInput = document.getElementById('searchInput');
        const entries = document.querySelectorAll('.entry');
        const noResults = document.getElementById('noResults');
        const btnShowAll = document.getElementById('btnShowAll');
        const btnShowWithExamples = document.getElementById('btnShowWithExamples');
        
        let currentFilter = 'all';
        
        // Search functionality
        searchInput.addEventListener('input', function() {{
            const searchTerm = this.value.toLowerCase().trim();
            let visibleCount = 0;
            
            entries.forEach(entry => {{
                const text = entry.textContent.toLowerCase();
                const hasExample = entry.querySelector('.example-section') !== null;
                
                const matchesSearch = searchTerm === '' || text.includes(searchTerm);
                const matchesFilter = currentFilter === 'all' || 
                                     (currentFilter === 'withExamples' && hasExample);
                
                if (matchesSearch && matchesFilter) {{
                    entry.classList.remove('hidden');
                    visibleCount++;
                }} else {{
                    entry.classList.add('hidden');
                }}
            }});
            
            noResults.style.display = visibleCount === 0 ? 'block' : 'none';
        }});
        
        // Filter buttons
        btnShowAll.addEventListener('click', function() {{
            currentFilter = 'all';
            btnShowAll.classList.add('active');
            btnShowWithExamples.classList.remove('active');
            searchInput.dispatchEvent(new Event('input'));
        }});
        
        btnShowWithExamples.addEventListener('click', function() {{
            currentFilter = 'withExamples';
            btnShowWithExamples.classList.add('active');
            btnShowAll.classList.remove('active');
            searchInput.dispatchEvent(new Event('input'));
        }});
        
        // Focus search box on load
        searchInput.focus();
    </script>
</body>
</html>"""
        
        return html
    
    def _format_entry_html(self, entry: Dict) -> str:
        """Format a single dictionary entry as HTML"""
        html_parts = ['<div class="entry">']
        
        # Vietnamese headword
        if entry['vietnamese']:
            html_parts.append(f'<div class="headword">{self._escape_html(entry["vietnamese"])}</div>')
        
        # Bru word
        if entry['bru']:
            html_parts.append(f'<div class="bru-word">➜ {self._escape_html(entry["bru"])}</div>')
        
        # Pronunciation
        if entry['pronunciation']:
            html_parts.append(f'<div class="pronunciation">[{self._escape_html(entry["pronunciation"])}]</div>')
        
        # Examples
        if entry['example_bru'] or entry['example_vietnamese']:
            html_parts.append('<div class="example-section">')
            html_parts.append('<div class="example-title">📝 Ví dụ / Example:</div>')
            
            if entry['example_bru']:
                html_parts.append(f'<div class="example-line"><strong>Bru:</strong> {self._escape_html(entry["example_bru"])}</div>')
            
            if entry['example_pronunciation']:
                html_parts.append(f'<div class="example-line"><strong>Đọc:</strong> <em>{self._escape_html(entry["example_pronunciation"])}</em></div>')
            
            if entry['example_vietnamese']:
                html_parts.append(f'<div class="example-line"><strong>Nghĩa:</strong> {self._escape_html(entry["example_vietnamese"])}</div>')
            
            html_parts.append('</div>')
        
        html_parts.append('</div>')
        
        return '\n'.join(html_parts)
    
    def _escape_html(self, text: str) -> str:
        """Escape HTML special characters"""
        return (text.replace('&', '&amp;')
                   .replace('<', '&lt;')
                   .replace('>', '&gt;')
                   .replace('"', '&quot;')
                   .replace("'", '&#39;'))


def main():
    json_path = "/Users/binhpht/Developer/VK/bru-dictionary/bru_dictionary.json"
    generator = HTMLDictionaryGenerator(json_path)
    
    print("\n🌐 Creating HTML web dictionary...")
    generator.create_html_dictionary("/Users/binhpht/Developer/VK/bru-dictionary/html")
    
    print("\n" + "="*60)
    print("✅ HTML dictionary created successfully!")
    print("="*60)
    print("\n📖 How to use:")
    print("   • Open index.html in any web browser")
    print("   • Works offline - no internet needed")
    print("   • Search functionality built-in")
    print("   • Mobile-friendly responsive design")


if __name__ == "__main__":
    main()

