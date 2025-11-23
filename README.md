# 🏭 ForgeGrid - Symulator Hali Produkcyjnej ELPLC

> **System monitoringu i planowania produkcji w czasie rzeczywistym**  
> Projekt FailSafe • Hackathon dla Małopolski 2025

[![Demo Ready](https://img.shields.io/badge/demo-ready-brightgreen)]()
[![Tech](https://img.shields.io/badge/tech-React%20%2B%20TypeScript-blue)]()
[![ELPLC](https://img.shields.io/badge/client-ELPLC-orange)]()

---

## 🎬 Landing Page - Co Robi Ten System?

**ForgeGrid** to symulator produkcji z modułem analitycznym, który pokazuje:

| Funkcja                     | Wartości                     | Opis                                                           |
| --------------------------- | ---------------------------- | -------------------------------------------------------------- |
| 🏭 **Production Monitoring** | 4 maszyny, 12 typów zadań    | Śledzenie CNC, Assembly, Test, Packaging w czasie rzeczywistym |
| 📊 **Hall Load**             | 0-100%                       | Średnie obciążenie całej hali produkcyjnej                     |
| ⚡ **Throughput**            | zadania/godzinę              | Przepustowość systemu (np. 12 zadań/hr)                        |
| ✓ **Task Status**           | Completed / Active / Waiting | Liczba zadań w każdym statusie                                 |
| ⏱️ **ETA**                   | minuty                       | Szacowany czas zakończenia wszystkich zadań                    |
| 🎯 **Machine Utilization**   | 0-100% per maszyna           | Jak efektywnie wykorzystywana jest każda maszyna               |
| 📝 **Event Log**             | 8 typów zdarzeń              | task_created, completed, breakdown, repair, alerts             |
| 📈 **Analytics Charts**      | 3 wykresy                    | Hall Load Trend, Task Throughput, Utilization Distribution     |
| 🚨 **Alert Routing**         | 4 grupy odbiorców            | Technicians, Supervisors, Managers, Quality Control            |
| 📥 **CSV Export**            | Pełna historia               | Eksport wszystkich zdarzeń do analizy                          |

### Kluczowe Liczby (Validowane z ELPLC):
- **$72,000/h** - koszt przestoju linii wariatorów
- **600 szt/h** - produkcja wariatorów (6 sek/cykl, $120/szt)
- **93% redukcja strat** - FailSafe (2 min) vs tradycyjna naprawa (30 min)
- **$4M rocznie** - potencjalne oszczędności przy 10 awariach/miesiąc

---

## 🎯 Co Robi Ten System?

**ForgeGrid** to zaawansowany symulator hali produkcyjnej z modułem analitycznym, który:

### 📊 Monitoruje Produkcję
✅ **Śledzenie 4 maszyn** w czasie rzeczywistym (CNC, Assembly, Test, Packaging)  
✅ **Ciągły napływ zleceń** - automatyczna generacja nowych zadań co 5-15 sekund  
✅ **Inteligentny przydział** - heurystyka minimalizacji makespan, nie losowość  
✅ **Symulacja awarii** - breakdown/repair z automatyczną dystrybucją zadań  
✅ **Priorytety zadań** - Critical (🔴) / Rush (🟡) / Normal (🟢)

### 📈 Zbiera Metryki
✅ **Hall Load** - obciążenie hali (0-100%)  
✅ **Throughput** - przepustowość (zadania/godzinę)  
✅ **ETA** - szacowany czas zakończenia wszystkich zadań  
✅ **Machine Utilization** - wykorzystanie każdej maszyny (%)  
✅ **Event Logging** - zapis wszystkich zdarzeń z timestampami  
✅ **Task Status** - completed / in progress / waiting

### 🎨 Prezentuje Dane
✅ **Production View** - dashboard z 4 maszynami + globalną pulą zadań  
✅ **Analytics View** - wykresy, raporty, logi zdarzeń, eksport CSV  
✅ **Real-time Updates** - aktualizacja co 0.5 minuty symulacyjnej  
✅ **UI w stylu MES** - brutalist design, czytelny dla operatorów  

---

## 🚀 Quick Start

```powershell
# Przejdź do projektu
cd production-simulator

# Zainstaluj i uruchom
npm install
npm run dev

# Otwórz http://localhost:5173
```

**Szczegółowa instrukcja:** Zobacz `production-simulator/INSTRUKCJA_URUCHOMIENIA.md`

---

## 📁 Struktura Projektu

```
hackaton/
├── production-simulator/          # ← GŁÓWNA APLIKACJA
│   ├── src/
│   │   ├── components/           # Komponenty React
│   │   ├── types.ts              # Typy TypeScript
│   │   ├── config.ts             # Konfiguracja maszyn i zadań
│   │   ├── store.ts              # Zustand store + logika symulacji
│   │   └── App.tsx               # Główny komponent
│   ├── INSTRUKCJA_URUCHOMIENIA.md
│   ├── PROJECT_README.md
│   └── package.json
│
├── README.md                      # ← TEN PLIK
├── ALGORITHMS.md                  # Opis algorytmów
├── ELPLC_RESEARCH.md              # Research firmy ELPLC
├── MURAL.md                       # Lean Canvas
├── PRESENTATION_GUIDE.md          # Przewodnik prezentacji
└── PYTANIA_DO_PREZESA.md          # Pytania walidacyjne
```

---

## 🎮 Demo Features

### 4 Maszyny Produkcyjne
- **CNC-01, CNC-02** - Frezarki wysokiej precyzji (szybkie)
- **Assembly-Line A** - Linia montażowa (normalna)
- **Test-Stand B** - Stanowisko testowe (wolniejsze)

### 12 Typów Zleceń
Realistyczne produkty ELPLC:
- 🔴 **Wariator - Obróbka** (Critical, 25 min) - automotive deadline!
- 🟡 **Bateria E-Bike - Montaż** (Rush, 40 min)
- 🟢 **Amortyzator - Spawanie** (Normal, 35 min)
- + 9 innych typów (testy EOL, kalibracja, pakowanie...)

### Algorytm Przydziału
**Heurystyka minimalizacji makespan:**
- Preferowane maszyny dla każdego typu zadania
- Obliczanie ETA dla wszystkich kandydatów
- Wybór maszyny z najmniejszym obciążeniem
- Uwzględnienie priorytetów (Critical > Rush > Normal)

**To NIE jest losowość** - to model myślenia planera produkcji.

---

## 💰 Realistyczne Parametry

### Validowane z lead produkcji ELPLC

```
Produkt: Wariatory do samochodów
├─ Wartość: $120/szt
├─ Cykl: 6 sekund
├─ Produkcja: 600 szt/h
└─ KOSZT PRZESTOJU: $72,000/GODZINĘ! ⚠️

Przykład awarii (30 min):
├─ Bez FailSafe: $36,000 strat
├─ Z FailSafe (2 min): $2,400 strat
└─ Oszczędność: $33,600 (93%)

ROI roczny: $4M przy 10 awariach/miesiąc
```

---

## 📊 Interfejs Użytkownika

### Dwa Widoki:

#### 🏭 Production View (Główny Dashboard)

**1. Górny pasek** - Globalne wskaźniki:
- **Hall Load** - aktualne obciążenie hali (0-100%)
- **ETA** - szacowany czas zakończenia wszystkich zadań
- **Completed** - liczba ukończonych zadań
- **In Progress** - zadania w realizacji
- **Waiting** - zadania czekające na przydział
- **Throughput** - zadania/godzinę (wyliczane dynamicznie)

**2. Lewy panel** - Task Pool (Pula Zleceń):
- Wszystkie zadania czekające na przydział
- Kolory według priorytetu: Critical (🔴) / Rush (🟡) / Normal (🟢)
- Dla każdego zadania: nazwa, czas trwania, preferowane maszyny
- Automatyczne znikanie po przydzieleniu do maszyny

**3. Cztery kolumny** - Maszyny:
- **Nagłówek**: nazwa maszyny, typ, prędkość (0.8x fast / 1.0x normal / 1.2x slow)
- **Current Task**: aktualne zadanie z paskiem postępu (0-100%)
- **Queue**: kolejka zadań (do 5 widocznych, reszta collapsed)
- **Breakdown Button** (⚠️): symulacja awarii z redistrybucją zadań
- **Metryki**: ETA kolejki, Utilization (%), Completed tasks

#### 📈 Analytics View (Moduł Raportowania)

**1. KPI Cards** (5 wskaźników):
- **Throughput** - zadania/hr
- **Completed** - suma ukończonych
- **In Progress** - aktywne zadania
- **Waiting** - w kolejce
- **Events Logged** - suma zdarzeń

**2. Wykresy** (3 interaktywne, time range: 5m/15m/30m/1h):
- **Hall Load Trend** (Area Chart) - obciążenie hali w czasie
- **Task Throughput** (Multi-Line) - completed/active/waiting tasks
- **Machine Utilization** (Bar Chart) - wykorzystanie każdej maszyny (%)

**3. Event Distribution** (Alert Panel):
- Liczba zdarzeń wg typu:
  - task_created, task_completed, task_started
  - machine_breakdown, machine_repaired
  - alert_sent, rebalance_triggered

**4. Notification Recipients** (Routing Alertów):
- **Technicians** (🔧) - ile alertów otrzymało
- **Supervisors** (👔) - ile notyfikacji
- **Managers** (💼) - raportowanie
- **Quality Control** (🔬) - alerty jakościowe

**5. System Event Log** (Tabela):
- 50 ostatnich zdarzeń (reversed chronological)
- Kolumny: Timestamp, Sim Time, Type, Severity, Message, Context
- Severity levels: Info / Warning / Critical
- **Eksport CSV** - pełna historia zdarzeń do pliku

---

## 🤖 Stack Technologiczny

- **React 18 + TypeScript** - UI i typowanie
- **Vite** - Dev server (ultra szybki)
- **Tailwind CSS** - Profesjonalny dark theme
- **Framer Motion** - Płynne animacje
- **Zustand** - State management (lekki)

**Dlaczego ten stack?**
✅ Nowoczesny i wydajny  
✅ Łatwe uruchomienie (npm install + npm run dev)  
✅ Typowanie = mniej błędów  
✅ Wygląd jak prawdziwy system MES  

---

## 🎯 Dla Jury Hackathonu

### Kluczowe punkty:

1. **Nie losowa symulacja** - model myślenia planera produkcji
2. **Dane z ELPLC** - validowane z lead produkcji (Kamil Małochleb)
3. **$72k/h koszt przestoju** - realne liczby (wariatory automotive)
4. **UI jak MES** - planer zrozumie w 5 sekund
5. **Komplementarność z TOMAI** - FailSafe reaguje, TOMAI monitoruje

### Scenariusz demo (3 min):

```
[0:00-0:30] Pokazanie interfejsu
[0:30-1:00] START - przydział 20 zadań
[1:00-2:00] Obserwacja symulacji, metryki
[2:00-2:30] Nowe zlecenia pojawiają się dynamicznie
[2:30-3:00] Podsumowanie: $72k/h, $4M ROI rocznie
```

---

## 📚 Dokumentacja

- **INSTRUKCJA_URUCHOMIENIA.md** - Jak uruchomić aplikację
- **PROJECT_README.md** - Szczegółowy opis projektu

---

## 🔧 Troubleshooting

### Aplikacja nie startuje?
```powershell
cd production-simulator
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
npm run dev
```

### Port zajęty?
```powershell
Stop-Process -Name node -Force
```

---

## 🎓 Co dalej? (Post-Hackathon)

### Phase 2 - Integracja
- [ ] WebSocket z TOMAI (system ELPLC)
- [ ] API dla zgłaszania awarii
- [ ] Historyczne dane produkcyjne

### Phase 3 - Zaawansowane
- [ ] Gantt chart timeline
- [ ] Multi-day planning
- [ ] Setup times między zadaniami
- [ ] Operator assignment

### Phase 4 - AI/ML
- [ ] Predykcja awarii (LSTM)
- [ ] Reinforcement Learning scheduler
- [ ] Anomaly detection

---

## 👥 Team FailSafe

**Hackathon dla Małopolski 2025**  
Projekt: **FailSafe** - System reagujący na awarie  
Klient: **ELPLC S.A.** (Tarnów)

---

## 📞 Kontakt

Pytania? Sugestie? Feedback?  
Skontaktuj się z zespołem FailSafe!

---

<div align="center">
  <h2>🏭 FailSafe Production Simulator</h2>
  <p><b>"Zero paniki. 3 sekundy. Nowy plan."</b></p>
  <p><i>Built with ❤️ for ELPLC by Team FailSafe</i></p>
  <br>
  <p>✅ Demo gotowe do prezentacji!</p>
  <p>🚀 <code>cd production-simulator && npm install && npm run dev</code></p>
</div>
