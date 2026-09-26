# Lånekortet – Mina sidor

Näsby biblioteks kundportal: se dina lån, reservera böcker och läs meddelanden från biblioteket.
Vue 3 + Vite + Pinia i frontenden, ett Express-API (`mock-api/`) med JWT-inloggning bakom.

## Kom igång

    cp .env.example .env     # lokala inställningar för API:t
    npm install
    npm run api              # API:t på http://localhost:4000 (egen terminal)
    npm run dev              # appen på http://localhost:5173

Testkonton: `maja.lind@example.com` / `bok-maja` och `omar.haddad@example.com` / `bok-omar`.

## Kvalitet

    npm run test:run         # enhets- och komponenttester (Vitest)
    npm run build            # produktionsbygge till dist/
    npm run preview          # serverar dist/ på http://localhost:4173 (API:t måste köra)
    docker build -t lanekortet . && docker run --rm -p 8080:80 lanekortet

## Labbprovet

Uppgiften står i `PROV.md` (samma text som i Canvas). Rättningen kör du själv med `npm run prov`,
och den körs automatiskt av GitHub Actions vid varje push.
