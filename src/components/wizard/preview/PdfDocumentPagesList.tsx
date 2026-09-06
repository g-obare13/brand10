import { useBrandStore } from "@/store/brandStore"
import type { PreviewStyleId } from "./pages/A4PageFrame"
import { PageColorInfo } from "./pages/PageColorInfo"
import { PageColors } from "./pages/PageColors"
import { PageBackCover } from "./pages/PageBackCover"
import { PageCover } from "./pages/PageCover"
import { PageFoundation } from "./pages/PageFoundation"
import { PageImagery } from "./pages/PageImagery"
import { PageLogo } from "./pages/PageLogo"
import { PageSecondaryLogo } from "./pages/PageSecondaryLogo"
import { PageTableOfContents } from "./pages/PageTableOfContents"
import { PageTypography } from "./pages/PageTypography"
import { PageTypographyBody } from "./pages/PageTypographyBody"

interface PdfDocumentPagesListProps {
  styleTheme: PreviewStyleId
}

/**
 * Shared renderer for all A4 Brand Guidelines pages.
 * Used by both standard PdfDocumentCanvas and the full-screen presentation modal.
 */
export function PdfDocumentPagesList({ styleTheme }: PdfDocumentPagesListProps) {
  const brand = useBrandStore()

  const hasSecondaryLogo = Boolean(
    brand.secondarySvgContent?.trim() || brand.secondaryLogoUrl?.trim()
  )
  const totalPages = hasSecondaryLogo ? 11 : 10

  const primaryColor =
    brand.colorPalette.find((c) => c.role === "primary")?.hex || "#6366f1"
  const secondaryColor =
    brand.colorPalette.find((c) => c.role === "secondary")?.hex || "#0ea5e9"
  const rasterUri = brand.rasterDataUri || brand.logoUrl || undefined

  return (
    <>
      {/* Page 1: Cover & Foundation */}
      <PageCover
        brandName={brand.brandName}
        tagline={brand.tagline}
        mission={brand.mission}
        vision={brand.vision}
        coreValues={brand.coreValues}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        svgContent={brand.svgContent}
        rasterDataUri={rasterUri}
        styleTheme={styleTheme}
        displayFont={brand.displayFont}
        bodyFont={brand.bodyFont}
        monoFont={brand.monoFont}
        colors={brand.colorPalette}
      />

      {/* Page 2: Table of Contents */}
      <PageTableOfContents
        brandName={brand.brandName}
        styleTheme={styleTheme}
        displayFont={brand.displayFont}
        bodyFont={brand.bodyFont}
        monoFont={brand.monoFont}
        totalPages={totalPages}
        colors={brand.colorPalette}
      />

      {/* Page 3: Brand Strategy & Foundation */}
      <PageFoundation
        brandName={brand.brandName}
        tagline={brand.tagline}
        mission={brand.mission}
        vision={brand.vision}
        coreValues={brand.coreValues}
        brandPillars={brand.brandPillars}
        styleTheme={styleTheme}
        displayFont={brand.displayFont}
        bodyFont={brand.bodyFont}
        monoFont={brand.monoFont}
        pageNumber={3}
        totalPages={totalPages}
        colors={brand.colorPalette}
      />

      {/* Page 4: Primary Logo System & Geometry */}
      <PageLogo
        brandName={brand.brandName}
        primaryColor={primaryColor}
        svgContent={brand.svgContent}
        rasterDataUri={rasterUri}
        dosAndDonts={brand.dosAndDonts}
        styleTheme={styleTheme}
        displayFont={brand.displayFont}
        bodyFont={brand.bodyFont}
        monoFont={brand.monoFont}
        pageNumber={4}
        totalPages={totalPages}
        colors={brand.colorPalette}
      />

      {/* Page 5: Secondary Logo & Lockup (Rendered on its own page if it exists) */}
      {hasSecondaryLogo && (
        <PageSecondaryLogo
          brandName={brand.brandName}
          primaryColor={primaryColor}
          secondarySvgContent={brand.secondarySvgContent}
          secondaryLogoUrl={brand.secondaryLogoUrl}
          styleTheme={styleTheme}
          displayFont={brand.displayFont}
          bodyFont={brand.bodyFont}
          monoFont={brand.monoFont}
          pageNumber={5}
          totalPages={totalPages}
          colors={brand.colorPalette}
        />
      )}

      {/* Page 5 or 6: Color Matrix & Palette */}
      <PageColors
        brandName={brand.brandName}
        colors={brand.colorPalette}
        styleTheme={styleTheme}
        displayFont={brand.displayFont}
        bodyFont={brand.bodyFont}
        monoFont={brand.monoFont}
        pageNumber={hasSecondaryLogo ? 6 : 5}
        totalPages={totalPages}
      />

      {/* Page 6 or 7: Color Information & Metrics */}
      <PageColorInfo
        brandName={brand.brandName}
        colors={brand.colorPalette}
        styleTheme={styleTheme}
        displayFont={brand.displayFont}
        bodyFont={brand.bodyFont}
        monoFont={brand.monoFont}
        pageNumber={hasSecondaryLogo ? 7 : 6}
        totalPages={totalPages}
      />

      {/* Page 7 or 8: Typography Hierarchy - Headings Modular Scale */}
      <PageTypography
        brandName={brand.brandName}
        displayFont={brand.displayFont}
        bodyFont={brand.bodyFont}
        monoFont={brand.monoFont}
        typeScaleRatio={brand.typeScaleRatio}
        baseFontSize={brand.baseFontSize}
        styleTheme={styleTheme}
        pageNumber={hasSecondaryLogo ? 8 : 7}
        totalPages={totalPages}
        colors={brand.colorPalette}
      />

      {/* Page 8 or 9: Typography - Body & Interface System */}
      <PageTypographyBody
        brandName={brand.brandName}
        displayFont={brand.displayFont}
        bodyFont={brand.bodyFont}
        monoFont={brand.monoFont}
        typeScaleRatio={brand.typeScaleRatio}
        baseFontSize={brand.baseFontSize}
        styleTheme={styleTheme}
        pageNumber={hasSecondaryLogo ? 9 : 8}
        totalPages={totalPages}
        colors={brand.colorPalette}
      />

      {/* Page 9 or 10: Imagery & Mood Direction */}
      <PageImagery
        brandName={brand.brandName}
        imageryMood={brand.imageryMood}
        imageryOverlay={brand.imageryOverlay}
        imageryLinks={brand.imageryLinks}
        primaryColor={primaryColor}
        styleTheme={styleTheme}
        displayFont={brand.displayFont}
        bodyFont={brand.bodyFont}
        monoFont={brand.monoFont}
        pageNumber={hasSecondaryLogo ? 10 : 9}
        totalPages={totalPages}
        colors={brand.colorPalette}
      />

      {/* Page 10 or 11: Back Cover Page */}
      <PageBackCover
        brandName={brand.brandName}
        tagline={brand.tagline}
        mission={brand.mission}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        svgContent={brand.svgContent}
        rasterDataUri={rasterUri}
        styleTheme={styleTheme}
        displayFont={brand.displayFont}
        bodyFont={brand.bodyFont}
        monoFont={brand.monoFont}
        pageNumber={hasSecondaryLogo ? 11 : 10}
        totalPages={totalPages}
        colors={brand.colorPalette}
      />
    </>
  )
}
