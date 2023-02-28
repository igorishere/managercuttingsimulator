const DEFAULT_SCREEN_DPI = 96;

export class Utils{
    static ConvertMilimetersToPixels(measureInMilimeters: number): number{
        return measureInMilimeters * (DEFAULT_SCREEN_DPI / 25.4);
    }

    static ConvertPixelsToMilimeters(measureInPixels: number): number{
        return measureInPixels / (DEFAULT_SCREEN_DPI / 25.4);
    }
}