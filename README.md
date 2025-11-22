# 🏭 SmartFlow — System Reagujący na Awarie

> **Hackathon dla Małopolski 2025** · ELPLC S.A.  
> _"System, który nie panikuje - algorytmy przeliczają plan w 3 sekundy"_

---

## 🎯 PROBLEM → ROZWIĄZANIE

### ❌ PRZED (typowa fabryka):
```
14:35 - CNC-01 się psuje

↓ 30 minut chaosu ↓

• Kierownik dzwoni do wszystkich
• Excel, kartki, chaos
• Operator nie wie co robić
• Klient czeka

KOSZT: 15 000 zł (jedna awaria)
```

### ✅ PO (SmartFlow):
```
14:35 - CNC-01 się psuje
       ↓
14:35:03 - System ma nowy plan
       ↓
14:35:10 - Wszyscy wiedzą co robić

OSZCZĘDNOŚĆ: 50 minut = 25 000 zł
```

---

## 📺 JAK TO WYGLĄDA - GRAFICZNE DEMO

### EKRAN 1: Dashboard Operatora
```
╔══════════════════════════════════════════════════════════╗
║  SmartFlow - Dashboard Operatora          14:35         ║
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
║  SmartFlow - Dashboard Operatora          14:35:01      ║
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

## 🎯 CO SYSTEM ROBI - Zgodność z ELPLC

| Wymóg prezesa ELPLC              | ✅ Nasza realizacja             | Gdzie w demo |
| -------------------------------- | ------------------------------ | ------------ |
| _"System, który nie panikuje"_   | Automatyczna reakcja w 3 sek   | Ekran 3      |
| _"Automatycznie przelicza plan"_ | Algorytm genetyczny (prototyp) | Ekran 4      |
| _"Uwzględnia dostępność maszyn"_ | Widzi że CNC-01 niedostępny    | Ekran 3      |
| _"Uwzględnia czasy operacji"_    | Każde zlecenie ma czas         | Ekran 5      |
| _"Wykres Gantta"_                | Wizualizacja harmonogramu      | Ekran 5      |
| _"Mapa zasobów"_                 | Dashboard maszyn               | Ekran 1      |
| _"Prosty dla operatora"_         | 🟢🟡🔴 intuicyjny UI              | Ekran 1      |

**Prototyp hackathonowy** - demonstracja koncepcji

---

## 💰 POTENCJAŁ BIZNESOWY

### Przykładowe oszczędności (szacunki):

```
PROBLEM:
• Awaria CNC → 30-60 min przestoju
• Ręczne przeliczanie planu
• Opóźnienia w produkcji

ROZWIĄZANIE:
• System reaguje w 3 sekundy
• Automatyczne przełożenie zadań
• Minimalizacja przestojów

POTENCJAŁ:
• Szybsza reakcja na awarie
• Lepsze wykorzystanie maszyn
• Mniej stresu dla operatorów
```

---

## 🚀 DEMO HACKATHONOWE

### Co pokażemy:
```
1. Dashboard - monitoring maszyn
2. Zgłoszenie awarii - prosty formularz
3. System reaguje - algorytm w akcji
4. Nowy harmonogram - wizualizacja
5. Gantt chart - timeline produkcji
6. Notyfikacje - powiadomienia
```

### Technologia:
- **Frontend**: HTML/CSS/JavaScript (wizualizacja)
- **Backend**: Python (algorytm)
- **Demo**: Przygotowane dane testowe

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
A: To prototyp koncepcyjny na hackathon. Pokazujemy jak by działał system.

**Q: Ile czasu zajęłoby wdrożenie?**  
A: Pełny system produkcyjny to 3-6 miesięcy rozwoju.

**Q: Jakie są następne kroki?**  
A: Rozwój działającego prototypu, testy z prawdziwymi danymi ELPLC.

**Q: Dlaczego to lepsze niż Excel?**  
A: Automatyzacja, szybkość reakcji, wizualizacja w czasie rzeczywistym.

---

## 🏆 NASZE ATUTY

✅ **Jasna wizja** - rozwiązujemy realny problem ELPLC  
✅ **Graficzne mockupy** - każdy widzi jak to działa  
✅ **Przemyślana koncepcja** - 3 warstwy inteligencji  
✅ **Prosty UI** - 🟢🟡🔴 intuicyjny dla operatora  
✅ **Mierzalny potencjał** - konkretne korzyści  

---

<div align="center">
    <h2>🏭 SmartFlow</h2>
    <p><b>"Plan, który nie panikuje. Plan, który się zmienia."</b></p>
    <p><i>Team SmartFlow · Hackathon dla Małopolski 2025</i></p>
</div>
