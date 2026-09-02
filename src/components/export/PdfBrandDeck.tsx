import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  pdf,
} from "@react-pdf/renderer"
import fileSaver from "file-saver"
import React from "react"
import type { ColorSwatch } from "../../lib/colorUtils"
import { computeTypeScale } from "../../lib/fontLoader"

const saveAs = fileSaver.saveAs

// Yoga Flexbox compatible styles
const styles = StyleSheet.create({
  page: {
    width: "100%",
    height: "100%",
    backgroundColor: "#090d16",
    color: "#f8fafc",
    padding: 40,
    fontFamily: "Helvetica",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  coverPage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#090d16",
    color: "#ffffff",
    padding: 60,
    fontFamily: "Helvetica",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
    paddingBottom: 15,
    marginBottom: 25,
  },
  headerTitle: {
    fontSize: 12,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  headerPageNum: {
    fontSize: 10,
    color: "#64748b",
  },
  footer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#1e293b",
    paddingTop: 12,
    marginTop: 20,
  },
  footerText: {
    fontSize: 9,
    color: "#64748b",
  },
  slideTitle: {
    fontSize: 26,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    marginBottom: 6,
  },
  slideSubtitle: {
    fontSize: 12,
    color: "#94a3b8",
    marginBottom: 20,
  },
  contentRow: {
    display: "flex",
    flexDirection: "row",
    gap: 20,
    flexGrow: 1,
  },
  col2: {
    width: "50%",
    display: "flex",
    flexDirection: "column",
  },
  col3: {
    width: "33.3%",
    display: "flex",
    flexDirection: "column",
  },
  card: {
    backgroundColor: "#131b2e",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  cardLabel: {
    fontSize: 10,
    color: "#6366f1",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
    fontFamily: "Helvetica-Bold",
  },
  cardBody: {
    fontSize: 11,
    color: "#e2e8f0",
    lineHeight: 1.5,
  },
  swatchGrid: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  swatchCard: {
    width: "48%",
    backgroundColor: "#131b2e",
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#1e293b",
    marginBottom: 8,
  },
  swatchColorBar: {
    height: 48,
    width: "100%",
  },
  swatchInfo: {
    padding: 10,
  },
  swatchName: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
  },
  swatchRole: {
    fontSize: 9,
    color: "#818cf8",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  swatchHex: {
    fontSize: 9,
    color: "#94a3b8",
    fontFamily: "Courier",
  },
  typeRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
  },
  typeName: {
    fontSize: 11,
    color: "#e2e8f0",
    width: "25%",
  },
  typeSample: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    width: "50%",
  },
  typeSpecs: {
    fontSize: 9,
    color: "#64748b",
    width: "25%",
    textAlign: "right",
  },
})

export interface BrandPdfProps {
  brandName: string
  tagline: string
  mission: string
  vision: string
  coreValues: string[]
  toneRatings: {
    formal: number
    playful: number
    minimalist: number
    bold: number
  }
  colors: ColorSwatch[]
  displayFont: string
  bodyFont: string
  monoFont: string
  baseFontSize: number
  typeScaleRatio: number
}

/**
 * Multi-page React-PDF vector brand guideline presentation document.
 * Features:
 * - Cover page with brand name, tagline, and generated date.
 * - Strategy page outlining Mission, Vision, and Core Values.
 * - Color Palette page displaying swatches, hex codes, and color roles.
 * - Typography page with computed type scale samples and font pairings.
 *
 * @component
 * @param {BrandPdfProps} props - The brand specification props.
 * @returns {React.ReactElement} The React-PDF Document component.
 */
export const BrandPdfDeck: React.FC<BrandPdfProps> = ({
  brandName,
  tagline,
  mission,
  vision,
  coreValues,
  toneRatings,
  colors,
  displayFont,
  bodyFont,
  monoFont,
  baseFontSize,
  typeScaleRatio,
}) => {
  const typeScale = computeTypeScale(baseFontSize, typeScaleRatio)
  const primaryColor =
    colors.find((c) => c.role === "primary")?.hex || "#6366f1"

  return (
    <Document title={`${brandName} - Brand Guidelines`} author="Brand10 Studio">
      {/* SLIDE 1: COVER */}
      <Page size="A4" orientation="landscape" style={styles.coverPage}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: "#818cf8",
              letterSpacing: 2,
              textTransform: "uppercase",
              fontFamily: "Helvetica-Bold",
            }}
          >
            Brand Identity Specification
          </Text>
          <Text style={{ fontSize: 11, color: "#64748b" }}>
            v1.0 • {new Date().getFullYear()}
          </Text>
        </View>

        <View style={{ marginVertical: "auto" }}>
          <View
            style={{
              width: 48,
              height: 6,
              backgroundColor: primaryColor,
              borderRadius: 3,
              marginBottom: 20,
            }}
          />
          <Text
            style={{
              fontSize: 48,
              fontFamily: "Helvetica-Bold",
              color: "#ffffff",
              marginBottom: 12,
            }}
          >
            {brandName}
          </Text>
          <Text
            style={{
              fontSize: 18,
              color: "#94a3b8",
              lineHeight: 1.4,
              maxWidth: "80%",
            }}
          >
            {tagline ||
              "Strategic Brand Guidelines, Asset Specifications & Design Tokens"}
          </Text>
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            borderTopWidth: 1,
            borderTopColor: "#1e293b",
            paddingTop: 16,
          }}
        >
          <Text style={{ fontSize: 10, color: "#64748b" }}>
            Generated via Brand10 Brand Studio
          </Text>
          <Text style={{ fontSize: 10, color: "#64748b" }}>
            Confidential & Proprietary
          </Text>
        </View>
      </Page>

      {/* SLIDE 2: STRATEGY & TONE */}
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{brandName} • Brand Strategy</Text>
          <Text style={styles.headerPageNum}>02</Text>
        </View>

        <View style={{ flexGrow: 1 }}>
          <Text style={styles.slideTitle}>Mission, Vision & Tone of Voice</Text>
          <Text style={styles.slideSubtitle}>
            The philosophical foundation and behavioral identity of {brandName}.
          </Text>

          <View style={styles.contentRow}>
            <View style={styles.col2}>
              <View style={styles.card}>
                <Text style={styles.cardLabel}>Brand Mission</Text>
                <Text style={styles.cardBody}>
                  {mission ||
                    "To empower and accelerate meaningful innovation with radical clarity."}
                </Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardLabel}>Brand Vision</Text>
                <Text style={styles.cardBody}>
                  {vision ||
                    "To become the defining benchmark of craft, intelligence, and design excellence."}
                </Text>
              </View>
            </View>

            <View style={styles.col2}>
              <View style={styles.card}>
                <Text style={styles.cardLabel}>Core Values</Text>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    marginTop: 4,
                  }}
                >
                  {(coreValues.length
                    ? coreValues
                    : ["Excellence", "Integrity", "Innovation", "Craft"]
                  ).map((val, i) => (
                    <Text key={i} style={{ fontSize: 11, color: "#e2e8f0" }}>
                      • {val}
                    </Text>
                  ))}
                </View>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardLabel}>Tone Dimensions</Text>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    marginTop: 4,
                  }}
                >
                  <Text style={{ fontSize: 10, color: "#94a3b8" }}>
                    Formal vs Casual: {toneRatings.formal}%
                  </Text>
                  <Text style={{ fontSize: 10, color: "#94a3b8" }}>
                    Playful vs Serious: {toneRatings.playful}%
                  </Text>
                  <Text style={{ fontSize: 10, color: "#94a3b8" }}>
                    Minimalist vs Rich: {toneRatings.minimalist}%
                  </Text>
                  <Text style={{ fontSize: 10, color: "#94a3b8" }}>
                    Bold vs Subtle: {toneRatings.bold}%
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{brandName} Design System</Text>
          <Text style={styles.footerText}>Section 01: Strategy</Text>
        </View>
      </Page>

      {/* SLIDE 3: COLOR SYSTEM */}
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {brandName} • Color Architecture
          </Text>
          <Text style={styles.headerPageNum}>03</Text>
        </View>

        <View style={{ flexGrow: 1 }}>
          <Text style={styles.slideTitle}>Harmonic Color Palette</Text>
          <Text style={styles.slideSubtitle}>
            Strict color formulas calibrated for digital interfaces and
            high-fidelity print.
          </Text>

          <View style={styles.swatchGrid}>
            {colors.slice(0, 6).map((c) => (
              <View key={c.id} style={styles.swatchCard}>
                <View
                  style={[styles.swatchColorBar, { backgroundColor: c.hex }]}
                />
                <View style={styles.swatchInfo}>
                  <Text style={styles.swatchRole}>{c.role}</Text>
                  <Text style={styles.swatchName}>{c.name}</Text>
                  <Text style={styles.swatchHex}>{c.hex.toUpperCase()}</Text>
                  <Text
                    style={[
                      styles.swatchHex,
                      { fontSize: 8, color: "#64748b", marginTop: 2 },
                    ]}
                  >
                    RGB: {c.rgb.r}, {c.rgb.g}, {c.rgb.b} | CMYK: {c.cmyk.c}%,{" "}
                    {c.cmyk.m}%, {c.cmyk.y}%, {c.cmyk.k}%
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{brandName} Design System</Text>
          <Text style={styles.footerText}>Section 02: Color Matrix</Text>
        </View>
      </Page>

      {/* SLIDE 4: TYPOGRAPHY SYSTEM */}
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {brandName} • Typographic Scale
          </Text>
          <Text style={styles.headerPageNum}>04</Text>
        </View>

        <View style={{ flexGrow: 1 }}>
          <Text style={styles.slideTitle}>Typography & Hierarchy</Text>
          <Text style={styles.slideSubtitle}>
            Display: {displayFont} • Body: {bodyFont} • Monospace: {monoFont}{" "}
            (Ratio: {typeScaleRatio})
          </Text>

          <View
            style={{
              backgroundColor: "#131b2e",
              borderRadius: 8,
              padding: 16,
              borderWidth: 1,
              borderColor: "#1e293b",
            }}
          >
            {typeScale.slice(0, 5).map((step) => (
              <View key={step.name} style={styles.typeRow}>
                <Text style={styles.typeName}>{step.name}</Text>
                <Text
                  style={[
                    styles.typeSample,
                    { fontSize: Math.min(22, step.fontSizePx * 0.6) },
                  ]}
                >
                  {brandName} Experience
                </Text>
                <Text style={styles.typeSpecs}>
                  {step.fontSizePx}px / LH {step.lineHeight}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{brandName} Design System</Text>
          <Text style={styles.footerText}>Section 03: Typography</Text>
        </View>
      </Page>
    </Document>
  )
}

/**
 * Generate and trigger download for 16:9 Landscape PDF
 */
export async function downloadBrandPdf(props: BrandPdfProps): Promise<void> {
  const blob = await pdf(<BrandPdfDeck {...props} />).toBlob()
  const slug = props.brandName.toLowerCase().replace(/[^a-z0-9]+/g, "-")
  saveAs(blob, `${slug}-brand-guidelines-deck.pdf`)
}
