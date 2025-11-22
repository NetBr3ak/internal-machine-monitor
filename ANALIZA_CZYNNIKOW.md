# Analiza czynników sprzyjających i nieprzyjających

Data: 2025-11-22

Poniżej zebrano czynniki sprzyjające (pozytywne) i nieprzyjające (barierowe) dla wdrożenia produktu FailSafe w kontekście ELPLC, pogrupowane według obszarów: ekonomicznych, politycznych, demograficznych, kulturowych i technologicznych. Wnioski oparte są na materiałach z repozytorium projektu (README.md, ELPLC_RESEARCH.md, ALGORITHMS.md, PRESENTATION_GUIDE.md, PYTANIA_DO_PREZESA.md, MURAL.md).

---

## Ekonomiczne

- Sprzyjające:
  - Wysoki koszt przestojów: **$72,000/godz.** (wariatory) — mocny argument ekonomiczny za inwestycją.
  - Wyraźne ROI i konkretne oszczędności: np. **$33,600** oszczędności na typowej awarii, ~**$4M/rok** przy założeniu 10 awarii/miesiąc.
  - Model komercyjny możliwy: licencje, opłata setupowa, wsparcie — szybki zwrot nakładów (LEAN CANVAS).

- Nieprzyjające:
  - Koszt i czas integracji z istniejącymi systemami (TOMAI, ERP, starsze maszyny) — nakład początkowy.
  - Procesy zakupowe klientów i budżet R&D mogą wydłużyć moment monetyzacji.
  - Ryzyko rozbieżności między proponowaną ceną a gotowością klienta do zapłaty.

## Polityczne / regulacyjne

- Sprzyjające:
  - ELPLC ma status Centrum Badawczo-Rozwojowego (CBR) → większa otwartość na pilotaże i współpracę R&D.
  - Obecność na branżowych wydarzeniach i partnerstwa ułatwiają wsparcie i promocję.

- Nieprzyjające:
  - Wymogi compliance i standardy (automotive, ISO, security) mogą wymagać dodatkowej pracy i certyfikacji.
  - Złożone ścieżki decyzyjne wewnątrz klienta (kto zatwierdza wdrożenie: R&D vs zarząd) — ryzyko opóźnień.

## Demograficzne (zasoby ludzkie)

- Sprzyjające:
  - ELPLC dysponuje zespołem specjalistów (~200 osób) oraz doświadczeniem w automatyzacji — zasoby do pilotażu i integracji.
  - Operatorzy wyrażają potrzebę jasnych instrukcji i informacji real-time, co zwiększa użyteczność rozwiązania.

- Nieprzyjające:
  - Opór przed zmianą procesu pracy (przyzwyczajenie do Excela/ ręcznego planowania) może wymagać szkoleń i change management.
  - Różny poziom integracji maszyn (legacy equipment) oznacza konieczność wsparcia manualnego lub adapterów.

## Kulturowe (organizacyjne)

- Sprzyjające:
  - Kultura innowacji w ELPLC (CBR, TOMAI, projekty pilotażowe) sprzyja testowaniu rozwiązań Industry 4.0.
  - Komplementarność z TOMAI (nie konkurencja) — łatwiejsze uzyskanie buy-inu.

- Nieprzyjające:
  - Zaufanie do automatycznych rekomendacji AI może być ograniczone — potrzeba transparentności i mechanizmu ręcznego zatwierdzania przez operatora.
  - Centralizacja decyzji u planistów może powodować opór wobec automatycznych sugestii: wymagana polityka adopcji.

## Technologiczne

- Sprzyjające:
  - TOMAI już zbiera dane w czasie rzeczywistym — punkt integracji (webhooks/API) dla FailSafe.
  - Zaawansowane zaplecze: roboty, SCADA, systemy wizyjne — techniczna dojrzałość infrastruktury.
  - Gotowy prototyp algorytmu i demo (AI scheduler, Gantt, powiadomienia) skracają etap PoC.

- Nieprzyjające:
  - Starsze maszyny bez API wymagają adapterów lub ręcznych procedur, co zwiększa koszt integracji.
  - Skalowalność wymaga testów: prototyp działa na scenariuszu 4 maszyn; pełna hala i równoległe awarie wymagają walidacji wydajności.
  - Wymagania bezpieczeństwa i standardy integracji (autoryzacja, protokoły) — prace inżynierskie i compliance.

---

## Rekomendowane następne kroki

1. Zweryfikować technicznie dostępność TOMAI API / webhooks (priorytet - potwierdzić zdolność dostarczania real-time eventów).
2. Uzyskać dane: średnia liczba awarii/miesiąc na linii (do finalnego wyliczenia ROI).
3. Zaproponować pilot na konkretnej linii (najwyższa wartość strat przy awarii — np. linia wariatorów).
4. Przygotować plan integracji dla maszyn legacy (adaptery, manualne fallbacky) i oszacowanie kosztów.
5. Zaplanować działania change management: szkolenia operatorów, UX z instrukcjami i mechanizmem zatwierdzania propozycji.

---

## Źródła
- `README.md`, `ELPLC_RESEARCH.md`, `ALGORITHMS.md`, `PRESENTATION_GUIDE.md`, `PYTANIA_DO_PREZESA.md`, `MURAL.md` (repozytorium projektu).
