const DEFAULT_SCREEN_DPI = 96;
const INCH_CONVERTED_TO_MILLIMETERS = 25.4;

export class Utils {
    static ConvertMilimetersToPixels(measureInMilimeters: number): number {
        return measureInMilimeters * (DEFAULT_SCREEN_DPI / INCH_CONVERTED_TO_MILLIMETERS);
    }

    static ConvertPixelsToMilimeters(measureInPixels: number): number {
        return measureInPixels / (DEFAULT_SCREEN_DPI / INCH_CONVERTED_TO_MILLIMETERS);
    }
}