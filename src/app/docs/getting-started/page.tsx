import { DocsHeader, H2, P, Callout } from "@/components/Docs";
import { CodeBlock } from "@/components/CodeBlock";

export const metadata = { title: "Getting started" };

export default function Page() {
  return (
    <>
      <DocsHeader
        title="Getting started"
        description="Install go-bs and make your first Gregorian ↔ Bikram Sambat conversion."
      />

      <H2>Install</H2>
      <P>go-bs has zero runtime dependencies and supports Go 1.22+.</P>
      <CodeBlock lang="sh" code="go get github.com/suprimkhatri77/go-bs" />

      <H2>Convert AD → BS</H2>
      <CodeBlock
        lang="go"
        title="main.go"
        code={`package main

import (
	"fmt"
	"log"
	"time"

	bs "github.com/suprimkhatri77/go-bs"
)

func main() {
	ad := time.Date(2026, time.September, 22, 0, 0, 0, 0, time.UTC)

	d, err := bs.ADToBS(ad)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println(d) // 2083-06-06
}`}
      />

      <H2>Convert BS → AD</H2>
      <CodeBlock
        lang="go"
        code={`d, err := bs.NewDate(2083, 6, 6)
if err != nil {
	log.Fatal(err)
}

ad, err := bs.BSToAD(d)
if err != nil {
	log.Fatal(err)
}

fmt.Println(ad.Format("2006-01-02")) // 2026-09-22`}
      />

      <Callout>
        <strong>Note:</strong> <code>bs.Date.Month</code> is 1-based — 1 is Baisakh, 12 is Chaitra. There&apos;s no
        month-0 convention here, unlike Go&apos;s own <code>time.Month</code> which happens to also be 1-based, so
        this one actually lines up.
      </Callout>

      <H2>Supported range</H2>
      <P>
        Bikram Sambat years <strong>1979–2100</strong> inclusive, corresponding to the Gregorian range{" "}
        <strong>1922-04-13 to 2044-04-13</strong>. That range comes from the verified calendar data itself, not an
        assumption — see{" "}
        <a href="/docs/data-verification" className="text-accent underline underline-offset-4">
          calendar data sources &amp; verification
        </a>{" "}
        for why, and for the one known limitation (BS 1979–1999 isn&apos;t checked against a live calendar source).
      </P>

      <H2>Where to next</H2>
      <P>
        The <a href="/docs/api/conversion" className="text-accent underline underline-offset-4">API reference</a>{" "}
        covers everything: conversion, date arithmetic, comparison, formatting, Nepali digits, and calendar-grid
        helpers for building calendar UIs.
      </P>
    </>
  );
}
