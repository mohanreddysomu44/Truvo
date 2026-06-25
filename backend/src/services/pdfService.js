import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

/**
 * Generates a Truvo certificate PDF
 * Returns a Buffer (raw bytes of the PDF)
 */
export const generateCertificatePDF = async ({
  learnerName,
  skillName,
  issuingOrg,
  issuedDate,
  tokenId,
}) => {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();

  // Add a page — A4 landscape size
  // 841 x 595 points (1 point = 1/72 inch)
  const page = pdfDoc.addPage([841, 595]);

  // Get page dimensions
  const { width, height } = page.getSize();

  // Load built-in fonts
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // ── BACKGROUND ──────────────────────────────────────────
  // Dark blue background
  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: rgb(0.07, 0.14, 0.37), // dark navy blue
  });

  // Light accent bar on left
  page.drawRectangle({
    x: 0,
    y: 0,
    width: 12,
    height,
    color: rgb(0.18, 0.46, 0.71), // accent blue
  });

  // Light accent bar on right
  page.drawRectangle({
    x: width - 12,
    y: 0,
    width: 12,
    height,
    color: rgb(0.18, 0.46, 0.71),
  });

  // Top gold line
  page.drawRectangle({
    x: 40,
    y: height - 40,
    width: width - 80,
    height: 2,
    color: rgb(0.85, 0.65, 0.13), // gold
  });

  // Bottom gold line
  page.drawRectangle({
    x: 40,
    y: 40,
    width: width - 80,
    height: 2,
    color: rgb(0.85, 0.65, 0.13),
  });

  // ── TRUVO LOGO TEXT ─────────────────────────────────────
  page.drawText("TRUVO", {
    x: 60,
    y: height - 80,
    size: 28,
    font: boldFont,
    color: rgb(0.85, 0.65, 0.13), // gold
  });

  page.drawText("Blockchain Skill Credentialing", {
    x: 60,
    y: height - 100,
    size: 10,
    font: regularFont,
    color: rgb(0.7, 0.7, 0.7),
  });

  // ── CERTIFICATE TITLE ───────────────────────────────────
  const titleText = "CERTIFICATE OF COMPLETION";
  const titleSize = 26;
  const titleWidth = boldFont.widthOfTextAtSize(titleText, titleSize);
  page.drawText(titleText, {
    x: (width - titleWidth) / 2,
    y: height - 130,
    size: titleSize,
    font: boldFont,
    color: rgb(1, 1, 1), // white
  });

  // Gold underline under title
  page.drawRectangle({
    x: (width - 300) / 2,
    y: height - 140,
    width: 300,
    height: 1.5,
    color: rgb(0.85, 0.65, 0.13),
  });

  // ── THIS IS TO CERTIFY ──────────────────────────────────
  const certifyText = "This is to certify that";
  const certifyWidth = regularFont.widthOfTextAtSize(certifyText, 14);
  page.drawText(certifyText, {
    x: (width - certifyWidth) / 2,
    y: height - 200,
    size: 14,
    font: regularFont,
    color: rgb(0.8, 0.8, 0.8),
  });

  // ── LEARNER NAME ────────────────────────────────────────
  const nameSize = 38;
  const nameWidth = boldFont.widthOfTextAtSize(learnerName, nameSize);
  page.drawText(learnerName, {
    x: (width - nameWidth) / 2,
    y: height - 255,
    size: nameSize,
    font: boldFont,
    color: rgb(0.85, 0.65, 0.13), // gold
  });

  // ── HAS SUCCESSFULLY COMPLETED ──────────────────────────
  const completedText = "has successfully completed the course";
  const completedWidth = regularFont.widthOfTextAtSize(completedText, 14);
  page.drawText(completedText, {
    x: (width - completedWidth) / 2,
    y: height - 295,
    size: 14,
    font: regularFont,
    color: rgb(0.8, 0.8, 0.8),
  });

  // ── SKILL NAME ──────────────────────────────────────────
  const skillSize = 24;
  const skillWidth = boldFont.widthOfTextAtSize(skillName, skillSize);
  page.drawText(skillName, {
    x: (width - skillWidth) / 2,
    y: height - 340,
    size: skillSize,
    font: boldFont,
    color: rgb(1, 1, 1),
  });

  // ── ISSUING ORG ─────────────────────────────────────────
  const orgText = `Issued by: ${issuingOrg}`;
  const orgWidth = regularFont.widthOfTextAtSize(orgText, 12);
  page.drawText(orgText, {
    x: (width - orgWidth) / 2,
    y: height - 375,
    size: 12,
    font: regularFont,
    color: rgb(0.7, 0.7, 0.7),
  });

  // ── DATE AND TOKEN ID ───────────────────────────────────
  page.drawText(`Issue Date: ${issuedDate}`, {
    x: 60,
    y: 80,
    size: 10,
    font: regularFont,
    color: rgb(0.6, 0.6, 0.6),
  });

  page.drawText(`Certificate ID: #${tokenId}`, {
    x: 60,
    y: 62,
    size: 10,
    font: regularFont,
    color: rgb(0.6, 0.6, 0.6),
  });

  // ── BLOCKCHAIN VERIFIED BADGE ───────────────────────────
  const badgeText = "Blockchain Verified";
  const badgeWidth = boldFont.widthOfTextAtSize(badgeText, 11);
  page.drawText(badgeText, {
    x: width - badgeWidth - 60,
    y: 71,
    size: 11,
    font: boldFont,
    color: rgb(0.18, 0.8, 0.44), // green
  });

  // ── VERIFY URL ──────────────────────────────────────────
  const verifyText = `Verify at: truvo.app/verify/${tokenId}`;
  const verifyWidth = regularFont.widthOfTextAtSize(verifyText, 9);
  page.drawText(verifyText, {
    x: (width - verifyWidth) / 2,
    y: 55,
    size: 9,
    font: regularFont,
    color: rgb(0.5, 0.5, 0.5),
  });

  // Save the PDF and return as Buffer
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
};
