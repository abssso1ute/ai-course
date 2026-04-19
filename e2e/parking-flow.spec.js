import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('E2E', '1')
  })
})

test('водитель: найти место у входа 3 → забронировать → подтверждение', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByTestId('parking-grid')).toBeVisible()
  await page.getByTestId('chat-input').fill('найди свободное место у входа №3')
  await page.getByTestId('chat-send').click()
  await expect(page.getByTestId('book-button')).toBeVisible({ timeout: 15_000 })
  await page.getByTestId('book-button').click()
  await expect(page.getByTestId('booking-card')).toContainText('S-', { timeout: 10_000 })
  await expect(page.getByTestId('chat-thread')).toContainText('забронировано')
})

test('водитель: дешевле → бронь', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('chat-input').fill('паркуйся дешевле')
  await page.getByTestId('chat-send').click()
  await expect(page.getByTestId('book-button')).toBeVisible({ timeout: 15_000 })
  await page.getByTestId('book-button').click()
  await expect(page.getByTestId('booking-card')).toContainText('S-')
})

test('водитель: где бронирование после брони', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('chat-input').fill('найди место у входа 3')
  await page.getByTestId('chat-send').click()
  await page.getByTestId('book-button').click()
  await page.getByTestId('chat-input').fill('где моё бронирование?')
  await page.getByTestId('chat-send').click()
  await expect(page.getByTestId('chat-thread')).toContainText('Ваша бронь')
})

test('водитель: отмена бронирования', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('chat-input').fill('найди у входа 2')
  await page.getByTestId('chat-send').click()
  await page.getByTestId('book-button').click()
  await page.getByTestId('chat-input').fill('отмени бронирование')
  await page.getByTestId('chat-send').click()
  await expect(page.getByTestId('booking-card')).toContainText('Пока нет активной брони')
})

test('админ: ленивая страница доступна', async ({ page }) => {
  await page.goto('/admin')
  await expect(page.getByTestId('admin-page')).toBeVisible()
  await page.getByTestId('admin-price').fill('100')
  await page.getByRole('button', { name: 'Сохранить' }).click()
  await expect(page.getByTestId('admin-toast')).toContainText('Тариф')
})
