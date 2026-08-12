"use client";

import { useActionState, useId } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sendeKontakt } from "@/app/actions/kontakt";
import {
  EMAIL_MUSTER,
  GRENZEN,
  HONIGTOPF_FELD,
  LEERER_ZUSTAND,
  TEXTE,
  type KontaktDaten,
} from "@/lib/kontakt-regeln";

/**
 * Kontaktformular.
 *
 * Zwei Prüfungen, eine Quelle: Grenzen und Texte kommen aus
 * `lib/kontakt-regeln.ts`. Hier im Browser prüft React Hook Form damit sofort,
 * auf dem Server prüft Zod dieselben Werte nochmal — verbindlich ist der
 * Server. Zod wird hier bewusst NICHT importiert; es wiegt gemessen rund
 * 60 KB und würde von jedem Besucher geladen.
 *
 * Das <form> trägt `action`, nicht `onSubmit`-mit-fetch. Damit funktioniert
 * das Absenden auch ohne JavaScript. Der onSubmit-Handler unten bricht nur ab,
 * wenn im Browser schon feststeht, dass die Eingabe unvollständig ist — das
 * spart den Umweg über den Server, ohne ihn zu ersetzen.
 */
export function KontaktFormular() {
  const [zustand, absenden, laeuft] = useActionState(sendeKontakt, LEERER_ZUSTAND);
  const gruppe = useId();

  const form = useForm<KontaktDaten>({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      telefon: "",
      nachricht: "",
      einwilligung: false,
    },
  });

  /**
   * WÄHREND des Renderns auslesen, nicht erst im Klick-Handler.
   *
   * React Hook Form überwacht ein Feld aus `formState` nur dann, wenn es beim
   * Rendern gelesen wurde (Proxy-Abo). Steht `formState.isValid` ausschließlich
   * im onSubmit, bleibt es dauerhaft `false` — das Formular bricht dann jeden
   * Versuch ab, ohne eine Fehlermeldung zu zeigen. Gemessen: Es ging kein
   * einziger POST hinaus.
   */
  const { errors, isValid } = form.formState;

  /** Browser-Fehler zuerst, sonst der vom Server gemeldete. */
  const fehlerVon = (feld: keyof KontaktDaten) =>
    errors[feld]?.message ?? zustand.felder?.[feld];

  if (zustand.status === "ok") {
    return (
      <div role="status" className="lesetext flex flex-col gap-2">
        <p className="font-medium">{zustand.meldung}</p>
        <p className="text-sm text-muted-foreground">
          Du bekommst keine automatische Bestätigungsmail — wir antworten
          persönlich.
        </p>
      </div>
    );
  }

  return (
    <form
      action={absenden}
      noValidate
      onSubmit={(ereignis) => {
        if (!isValid) {
          ereignis.preventDefault();
          void form.trigger();
        }
      }}
      className="flex max-w-xl flex-col gap-6"
    >
      {/* Honigtopf. Nicht `display:none` — manche Bots überspringen versteckte
          Felder. Aus dem Textfluss genommen, aus der Tabreihenfolge genommen,
          von Screenreadern ignoriert. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={`${gruppe}-hp`}>Website (bitte leer lassen)</label>
        <input
          id={`${gruppe}-hp`}
          type="text"
          name={HONIGTOPF_FELD}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <Feld id={`${gruppe}-name`} beschriftung="Name" fehler={fehlerVon("name")}>
        {(steuerung) => (
          <Input
            {...form.register("name", {
              required: TEXTE.nameFehlt,
              minLength: { value: GRENZEN.nameMin, message: TEXTE.nameFehlt },
              maxLength: { value: GRENZEN.nameMax, message: TEXTE.nameZuLang },
            })}
            {...steuerung}
            autoComplete="name"
          />
        )}
      </Feld>

      <Feld id={`${gruppe}-email`} beschriftung="E-Mail" fehler={fehlerVon("email")}>
        {(steuerung) => (
          <Input
            {...form.register("email", {
              required: TEXTE.emailFehlt,
              pattern: { value: EMAIL_MUSTER, message: TEXTE.emailUnvollstaendig },
            })}
            {...steuerung}
            type="email"
            inputMode="email"
            autoComplete="email"
          />
        )}
      </Feld>

      <Feld
        id={`${gruppe}-telefon`}
        beschriftung="Telefon"
        hinweis="optional"
        fehler={fehlerVon("telefon")}
      >
        {(steuerung) => (
          <Input
            {...form.register("telefon", {
              maxLength: { value: GRENZEN.telefonMax, message: TEXTE.telefonZuLang },
            })}
            {...steuerung}
            type="tel"
            autoComplete="tel"
          />
        )}
      </Feld>

      <Feld id={`${gruppe}-nachricht`} beschriftung="Nachricht" fehler={fehlerVon("nachricht")}>
        {(steuerung) => (
          <Textarea
            {...form.register("nachricht", {
              required: TEXTE.nachrichtZuKurz,
              minLength: { value: GRENZEN.nachrichtMin, message: TEXTE.nachrichtZuKurz },
              maxLength: { value: GRENZEN.nachrichtMax, message: TEXTE.nachrichtZuLang },
            })}
            {...steuerung}
            rows={6}
          />
        )}
      </Feld>

      <div className="flex flex-col gap-2">
        <div className="flex items-start gap-3">
          <Checkbox
            id={`${gruppe}-einwilligung`}
            {...form.register("einwilligung", {
              validate: (wert) => wert === true || TEXTE.einwilligungFehlt,
            })}
            aria-invalid={Boolean(fehlerVon("einwilligung"))}
            aria-describedby={
              fehlerVon("einwilligung") ? `${gruppe}-einwilligung-fehler` : undefined
            }
            className="mt-1"
          />
          {/* `block` und normale Zeilenhöhe: Das hier ist Fließtext mit einem
              Link darin, keine Beschriftung mit Symbol. */}
          <Label
            htmlFor={`${gruppe}-einwilligung`}
            className="block text-sm leading-snug font-normal"
          >
            Ich bin damit einverstanden, dass meine Angaben zur Beantwortung
            meiner Anfrage gespeichert werden. Einzelheiten stehen in der{" "}
            <a href="/datenschutz" className="underline underline-offset-4">
              Datenschutzerklärung
            </a>
            .
          </Label>
        </div>
        {fehlerVon("einwilligung") ? (
          <p id={`${gruppe}-einwilligung-fehler`} className="text-sm text-destructive">
            {fehlerVon("einwilligung")}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-3">
        <Button type="submit" disabled={laeuft} className="self-start">
          {laeuft ? "Wird gesendet …" : "Anfrage senden"}
        </Button>

        {/* Fehler vom Server. `aria-live` sorgt dafür, dass Screenreader die
            Meldung mitbekommen, ohne dass der Fokus wegspringt. */}
        <p aria-live="polite" className="text-sm text-destructive empty:hidden">
          {zustand.status === "fehler" ? zustand.meldung : ""}
        </p>
      </div>
    </form>
  );
}

type FeldProps = {
  id: string;
  beschriftung: string;
  hinweis?: string;
  fehler?: string;
  /** Bekommt die Attribute, die das Eingabefeld mit Label und Fehler verbinden. */
  children: (steuerung: {
    id: string;
    "aria-invalid": boolean;
    "aria-describedby"?: string;
  }) => React.ReactNode;
};

/**
 * Ein Feld ist erst dann bedienbar, wenn Beschriftung, Eingabe und Fehlertext
 * programmatisch verbunden sind. Ein rot umrandeter Rahmen allein ist für
 * jemanden mit Screenreader keine Information.
 */
function Feld({ id, beschriftung, hinweis, fehler, children }: FeldProps) {
  const fehlerId = `${id}-fehler`;

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>
        {beschriftung}
        {hinweis ? (
          <span className="ml-2 font-normal text-muted-foreground">({hinweis})</span>
        ) : null}
      </Label>

      {children({
        id,
        "aria-invalid": Boolean(fehler),
        "aria-describedby": fehler ? fehlerId : undefined,
      })}

      {fehler ? (
        <p id={fehlerId} className="text-sm text-destructive">
          {fehler}
        </p>
      ) : null}
    </div>
  );
}
