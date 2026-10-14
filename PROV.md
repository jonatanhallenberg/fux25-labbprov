# Labbprov · Lånekortet – laga fyra saker
*Torsdag 15/10 2026 · 09:00–12:00 · sal 5 · individuellt · Kursmål 1, 3, 5 och 8*

**Läs så här:** läs hela sidan en gång innan du börjar. Sedan jobbar du del för del i valfri ordning. Allt du behöver för varje del står under delen. Sist står när du är klar och hur inlämningen går till.

Näsby bibliotek har fått en ny kundportal, *Lånekortet*, levererad av en byrå. Den fungerar på byråns dator. Men pipelinen har aldrig varit grön, containern väger 1,2 GB och svarar fel, API:t läcker andras lån, och startsidan tar sju sekunder på en mobil. Du tar över. På tre timmar ska du få de fyra sakerna att fungera, och kunna förklara vad du gjorde.

## Före provet – kontrollera kvällen innan

På din dator ska följande fungera. Kör kommandona; alla ska svara utan fel.

```bash
node -v            # v22 eller nyare
git --version
docker version     # både Client och Server ska skrivas ut – Docker Desktop måste vara igång
```

Du ska vara inloggad på GitHub i browsern, och `git push` ska fungera från terminalen (samma konto som i kursen). Chrome installerat. Ladda batteriet.

## Så får du provet

1. Klockan 09:00 öppnas mallrepot [**`fux25-labbprov`**](https://github.com/jonatanhallenberg/fux25-labbprov) (länken står också i Canvas-uppgiften *Labbprov 15/10*). Klicka **Use this template → Create a new repository**. Owner: ditt eget konto. Namn: `labbprov-<ditt användarnamn>`. Välj **Private** – inte Public. Samma knapp som i övningen, men privat.
2. Ge mig läsrätt, annars kan jag inte rätta ditt prov: i ditt nya repo, **Settings → Collaborators → Add people** → `jonatanhallenberg` → *Add*. Det räcker att inbjudan syns där som *Pending* – jag accepterar den.
3. Klona ditt repo, installera och kontrollera att appen startar:

```bash
git clone <din repo-url> && cd labbprov-<användarnamn>
npm install
npm run api        # API:t på :4000 – låt det ligga i en egen terminal
npm run dev        # appen på http://localhost:5173
```

Logga in med `maja.lind@example.com` / `bok-maja`. Det finns ett konto till: `omar.haddad@example.com` / `bok-omar`.

4. Kör rättningen en första gång, så ser du utgångsläget:

```bash
npm run prov
```

Den skriver ut alla 25 checks, vad som är rött, och varför. Samma checks körs av GitHub Actions varje gång du pushar (workflowen *Autograding Tests* under fliken **Actions**). Du kan köra en del i taget: `npm run prov -- B`.

## Regler

- **AI är tillåtet** – Copilot, ChatGPT, Claude, vad du vill. Internet, kursmaterialet och dina egna anteckningar och repon också.
- **Samarbete är inte tillåtet.** Inga meddelanden, ingen kod från någon annan, ingen skärmdelning. Du sitter ensam med din dator.
- **Allt du lämnar in ska du kunna förklara.** Under provet kommer jag runt till alla, ungefär tre minuter var: jag pekar på något du lagat och ber dig förklara vad felet var, varför din ändring lagar det, och vilken princip från kursen det handlar om. Kan du inte förklara din egen ändring räknas den delen inte, oavsett vad rättningen säger.
- Rör inte `grading/` och `.github/workflows/classroom.yml`. Rättningen görs om efteråt med min kopia av dem.
- **Behåll filnamn, funktionsnamn och routes.** Rättningen letar efter `src/views/MessagesView.vue`, `src/views/DashboardView.vue`, `login` och `fetchLoans` i `src/services/api.js`, `/api/loans` och `/api/login` i API:t, samt de 18 testerna. Laga koden – döp inte om och ta inte bort.

## De fyra delarna

Varje del hör till ett kursmål. **Checks märkta ★ är kärnchecks: alla ★ i en del måste vara gröna för godkänt på den delen.** De andra ger poäng men avgör inte godkänt. Poängen ser du i `npm run prov` och i Actions.

### Del A · Pipelinen (kursmål 5)

`.github/workflows/ci.yml` finns, men har aldrig gått grön. Läs den rad för rad mot det ni byggde i vecka 3. Det finns också ett test som är rött: kör `npm run test:run`, läs felet, och laga **koden** (inte testet).

| Check | Vad som ska stämma | p |
|---|---|---|
| A1 ★ | Workflowen är giltig: `actionlint` hittar inga fel (samma kontroll som när GitHub säger *Invalid workflow file* – `npm run prov` visar felet med radnummer) | 5 |
| A2 ★ | Den körs på varje pull request och på push till `main` | 3 |
| A3 ★ | Koden hämtas med `actions/checkout` innan något `npm`-kommando körs | 3 |
| A4 ★ | Beroenden installeras med `npm ci`, inte `npm install` | 3 |
| A5 ★ | Testerna (`npm run test:run`) och bygget (`npm run build`) körs | 3 |
| A6 | Bygget sparas som artefakt: `actions/upload-artifact` med `path: dist` | 3 |
| A7 ★ | Alla 18 enhetstester är gröna (laga koden, ta inte bort tester) | 5 |

Verifiera själv: `npm run prov -- A`. På GitHub: workflowen *CI* under Actions ska bli grön på din push.

### Del B · Containern (kursmål 3)

Byråns `Dockerfile` bygger en image på över en gigabyte som kör dev-verktyg i produktion, och `nginx.conf` saknar det som får en single page-app att överleva en omladdning. Bygg om till det ni gjorde i vecka 4: **ett byggsteg med Node, ett serveringssteg med nginx, appen på port 80.** Containern ska bara innehålla frontenden; API:t körs separat.

| Check | Vad som ska stämma | p |
|---|---|---|
| B1 ★ | `docker build -t lanekortet .` lyckas | 5 |
| B2 ★ | `docker run -p 8080:80 lanekortet` → `http://localhost:8080/` ger appen (200) | 4 |
| B3 ★ | `http://localhost:8080/lan` ger också appen, inte 404 (omladdning på en underroute) | 5 |
| B4 ★ | Den färdiga imagen innehåller ingen Node. Så kontrolleras det: `docker run --rm --entrypoint node lanekortet --version` – `--entrypoint node` kör `node` i containern i stället för nginx, och det ska misslyckas med *executable file not found* | 4 |
| B5 | Imagen är under 100 MB. Rättningen läser `docker image inspect -f '{{.Size}}' lanekortet` (det uppackade innehållet); `docker image ls` kan visa en större siffra i DISK USAGE, så jämför med `inspect` | 4 |
| B6 | `.dockerignore` finns med raderna `node_modules`, `dist` och `.git` (exakt så, en per rad – fler rader får finnas) | 3 |

Verifiera själv: `npm run prov -- B` (kräver att Docker Desktop är igång). Fungerar inte Docker på din dator: pusha, så bygger Actions imagen och visar resultatet under *Autograding Tests*. Räkna med 2–3 minuter per försök.

### Del C · Säkerheten (kursmål 8)

API:t i `mock-api/server.js` och frontenden har samma sorts hål som kampanjappen i vecka 7. Hitta dem, bevisa dem gärna med `curl` som i hackerlabbet, och laga dem. Rättningen provar fem saker:

| Check | Vad som ska stämma | p |
|---|---|---|
| C1 ★ | Inloggad som Maja kan man **inte** få Omars lån, hur man än anropar `/api/loans` (vems lån avgörs av token, inte av något i adressen) | 6 |
| C2 | En token som någon signerat med hemligheten som stod i koden avvisas med 401 | 5 |
| C3 ★ | Hemligheten kommer **bara** från miljön: servern **vägrar starta** utan `JWT_SECRET` (inget standardvärde i koden), och en token signerad med miljöns `JWT_SECRET` godtas. Lägg din egen hemlighet i `.env` (mallen `.env.example` finns) – aldrig i koden | 4 |
| C4 ★ | Ett meddelande som innehåller HTML visas som text – ingen tagg blir ett element (ingen XSS) | 5 |
| C5 ★ | Token ligger **inte** i `localStorage` eller `sessionStorage` efter inloggning (ett skript på sidan läser båda lika lätt), men skickas ändå med som `Authorization: Bearer` i anropen | 5 |

Verifiera själv: `npm run prov -- C`. Tips: `mock-api/server.js` läser `.env` själv (`process.loadEnvFile`), så `npm run api` plockar upp `JWT_SECRET` därifrån; rättningen sätter sin egen hemlighet och behöver ingen `.env`. Efter C5 loggas man ut vid omladdning – det är rätt och förväntat i den här appen.

### Del D · Prestandan (kursmål 8)

Startsidan är långsam av samma skäl som Kraftlys dashboard var i vecka 8. Mät gärna före och efter som i prestandajakten (produktionsbygget: `npm run build && npm run preview`, DevTools → Performance, enhetsläge, Fast 4G, cache av). Rättningen läser byggets utskrift:

| Check | Vad som ska stämma | p |
|---|---|---|
| D1 ★ | `npm run build` lyckas | 3 |
| D2 ★ | Ingen bild i `dist/` är över 300 kB – hero-bilden ska finnas kvar, men i rätt storlek och format | 5 |
| D3 ★ | Vyerna laddas lazy: bygget ger minst tre egna chunkar för vyer (`LoginView-*.js` osv.) | 5 |
| D4 ★ | Startbundlen `index-*.js` är under 60 kB gzip | 4 |
| D5 | lodash är borta ur `package.json` och ur `src/` | 3 |
| D6 | Chart.js importeras med namngivna importer och `Chart.register(…)`, inte `chart.js/auto` (glöm inte mocken i testet) | 3 |
| D7 | Hero-bilden har `width` och `height` och inte `loading="lazy"` | 2 |

Verifiera själv: `npm run prov -- D`. `npm run test:run` ska fortfarande vara grönt efteråt.

## Inlämning

- Allt ska vara **pushat till `main` i ditt repo `labbprov-<användarnamn>` senast 12:00.** Det som ligger där då är det som rättas; det spelar ingen roll hur många gånger du pushat innan. Tiden räknas från när GitHub tog emot pushen, inte från tiden på dina commits.
- Repot ska vara **privat**, och `jonatanhallenberg` ska vara inbjuden (steg 2 under *Så får du provet*).
- Committa i små steg medan du jobbar (t.ex. en commit per lagat fel). Det är din historik jag tittar på när jag frågar vad du gjorde.
- I Canvas: lämna in **länken till ditt repo** som text i uppgiften *Labbprov 15/10*. Det är allt.

## Bedömning

- Godkänt på ett kursmål = alla ★-checks gröna i den delen **och** att du kunnat förklara dina ändringar i stickprovet. Del A = kursmål 5, del B = kursmål 3, del C och D = kursmål 8 (båda delarna krävs). Kursmål 1 bedöms i stickprovet: du ska kunna säga varför pipelinen, containern och mätningen finns, inte bara att de gör det.
- Poängen (0–100) är feedback till dig och mig – inte betyget.
- Får du inte godkänt på en del gör du om **den delen** vid kompletteringstillfället v. 47, inte hela provet. Besked i Canvas senast onsdag 21/10.

## Om något strular under provet

| Problem | Gör så här |
|---|---|
| Docker Desktop startar inte | Pusha – Actions bygger imagen åt dig. Säg till mig, så noterar jag det |
| `npm run prov` säger att en check inte kunde köras | Läs raderna under: de visar slutet av testets utskrift. Oftast: API:t kraschar vid start (syntaxfel i `server.js` – kör `npm run api` och läs felet), eller en fil/funktion som rättningen letar efter är omdöpt |
| GitHub Actions visar inget efter push | Vänta en minut, ladda om Actions-fliken. Kör `npm run prov` lokalt så länge |
| Du råkade skapa repot som Public | Settings → General → längst ner *Change repository visibility* → Private. Säg till mig |
| Något annat | Räck upp handen. Ligger felet utanför din dator (salens nät, GitHub nere) får du tiden tillbaka; Docker som inte startar löses via Actions och ger ingen extra tid |

## Du är klar när

`npm run prov` visar **G ✅ på alla fyra delar**, allt är pushat till `main`, repolänken ligger i Canvas – och du har fått ditt stickprov. Har du tid över: de ★-lösa checksen ger poäng, och ett kort stycke i `README.md` om vad du ändrade och varför gör stickprovet enklare för oss båda.
