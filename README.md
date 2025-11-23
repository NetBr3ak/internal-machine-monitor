# 🏭 FailSafe - Symulator Hali Produkcyjnej ELPLC

> **Realistyczne demo systemu planowania produkcji**  
> Hackathon dla Małopolski 2025

[![Demo Ready](https://img.shields.io/badge/demo-ready-brightgreen)]()
[![Tech](https://img.shields.io/badge/tech-React%20%2B%20TypeScript-blue)]()
[![ELPLC](https://img.shields.io/badge/client-ELPLC-orange)]()

---

## 🎯 Projekt

**Interaktywny symulator hali produkcyjnej ELPLC** - frontendowe demo systemu FailSafe pokazujące:

✅ **Ciągły napływ zleceń** produkcyjnych (wariatory, baterie e-bike, amortyzatory)  
✅ **Inteligentny przydział zadań** - heurystyka minimalizacji makespan  
✅ **Realistyczne parametry** z hal ELPLC ($72k/h koszt przestoju)  
✅ **UI jak system MES** - zrozumiały dla planera produkcji  
✅ **Metryki real-time** - obciążenie, ETA, throughput, wykorzystanie  

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

### Trzy strefy ekranu:

**1. Górny pasek** - Globalne wskaźniki:
- Obciążenie hali (%)
- ETA zakończenia
- Zadania: ukończone / w realizacji / oczekujące
- Throughput (zadania/h)

**2. Lewy panel** - Pula zleceń:
- Oczekujące na przydział
- Kolory według priorytetu (🔴🟡🟢)
- Szacowany czas + preferowane maszyny

**3. Cztery kolumny** - Maszyny:
- Aktualne zadanie z paskiem postępu
- Kolejka zadań
- Metryki: ETA, wykorzystanie, ukończone

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
