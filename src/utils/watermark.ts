export const rotateWaterMark = (
  canvasRef,
  watermarkText,
  canvasWidth,
  canvasHeight
) => {
  const canvas = canvasRef.current
  if (!canvas || !watermarkText) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.clearRect(0, 0, canvasWidth, canvasHeight)
  ctx.save()
  ctx.rotate(Math.PI / -8)
  ctx.font = 'bold 16px Arial'
  ctx.fillStyle = 'rgb(226 232 240)'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const textWidth = ctx.measureText(watermarkText).width
  const textHeight = 20
  const angle = Math.atan(textHeight / textWidth)
  const diagonalLength = Math.sqrt(
    textWidth * textWidth + textHeight * textHeight
  )
  const x = (diagonalLength * Math.cos(angle)) / 2
  const y = (diagonalLength * Math.sin(angle)) / 2
  for (let i = -canvasWidth; i < canvasWidth; i += diagonalLength + 10) {
    for (
      let j = -canvasHeight;
      j < canvasHeight + canvasWidth / 2;
      j += textHeight * 2
    ) {
      ctx.fillText(watermarkText, i + x, j + y)
    }
  }
  ctx.restore()
}
