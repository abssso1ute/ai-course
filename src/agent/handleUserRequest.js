import { analyzeIntent } from './agentCore'
import { useParkingMapStore } from '../stores/parkingMapStore'
import { useBookingStore } from '../stores/bookingStore'
import { useChatStore } from '../stores/chatStore'

/**
 * Оркестратор: анализ намерения → действия сторов → ответ ассистента.
 * @param {string} message
 */
export function handleUserRequest(message) {
  const parking = useParkingMapStore()
  const booking = useBookingStore()
  const chat = useChatStore()

  const { intent, params } = analyzeIntent(message)

  const reply = (text) => chat.pushAssistant(text)

  if (intent === 'unknown') {
    reply(
      'Не понял запрос. Попробуйте: «Найди свободное место у входа №3», «Паркуйся дешевле», «Забронируй на 2 часа с 15:00», «Где моё бронирование?» или «Отмени бронирование».'
    )
    return
  }

  if (intent === 'where') {
    const b = booking.activeBooking
    if (!b) {
      reply('Активного бронирования нет.')
      return
    }
    reply(
      `Ваша бронь: место ${b.spotId}, с ${new Date(b.start).toLocaleString('ru-RU')} по ${new Date(b.end).toLocaleString('ru-RU')}.`
    )
    parking.setHighlightedSpotId(b.spotId)
    return
  }

  if (intent === 'cancel') {
    const b = booking.activeBooking
    if (!b) {
      reply('Отменять нечего — бронирования нет.')
      return
    }
    parking.releaseSpot(b.spotId)
    booking.cancelBooking()
    chat.clearPendingBook()
    parking.setHighlightedSpotId(null)
    reply('Бронирование отменено, место снова доступно (если датчики не заняли его).')
    return
  }

  if (intent === 'cheapest') {
    const spot = parking.findCheapestFree()
    if (!spot) {
      reply('Сейчас нет свободных мест с известной ценой.')
      parking.setHighlightedSpotId(null)
      chat.setPendingBookSpotId(null)
      return
    }
    parking.setHighlightedSpotId(spot.id)
    chat.setPendingBookSpotId(spot.id)
    reply(
      `Самое дешёвое свободное место сейчас: ${spot.id} (${spot.price} ₽/ч). Нажмите «Забронировать», чтобы зафиксировать.`
    )
    return
  }

  if (intent === 'find') {
    const entranceId = params.entranceId || 3
    const spot = parking.findClosestSpot(entranceId)
    if (!spot) {
      reply(`У входа №${entranceId} нет свободных мест поблизости. Попробуйте другой вход или подождите.`)
      parking.setHighlightedSpotId(null)
      chat.setPendingBookSpotId(null)
      return
    }
    parking.setHighlightedSpotId(spot.id)
    chat.setPendingBookSpotId(spot.id)
    reply(
      `Нашёл место ${spot.id} рядом с входом №${entranceId} (${spot.price} ₽/ч). Могу забронировать — нажмите «Забронировать» или напишите «забронируй на N часов».`
    )
    return
  }

  if (intent === 'book') {
    const spotId = chat.pendingBookSpotId || parking.highlightedSpotId
    if (!spotId) {
      reply('Сначала попросите найти место или выберите его на карте запросом «найди у входа №…».')
      return
    }
    const spot = parking.spots.find((s) => s.id === spotId)
    if (!spot || spot.status !== 'free') {
      reply('Это место сейчас недоступно для брони. Попросите найти другое.')
      chat.setPendingBookSpotId(null)
      return
    }
    const duration = params.durationHours ?? 2
    const ok = parking.reserveSpot(spotId)
    if (!ok) {
      reply('Не удалось забронировать — место уже занято.')
      return
    }
    booking.createBooking({
      spotId,
      durationHours: duration,
      startHour: params.startHour ?? null
    })
    chat.clearPendingBook()
    reply(`Готово: место ${spotId} забронировано на ${duration} ч. Детали — в блоке «Моё бронирование».`)
    return
  }

  reply('Команда пока не поддерживается в этом MVP.')
}
