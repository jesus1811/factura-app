export const hasContrast = (color1: string, color2: string) => {
  const calculateLuminance = (color: string) => {
    const match = color.match(/\w\w/g);
    if (!match) return 0;
    const [r, g, b] = match.map((x) => parseInt(x, 16) / 255);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const luminance1 = calculateLuminance(color1);
  const luminance2 = calculateLuminance(color2);
  const contrastRatio = (Math.max(luminance1, luminance2) + 0.05) / (Math.min(luminance1, luminance2) + 0.05);
  return contrastRatio >= 4.5;
};
