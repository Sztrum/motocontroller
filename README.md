# MotoController

Panel webowy do sterowania fizycznym robotem lub autkiem. Interfejs jest zaprojektowany jako prosty, techniczny cockpit: pokazuje stan połączenia, wysyła komendy ruchu i zapisuje ostatnie komendy w logu.

## Funkcje

- sterowanie kierunkami: forward, backward, left, right i stop,
- obsługa przycisków, WASD oraz strzałek,
- wysłanie `STOP` po zwolnieniu klawisza lub przycisku ruchu,
- wyraźny przycisk Emergency Stop,
- status połączenia, ostatnia komenda i log komend,
- mapowanie komend domenowych na prosty protokół urządzenia:

  | Command    | Payload |
  | ---------- | ------- |
  | `forward`  | `F`     |
  | `backward` | `B`     |
  | `left`     | `L`     |
  | `right`    | `R`     |
  | `stop`     | `S`     |

## Uruchomienie

Wymagany jest Node.js oraz npm.

```bash
npm install
npm run dev
```

Aplikacja będzie dostępna pod adresem wyświetlonym przez Vite, zwykle `http://localhost:5173`.

## Kontrole jakości

```bash
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run build
```

## Architektura

Projekt stosuje architekturę feature-based inspirowaną Bulletproof React. Kierunek zależności to:

```text
shared code -> features -> app
```

```text
src/
├── app/                 # kompozycja aplikacji i log komend
├── config/              # konfiguracja współdzielona
├── features/
│   ├── connection/      # stan oraz UI połączenia
│   └── robot-control/   # sterowanie, klawiatura i protokół komend
├── lib/serial/          # izolowany adapter transportu
└── types/               # współdzielone kontrakty TypeScript
```

Komponenty UI nie wysyłają bezpośrednio danych do urządzenia. Wywołują metody domenowe, na przykład `forward()` lub `stop()`. Dopiero kontroler robota mapuje je na payload protokołu i przekazuje do abstrakcji komunikacji.

```text
UI -> robot control -> communication abstraction -> transport -> robot
```

## Komunikacja z robotem

Docelowym transportem jest Wi-Fi. Protokół oraz adres urządzenia nie zostały jeszcze ustalone, dlatego nie należy na sztywno dodawać ich do komponentów UI.

Aktualny adapter `WebSerialClient` jest minimalnym szkieletem z początkowej wersji projektu. Ma być zastąpiony lub uzupełniony adapterem Wi-Fi, najprawdopodobniej WebSocket, po ustaleniu protokołu urządzenia. Kontrakt `SerialClient` (`connect`, `disconnect`, `write`) pozwala to zrobić bez przebudowy feature’a `robot-control`.

## Bezpieczeństwo

Robot steruje fizycznymi silnikami, dlatego:

- `STOP` ma priorytet nad ruchem,
- zwolnienie klawisza ruchu wysyła `STOP`,
- świadome rozłączenie najpierw próbuje wysłać `STOP`,
- błędy transportu są pokazywane użytkownikowi,
- nie należy dodawać ciągłego ruchu bez mechanizmu zatrzymania po stronie urządzenia.

## Stack

- React + TypeScript
- Vite
- Tailwind CSS
- ESLint + Prettier
- Vitest + React Testing Library

## Dalszy rozwój

Potencjalne kolejne kroki to adapter Wi-Fi/WebSocket, telemetry, sterowanie prędkością, monitoring baterii, sensory oraz transmisja obrazu. Te elementy nie są jeszcze implementowane.
