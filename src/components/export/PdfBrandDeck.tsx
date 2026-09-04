import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  Image,
  pdf,
} from "@react-pdf/renderer"
import fileSaver from "file-saver"
import React from "react"
import type { ColorSwatch } from "@/lib/colorUtils"
import { getWcagContrast } from "@/lib/colorUtils"
import { computeTypeScale } from "@/lib/fontLoader"
import type { BrandDoDontItem } from "@/store/brandStore"
import type { PreviewStyleId } from "@/components/wizard/preview/pages/A4PageFrame"
import { IMAGERY_MOOD_IMAGE_ARRAYS } from "@/data/wizard"

const saveAs = fileSaver.saveAs

/**
 * 4 Presentation theme color tokens matching A4PageFrame
 */
interface ThemeColors {
  pageBg: string
  text: string
  textMuted: string
  border: string
  cardBg: string
  cardBorder: string
  badgeBg: string
  badgeText: string
}

const THEME_TOKENS: Record<PreviewStyleId, ThemeColors> = {
  minimal: {
    pageBg: "#ffffff",
    text: "#18181b",
    textMuted: "#71717a",
    border: "#e4e4e7",
    cardBg: "#f8fafc",
    cardBorder: "#e2e8f0",
    badgeBg: "#f1f5f9",
    badgeText: "#334155",
  },
  cinematic: {
    pageBg: "#09090b",
    text: "#fafafa",
    textMuted: "#a1a1aa",
    border: "#27272a",
    cardBg: "#141418",
    cardBorder: "#27272a",
    badgeBg: "#22242a",
    badgeText: "#e2e8f0",
  },
  vibrant: {
    pageBg: "#fafaf9",
    text: "#18181b",
    textMuted: "#78716c",
    border: "#e7e5e4",
    cardBg: "#f5f5f4",
    cardBorder: "#e7e5e4",
    badgeBg: "#e7e5e4",
    badgeText: "#292524",
  },
  candid: {
    pageBg: "#faf8f5",
    text: "#18181b",
    textMuted: "#78716c",
    border: "#eae5dc",
    cardBg: "#f5f0e8",
    cardBorder: "#eae5dc",
    badgeBg: "#ebe5db",
    badgeText: "#292524",
  },
}

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
  logoUrl?: string
  rasterDataUri?: string
  clearspaceMultiplier?: number
  dosAndDonts?: BrandDoDontItem[]
  imageryMood?: string
  imageryOverlay?: string
  imageryLinks?: string[]
  iconStyle?: string
  styleTheme?: PreviewStyleId
}

const styles = StyleSheet.create({
  page: {
    width: "100%",
    height: "100%",
    paddingTop: 36,
    paddingBottom: 36,
    paddingLeft: 40,
    paddingRight: 40,
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
    paddingBottom: 10,
    marginBottom: 16,
  },
  headerLeft: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerSectionNum: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1,
  },
  headerSectionDivider: {
    width: 1,
    height: 10,
  },
  headerSectionTitle: {
    fontSize: 9,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  headerRight: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  headerBrandName: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
  },
  headerMetaSub: {
    fontSize: 8,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  footer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    paddingTop: 10,
    marginTop: 16,
  },
  footerLeft: {
    fontSize: 8,
  },
  footerRight: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  footerPageNum: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
  },
  contentBody: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  badgeRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  badge: {
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.5,
  },
  pageTitle: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 9,
    lineHeight: 1.4,
    marginBottom: 14,
  },
  // Cards
  card: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
  },
  cardTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  cardBody: {
    fontSize: 8.5,
    lineHeight: 1.45,
  },
  grid2: {
    display: "flex",
    flexDirection: "row",
    gap: 12,
  },
  col2: {
    width: "50%",
  },
  grid3: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  col3: {
    width: "33.3%",
  },
})

export const BrandPdfDeck: React.FC<BrandPdfProps> = ({
  brandName,
  tagline,
  mission,
  vision,
  coreValues,
  colors,
  displayFont,
  bodyFont,
  monoFont,
  baseFontSize,
  typeScaleRatio,
  logoUrl,
  rasterDataUri,
  clearspaceMultiplier = 1.5,
  dosAndDonts = [],
  styleTheme = "minimal",
}) => {
  const currentTheme = THEME_TOKENS[styleTheme]
  const primaryColor =
    colors.find((c) => c.role === "primary")?.hex || "#6366f1"
  const secondaryColor =
    colors.find((c) => c.role === "secondary")?.hex || "#0ea5e9"
  const monogram = (brandName || "Brand").charAt(0).toUpperCase()
  const activeYear = new Date().getFullYear()
  const typeScale = computeTypeScale(baseFontSize, typeScaleRatio)
  const resolvedMood = styleTheme === "candid" ? "editorial" : styleTheme
  const moodImages = IMAGERY_MOOD_IMAGE_ARRAYS[resolvedMood]

  const renderHeader = (sectionNumber: string, sectionTitle: string) => (
    <View style={[styles.header, { borderBottomColor: currentTheme.border }]}>
      <View style={styles.headerLeft}>
        <Text style={[styles.headerSectionNum, { color: currentTheme.text }]}>
          {sectionNumber}
        </Text>
        <View
          style={[
            styles.headerSectionDivider,
            { backgroundColor: currentTheme.border },
          ]}
        />
        <Text
          style={[
            styles.headerSectionTitle,
            { color: currentTheme.textMuted },
          ]}
        >
          {sectionTitle}
        </Text>
      </View>
      <View style={styles.headerRight}>
        <Text style={[styles.headerBrandName, { color: currentTheme.text }]}>
          {brandName || "Brand Architecture"}
        </Text>
        <Text style={{ fontSize: 8, color: currentTheme.textMuted }}>|</Text>
        <Text style={[styles.headerMetaSub, { color: currentTheme.textMuted }]}>
          GUIDELINES
        </Text>
      </View>
    </View>
  )

  const renderFooter = (pageNumber: number) => (
    <View style={[styles.footer, { borderTopColor: currentTheme.border }]}>
      <View style={styles.footerLeft}>
        <Text style={{ color: currentTheme.textMuted }}>
          {brandName || "Brand"} Guidelines •{" "}
          {styleTheme.charAt(0).toUpperCase() + styleTheme.slice(1)} Edition
        </Text>
      </View>
      <View style={styles.footerRight}>
        <Text style={{ fontSize: 8, color: currentTheme.textMuted }}>
          Confidential
        </Text>
        <Text style={[styles.footerPageNum, { color: currentTheme.text }]}>
          {String(pageNumber).padStart(2, "0")} / 06
        </Text>
      </View>
    </View>
  )

  return (
    <Document
      title={`${brandName} - Brand Guidelines (${styleTheme})`}
      author="Brand10 Studio"
    >
      {/* PAGE 1: COVER & FOUNDATION */}
      <Page
        size="A4"
        orientation="portrait"
        style={[
          styles.page,
          {
            backgroundColor: currentTheme.pageBg,
            color: currentTheme.text,
          },
        ]}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={styles.badgeRow}>
            <View
              style={[
                styles.badge,
                { backgroundColor: currentTheme.badgeBg },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  { color: currentTheme.badgeText },
                ]}
              >
                BRAND GUIDELINES
              </Text>
            </View>
            <View
              style={[
                styles.badge,
                { backgroundColor: primaryColor },
              ]}
            >
              <Text style={[styles.badgeText, { color: "#ffffff" }]}>
                {styleTheme.toUpperCase()} EDITION
              </Text>
            </View>
          </View>
          <Text style={{ fontSize: 8.5, color: currentTheme.textMuted }}>
            Vol. {activeYear}
          </Text>
        </View>

        {/* Center Hero Block */}
        <View style={{ marginVertical: "auto" }}>
          {/* Logo or Monogram */}
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 14,
              marginBottom: 18,
            }}
          >
            {rasterDataUri || logoUrl ? (
              <Image
                src={rasterDataUri || logoUrl}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: currentTheme.border,
                  objectFit: "contain",
                }}
              />
            ) : (
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 10,
                  backgroundColor: primaryColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 26,
                    fontFamily: "Helvetica-Bold",
                    color: "#ffffff",
                  }}
                >
                  {monogram}
                </Text>
              </View>
            )}
            <View>
              <Text
                style={{
                  fontSize: 8.5,
                  fontFamily: "Helvetica-Bold",
                  letterSpacing: 1.5,
                  color: currentTheme.textMuted,
                  textTransform: "uppercase",
                  marginBottom: 3,
                }}
              >
                Official Brand Manual
              </Text>
              <View
                style={{
                  width: 36,
                  height: 3,
                  borderRadius: 2,
                  backgroundColor: primaryColor,
                }}
              />
            </View>
          </View>

          {/* Title and Tagline */}
          <Text
            style={{
              fontSize: 34,
              fontFamily: "Helvetica-Bold",
              color: currentTheme.text,
              marginBottom: 8,
              letterSpacing: -0.5,
            }}
          >
            {brandName || "Brand Architecture"}
          </Text>
          <Text
            style={{
              fontSize: 12,
              lineHeight: 1.45,
              color: currentTheme.textMuted,
              maxWidth: "88%",
              marginBottom: 24,
            }}
          >
            {tagline ||
              "Comprehensive visual design systems, tokens, and brand governance specifications."}
          </Text>

          {/* Mission & Vision Pillars */}
          <View style={styles.grid2}>
            <View
              style={[
                styles.col2,
                styles.card,
                {
                  backgroundColor: currentTheme.cardBg,
                  borderColor: currentTheme.cardBorder,
                },
              ]}
            >
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: currentTheme.badgeBg,
                    alignSelf: "flex-start",
                    marginBottom: 6,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    { color: currentTheme.badgeText },
                  ]}
                >
                  MISSION
                </Text>
              </View>
              <Text
                style={[styles.cardBody, { color: currentTheme.text }]}
              >
                {mission ||
                  "Empowering users with coherent, accessible, and delightful design systems built for modern digital scale."}
              </Text>
            </View>

            <View
              style={[
                styles.col2,
                styles.card,
                {
                  backgroundColor: currentTheme.cardBg,
                  borderColor: currentTheme.cardBorder,
                },
              ]}
            >
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: currentTheme.badgeBg,
                    alignSelf: "flex-start",
                    marginBottom: 6,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    { color: currentTheme.badgeText },
                  ]}
                >
                  VISION
                </Text>
              </View>
              <Text
                style={[styles.cardBody, { color: currentTheme.text }]}
              >
                {vision ||
                  "Setting the benchmark for cross-platform visual harmony and effortless brand identity expression."}
              </Text>
            </View>
          </View>
        </View>

        {/* Cover Bottom Info */}
        <View style={{ marginTop: "auto" }}>
          {coreValues.length > 0 && (
            <View style={{ marginBottom: 12 }}>
              <Text
                style={{
                  fontSize: 7.5,
                  fontFamily: "Helvetica-Bold",
                  letterSpacing: 1.2,
                  color: currentTheme.textMuted,
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                Guiding Core Values
              </Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 5,
                }}
              >
                {coreValues.slice(0, 5).map((val, idx) => (
                  <View
                    key={idx}
                    style={{
                      borderWidth: 1,
                      borderColor: currentTheme.border,
                      borderRadius: 4,
                      paddingVertical: 2.5,
                      paddingHorizontal: 6,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 7.5,
                        color: currentTheme.text,
                      }}
                    >
                      {val}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View
            style={[
              styles.footer,
              { borderTopColor: currentTheme.border },
            ]}
          >
            <Text style={{ fontSize: 8, color: currentTheme.textMuted }}>
              Standard A4 Specification • Published {activeYear}
            </Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
              }}
            >
              <View
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: primaryColor,
                }}
              />
              <View
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: secondaryColor,
                }}
              />
              <Text style={{ fontSize: 8, color: currentTheme.textMuted }}>
                Color Harmonized
              </Text>
            </View>
          </View>
        </View>
      </Page>

      {/* PAGE 2: LOGO SYSTEM & GEOMETRY */}
      <Page
        size="A4"
        orientation="portrait"
        style={[
          styles.page,
          {
            backgroundColor: currentTheme.pageBg,
            color: currentTheme.text,
          },
        ]}
      >
        {renderHeader("02", "Logo System & Geometry")}

        <View style={styles.contentBody}>
          <View>
            <View style={styles.badgeRow}>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: currentTheme.badgeBg },
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    { color: currentTheme.badgeText },
                  ]}
                >
                  BRAND MARK
                </Text>
              </View>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: primaryColor },
                ]}
              >
                <Text style={[styles.badgeText, { color: "#ffffff" }]}>
                  CLEARSPACE {clearspaceMultiplier}X
                </Text>
              </View>
            </View>
            <Text
              style={[styles.pageTitle, { color: currentTheme.text }]}
            >
              Primary & Secondary Marks
            </Text>
            <Text
              style={[
                styles.pageSubtitle,
                { color: currentTheme.textMuted },
              ]}
            >
              The brandmark serves as the cornerstone of our visual identity.
              Maintain correct clearspace, proportions, and background contrast.
            </Text>

            {/* Dual Stage: Light & Dark Presentation */}
            <View style={[styles.grid2, { marginBottom: 14 }]}>
              {/* Light Stage */}
              <View
                style={[
                  styles.col2,
                  styles.card,
                  {
                    backgroundColor: "#ffffff",
                    borderColor: "#e4e4e7",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingVertical: 20,
                  },
                ]}
              >
                <Text
                  style={{
                    fontSize: 7.5,
                    fontFamily: "Helvetica-Bold",
                    color: "#71717a",
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    marginBottom: 10,
                  }}
                >
                  Light Canvas
                </Text>
                {rasterDataUri || logoUrl ? (
                  <Image
                    src={rasterDataUri || logoUrl}
                    style={{
                      maxHeight: 50,
                      maxWidth: 120,
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 8,
                      backgroundColor: primaryColor,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        fontFamily: "Helvetica-Bold",
                        color: "#ffffff",
                      }}
                    >
                      {monogram}
                    </Text>
                  </View>
                )}
                <Text
                  style={{
                    fontSize: 7.5,
                    color: "#71717a",
                    marginTop: 10,
                  }}
                >
                  {brandName} Mark
                </Text>
              </View>

              {/* Dark Stage */}
              <View
                style={[
                  styles.col2,
                  styles.card,
                  {
                    backgroundColor: "#09090b",
                    borderColor: "#27272a",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingVertical: 20,
                  },
                ]}
              >
                <Text
                  style={{
                    fontSize: 7.5,
                    fontFamily: "Helvetica-Bold",
                    color: "#a1a1aa",
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    marginBottom: 10,
                  }}
                >
                  Dark Canvas
                </Text>
                {rasterDataUri || logoUrl ? (
                  <Image
                    src={rasterDataUri || logoUrl}
                    style={{
                      maxHeight: 50,
                      maxWidth: 120,
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 8,
                      backgroundColor: primaryColor,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        fontFamily: "Helvetica-Bold",
                        color: "#ffffff",
                      }}
                    >
                      {monogram}
                    </Text>
                  </View>
                )}
                <Text
                  style={{
                    fontSize: 7.5,
                    color: "#a1a1aa",
                    marginTop: 10,
                  }}
                >
                  Reversed Contrast
                </Text>
              </View>
            </View>

            {/* Clearspace Requirements */}
            <View
              style={[
                styles.card,
                {
                  backgroundColor: currentTheme.cardBg,
                  borderColor: currentTheme.cardBorder,
                  marginBottom: 14,
                },
              ]}
            >
              <Text
                style={[styles.cardTitle, { color: currentTheme.text }]}
              >
                Exclusion Clearspace Bound: {clearspaceMultiplier}x
              </Text>
              <Text
                style={[styles.cardBody, { color: currentTheme.textMuted }]}
              >
                Preserve an exclusion zone equal to at least{" "}
                {clearspaceMultiplier}x the mark unit perimeter. No other
                graphic elements, text lockups, photography edges, or trim borders
                may infringe on this breathing room.
              </Text>
            </View>

            {/* Do's and Don'ts */}
            <Text
              style={{
                fontSize: 10,
                fontFamily: "Helvetica-Bold",
                color: currentTheme.text,
                marginBottom: 6,
              }}
            >
              Brand Governance & Usage Rules
            </Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              {(dosAndDonts.length > 0
                ? dosAndDonts.slice(0, 4)
                : [
                    {
                      id: "1",
                      type: "do" as const,
                      rule: "Use approved vectors",
                      detail:
                        "Always scale proportionately using source vector assets.",
                    },
                    {
                      id: "2",
                      type: "dont" as const,
                      rule: "Do not distort",
                      detail:
                        "Never skew, rotate off-axis, or alter geometry.",
                    },
                    {
                      id: "3",
                      type: "do" as const,
                      rule: "Maintain contrast",
                      detail:
                        "Ensure background values pass minimum accessibility requirements.",
                    },
                    {
                      id: "4",
                      type: "dont" as const,
                      rule: "Do not add unapproved effects",
                      detail:
                        "No unapproved drop shadows, outer glows, or bevels.",
                    },
                  ]
              ).map((item) => (
                <View
                  key={item.id}
                  style={[
                    styles.card,
                    {
                      width: "48.5%",
                      backgroundColor: currentTheme.cardBg,
                      borderColor: currentTheme.cardBorder,
                      padding: 8,
                    },
                  ]}
                >
                  <View
                    style={{
                      paddingVertical: 2,
                      paddingHorizontal: 5,
                      borderRadius: 3,
                      alignSelf: "flex-start",
                      backgroundColor:
                        item.type === "do" ? "#dcfce7" : "#fee2e2",
                      marginBottom: 4,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 7,
                        fontFamily: "Helvetica-Bold",
                        color: item.type === "do" ? "#15803d" : "#b91c1c",
                      }}
                    >
                      {item.type === "do" ? "APPROVED / DO" : "FORBIDDEN / DONT"}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 8,
                      fontFamily: "Helvetica-Bold",
                      color: currentTheme.text,
                      marginBottom: 2,
                    }}
                  >
                    {item.rule}
                  </Text>
                  <Text
                    style={{
                      fontSize: 7.5,
                      color: currentTheme.textMuted,
                      lineHeight: 1.35,
                    }}
                  >
                    {item.detail}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {renderFooter(2)}
      </Page>

      {/* PAGE 3: COLOR MATRIX & PALETTE */}
      <Page
        size="A4"
        orientation="portrait"
        style={[
          styles.page,
          {
            backgroundColor: currentTheme.pageBg,
            color: currentTheme.text,
          },
        ]}
      >
        {renderHeader("03", "Color Matrix & Palette")}

        <View style={styles.contentBody}>
          <View>
            <View style={styles.badgeRow}>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: currentTheme.badgeBg },
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    { color: currentTheme.badgeText },
                  ]}
                >
                  CHROMA TOKENS
                </Text>
              </View>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: "#10b981" },
                ]}
              >
                <Text style={[styles.badgeText, { color: "#ffffff" }]}>
                  WCAG 2.1 AA COMPLIANT
                </Text>
              </View>
            </View>
            <Text
              style={[styles.pageTitle, { color: currentTheme.text }]}
            >
              Harmonized Chromatic System
            </Text>
            <Text
              style={[
                styles.pageSubtitle,
                { color: currentTheme.textMuted },
              ]}
            >
              Engineered for high-contrast accessibility, dark-mode adaptability,
              and digital surface consistency across all brand applications.
            </Text>

            {/* Core Hero Color Card */}
            <View
              style={[
                styles.card,
                {
                  backgroundColor: primaryColor,
                  borderColor: primaryColor,
                  padding: 16,
                  marginBottom: 16,
                },
              ]}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View>
                  <View
                    style={[
                      styles.badge,
                      {
                        backgroundColor: "rgba(255,255,255,0.25)",
                        alignSelf: "flex-start",
                        marginBottom: 6,
                      },
                    ]}
                  >
                    <Text
                      style={[styles.badgeText, { color: "#ffffff" }]}
                    >
                      CORE HERO COLOR
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: "Helvetica-Bold",
                      color: "#ffffff",
                      marginBottom: 4,
                    }}
                  >
                    {colors[0]?.name || "Primary Brand"}
                  </Text>
                  <Text
                    style={{
                      fontSize: 9,
                      fontFamily: "Courier",
                      color: "#ffffff",
                      opacity: 0.9,
                    }}
                  >
                    HEX {primaryColor.toUpperCase()}
                  </Text>
                </View>

                <View
                  style={{
                    backgroundColor: "rgba(255,255,255,0.18)",
                    borderRadius: 6,
                    padding: 8,
                    alignItems: "flex-end",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 7.5,
                      color: "#ffffff",
                      opacity: 0.85,
                      marginBottom: 2,
                    }}
                  >
                    Contrast vs White
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: "Helvetica-Bold",
                      color: "#ffffff",
                    }}
                  >
                    {getWcagContrast(primaryColor, "#ffffff").ratio.toFixed(1)}:1
                  </Text>
                  <Text
                    style={{
                      fontSize: 7,
                      color: "#ffffff",
                      opacity: 0.85,
                    }}
                  >
                    WCAG AA Certified
                  </Text>
                </View>
              </View>
            </View>

            {/* Supporting Swatches Grid */}
            <Text
              style={{
                fontSize: 10,
                fontFamily: "Helvetica-Bold",
                color: currentTheme.text,
                marginBottom: 8,
              }}
            >
              Supporting Brand Palette & Roles
            </Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              {colors.slice(0, 6).map((swatch) => (
                <View
                  key={swatch.id}
                  style={[
                    styles.card,
                    {
                      width: "48.5%",
                      backgroundColor: currentTheme.cardBg,
                      borderColor: currentTheme.cardBorder,
                      padding: 0,
                      overflow: "hidden",
                    },
                  ]}
                >
                  <View
                    style={{
                      height: 28,
                      width: "100%",
                      backgroundColor: swatch.hex,
                    }}
                  />
                  <View style={{ padding: 8 }}>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 2,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 8.5,
                          fontFamily: "Helvetica-Bold",
                          color: currentTheme.text,
                        }}
                      >
                        {swatch.name}
                      </Text>
                      <Text
                        style={{
                          fontSize: 7,
                          fontFamily: "Helvetica-Bold",
                          color: primaryColor,
                          textTransform: "uppercase",
                        }}
                      >
                        {swatch.role}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: 7.5,
                        fontFamily: "Courier",
                        color: currentTheme.textMuted,
                      }}
                    >
                      {swatch.hex.toUpperCase()} • RGB {swatch.rgb.r},{" "}
                      {swatch.rgb.g}, {swatch.rgb.b}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        {renderFooter(3)}
      </Page>

      {/* PAGE 4: TYPOGRAPHY & SCALE HIERARCHY */}
      <Page
        size="A4"
        orientation="portrait"
        style={[
          styles.page,
          {
            backgroundColor: currentTheme.pageBg,
            color: currentTheme.text,
          },
        ]}
      >
        {renderHeader("04", "Typography & Scale Hierarchy")}

        <View style={styles.contentBody}>
          <View>
            <View style={styles.badgeRow}>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: currentTheme.badgeBg },
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    { color: currentTheme.badgeText },
                  ]}
                >
                  TYPE SYSTEM
                </Text>
              </View>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: primaryColor },
                ]}
              >
                <Text style={[styles.badgeText, { color: "#ffffff" }]}>
                  MODULAR RATIO {typeScaleRatio}
                </Text>
              </View>
            </View>
            <Text
              style={[styles.pageTitle, { color: currentTheme.text }]}
            >
              Typographic Architecture
            </Text>
            <Text
              style={[
                styles.pageSubtitle,
                { color: currentTheme.textMuted },
              ]}
            >
              A cohesive typographic hierarchy balancing display distinction
              with body readability and clean code notation.
            </Text>

            {/* 3 Voice Cards */}
            <View style={[styles.grid3, { marginBottom: 16 }]}>
              <View
                style={[
                  styles.col3,
                  styles.card,
                  {
                    backgroundColor: currentTheme.cardBg,
                    borderColor: currentTheme.cardBorder,
                  },
                ]}
              >
                <Text
                  style={{
                    fontSize: 7,
                    fontFamily: "Helvetica-Bold",
                    color: currentTheme.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: 0.8,
                    marginBottom: 4,
                  }}
                >
                  01 Display Voice
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: "Helvetica-Bold",
                    color: currentTheme.text,
                    marginBottom: 4,
                  }}
                >
                  {displayFont || "Inter"}
                </Text>
                <Text
                  style={{
                    fontSize: 7,
                    color: currentTheme.textMuted,
                    lineHeight: 1.3,
                  }}
                >
                  Hero titles, marketing headers, and impact statements.
                </Text>
              </View>

              <View
                style={[
                  styles.col3,
                  styles.card,
                  {
                    backgroundColor: currentTheme.cardBg,
                    borderColor: currentTheme.cardBorder,
                  },
                ]}
              >
                <Text
                  style={{
                    fontSize: 7,
                    fontFamily: "Helvetica-Bold",
                    color: currentTheme.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: 0.8,
                    marginBottom: 4,
                  }}
                >
                  02 Body Interface
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: "Helvetica-Bold",
                    color: currentTheme.text,
                    marginBottom: 4,
                  }}
                >
                  {bodyFont || "Inter"}
                </Text>
                <Text
                  style={{
                    fontSize: 7,
                    color: currentTheme.textMuted,
                    lineHeight: 1.3,
                  }}
                >
                  Paragraphs, UI button labels, cards, and data readouts.
                </Text>
              </View>

              <View
                style={[
                  styles.col3,
                  styles.card,
                  {
                    backgroundColor: currentTheme.cardBg,
                    borderColor: currentTheme.cardBorder,
                  },
                ]}
              >
                <Text
                  style={{
                    fontSize: 7,
                    fontFamily: "Helvetica-Bold",
                    color: currentTheme.textMuted,
                    textTransform: "uppercase",
                    letterSpacing: 0.8,
                    marginBottom: 4,
                  }}
                >
                  03 Monospace
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: "Courier-Bold",
                    color: currentTheme.text,
                    marginBottom: 4,
                  }}
                >
                  {monoFont || "JetBrains Mono"}
                </Text>
                <Text
                  style={{
                    fontSize: 7,
                    color: currentTheme.textMuted,
                    lineHeight: 1.3,
                  }}
                >
                  Code tokens, hex values, technical specifications.
                </Text>
              </View>
            </View>

            {/* Type Scale Hierarchy Table */}
            <Text
              style={{
                fontSize: 10,
                fontFamily: "Helvetica-Bold",
                color: currentTheme.text,
                marginBottom: 8,
              }}
            >
              Modular Scale Hierarchy (Base: {baseFontSize}px)
            </Text>
            <View
              style={[
                styles.card,
                {
                  backgroundColor: currentTheme.cardBg,
                  borderColor: currentTheme.cardBorder,
                  padding: 10,
                },
              ]}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  borderBottomWidth: 1,
                  borderBottomColor: currentTheme.border,
                  paddingBottom: 4,
                  marginBottom: 6,
                }}
              >
                <Text
                  style={{
                    width: "25%",
                    fontSize: 7.5,
                    fontFamily: "Helvetica-Bold",
                    color: currentTheme.textMuted,
                  }}
                >
                  LEVEL / TOKEN
                </Text>
                <Text
                  style={{
                    width: "50%",
                    fontSize: 7.5,
                    fontFamily: "Helvetica-Bold",
                    color: currentTheme.textMuted,
                  }}
                >
                  SAMPLE SPECIMEN
                </Text>
                <Text
                  style={{
                    width: "25%",
                    fontSize: 7.5,
                    fontFamily: "Helvetica-Bold",
                    color: currentTheme.textMuted,
                    textAlign: "right",
                  }}
                >
                  SIZE / LINE-HEIGHT
                </Text>
              </View>

              {typeScale.slice(0, 6).map((step) => (
                <View
                  key={step.name}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 5,
                    borderBottomWidth: 1,
                    borderBottomColor: currentTheme.border,
                  }}
                >
                  <Text
                    style={{
                      width: "25%",
                      fontSize: 8,
                      fontFamily: "Helvetica-Bold",
                      color: currentTheme.text,
                    }}
                  >
                    {step.name}
                  </Text>
                  <Text
                    style={{
                      width: "50%",
                      fontSize: Math.min(13, Math.max(8, step.fontSizePx * 0.45)),
                      fontFamily: "Helvetica-Bold",
                      color: currentTheme.text,
                    }}
                  >
                    {brandName} Experience
                  </Text>
                  <Text
                    style={{
                      width: "25%",
                      fontSize: 7.5,
                      fontFamily: "Courier",
                      color: currentTheme.textMuted,
                      textAlign: "right",
                    }}
                  >
                    {step.fontSizePx}px / LH {step.lineHeight}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {renderFooter(4)}
      </Page>

      {/* PAGE 5: IMAGERY & ART DIRECTION */}
      <Page
        size="A4"
        orientation="portrait"
        style={[
          styles.page,
          {
            backgroundColor: currentTheme.pageBg,
            color: currentTheme.text,
          },
        ]}
      >
        {renderHeader("05", "Imagery & Mood Direction")}

        <View style={styles.contentBody}>
          <View>
            <View style={styles.badgeRow}>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: currentTheme.badgeBg },
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    { color: currentTheme.badgeText },
                  ]}
                >
                  PHOTOGRAPHY ART DIRECTION
                </Text>
              </View>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: primaryColor },
                ]}
              >
                <Text style={[styles.badgeText, { color: "#ffffff" }]}>
                  {styleTheme.toUpperCase()} VIBE
                </Text>
              </View>
            </View>
            <Text
              style={[styles.pageTitle, { color: currentTheme.text }]}
            >
              Visual Tone & Photography Art Direction
            </Text>
            <Text
              style={[
                styles.pageSubtitle,
                { color: currentTheme.textMuted },
              ]}
            >
              Curated imagery standards governing brand campaign art direction,
              ambient light, and textural treatment.
            </Text>

            {/* Hero Image */}
            <View
              style={[
                styles.card,
                {
                  padding: 0,
                  overflow: "hidden",
                  height: 160,
                  backgroundColor: currentTheme.cardBg,
                  borderColor: currentTheme.cardBorder,
                  marginBottom: 10,
                },
              ]}
            >
              <Image
                src={moodImages[0]}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </View>

            {/* Supporting Image Grid */}
            <View style={[styles.grid2, { marginBottom: 12 }]}>
              <View
                style={[
                  styles.col2,
                  styles.card,
                  {
                    padding: 0,
                    overflow: "hidden",
                    height: 100,
                    backgroundColor: currentTheme.cardBg,
                    borderColor: currentTheme.cardBorder,
                  },
                ]}
              >
                <Image
                  src={moodImages[1]}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </View>

              <View
                style={[
                  styles.col2,
                  styles.card,
                  {
                    padding: 0,
                    overflow: "hidden",
                    height: 100,
                    backgroundColor: currentTheme.cardBg,
                    borderColor: currentTheme.cardBorder,
                  },
                ]}
              >
                <Image
                  src={moodImages[2]}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </View>
            </View>

            {/* Art Direction Pillars */}
            <View
              style={[
                styles.card,
                {
                  backgroundColor: currentTheme.cardBg,
                  borderColor: currentTheme.cardBorder,
                  padding: 10,
                },
              ]}
            >
              <Text
                style={[styles.cardTitle, { color: currentTheme.text }]}
              >
                Lighting, Composition & Grading
              </Text>
              <Text
                style={[styles.cardBody, { color: currentTheme.textMuted }]}
              >
                Maintain natural illumination with high dynamic range. Avoid
                over-saturated artificial filters. Subject matter must prioritize
                authentic human interaction, tactile architectural textures, and
                uncluttered balanced negative space.
              </Text>
            </View>
          </View>
        </View>

        {renderFooter(5)}
      </Page>

      {/* PAGE 6: SYSTEM SPECS & BRAND TOUCHPOINTS */}
      <Page
        size="A4"
        orientation="portrait"
        style={[
          styles.page,
          {
            backgroundColor: currentTheme.pageBg,
            color: currentTheme.text,
          },
        ]}
      >
        {renderHeader("06", "System Specs & Brand Touchpoints")}

        <View style={styles.contentBody}>
          <View>
            <View style={styles.badgeRow}>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: currentTheme.badgeBg },
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    { color: currentTheme.badgeText },
                  ]}
                >
                  PRODUCTION TOKENS
                </Text>
              </View>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: primaryColor },
                ]}
              >
                <Text style={[styles.badgeText, { color: "#ffffff" }]}>
                  SPEC v1.0
                </Text>
              </View>
            </View>
            <Text
              style={[styles.pageTitle, { color: currentTheme.text }]}
            >
              System Specs & Brand Touchpoints
            </Text>
            <Text
              style={[
                styles.pageSubtitle,
                { color: currentTheme.textMuted },
              ]}
            >
              Tangible real-world collateral mockups and complete digital token
              manifest ready for production engineering.
            </Text>

            {/* Mockups Row: Business Card & Digital Interface Card */}
            <View style={[styles.grid2, { marginBottom: 14 }]}>
              {/* Business Card Representation */}
              <View
                style={[
                  styles.col2,
                  styles.card,
                  {
                    backgroundColor: currentTheme.cardBg,
                    borderColor: currentTheme.cardBorder,
                    padding: 14,
                    height: 120,
                    justifyContent: "space-between",
                  },
                ]}
              >
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
                      fontSize: 11,
                      fontFamily: "Helvetica-Bold",
                      color: currentTheme.text,
                    }}
                  >
                    {brandName}
                  </Text>
                  <View
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 4,
                      backgroundColor: primaryColor,
                    }}
                  />
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 8,
                      fontFamily: "Helvetica-Bold",
                      color: currentTheme.text,
                    }}
                  >
                    Design Leadership
                  </Text>
                  <Text
                    style={{
                      fontSize: 7,
                      color: currentTheme.textMuted,
                      marginTop: 2,
                    }}
                  >
                    hello@{brandName.toLowerCase().replace(/[^a-z0-9]/g, "") || "brand"}.com
                  </Text>
                  <Text
                    style={{
                      fontSize: 6.5,
                      color: currentTheme.textMuted,
                      marginTop: 1,
                    }}
                  >
                    +1 (555) 019-2834 • Studio Headquarters
                  </Text>
                </View>
              </View>

              {/* Digital UI Interface Mockup */}
              <View
                style={[
                  styles.col2,
                  styles.card,
                  {
                    backgroundColor: currentTheme.cardBg,
                    borderColor: currentTheme.cardBorder,
                    padding: 12,
                    height: 120,
                    justifyContent: "space-between",
                  },
                ]}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <View
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: 3,
                      backgroundColor: "#ef4444",
                    }}
                  />
                  <View
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: 3,
                      backgroundColor: "#f59e0b",
                    }}
                  />
                  <View
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: 3,
                      backgroundColor: "#10b981",
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 7,
                      color: currentTheme.textMuted,
                      marginLeft: 4,
                    }}
                  >
                    app.{brandName.toLowerCase().replace(/[^a-z0-9]/g, "") || "brand"}.io
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 9,
                      fontFamily: "Helvetica-Bold",
                      color: currentTheme.text,
                      marginBottom: 2,
                    }}
                  >
                    Platform Dashboard
                  </Text>
                  <Text
                    style={{
                      fontSize: 7,
                      color: currentTheme.textMuted,
                    }}
                  >
                    Tailwind tokens, CSS variables, and design specs synchronized.
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: primaryColor,
                    borderRadius: 4,
                    paddingVertical: 3,
                    paddingHorizontal: 8,
                    alignSelf: "flex-start",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 7,
                      fontFamily: "Helvetica-Bold",
                      color: "#ffffff",
                    }}
                  >
                    Get Started →
                  </Text>
                </View>
              </View>
            </View>

            {/* Design Tokens Table */}
            <View
              style={[
                styles.card,
                {
                  backgroundColor: currentTheme.cardBg,
                  borderColor: currentTheme.cardBorder,
                  padding: 10,
                  marginBottom: 12,
                },
              ]}
            >
              <Text
                style={[styles.cardTitle, { color: currentTheme.text }]}
              >
                Core Engineering Tokens Manifest
              </Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 3,
                  borderBottomWidth: 1,
                  borderBottomColor: currentTheme.border,
                }}
              >
                <Text
                  style={{ fontSize: 7.5, color: currentTheme.textMuted }}
                >
                  Primary Color Token
                </Text>
                <Text
                  style={{
                    fontSize: 7.5,
                    fontFamily: "Courier-Bold",
                    color: currentTheme.text,
                  }}
                >
                  {primaryColor}
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 3,
                  borderBottomWidth: 1,
                  borderBottomColor: currentTheme.border,
                }}
              >
                <Text
                  style={{ fontSize: 7.5, color: currentTheme.textMuted }}
                >
                  Display Font Family
                </Text>
                <Text
                  style={{
                    fontSize: 7.5,
                    fontFamily: "Helvetica-Bold",
                    color: currentTheme.text,
                  }}
                >
                  {displayFont}
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 3,
                  borderBottomWidth: 1,
                  borderBottomColor: currentTheme.border,
                }}
              >
                <Text
                  style={{ fontSize: 7.5, color: currentTheme.textMuted }}
                >
                  Body Font Family
                </Text>
                <Text
                  style={{
                    fontSize: 7.5,
                    fontFamily: "Helvetica-Bold",
                    color: currentTheme.text,
                  }}
                >
                  {bodyFont}
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 3,
                }}
              >
                <Text
                  style={{ fontSize: 7.5, color: currentTheme.textMuted }}
                >
                  Modular Scale Ratio
                </Text>
                <Text
                  style={{
                    fontSize: 7.5,
                    fontFamily: "Courier-Bold",
                    color: currentTheme.text,
                  }}
                >
                  {typeScaleRatio} (Base: {baseFontSize}px)
                </Text>
              </View>
            </View>

            {/* Governance Signoff */}
            <View
              style={{
                borderWidth: 1,
                borderColor: currentTheme.border,
                borderRadius: 6,
                padding: 8,
                backgroundColor: currentTheme.cardBg,
              }}
            >
              <Text
                style={{
                  fontSize: 7.5,
                  fontFamily: "Helvetica-Bold",
                  color: currentTheme.text,
                  marginBottom: 2,
                }}
              >
                Official Signoff & Brand Governance
              </Text>
              <Text
                style={{
                  fontSize: 7,
                  color: currentTheme.textMuted,
                  lineHeight: 1.35,
                }}
              >
                Approved for worldwide release across all corporate, marketing,
                and digital product environments. Maintained under version control.
              </Text>
            </View>
          </View>
        </View>

        {renderFooter(6)}
      </Page>
    </Document>
  )
}

/**
 * Generate and trigger download for A4 Portrait PDF matching the preview
 */
export async function downloadBrandPdf(props: BrandPdfProps): Promise<void> {
  const currentStyleTheme = props.styleTheme ?? "minimal"
  const blob = await pdf(
    <BrandPdfDeck {...props} styleTheme={currentStyleTheme} />
  ).toBlob()
  const slug = props.brandName.toLowerCase().replace(/[^a-z0-9]+/g, "-")
  saveAs(blob, `${slug}-brand-guidelines-${currentStyleTheme}.pdf`)
}
