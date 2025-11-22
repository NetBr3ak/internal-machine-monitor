# 🏭 FailSafe — System Reagujący na Awarie

> **Hackathon dla Małopolski 2025** · ELPLC S.A.  
> _"Zero paniki. 3 sekundy. Nowy plan."_

[![Industry 4.0](https://img.shields.io/badge/Industry-4.0-blue)]() [![AI Powered](https://img.shields.io/badge/AI-Powered-green)]() [![ELPLC Ready](https://img.shields.io/badge/ELPLC-Ready-orange)]()

---

## 🎯 PROBLEM → ROZWIĄZANIE

### ❌ PRZED (typowa fabryka ELPLC):
```
14:35 - CNC-01 się psuje

↓ 30 minut chaosu ↓

• Planista ręcznie przelicza harmonogram
• Operatorzy nie wiedzą gdzie przejść
• Komunikacja: telefony, Excel, chaos
• 300 wariatorów nie wyprodukowanych

KOSZT: $36,000 (jedna awaria)
       = 300 sztuk × $120
```

### ✅ PO (FailSafe + TOMAI):
```
14:35:00 - CNC-01 awaria (TOMAI wykrywa)
         ↓
14:35:03 - FailSafe: nowy harmonogram
         ↓
14:35:10 - Wszyscy wiedzą co robić
         ↓
14:37:00 - Produkcja na CNC-02 rusza

OSZCZĘDNOŚĆ: $33,600 (93% redukcja strat)
            = ~280 wariatorów uratowanych
```

---

## 📺 JAK TO WYGLĄDA - GRAFICZNE DEMO

### EKRAN 1: Dashboard Operatora
```
╔══════════════════════════════════════════════════════════╗
║  FailSafe - Dashboard Operatora           14:35         ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     ║
║  │  🟢 CNC-01  │  │  🟢 CNC-02  │  │  🟢 Press-A │     ║
║  │             │  │             │  │             │     ║
║  │  Felga-L    │  │  Felga-R    │  │  Osłona     │     ║
║  │  [████░░░░] │  │  [██░░░░░░] │  │  [░░░░░░░░] │     ║
║  │  45%        │  │  12%        │  │  Czeka      │     ║
║  │             │  │             │  │             │     ║
║  │ [ZGŁOŚ      │  │             │  │             │     ║
║  │  AWARIĘ]    │  │             │  │             │     ║
║  └─────────────┘  └─────────────┘  └─────────────┘     ║
║                                                          ║
║  ┌─────────────┐                                        ║
║  │  🟡 Press-B │      Status: ✅ Wszystko działa        ║
║  │ Maintenance │      Completion: 18:30                ║
║  └─────────────┘                                        ║
╚══════════════════════════════════════════════════════════╝
```

### EKRAN 2: Operator zgłasza awarię
```
╔══════════════════════════════════════════════════════════╗
║  Zgłoś awarię - CNC-01                                  ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  Co się stało?                                          ║
║  ┌────────────────────────────────────────────────────┐ ║
║  │ Pęknięte narzędzie T12 - wymaga wymiany           │ ║
║  └────────────────────────────────────────────────────┘ ║
║                                                          ║
║  Priorytet:  ◉ Krytyczny  ○ Wysoki  ○ Normalny        ║
║                                                          ║
║              [ ZGŁOŚ AWARIĘ ]                           ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
```

### EKRAN 3: System reaguje (0.5 sekundy później)
```
╔══════════════════════════════════════════════════════════╗
║  FailSafe - Dashboard Operatora           14:35:01      ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     ║
║  │  🔴 CNC-01  │  │  🟢 CNC-02  │  │  🟢 Press-A │     ║
║  │   AWARIA!   │  │             │  │             │     ║
║  │  Felga-L    │  │  Felga-R    │  │  Osłona     │     ║
║  │  [████░░░░] │  │  [██░░░░░░] │  │  [░░░░░░░░] │     ║
║  │   STOP      │  │  12%        │  │  Czeka      │     ║
║  └─────────────┘  └─────────────┘  └─────────────┘     ║
║                                                          ║
║  ⚠️  Zlecenie Felga-L ZABLOKOWANE                       ║
║  ⚙️  Przeliczam harmonogram...                          ║
║      [████████████░░░░░░░░░░] 2.1s / 3.0s              ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
```

### EKRAN 4: Nowy harmonogram (3 sekundy później)
```
╔══════════════════════════════════════════════════════════╗
║  ✅ NOWY HARMONOGRAM GOTOWY!                             ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  📊 PORÓWNANIE:                                          ║
║  ┌────────────────────────────────────────────────────┐ ║
║  │ Poprzedni plan:  Zakończenie o 19:45              │ ║
║  │                  Opóźnienie: 1h 15min             │ ║
║  │                                                    │ ║
║  │ Nowy plan (AI):  Zakończenie o 18:55              │ ║
║  │                  Opóźnienie: 25 min               │ ║
║  │                                                    │ ║
║  │ ⚡ OSZCZĘDNOŚĆ:   50 MINUT!                        │ ║
║  └────────────────────────────────────────────────────┘ ║
║                                                          ║
║  🔄 ZMIANY:                                              ║
║  ✓ Felga-L → CNC-02 (start 16:05)                      ║
║  ✓ Wspornik → Press-A (wcześniej o 15 min)             ║
║  ✓ Korpus → opóźniony 20 min (w SLA)                   ║
║                                                          ║
║     [ ZASTOSUJ ]     [ ZOBACZ GANTT ]                   ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
```

### EKRAN 5: Wykres Gantta (wizualizacja)
```
╔══════════════════════════════════════════════════════════════╗
║  Wykres Gantta - Harmonogram Produkcji                      ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║      14:00   15:00   16:00   17:00   18:00   19:00   20:00 ║
║      │       │       │       │       │       │       │      ║
║ CNC-01 [████❌ AWARIA                                  ]     ║
║        └─ Felga-L (BLOCKED)                                 ║
║                                                              ║
║ CNC-02 [████████████Felga-R█][██Felga-L██][█Korpus██]      ║
║        └─ 14:00-15:30        └─ 16:05-17:10└─ 17:15-18:20  ║
║                                                              ║
║ Press  [░░░Osłona░░][█Wspornik█][░Panel░]                   ║
║        └─ 15:00-15:40└─15:45-16:30└─16:40-17:20            ║
║      │       │       │       │       │       │       │      ║
║                                                              ║
║  ───── Plan przed awarią (szary): zakończenie 19:45        ║
║  ▓▓▓▓▓ Nowy plan AI (zielony):    zakończenie 18:55 ✓      ║
║                                                              ║
║  Oszczędność: 50 minut                                      ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

### EKRAN 6: Notyfikacje dla operatorów
```
╔══════════════════════════════════════════════════════════╗
║  Powiadomienia                                          ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  ┌────────────────────────────────────────────────────┐ ║
║  │ 🔔 Operator CNC-02 - Jan Kowalski                  │ ║
║  │                                                     │ ║
║  │ Nowe zlecenie: Felga-L #1234                       │ ║
║  │ Start: 16:05 (za 1h 30min)                         │ ║
║  │                                                     │ ║
║  │ Przygotuj:                                         │ ║
║  │ • Narzędzie: T12 (nowe)                            │ ║
║  │ • Materiał: Aluminium ALU-2024                     │ ║
║  │ • Czas operacji: 65 minut                          │ ║
║  │                                                     │ ║
║  │            [ OK, ROZUMIEM ]                         │ ║
║  └────────────────────────────────────────────────────┘ ║
║                                                          ║
║  ┌────────────────────────────────────────────────────┐ ║
║  │ 🔔 Operator Press-A - Anna Nowak                   │ ║
║  │                                                     │ ║
║  │ Zmiana harmonogramu: Wspornik #1237                │ ║
║  │ Nowy start: 15:45 (wcześniej o 15 min!)           │ ║
║  │                                                     │ ║
║  │            [ OK, ROZUMIEM ]                         │ ║
║  └────────────────────────────────────────────────────┘ ║
║                                                          ║
║  ┌────────────────────────────────────────────────────┐ ║
║  │ ⚠️  Manager - Informacja dla klienta               │ ║
║  │                                                     │ ║
║  │ Zlecenie: Korpus #1238 - Automotive XYZ            │ ║
║  │ Opóźnienie: +20 minut (nowy termin 18:20)         │ ║
║  │ Status SLA: ✅ W normie                             │ ║
║  │                                                     │ ║
║  │    [ WYŚLIJ EMAIL ]  [ ZADZWOŃ ]                   │ ║
║  └────────────────────────────────────────────────────┘ ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
```

---

## 🤝 FailSafe + TOMAI = Kompletny Ekosystem

```
┌─────────────────────────────────────────────────────┐
│  TOMAI (System ELPLC)        FailSafe (Prototyp)   │
├─────────────────────────────────────────────────────┤
│  ✓ Monitoring real-time      ✓ Reakcja w 3 sek     │
│  ✓ Wykrywanie awarii         ✓ Reorganizacja auto  │
│  ✓ Analiza OEE               ✓ Optymalizacja zadań │
│  ✓ Zbieranie danych          ✓ Gantt visualization │
│  ✗ Auto-rescheduling    ←──→ ✓ AI Scheduler        │
└─────────────────────────────────────────────────────┘

    TOMAI mówi: "Mamy problem"
    FailSafe odpowiada: "Mam rozwiązanie"
```

---

## 🎯 CO SYSTEM ROBI - Zgodność z ELPLC

| Wymóg ELPLC (z rozmowy)             | ✅ Realizacja FailSafe          | Gdzie w demo |
| ----------------------------------- | ------------------------------ | ------------ |
| _"Natychmiastowa reakcja"_          | 3 sekundy (vs 30 min ręczne)   | Ekran 3      |
| _"Operatorzy: dużo info real-time"_ | Dashboard + powiadomienia push | Ekran 1, 6   |
| _"Instrukcje jak reagować"_         | Konkretne kroki dla operatora  | Ekran 6      |
| _"Wiedzieć gdzie przejść"_          | Nowe zadanie + przygotowanie   | Ekran 6      |
| _"Automatyczne przeliczanie"_       | Algorytm optymalizacyjny       | Ekran 4      |
| _"Wykres Gantta"_                   | Wizualizacja + timeline        | Ekran 5      |
| _"Integracja z TOMAI"_              | API webhooks (planned)         | Architektura |

**Prototyp hackathonowy** - demonstracja koncepcji

---

## 💰 POTENCJAŁ BIZNESOWY

### ROI dla ELPLC - Konkretne Liczby:

```
📊 CASE STUDY: Wariatory do samochodów
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Wartość: $120/sztuka
• Cykl produkcji: 6 sekund
• Produkcja/godzina: 600 sztuk = $72,000

❌ BEZ FailSafe (30 min przestoju):
   • Stracone sztuki: 300
   • Koszt: $36,000 na awarię

✅ Z FailSafe (2 min przestoju):
   • Stracone sztuki: 20
   • Koszt: $2,400 na awarię
   • OSZCZĘDNOŚĆ: $33,600 (93%!)

📈 PRZY 10 AWARIACH/MIESIĄC:
   • Oszczędność miesięczna: $336,000
   • Oszczędność roczna: $4,032,000

💰 ROI: System zwraca się w < 1 miesiąc
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

KOMPLEMENTARNOŚĆ:
✓ TOMAI monitoruje i wykrywa awarie
✓ FailSafe automatycznie reorganizuje
✓ Razem = Industry 4.0 w akcji
```

---

## 🚀 DEMO HACKATHONOWE

### Co pokażemy (3 minuty):
```
1. [0:00-0:30] Problem - chaos w ELPLC
2. [0:30-0:45] Dashboard - monitoring 4 maszyn
3. [0:45-1:00] Awaria CNC-01 zgłoszona
4. [1:00-1:15] AI myśli... 3 sekundy
5. [1:15-1:45] Nowy plan - Gantt chart
6. [1:45-2:15] Powiadomienia dla zespołu
7. [2:15-2:45] ROI: $33,600 oszczędności
8. [2:45-3:00] FailSafe + TOMAI = WIN
```

### Technologia (prototyp hackathonowy):
- **Algorytm**: Python - optymalizacja zadań
- **Wizualizacja**: HTML/CSS/JS - mockupy UI
- **Demo**: Realistic data z hal ELPLC (wariatory case)
- **Next**: Integracja TOMAI API, pilot program

---

## 🎤 SCENARIUSZ PREZENTACJI (3 minuty)

### [0:00-0:30] PROBLEM
```
"Piątek 14:35. Fabryka ELPLC.
CNC-01 pęka narzędzie.

Co się dzieje?
→ Operator nie wie co robić
→ Kierownik dzwoni do planisty
→ 30 minut chaosu
→ Opóźnienia, straty"
```

### [0:30-2:30] DEMO
```
"Pokażemy jak SmartFlow to rozwiązuje."

[EKRANY 1-6]

1. Dashboard - widzimy wszystkie maszyny
2. Zgłoszenie - operator klika "Awaria"
3. System myśli - algorytm w akcji (3s)
4. Nowy plan - alternatywny harmonogram
5. Gantt - wizualizacja zmian
6. Notyfikacje - wszyscy wiedzą co robić
```

### [2:30-3:00] WYNIK
```
"3 sekundy zamiast 30 minut.

System, który nie panikuje.
Prototyp gotowy do rozwoju.

SmartFlow - planowanie, które się adaptuje."
```

---

## 📁 STRUKTURA PROJEKTU

```
smartflow/
├── docs/
│   ├── README.md              # Dokumentacja
│   ├── ALGORITHMS.md          # Opis algorytmów
│   └── PRESENTATION_GUIDE.md  # Przewodnik prezentacji
│
├── demo/
│   ├── mockups/               # Graficzne mockupy UI
│   └── algorithm_prototype.py # Prototyp algorytmu
│
└── README.md                  # ← TEN PLIK
```

---

## ❓ Q&A - Częste pytania

**Q: Czy to działa naprawdę?**  
A: To prototyp koncepcyjny na hackathon pokazujący jak działałby system w halach produkcyjnych ELPLC.

**Q: Ile czasu zajęłoby wdrożenie?**  
A: Pełny system produkcyjny to 3-6 miesięcy rozwoju, zaczynając od pilotażu na wybranej linii produkcyjnej.

**Q: Jak FailSafe współpracuje z TOMAI?**  
A: TOMAI (własny system ELPLC) świetnie monitoruje produkcję i wykrywa awarie w czasie rzeczywistym. FailSafe dodaje brakujący element - **automatyczną reorganizację** harmonogramu w 3 sekundy. To NIE konkurencja, to synergia:
- TOMAI: "CNC-01 nie działa" → 
- FailSafe: "Przenoszę zadania na CNC-02" → 
- Operator: "Wiem co robić"

Integracja przez API/webhooks.

**Q: Jakie są następne kroki?**  
A: Rozwój działającego prototypu, integracja z systemami ELPLC (TOMAI, ERP), testy z prawdziwymi danymi produkcyjnymi z hal w Tarnowie.

**Q: Dlaczego to lepsze niż Excel?**  
A: Automatyzacja (3 sekundy vs 30-60 minut), eliminacja błędów ludzkich, wizualizacja w czasie rzeczywistym, powiadomienia dla całego zespołu.

---

## 🏆 DLACZEGO FailSafe TO GAME CHANGER

✅ **Rozmowa z ELPLC** - validacja z lead produkcji (Kamil Małochleb)  
✅ **Konkretny ROI** - $4M oszczędności rocznie dla ELPLC  
✅ **Komplementarność** - wzmacnia TOMAI, nie konkuruje  
✅ **Industry 4.0 ready** - pasuje do statusu CBR ELPLC  
✅ **Realistic case** - wariatory, CNC, real data z hal 4200m²  
✅ **Prosty UI** - operatorzy wiedzą "gdzie przejść" (feedback z rozmowy)  
✅ **Quick win** - ROI < 1 miesiąc, pilot na 1 linii możliwy od zaraz  

---

<div align="center">
    <h2>🏭 FailSafe</h2>
    <p><b>"Plan, który nie panikuje. Plan, który się zmienia."</b></p>
    <p><i>Team FailSafe · Hackathon dla Małopolski 2025</i></p>
</div>
