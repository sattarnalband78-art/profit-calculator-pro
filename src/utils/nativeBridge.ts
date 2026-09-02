import { Capacitor, registerPlugin } from '@capacitor/core';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { StatusBar, Style } from '@capacitor/status-bar';
import { App as CapacitorApp } from '@capacitor/app';

interface NativePrintPlugin {
  printPdf(options: { base64: string; name?: string }): Promise<{ success: boolean }>;
}

const PrintManagerPlugin = registerPlugin<NativePrintPlugin>('PrintManagerPlugin');

/**
 * Checks if the application is running inside a native Capacitor shell (e.g. Android APK)
 */
export function isNativeAndroid(): boolean {
  return Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android';
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
 * Saves a PDF file directly to device storage on native Android (or web fallback).
 * Performs a true save/download operation without opening the Share Sheet or Print dialog.
 */
export async function saveOrShareNativePdf(
  base64Data: string,
  filename: string,
  _title?: string
): Promise<boolean> {
  if (Capacitor.isNativePlatform()) {
    try {
      // 1. Clean base64 string completely
      const rawBase64 = base64Data
        .replace(/^data:application\/pdf[^;]*;base64,/, '')
        .replace(/^data:[^;]*;base64,/, '')
        .trim();

      // 2. Write file directly to Documents directory
      try {
        await Filesystem.writeFile({
          path: filename,
          data: rawBase64,
          directory: Directory.Documents,
          recursive: true,
        });
        return true;
      } catch (docErr) {
        console.warn('Filesystem write to Documents failed, trying Cache directory fallback:', docErr);
        // Fallback to Cache directory if Documents is restricted
        await Filesystem.writeFile({
          path: filename,
          data: rawBase64,
          directory: Directory.Cache,
          recursive: true,
        });
        return true;
      }
    } catch (fsErr) {
      console.warn('Native filesystem write failed, falling back to standard web download:', fsErr);
    }
  }
  return false;
}
