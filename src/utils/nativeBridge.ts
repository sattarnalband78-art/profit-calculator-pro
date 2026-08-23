import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { StatusBar, Style } from '@capacitor/status-bar';

/**
 * Checks if the application is running inside a native Capacitor shell (e.g. Android APK)
 */
export function isNativeAndroid(): boolean {
  return Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android';
}

/**
 * Initializes native Android device integrations (status bar, navigation bar, etc.)
 */
export async function initNativeApp(): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    try {
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setBackgroundColor({ color: '#061326' });
    } catch (e) {
      console.warn('Native status bar setup skipped:', e);
    }
  }
}

/**
 * Native-ready Share helper that works seamlessly across:
 * 1. Capacitor Native Android Share sheet
 * 2. Standard Web Share API (navigator.share)
 * 3. Clipboard fallback
 */
export async function shareTextOrContent(options: {
  title: string;
  text: string;
  url?: string;
  dialogTitle?: string;
}): Promise<boolean> {
  // 1. Native Capacitor Share (Android APK)
  if (Capacitor.isNativePlatform()) {
    try {
      await Share.share({
        title: options.title,
        text: options.text,
        url: options.url,
        dialogTitle: options.dialogTitle || 'Share with NOMAN Profit Calculator Pro',
      });
      return true;
    } catch (nativeShareErr) {
      console.warn('Capacitor Share failed, falling back:', nativeShareErr);
    }
  }

  // 2. Standard Web Share API
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title: options.title,
        text: options.text,
        url: options.url,
      });
      return true;
    } catch {
      // User cancelled or share failed, proceed to clipboard
    }
  }

  // 3. Clipboard fallback
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(options.text);
      return true;
    } catch (clipErr) {
      console.warn('Clipboard write failed:', clipErr);
    }
  }

  return false;
}

/**
 * Saves and opens/shares a PDF file on native Android or web
 */
export async function saveOrShareNativePdf(
  base64Data: string,
  filename: string,
  title: string
): Promise<boolean> {
  if (Capacitor.isNativePlatform()) {
    try {
      // Clean base64 string
      const rawBase64 = base64Data.replace(/^data:application\/pdf;filename=generated\.pdf;base64,/, '')
        .replace(/^data:application\/pdf;base64,/, '');

      const writeResult = await Filesystem.writeFile({
        path: filename,
        data: rawBase64,
        directory: Directory.Documents,
        recursive: true,
      });

      if (writeResult.uri) {
        try {
          await Share.share({
            title: title,
            url: writeResult.uri,
            dialogTitle: `Share / Open ${filename}`,
          });
        } catch {
          // Ignored if user dismissed share sheet
        }
        return true;
      }
    } catch (fsErr) {
      console.warn('Native filesystem write failed, fallback to standard web download:', fsErr);
    }
  }
  return false;
}
