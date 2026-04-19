/**
 * Клиентский разбор намерений без вызова внешней LLM.
 * @param {string} raw
 * @returns {{ intent: 'find'|'book'|'cancel'|'where'|'cheapest'|'unknown', params: Record<string, unknown> }}
 */
export function analyzeIntent(raw) {
  const text = String(raw || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()

  if (!text) {
    return { intent: 'unknown', params: {} }
  }

  const params = {}

  const hourMatch = text.match(/с\s+(\d{1,2})(?::00)?\b/)
  if (hourMatch) {
    params.startHour = Math.min(23, Math.max(0, parseInt(hourMatch[1], 10)))
  }

  const durMatch =
    text.match(/на\s+(\d+)\s*(час|часа|часов|ч)\b/) || text.match(/\b(\d+)\s*(час|часа|часов|ч)\b/)
  if (durMatch) {
    params.durationHours = parseInt(durMatch[1], 10)
  }

  const entranceDigit = text.match(/вход(?:а|е|у|ом|ами)?\s*№?\s*(\d)/)
  const entranceWord = text.match(/вход(?:а|е|у|ом|ами)?\s*(один|два|три|1|2|3)\b/)
  if (entranceDigit) {
    params.entranceId = parseInt(entranceDigit[1], 10)
  } else if (entranceWord) {
    const map = { один: 1, два: 2, три: 3, '1': 1, '2': 2, '3': 3 }
    params.entranceId = map[entranceWord[1]]
  }

  const hasCancel = /(отмени|отменить|сними бронь|снять бронь)/.test(text)
  const hasWhere = /(где\s+(моё|мое)\s+бронирован)/.test(text) || /(покажи\s+бронь)/.test(text)
  const hasBook = /(забронируй|забронировать|бронь)/.test(text)
  const hasFind = /(найди|найти|покажи\s+место|есть\s+место)/.test(text)
  const hasCheap =
    /(дешевле|дешёвле|подешевле|минимальн|самый\s+низкий\s+тариф|низк)/.test(text) ||
    /паркуйся\s+дешевле/.test(text)

  if (hasCancel) return { intent: 'cancel', params }
  if (hasWhere) return { intent: 'where', params }
  if (hasBook) return { intent: 'book', params }
  if (hasCheap) return { intent: 'cheapest', params }
  if (hasFind) return { intent: 'find', params }

  if (/вход/.test(text) && params.entranceId) {
    return { intent: 'find', params }
  }

  return { intent: 'unknown', params: {} }
}
