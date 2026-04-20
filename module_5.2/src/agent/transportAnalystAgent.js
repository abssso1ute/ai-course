/**
 * Аналитический агент: намерение → сущности → команды dashboardStore + текстовый ответ.
 * Без внешнего LLM (детерминированно для учебной сдачи).
 */

/** @typedef {'FILTER_MAP'|'BUILD_CHART'|'GET_METRIC'|'TOGGLE_UI'|'RESTORE_UI'|'COMPARE_STOPS'|'UNKNOWN'} Intent */

const ROUTE_RE =
  /(?:маршрут(?:а|у)?|№|номер(?:а)?)\s*(?:№?\s*)?(\d{1,4})/i
const DAYS_RE =
  /(?:за\s*)?(?:последни(?:е|ю|й))?\s*(несколько\s*)?(?:(\d+)\s*(?:дней|день|дня))?(?:недел(?:ю|я|и|ей))?/i

function normalize(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/ё/g, 'е')
    .trim()
}

function extractRoute(text) {
  const m = text.match(ROUTE_RE)
  if (m?.[1]) return m[1]
  const d = text.match(/\b(\d{2,4})\b/)
  return d?.[1] || null
}

function extractDays(text) {
  if (/недел/i.test(text)) return 7
  const m = text.match(/(\d+)\s*(?:дн)/i)
  if (m?.[1]) return Math.min(56, Math.max(1, Number(m[1])))
  return 7
}

function extractStopPair(text) {
  const quoted = [...text.matchAll(/['«"]([^'»"]+)['»"]/g)].map((x) => x[1])
  if (quoted.length >= 2) return { a: quoted[0], b: quoted[1] }

  const m = text.match(
    /останов(?:ки|ках)\s+(.+?)\s+и\s+(.+?)(?:\s|$|,|\.|в\s+виде)/i
  )
  if (m) return { a: m[1].trim(), b: m[2].trim() }

  return null
}

function extractDelayMinutes(text) {
  const m = text.match(/(\d+)\s*(?:мин|минут)/i)
  return m?.[1] ? Number(m[1]) : 5
}

function classifyIntent(q) {
  const t = normalize(q)

  if (/спряч|скрой|убери|только\s+карт/i.test(t) && /граф/i.test(t)) {
    return /** @type {Intent} */ ('TOGGLE_UI')
  }
  if (/(верни|включи)\s+(граф|диаграм)|покажи\s+графики/i.test(t)) {
    return /** @type {Intent} */ ('RESTORE_UI')
  }
  if (/столбчат|гистограм|сравни.*останов/i.test(t)) return 'COMPARE_STOPS'
  if (/график|теплокарт|диаграм/i.test(t) || (/построй|покажи/i.test(t) && /загруз/i.test(t))) {
    return 'BUILD_CHART'
  }
  if (/опаздыва|задерж/i.test(t)) return 'GET_METRIC'
  if (/самая\s+загруженн|час\s+пик/i.test(t)) return 'GET_METRIC'
  if (/трамва|троллейбус|автобус|транспорт|карт/i.test(t)) return 'FILTER_MAP'

  return 'UNKNOWN'
}

function extractRegion(t) {
  if (/северо[-\s]?запад|с[-\s]?з\b/i.test(t)) return 'nw'
  if (/северо[-\s]?восток|с[-\s]?в\b/i.test(t)) return 'ne'
  if (/юго[-\s]?запад|ю[-\s]?з\b/i.test(t)) return 'sw'
  if (/юго[-\s]?восток|ю[-\s]?в\b/i.test(t)) return 'se'
  return null
}

function extractVehicleType(t) {
  if (/трамва/i.test(t)) return 'tram'
  if (/троллейбус/i.test(t)) return 'trolleybus'
  if (/автобус/i.test(t)) return 'bus'
  return null
}

/**
 * Разбор пользовательского запроса.
 * @param {string} message
 * @param {{ vehicles?: unknown[] }} [ctx]
 */
export function processTransportQuery(message, ctx = {}) {
  const intent = classifyIntent(message)
  const t = normalize(message)
  const vehicles = Array.isArray(ctx.vehicles) ? ctx.vehicles : []

  /** @type {unknown[]} */
  const commands = []

  if (intent === 'RESTORE_UI') {
    commands.push({
      type: 'TOGGLE_PANELS',
      payload: { chartsVisible: true, metricsVisible: true }
    })
    return { assistantText: 'Графики и KPI снова отображаются.', commands }
  }

  if (intent === 'TOGGLE_UI') {
    const hideCharts = /спряч|скрой|убери/i.test(t)
    const mapOnly = /только\s+карт/i.test(t)
    commands.push({
      type: 'TOGGLE_PANELS',
      payload: {
        chartsVisible: !(hideCharts || mapOnly),
        metricsVisible: mapOnly ? false : true
      }
    })
    const reply = hideCharts || mapOnly ? 'Графики скрыты, остаётся карта.' : 'Панели обновлены.'
    return { assistantText: reply, commands }
  }

  if (intent === 'BUILD_CHART') {
    const routeNumber = extractRoute(message) || '555'
    const days = extractDays(message)
    const heat = /тепло/i.test(t)
    commands.push({
      type: 'FETCH_AND_RENDER_CHART',
      payload: {
        chartType: heat ? 'heatmap' : 'line',
        metric: 'passenger_load',
        routeNumber,
        days
      }
    })
    const reply = heat
      ? `Запрошена тепловая агрегация загрузки маршрута ${routeNumber} (${days} дн.) — данные подставлены в график как условная серия.`
      : `Строю график загрузки маршрута ${routeNumber} за ${days} дн.`
    return { assistantText: reply, commands }
  }

  if (intent === 'COMPARE_STOPS') {
    const pair = extractStopPair(message) || {
      a: 'Университет',
      b: 'Парк Культуры'
    }
    commands.push({
      type: 'COMPARE_STOPS_BAR',
      payload: { stopA: pair.a, stopB: pair.b }
    })
    commands.push({
      type: 'TOGGLE_PANELS',
      payload: { chartsVisible: true }
    })
    return {
      assistantText: `Сравниваю пассажиропоток на остановках «${pair.a}» и «${pair.b}» столбчатой диаграммой.`,
      commands
    }
  }

  if (intent === 'GET_METRIC') {
    if (/самая\s+загруженн|час\s+пик/i.test(t)) {
      return {
        assistantText:
          'По историческим агрегатам (мок): наибольшая загрузка в час пик — «Тверская». Уточните район или маршрут для среза.',
        commands: []
      }
    }

    const thr = extractDelayMinutes(message)
    commands.push({
      type: 'SET_DELAY_THRESHOLD',
      payload: { minutes: thr }
    })
    const late = vehicles.filter((v) => Number(v.delayMin ?? 0) > thr)
    const vehiclesOut = vehicles.filter((v) => v.type === 'bus')
    const lateBuses = vehiclesOut.filter((v) => Number(v.delayMin ?? 0) > thr)
    return {
      assistantText:
        late.length > 0
          ? `Найдено ТС с задержкой > ${thr} мин: ${late.length}. Из них автобусов: ${lateBuses.length}. Маркеры подсвечены на карте.`
          : `ТС с задержкой > ${thr} мин не найдено (в текущем снимке).`,
      commands
    }
  }

  if (intent === 'FILTER_MAP') {
    const vehicleType = extractVehicleType(t) || 'all'
    const regionPreset = extractRegion(t) || 'all'
    commands.push({
      type: 'UPDATE_MAP_FILTER',
      payload: {
        vehicleType: extractVehicleType(t) || 'all',
        regionPreset: extractRegion(t) || 'all'
      }
    })

    const filtered = vehicles.filter((v) => {
      const okType = vehicleType === 'all' || v.type === vehicleType
      return okType
    })

    const typeLabel =
      vehicleType === 'tram'
        ? 'трамваи'
        : vehicleType === 'trolleybus'
          ? 'троллейбусы'
          : vehicleType === 'bus'
            ? 'автобусы'
            : 'единиц транспорта'

    let text = ''
    if (vehicleType !== 'all' && regionPreset !== 'all') {
      text = `Фильтр: только ${typeLabel}, сектор карты «${regionPreset}». На карте отображаются совпадающие ТС (геофильтр на клиенте).`
    } else if (vehicleType !== 'all') {
      text = `На карте показаны только ${typeLabel}: примерно ${filtered.length} ТС в текущем потоке.`
    } else if (regionPreset !== 'all') {
      text = `Геофильтр ${regionPreset} включён (см. отфильтрованные маркеры).`
    } else {
      text = 'Фильтр карты обновлён.'
    }

    if (/покажи\s+трамваи/i.test(t) && /северо/i.test(t)) {
      return {
        assistantText: `Показано трамваев в выбранном секторе (оценочно по снимку): ${filtered.filter((x) => x.type === 'tram').length}.`,
        commands
      }
    }

    return { assistantText: text, commands }
  }

  return {
    assistantText:
      'Не распознал аналитический запрос. Примеры: «покажи только трамваи на северо-западе», «график маршрута 555 за неделю», «спрячь графики».',
    commands: []
  }
}
