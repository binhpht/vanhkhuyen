#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Bru Dictionary Extractor
Extracts dictionary entries from Bru.txt, Bru2.txt, and Bruh.txt
and creates structured dictionary data
"""

import re
import json
import csv
from pathlib import Path
from typing import List, Dict, Any

class BruDictionaryExtractor:
    def __init__(self, base_path: str = "/Users/binhpht/Developer/VK"):
        self.base_path = Path(base_path)
        self.entries = []
        
    def parse_bru_txt(self, filename: str) -> List[Dict[str, Any]]:
        """Parse Bru.txt format with @ markers"""
        filepath = self.base_path / filename
        entries = []
        current_entry = {}
        
        with open(filepath, 'r', encoding='utf-8') as f:
            lines = f.readlines()
            
        i = 0
        while i < len(lines):
            line = lines[i].strip()
            
            # Start of new entry (Vietnamese headword)
            if line.startswith('@'):
                # Save previous entry if exists
                if current_entry:
                    entries.append(current_entry)
                
                # Extract Vietnamese headword
                vietnamese = line[1:].split('/')[0].strip()
                current_entry = {
                    'vietnamese': vietnamese,
                    'bru': '',
                    'pronunciation': '',
                    'example_bru': '',
                    'example_pronunciation': '',
                    'example_vietnamese': '',
                    'source_file': filename
                }
            
            # Extract Bru word
            elif line and 'Nghĩa Brũ' in line:
                parts = line.split(':')
                if len(parts) > 1:
                    current_entry['bru'] = parts[1].strip()
            
            # Extract pronunciation
            elif line and 'Phiên âm:' in line:
                parts = line.split(':')
                if len(parts) > 1:
                    current_entry['pronunciation'] = parts[1].strip()
            
            # Extract example
            elif line and 'Ví dụ:' in line:
                parts = line.split(':')
                if len(parts) > 1:
                    current_entry['example_bru'] = parts[1].strip()
            
            # Extract example pronunciation
            elif line and ('Cách đọc:' in line or 'Đọc:' in line):
                parts = line.split(':')
                if len(parts) > 1:
                    current_entry['example_pronunciation'] = parts[1].strip()
            
            # Extract Vietnamese translation
            elif line and 'Dịch nghĩa:' in line:
                parts = line.split(':')
                if len(parts) > 1:
                    current_entry['example_vietnamese'] = parts[1].strip()
            
            i += 1
        
        # Don't forget last entry
        if current_entry:
            entries.append(current_entry)
        
        return entries
    
    def parse_bru2_txt(self, filename: str) -> List[Dict[str, Any]]:
        """Parse Bru2.txt format (simplified)"""
        filepath = self.base_path / filename
        entries = []
        current_entry = {}
        
        with open(filepath, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        i = 0
        while i < len(lines):
            line = lines[i].strip()
            
            if line.startswith('@'):
                # Save previous entry
                if current_entry:
                    entries.append(current_entry)
                
                vietnamese = line[1:].split('/')[0].strip()
                current_entry = {
                    'vietnamese': vietnamese,
                    'bru': '',
                    'pronunciation': '',
                    'example_bru': '',
                    'example_pronunciation': '',
                    'example_vietnamese': '',
                    'source_file': filename
                }
            elif 'Phiên âm:' in line:
                current_entry['pronunciation'] = line.split(':', 1)[1].strip()
            elif i + 1 < len(lines) and not lines[i+1].strip().startswith('@') and not ':' in line and line:
                # This is likely the Bru word (on its own line)
                if not current_entry['bru']:
                    current_entry['bru'] = line
            elif 'Ví dụ:' in line:
                current_entry['example_bru'] = line.split(':', 1)[1].strip()
            elif 'Đọc:' in line:
                current_entry['example_pronunciation'] = line.split(':', 1)[1].strip()
            elif 'Nghĩa:' in line or 'Dịch nghĩa:' in line:
                current_entry['example_vietnamese'] = line.split(':', 1)[1].strip()
            
            i += 1
        
        if current_entry:
            entries.append(current_entry)
        
        return entries
    
    def extract_all(self):
        """Extract from all three files"""
        print("Extracting from Bru.txt...")
        bru_entries = self.parse_bru_txt("Bru.txt")
        print(f"  Found {len(bru_entries)} entries")
        
        print("Extracting from Bru2.txt...")
        bru2_entries = self.parse_bru2_txt("Bru2.txt")
        print(f"  Found {len(bru2_entries)} entries")
        
        print("Extracting from Bruh.txt...")
        bruh_entries = self.parse_bru_txt("Bruh.txt")
        print(f"  Found {len(bruh_entries)} entries")
        
        # Combine all entries
        self.entries = bru_entries + bru2_entries + bruh_entries
        print(f"\nTotal entries: {len(self.entries)}")
        
        # Remove duplicates based on Vietnamese + Bru word
        seen = set()
        unique_entries = []
        for entry in self.entries:
            key = (entry['vietnamese'].lower(), entry['bru'].lower())
            if key not in seen and entry['vietnamese'] and entry['bru']:
                seen.add(key)
                unique_entries.append(entry)
        
        self.entries = unique_entries
        print(f"Unique entries: {len(self.entries)}")
        
        return self.entries
    
    def save_to_json(self, output_path: str):
        """Save dictionary to JSON format"""
        output_file = Path(output_path)
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(self.entries, f, ensure_ascii=False, indent=2)
        
        print(f"Saved to {output_file}")
    
    def save_to_csv(self, output_path: str):
        """Save dictionary to CSV format"""
        output_file = Path(output_path)
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_file, 'w', encoding='utf-8', newline='') as f:
            if self.entries:
                writer = csv.DictWriter(f, fieldnames=self.entries[0].keys())
                writer.writeheader()
                writer.writerows(self.entries)
        
        print(f"Saved to {output_file}")
    
    def create_bidirectional_dict(self):
        """Create both Bru->Vietnamese and Vietnamese->Bru dictionaries"""
        bru_to_viet = {}
        viet_to_bru = {}
        
        for entry in self.entries:
            bru_word = entry['bru'].strip()
            viet_word = entry['vietnamese'].strip()
            
            if bru_word and viet_word:
                # Bru -> Vietnamese
                if bru_word not in bru_to_viet:
                    bru_to_viet[bru_word] = []
                bru_to_viet[bru_word].append(entry)
                
                # Vietnamese -> Bru
                if viet_word not in viet_to_bru:
                    viet_to_bru[viet_word] = []
                viet_to_bru[viet_word].append(entry)
        
        return bru_to_viet, viet_to_bru


if __name__ == "__main__":
    extractor = BruDictionaryExtractor()
    entries = extractor.extract_all()
    
    # Save to different formats
    extractor.save_to_json("/Users/binhpht/Developer/VK/bru-dictionary/bru_dictionary.json")
    extractor.save_to_csv("/Users/binhpht/Developer/VK/bru-dictionary/bru_dictionary.csv")
    
    print("\n✅ Dictionary extraction complete!")
    print(f"📊 Total unique entries: {len(entries)}")

