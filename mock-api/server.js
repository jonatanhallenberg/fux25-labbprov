// Lånekortets mock-API. Körs lokalt med `npm run api`, lyssnar på PORT (standard 4000).
//
// Inloggning: e-post + lösenord → JWT i svaret. Varje skyddad endpoint kräver
// Authorization: Bearer <token>.
const express = require('express')
const crypto = require('node:crypto')
const jwt = require('jsonwebtoken')

try {
  process.loadEnvFile()
} catch {
  // ingen .env – helt normalt i CI och i en container
}

// ---------------------------------------------------------------------------
// Konfiguration
// ---------------------------------------------------------------------------
// TODO: flytta till .env innan lansering /byrån
const JWT_SECRET = 'lanekortet'
const TOKEN_TTL = process.env.TOKEN_TTL || '30m'
const PORT = Number(process.env.PORT || 4000)

// ---------------------------------------------------------------------------
// Data. Lösenorden lagras som scrypt-hash (mock-api/hash-password.js gör en ny).
// Testkonton: maja.lind@example.com / bok-maja · omar.haddad@example.com / bok-omar
// ---------------------------------------------------------------------------
const members = [
  {
    id: 1,
    memberNo: 'L-10423',
    email: 'maja.lind@example.com',
    passwordHash: 'scrypt$7b0b28bdccf03c772c232ac2453d3777$cb7a357c41d6587ee41cb6c1dc14c1638542c98caf66faa7add17563023780cc1e3562f9422c2c559f31593f64143defca85a450f08c1303db12b20e2653974d',
    name: 'Maja Lind'
  },
  {
    id: 2,
    memberNo: 'L-20881',
    email: 'omar.haddad@example.com',
    passwordHash: 'scrypt$3a0ef70972dbcc8a14de475ef7ffa273$083818ace687e10dc70f8876c77367bc4691af0ae92a8f4446d4f1b66163bf1b4a2e32ace1d92f13db143cf7d2e9f6eff5ec9c08e8e711a399fbe1a69f96d3c4',
    name: 'Omar Haddad'
  }
]

const loansByMember = {
  'L-10423': [
    { id: 101, title: 'Gösta Berlings saga', author: 'Selma Lagerlöf', due: '2026-10-28', returned: false },
    { id: 102, title: 'Doktor Glas', author: 'Hjalmar Söderberg', due: '2026-10-09', returned: false },
    { id: 103, title: 'Kallocain', author: 'Karin Boye', due: '2026-09-20', returned: true },
    { id: 104, title: 'Mio, min Mio', author: 'Astrid Lindgren', due: '2026-11-02', returned: false }
  ],
  'L-20881': [
    { id: 201, title: 'Röde Orm', author: 'Frans G. Bengtsson', due: '2026-10-19', returned: false },
    { id: 202, title: 'Aniara', author: 'Harry Martinson', due: '2026-09-30', returned: true }
  ]
}

const historyByMember = {
  'L-10423': { months: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt'], values: [3, 5, 2, 4, 4, 6, 3, 2, 7, 5, 4, 3] },
  'L-20881': { months: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt'], values: [1, 2, 0, 1, 3, 2, 1, 0, 2, 2, 1, 1] }
}

const messagesByMember = {
  'L-10423': [
    { id: 1001, date: '2026-10-06', from: 'Näsby bibliotek', text: 'Doktor Glas ska tillbaka senast 9 oktober. Du kan förlänga lånet på Mina sidor.', html: '<strong>Doktor Glas</strong> ska tillbaka senast 9 oktober. Du kan förlänga lånet på Mina sidor.' },
    { id: 1002, date: '2026-09-22', from: 'Näsby bibliotek', text: 'Tack för att du lämnade tillbaka Kallocain i tid.', html: 'Tack för att du lämnade tillbaka <strong>Kallocain</strong> i tid.' }
  ],
  'L-20881': [
    { id: 2001, date: '2026-10-01', from: 'Näsby bibliotek', text: 'Din reservation av Röde Orm finns att hämta i disken.', html: 'Din reservation av <strong>Röde Orm</strong> finns att hämta i disken.' }
  ]
}

const publicMember = ({ id, memberNo, email, name }) => ({ id, memberNo, email, name })

// ---------------------------------------------------------------------------
// Lösenord: scrypt med salt, jämförelse i konstant tid
// ---------------------------------------------------------------------------
const verifyPassword = (password, stored) => {
  const [algo, salt, hash] = String(stored).split('$')
  if (algo !== 'scrypt' || !salt || !hash) return false
  const derived = crypto.scryptSync(password, salt, 64)
  const expected = Buffer.from(hash, 'hex')
  return derived.length === expected.length && crypto.timingSafeEqual(derived, expected)
}

// ---------------------------------------------------------------------------
// Appen
// ---------------------------------------------------------------------------
const app = express()
app.use(express.json())

app.get('/healthz', (req, res) => res.json({ ok: true }))

app.post('/api/login', (req, res) => {
  const { email, password } = req.body || {}
  const member = members.find((m) => m.email === String(email || '').toLowerCase())
  // Samma svar vare sig e-posten finns eller inte – avslöja inte vilka konton som finns.
  if (!member || !verifyPassword(String(password || ''), member.passwordHash)) {
    return res.status(401).json({ error: 'Fel e-post eller lösenord' })
  }
  const token = jwt.sign({ sub: String(member.id), memberNo: member.memberNo }, JWT_SECRET, {
    expiresIn: TOKEN_TTL,
    issuer: 'lanekortet'
  })
  res.json({ token, name: member.name })
})

// Kräver en giltig token. Sätter req.member – allt efter det här litar på token, inte på klienten.
const requireLogin = (req, res, next) => {
  const header = req.get('Authorization') || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Inloggning krävs' })
  try {
    const payload = jwt.verify(token, JWT_SECRET, { issuer: 'lanekortet' })
    req.member = members.find((m) => String(m.id) === payload.sub)
    if (!req.member) return res.status(401).json({ error: 'Inloggning krävs' })
    next()
  } catch {
    res.status(401).json({ error: 'Ogiltig eller utgången token' })
  }
}

app.get('/api/user', requireLogin, (req, res) => res.json(publicMember(req.member)))

// Lån för en medlem. Frontenden skickar med memberNo (personalen ska kunna slå upp andra sen).
app.get('/api/loans', requireLogin, (req, res) => {
  const memberNo = req.query.memberNo || req.member.memberNo
  res.json(loansByMember[memberNo] || [])
})

app.get('/api/loans/history', requireLogin, (req, res) => {
  res.json(historyByMember[req.member.memberNo])
})

app.get('/api/messages', requireLogin, (req, res) => {
  res.json(messagesByMember[req.member.memberNo] || [])
})

// Reservation: skapar ett bekräftelsemeddelande med titeln i fetstil.
app.post('/api/reserve', requireLogin, (req, res) => {
  const title = String(req.body?.title || '').trim().slice(0, 200)
  if (!title) return res.status(400).json({ error: 'Titel saknas' })
  const list = messagesByMember[req.member.memberNo] || (messagesByMember[req.member.memberNo] = [])
  const message = {
    id: Date.now(),
    date: new Date().toISOString().slice(0, 10),
    from: 'Näsby bibliotek',
    text: `Vi har tagit emot din reservation av "${title}". Du får ett meddelande när boken finns att hämta.`,
    html: `Vi har tagit emot din reservation av <strong>${title}</strong>. Du får ett meddelande när boken finns att hämta.`
  }
  list.unshift(message)
  res.status(201).json(message)
})

app.listen(PORT, () => console.log(`Lånekortets mock-API lyssnar på http://localhost:${PORT}`))
