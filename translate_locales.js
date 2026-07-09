const fs = require('fs')
const path = require('path')
const { translate } = require('@vitalets/google-translate-api')

const SOURCE_JSON = path.join(__dirname, 'frontend/src/locales/en.json')
const OUT_DIR     = path.join(__dirname, 'frontend/public/locales')
const TARGET_LANGS = ['hi', 'ta', 'te', 'kn', 'ml']
const ALL_LANGS    = ['en', ...TARGET_LANGS]

// Load the english base
const enData = JSON.parse(fs.readFileSync(SOURCE_JSON, 'utf8'))

ALL_LANGS.forEach(l => fs.mkdirSync(path.join(OUT_DIR, l), { recursive: true }))
fs.writeFileSync(path.join(OUT_DIR, 'en', 'translation.json'), JSON.stringify(enData, null, 2))

async function translateString(text, lang) {
  if (typeof text !== 'string' || !text.trim()) return text
  try {
    const res = await translate(text, { to: lang })
    return res.text
      .replace(/{\s*{\s*/g, '{{')
      .replace(/\s*}\s*}/g, '}}')
  } catch (err) {
    return text
  }
}

async function translateObject(obj, lang) {
  if (typeof obj === 'string') return await translateString(obj, lang)
  if (typeof obj !== 'object' || obj === null) return obj
  
  const result = {}
  
  // We process keys sequentially just to avoid completely overloading the API instantly,
  // but we process languages sequentially as well. This Node version won't hang.
  for (const key of Object.keys(obj)) {
    result[key] = await translateObject(obj[key], lang)
  }
  return result
}

async function start() {
  console.log('Starting fast translations...')
  for (const lang of TARGET_LANGS) {
    console.log(`Translating to ${lang}...`)
    try {
      const translated = await translateObject(enData, lang)
      fs.writeFileSync(
        path.join(OUT_DIR, lang, 'translation.json'),
        JSON.stringify(translated, null, 2)
      )
      console.log(`Saved ${lang}/translation.json`)
    } catch(e) {
      console.error(lang, e)
    }
  }
  console.log('All done!')
}

start()
