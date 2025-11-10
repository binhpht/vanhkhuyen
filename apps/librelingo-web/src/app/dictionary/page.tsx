'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type DictionaryEntry = {
  vietnamese: string
  bru: string
  pronunciation: string
  example_bru: string
  example_pronunciation: string
  example_vietnamese: string
}

export default function DictionaryPage() {
  const [entries, setEntries] = useState<DictionaryEntry[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [searchMode, setSearchMode] = useState<'vi-bru' | 'bru-vi'>('vi-bru')

  useEffect(() => {
    fetch('/bru_dictionary.json')
      .then(res => res.json())
      .then(data => {
        setEntries(data)
        setIsLoading(false)
      })
      .catch(error => {
        console.error('Error loading dictionary:', error)
        setIsLoading(false)
      })
  }, [])

  const filteredEntries = entries.filter(entry => {
    if (!searchTerm) return false
    
    const term = searchTerm.toLowerCase()
    
    if (searchMode === 'vi-bru') {
      return entry.vietnamese.toLowerCase().includes(term)
    } else {
      return entry.bru.toLowerCase().includes(term)
    }
  }).slice(0, 50) // Limit to 50 results

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">📖</div>
          <h1 className="text-4xl font-bold mb-2">Từ điển Brũ - Việt</h1>
          <p className="text-muted-foreground">
            Tra cứu từ vựng tiếng Brũ Vân Kiều ({entries.length.toLocaleString('vi-VN')} từ)
          </p>
        </div>

        {/* Search Mode Toggle */}
        <div className="flex justify-center gap-2 mb-4">
          <Button
            variant={searchMode === 'vi-bru' ? 'default' : 'outline'}
            onClick={() => setSearchMode('vi-bru')}
          >
            Việt → Brũ
          </Button>
          <Button
            variant={searchMode === 'bru-vi' ? 'default' : 'outline'}
            onClick={() => setSearchMode('bru-vi')}
          >
            Brũ → Việt
          </Button>
        </div>

        {/* Search Box */}
        <div className="mb-6">
          <Input
            type="text"
            placeholder={searchMode === 'vi-bru' ? 'Nhập từ tiếng Việt...' : 'Nhập từ tiếng Brũ...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-lg p-6"
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Đang tải từ điển...</p>
          </div>
        )}

        {/* Search Results */}
        {!isLoading && searchTerm && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Tìm thấy {filteredEntries.length} kết quả {filteredEntries.length === 50 && '(hiển thị 50 đầu tiên)'}
            </p>

            {filteredEntries.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">Không tìm thấy kết quả nào</p>
                </CardContent>
              </Card>
            )}

            {filteredEntries.map((entry, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-primary mb-1">
                        {searchMode === 'vi-bru' ? entry.vietnamese : entry.bru}
                      </CardTitle>
                      <div className="text-lg font-medium">
                        {searchMode === 'vi-bru' ? entry.bru : entry.vietnamese}
                      </div>
                      {entry.pronunciation && (
                        <div className="text-sm text-muted-foreground mt-1">
                          🔊 Phát âm: {entry.pronunciation}
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                {(entry.example_bru || entry.example_vietnamese) && (
                  <CardContent>
                    <div className="bg-muted/50 p-4 rounded-md space-y-2">
                      <p className="text-sm font-medium">Ví dụ:</p>
                      {entry.example_bru && (
                        <p className="text-sm">
                          <span className="font-medium">Brũ:</span> {entry.example_bru}
                        </p>
                      )}
                      {entry.example_pronunciation && (
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Phát âm:</span> {entry.example_pronunciation}
                        </p>
                      )}
                      {entry.example_vietnamese && (
                        <p className="text-sm">
                          <span className="font-medium">Việt:</span> {entry.example_vietnamese}
                        </p>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Initial State */}
        {!isLoading && !searchTerm && (
          <Card className="bg-muted/30">
            <CardContent className="p-12 text-center">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-lg font-medium mb-2">Bắt đầu tra từ</p>
              <p className="text-sm text-muted-foreground">
                Nhập từ vào ô tìm kiếm bên trên để tra cứu từ điển
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

