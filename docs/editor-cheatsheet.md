# Editor Cheat Sheet (Publii)

Diese Vorlage hilft dir beim schnellen Schreiben von Beiträgen, die exakt zum Theme passen.

## 1) FAQ / Akkordeon

Nutze pro Frage eine eigene Box:

```html
<div class="faq-item">
  <button class="faq-question">Was ist die Kernfrage?</button>
  <div class="faq-answer">
    <p>Hier steht die Antwort mit normalem Fließtext.</p>
  </div>
</div>
```

Mehrere FAQ-Elemente einfach untereinander einfügen.

## 2) Lottie-Animation

Basis-Variante mit Theme-Defaults (Breite/Höhe/Loop aus Theme-Optionen):

```html
<div class="lottie-embed" data-src="https://assets9.lottiefiles.com/packages/lf20_xxx.json"></div>
```

Variante mit Override pro Animation:

```html
<div
  class="lottie-embed"
  data-src="https://assets9.lottiefiles.com/packages/lf20_xxx.json"
  data-width="100%"
  data-height="320px"
  data-loop="true">
</div>
```

Hinweise:
- data-width: z. B. 100%, 640px
- data-height: z. B. 320px, 40vh
- data-loop: true oder false

## 3) Video-Einbettung

YouTube / Vimeo (iframe):

```html
<iframe
  src="https://www.youtube.com/embed/VIDEO_ID"
  title="Video"
  loading="lazy"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen>
</iframe>
```

Lokales Video:

```html
<video controls preload="metadata">
  <source src="/media/video/datei.mp4" type="video/mp4">
</video>
```

Beides wird automatisch responsiv dargestellt.

## 4) Inhalte stabil halten (Best Practices)

- Überschriften kurz halten, damit Kartenhöhe konsistent bleibt.
- Lange Absätze nach 3-5 Zeilen trennen.
- Bilder mit klarem Motivzentrum verwenden (für 16:9-Crops).
- Für externe Links immer eine aussagekräftige Link-Beschriftung wählen.

## 5) Schneller Block-Start für neuen Beitrag

```html
<h2>Einleitender Abschnitt</h2>
<p>Kurzer Einstieg in das Thema.</p>

<div class="faq-item">
  <button class="faq-question">Häufige Frage 1</button>
  <div class="faq-answer">
    <p>Antwort 1</p>
  </div>
</div>

<div class="lottie-embed" data-src="https://assets9.lottiefiles.com/packages/lf20_xxx.json" data-height="280px"></div>

<iframe src="https://www.youtube.com/embed/VIDEO_ID" title="Video" loading="lazy" allowfullscreen></iframe>
```

## 6) Troubleshooting

- Lottie wird nicht angezeigt:
  - Prüfe data-src URL (direkt auf JSON-Datei)
  - Prüfe Browser-Konsole auf CORS/404
- FAQ klappt nicht auf:
  - Prüfe Klassen faq-item, faq-question, faq-answer
- Video ist zu groß/klein:
  - Das Theme skaliert automatisch; alte Inline-Width/Height-Attribute entfernen
