import qrcode from "qrcode-generator"

/** Returns an SVG path ("M x y h1v1h-1z…") and module count for a real, scannable QR code. */
export function qrPath(text: string) {
  const qr = qrcode(0, "M")
  qr.addData(text)
  qr.make()
  const size = qr.getModuleCount()
  let d = ""
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++) if (qr.isDark(r, c)) d += `M${c} ${r}h1v1h-1z`
  return { d, size }
}
