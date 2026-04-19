import { defineStore } from 'pinia'
import { ref } from 'vue'

function addHours(date, hours) {
  const d = new Date(date)
  d.setTime(d.getTime() + hours * 60 * 60 * 1000)
  return d
}

export const useBookingStore = defineStore('booking', () => {
  const activeBooking = ref(null)

  function createBooking({ spotId, durationHours = 2, startHour = null }) {
    const start = new Date()
    if (startHour !== null && startHour !== undefined) {
      start.setHours(Number(startHour), 0, 0, 0)
      if (start < new Date()) {
        start.setDate(start.getDate() + 1)
      }
    }
    const end = addHours(start, Number(durationHours) || 2)
    activeBooking.value = {
      spotId,
      start: start.toISOString(),
      end: end.toISOString(),
      createdAt: new Date().toISOString()
    }
    return activeBooking.value
  }

  function cancelBooking() {
    activeBooking.value = null
  }

  return {
    activeBooking,
    createBooking,
    cancelBooking
  }
})
