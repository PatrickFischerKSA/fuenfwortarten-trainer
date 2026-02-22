# Fuenfwortarten-Trainer

Interaktive Uebungsumgebung mit Sofortkorrektur zur Fuenfwortarten-Lehre.

## Enthaltene Wortarten
- Nomen
- Adjektiv
- Verb
- Pronomen: Personal, Possessiv, Reflexiv, Demonstrativ, Indefinit

## Lernmodus
- 2 Serien mit je 5 Saetzen (steigende Komplexitaet)
- Fortschrittsanzeige pro Serie
- Serie 2 wird erst nach Abschluss von Serie 1 freigeschaltet
- Sofortkorrektur pro Aufgabe:
  - 1. Fehlversuch: nur `Richtig/Falsch`
  - 2. Fehlversuch: Hinweis ohne Antwortspoiler
  - 3. Fehlversuch: korrekte Modellantwort

## Starten
Einfach `index.html` im Browser oeffnen.

Alternativ mit lokalem Server:

```bash
npx serve .
```

## GitHub-Setup
Im Projektordner ausfuehren:

```bash
git init
git add .
git commit -m "Initial commit: Fuenfwortarten-Trainer"
git branch -M main
git remote add origin <DEIN_GITHUB_REPO_URL>
git push -u origin main
```
