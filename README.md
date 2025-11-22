# 🏭 Internal Machine & Task Monitor

Lekki, szybki i superpraktyczny system do monitorowania pracy maszyn, zadań i awarii — z osobnym widokiem dla operatorów/kierowników i techników.

System, który realnie usprawnia komunikację na hali produkcyjnej.

## 🎯 Cel projektu
Wszystko w jednym miejscu:
– statusy maszyn,
– zlecenia produkcyjne,
– awarie,
– praca techników.

Prosto, czytelnie, praktycznie.

## 👥 Kto używa systemu?
### Operator / Kierownik produkcji
Widzi co się dzieje na hali:
- status każdej maszyny,
- które zadanie aktualnie jest wykonywane,
- ile zostało czasu,
- szybkie zgłoszenie awarii,
- lista zleceń i ich stan,
- historia incydentów.

To jest „widok hali”.

### Technik / Serwisant
Ma swój własny panel:
- lista wszystkich zgłoszonych awarii,
- podział: nowe / w trakcie / zakończone,
- priorytety (nadawane automatycznie lub przez kierownika),
- szczegóły zgłoszenia (opis, zdjęcie, maszyna, czas zgłoszenia),
- przycisk „Rozpocznij naprawę”,
- przycisk „Naprawione” → automatyczny zapis czasu reakcji i naprawy.

Technik widzi tylko to, co jest dla niego istotne: szybka diagnoza → akcja → raport.

## 🧩 Funkcje (MVP – gotowe w 2–3 dni)
- **Dashboard maszyn (operator/kierownik)**: duże kafelki: 🟢 działa / 🟡 przezbrojenie / 🔴 awaria, aktualne zadanie + czas do końca.
- **Zgłaszanie awarii (operator)**: 1 klik, opis + typ awarii, opcjonalne zdjęcie, automatyczna zmiana statusu maszyny.
- **Panel technika**: lista awarii, filtrowanie po statusie, możliwość potwierdzenia rozpoczęcia i zakończenia naprawy, automatyczne rejestrowanie czasów.
- **Lista zleceń produkcyjnych**: nazwa zlecenia, przypisana maszyna, czas trwania, status.
- **Historia incydentów**: pełna lista awarii, czas zgłoszenia, czas naprawy, najczęściej psujące się maszyny.

## 🖥️ UI — czytelny pod podział ról
- **Operator/kierownik**: dashboard maszyn, zlecenia, historia.
- **Technik**: lista awarii, karta zgłoszenia, status napraw.

Dwa proste menu → maksymalna klarowność.

## ⚙️ Technologia (szybka do zrobienia)
- Flask — backend
- HTML/CSS/JS — frontend
- SQLite — baza
- PWA — działa jak natywna apka
- DataTables / własne kafelki

Całość w 2–3 dni z Copilotem i dobrym podziałem pracy.

## 💡 Dlaczego ELPLC to doceni
- realne zastosowanie na hali,
- oszczędza czas operatorów i techników,
- natychmiastowa wartość: mniej przestojów, lepsza komunikacja, czyste dane,
- łatwe w dalszym rozwoju (np. integracje z PLC).

## 🏆 Dlaczego wygrywa hackathon
- system jest praktyczny i profesjonalny,
- ma dwa widoki, co pokazuje dojrzałość projektu,
- ładne demo: klik → awaria → technik → naprawa,
- nie jest „pomysłem”, tylko produktem.

## 🚀 Plan pracy
- **Dzień 1**: baza danych, dashboard maszyn, zgłaszanie awarii.
- **Dzień 2**: panel technika, lista zleceń, historia incydentów.
- **Dzień 3**: UI polish, PWA, test demo, slajdy.

## 🔚 Gotowe.
System wygląda profesjonalnie, jest prosty, szybki i robi ogromne wrażenie na partnerze.

## Instalacja i uruchomienie
1. Zainstaluj Python 3.8+.
2. `pip install flask`
3. Uruchom `python app.py`
4. Otwórz http://localhost:5000 w przeglądarce.

## Przykład użycia
- Operator: Zaloguj się jako operator, zobacz dashboard maszyn.
- Technik: Zaloguj się jako technik, zobacz listę awarii.

## Licencja
MIT