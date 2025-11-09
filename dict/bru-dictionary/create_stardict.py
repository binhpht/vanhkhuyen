#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
StarDict Dictionary Generator for Bru Language
Creates StarDict format dictionaries (.ifo, .idx, .dict files)
"""

import json
import struct
from pathlib import Path
from typing import List, Dict
import hashlib

class StarDictGenerator:
    def __init__(self, json_path: str):
        with open(json_path, 'r', encoding='utf-8') as f:
            self.entries = json.load(f)
    
    def create_stardict(self, output_dir: str, dict_name: str, direction: str = "vi-bru"):
        """
        Create StarDict dictionary files
        direction: 'vi-bru' (Vietnamese to Bru) or 'bru-vi' (Bru to Vietnamese)
        """
        output_path = Path(output_dir)
        output_path.mkdir(parents=True, exist_ok=True)
        
        # Sort entries by headword
        if direction == "vi-bru":
            sorted_entries = sorted(self.entries, key=lambda x: x['vietnamese'].lower())
        else:
            sorted_entries = sorted(self.entries, key=lambda x: x['bru'].lower())
        
        # Create .dict file (definitions)
        dict_file = output_path / f"{dict_name}.dict"
        idx_data = []
        
        with open(dict_file, 'wb') as dict_f:
            for entry in sorted_entries:
                if direction == "vi-bru":
                    headword = entry['vietnamese']
                    definition = self._format_definition_vi_bru(entry)
                else:
                    headword = entry['bru']
                    definition = self._format_definition_bru_vi(entry)
                
                if not headword or not definition:
                    continue
                
                # Write definition to dict file
                offset = dict_f.tell()
                definition_bytes = definition.encode('utf-8')
                dict_f.write(definition_bytes)
                
                # Store index data
                idx_data.append({
                    'word': headword,
                    'offset': offset,
                    'size': len(definition_bytes)
                })
        
        # Create .idx file (index)
        idx_file = output_path / f"{dict_name}.idx"
        with open(idx_file, 'wb') as idx_f:
            for item in idx_data:
                # Write word (null-terminated)
                idx_f.write(item['word'].encode('utf-8'))
                idx_f.write(b'\x00')
                # Write offset (4 bytes, big-endian)
                idx_f.write(struct.pack('>I', item['offset']))
                # Write size (4 bytes, big-endian)
                idx_f.write(struct.pack('>I', item['size']))
        
        # Create .ifo file (metadata)
        ifo_file = output_path / f"{dict_name}.ifo"
        self._create_ifo_file(ifo_file, dict_name, len(idx_data), direction)
        
        print(f"✅ StarDict dictionary created: {dict_name}")
        print(f"   📄 {len(idx_data)} entries")
        print(f"   📁 Location: {output_path}")
    
    def _format_definition_vi_bru(self, entry: Dict) -> str:
        """Format definition for Vietnamese->Bru dictionary"""
        lines = []
        
        # Bru word
        if entry['bru']:
            lines.append(f"<b>{entry['bru']}</b>")
        
        # Pronunciation
        if entry['pronunciation']:
            lines.append(f"<i>[{entry['pronunciation']}]</i>")
        
        lines.append("")
        
        # Example
        if entry['example_bru']:
            lines.append("<u>Ví dụ:</u>")
            lines.append(f"• Bru: {entry['example_bru']}")
            if entry['example_pronunciation']:
                lines.append(f"  Đọc: {entry['example_pronunciation']}")
            if entry['example_vietnamese']:
                lines.append(f"  Nghĩa: {entry['example_vietnamese']}")
        
        return '\n'.join(lines)
    
    def _format_definition_bru_vi(self, entry: Dict) -> str:
        """Format definition for Bru->Vietnamese dictionary"""
        lines = []
        
        # Vietnamese word
        if entry['vietnamese']:
            lines.append(f"<b>{entry['vietnamese']}</b>")
        
        # Pronunciation
        if entry['pronunciation']:
            lines.append(f"<i>[{entry['pronunciation']}]</i>")
        
        lines.append("")
        
        # Example
        if entry['example_vietnamese']:
            lines.append("<u>Ví dụ:</u>")
            if entry['example_bru']:
                lines.append(f"• Bru: {entry['example_bru']}")
            lines.append(f"• Việt: {entry['example_vietnamese']}")
            if entry['example_pronunciation']:
                lines.append(f"  Đọc: {entry['example_pronunciation']}")
        
        return '\n'.join(lines)
    
    def _create_ifo_file(self, filepath: Path, dict_name: str, word_count: int, direction: str):
        """Create .ifo metadata file"""
        if direction == "vi-bru":
            bookname = "Từ điển Việt-Brũ (Vietnamese-Bru Dictionary)"
            description = "Từ điển Việt Nam - Brũ Vân Kiều | Vietnamese to Bru (Brũ Vân Kiều) Dictionary"
        else:
            bookname = "Từ điển Brũ-Việt (Bru-Vietnamese Dictionary)"
            description = "Từ điển Brũ Vân Kiều - Việt Nam | Bru (Brũ Vân Kiều) to Vietnamese Dictionary"
        
        ifo_content = f"""StarDict's dict ifo file
version=3.0.0
bookname={bookname}
wordcount={word_count}
synwordcount=0
idxfilesize={self._get_idx_filesize(filepath.parent / f"{dict_name}.idx")}
sametypesequence=m
description={description}
date=2025
author=Bru Dictionary Project
email=bru-dictionary@example.com
"""
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(ifo_content)
    
    def _get_idx_filesize(self, idx_filepath: Path) -> int:
        """Get size of idx file"""
        if idx_filepath.exists():
            return idx_filepath.stat().st_size
        return 0


def main():
    # Load JSON dictionary
    json_path = "/Users/binhpht/Developer/VK/bru-dictionary/bru_dictionary.json"
    generator = StarDictGenerator(json_path)
    
    # Create Vietnamese->Bru dictionary
    print("\n📚 Creating Vietnamese to Bru dictionary...")
    generator.create_stardict(
        output_dir="/Users/binhpht/Developer/VK/bru-dictionary/stardict",
        dict_name="vi-bru",
        direction="vi-bru"
    )
    
    # Create Bru->Vietnamese dictionary
    print("\n📚 Creating Bru to Vietnamese dictionary...")
    generator.create_stardict(
        output_dir="/Users/binhpht/Developer/VK/bru-dictionary/stardict",
        dict_name="bru-vi",
        direction="bru-vi"
    )
    
    print("\n" + "="*60)
    print("✅ StarDict dictionaries created successfully!")
    print("="*60)
    print("\n📖 How to use:")
    print("   1. Install GoldenDict or StarDict app")
    print("   2. Copy the 'stardict' folder to your dictionary directory")
    print("   3. Restart the dictionary app")
    print("\n💡 Dictionary apps that support StarDict:")
    print("   • GoldenDict (Desktop - Windows/Mac/Linux)")
    print("   • BlueDict (Android)")
    print("   • GoldenDict Mobile (iOS)")
    print("   • StarDict (Linux)")


if __name__ == "__main__":
    main()

