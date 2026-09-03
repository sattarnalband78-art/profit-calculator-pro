import { Capacitor, registerPlugin } from '@capacitor/core';
import { Share } from '@capacitor/share';
import { StatusBar, Style } from '@capacitor/status-bar';
import { App as CapacitorApp } from '@capacitor/app';

interface NativePrintPlugin {
  printPdf(options: { base64: string; name?: string }): Promise<{ success: boolean }>;
}

const PrintManagerPlugin = registerPlugin<NativePrintPlugin>('PrintManagerPlugin');

interface NativeMediaStorePlugin {
  saveToDownloads(options: { base64: string; filename: string }): Promise<{
    success: boolean;
    uri?: string;
    filename?: string;
  }>;
}

const MediaStoreDownloadPlugin = registerPlugin<NativeMediaStorePlugin>('MediaStoreDownloadPlugin');

export interface ShareResult {
  completed: boolean;
  copied: boolean;
}

/**
 * Checks if the application is running inside a native Capacitor shell (e.g. Android APK)
 */
export function isNativeAndroid(): boolean {
  return (
    Capacitor.isNativePlatform() &&
    (Capacitor.getPlatform() === 'android' ||
      (typeof window !== 'undefined' && !!(window as any).androidBridge))
  );
}

/**
 * Native Print Handler for Android APK:
 * Invokes the native Android PrintManager system service directly via PrintManagerPlugin.
 * Opens the real Android system print preview / print spooler dialog.
 */
export async function printNativePdfReport(base64Data: string, filename: string): Promise<boolean> {
  if (!isNativeAndroid()) {
    return false;
  }

  try {
    const cleanBase64 = base64Data
      .replace(/^data:application\/pdf;filename=generated\.pdf;base64,/, '')
      .replace(/^data:application\/pdf;base64,/, '');

    const docName = filename.replace(/\.pdf$/i, '');
    const res = await PrintManagerPlugin.printPdf({
      base64: cleanBase64,
      name: docName,
    });
    return !!res.success;
  } catch (err) {
    console.error('Native Android PrintManager failed:', err);
    return false;
  }
}

/**
 * Exits the Android application immediately
 */
export async function exitNativeApp(): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    try {
      await CapacitorApp.exitApp();
    } catch (e) {
      console.warn('Capacitor exitApp failed:', e);
    }
  }
}

/**
 * Initializes native Android device integrations:
 * 1. Status Bar styling & brand color (#061326)
 * 2. Hardware / System Back Button handling to exit app or navigate back
 */
export async function initNativeApp(onBackPressed?: () => boolean): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    try {
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setBackgroundColor({ color: '#061326' });
    } catch (e) {
      console.warn('Native status bar setup skipped:', e);
    }

    try {
      await CapacitorApp.removeAllListeners();
      await CapacitorApp.addListener('backButton', ({ canGoBack }) => {
        // Allow custom in-app back handling if provided
        if (onBackPressed && onBackPressed()) {
          return;
        }

        // If standard browser history can go back, navigate back
        if (canGoBack && window.history.length > 1) {
          window.history.back();
        } else {
          // Otherwise exit the application cleanly
          CapacitorApp.exitApp();
        }
      });
    } catch (e) {
      console.warn('Native back button registration failed:', e);
    }
  }
}

/**
 * Native-ready Share helper that works seamlessly across:
 * 1. Capacitor Native Android Share sheet
 * 2. Standard Web Share API (navigator.share)
 * 3. Clipboard fallback (strictly for desktop browsers where native sharing is unavailable)
 */
export async function shareTextOrContent(options: {
  title: string;
  text: string;
  url?: string;
  dialogTitle?: string;
}): Promise<ShareResult> {
  // 1. Native Capacitor Share (Android APK)
  if (Capacitor.isNativePlatform()) {
    try {
      await Share.share({
        title: options.title,
        text: options.text,
        url: options.url,
        dialogTitle: options.dialogTitle || 'Share with NOMAN Profit Calculator Pro',
      });
      return { completed: true, copied: false };
    } catch (nativeShareErr) {
      // User cancelled, dismissed, or returned from Share Sheet (e.g. WhatsApp, back button)
      console.warn('Capacitor Share dismissed or returned:', nativeShareErr);
      // On native platform, NEVER fall back to clipboard write and NEVER trigger copy state
      return { completed: false, copied: false };
    }
  }

  // 2. Standard Web Share API (mobile web browsers)
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title: options.title,
        text: options.text,
        url: options.url,
      });
      return { completed: true, copied: false };
    } catch (webShareErr: any) {
      // If user cancelled Web Share sheet (AbortError), do NOT fall back to clipboard
      if (webShareErr?.name === 'AbortError') {
        return { completed: false, copied: false };
      }
      console.warn('navigator.share failed, falling back to clipboard:', webShareErr);
    }
  }

  // 3. Clipboard fallback (only for desktop / web browsers where native sharing is unavailable)
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(options.text);
      return { completed: true, copied: true };
    } catch (clipErr) {
      console.warn('Clipboard write failed:', clipErr);
    }
  }

  return { completed: false, copied: false };
}

/**
 * Saves a PDF file directly to the public Android Downloads folder via MediaStore.
 * Performs a true save/download operation without opening the Share Sheet or Print dialog.
 */
export async function saveOrShareNativePdf(
  base64Data: string,
  filename: string,
  _title?: string
): Promise<boolean> {
  if (isNativeAndroid()) {
    try {
      // 1. Clean base64 string completely
      const rawBase64 = base64Data
        .replace(/^data:application\/pdf[^;]*;base64,/, '')
        .replace(/^data:[^;]*;base64,/, '')
        .trim();

      // 2. Write directly to Android public Downloads via MediaStore
      const result = await MediaStoreDownloadPlugin.saveToDownloads({
        base64: rawBase64,
        filename,
      });

      if (result && result.success) {
        return true;
      }
      throw new Error('MediaStore download returned unsuccessful');
    } catch (fsErr) {
      console.error('Native Android MediaStore PDF save failed:', fsErr);
      throw fsErr;
    }
  }
  return false;
}
