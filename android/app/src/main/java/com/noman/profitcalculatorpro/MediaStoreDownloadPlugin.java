package com.noman.profitcalculatorpro;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.media.MediaScannerConnection;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Base64;
import android.util.Log;

import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;

@CapacitorPlugin(name = "MediaStoreDownloadPlugin")
public class MediaStoreDownloadPlugin extends Plugin {
    private static final String TAG = "MediaStoreDownload";
    private static final String CHANNEL_ID = "pdf_downloads";
    private static final String CHANNEL_NAME = "PDF Downloads";
    private static final int NOTIFICATION_ID = 2001;

    @Override
    public void load() {
        super.load();
        createNotificationChannel();
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            try {
                Context context = getContext();
                if (context != null) {
                    NotificationChannel channel = new NotificationChannel(
                        CHANNEL_ID,
                        CHANNEL_NAME,
                        NotificationManager.IMPORTANCE_LOW
                    );
                    channel.setDescription("Notifications for generated PDF report downloads");
                    NotificationManager manager = context.getSystemService(NotificationManager.class);
                    if (manager != null) {
                        manager.createNotificationChannel(channel);
                    }
                }
            } catch (Exception e) {
                Log.w(TAG, "Failed to create notification channel", e);
            }
        }
    }

    private void showDownloadingNotification(String filename) {
        try {
            Context context = getContext();
            if (context == null) return;

            NotificationManagerCompat notificationManager = NotificationManagerCompat.from(context);
            if (!notificationManager.areNotificationsEnabled()) return;

            NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_ID)
                .setSmallIcon(android.R.drawable.stat_sys_download)
                .setContentTitle("Downloading PDF...")
                .setContentText(filename)
                .setPriority(NotificationCompat.PRIORITY_LOW)
                .setOngoing(true)
                .setProgress(0, 0, true)
                .setOnlyAlertOnce(true);

            notificationManager.notify(NOTIFICATION_ID, builder.build());
        } catch (Exception e) {
            Log.w(TAG, "Could not display downloading notification", e);
        }
    }

    private void showDownloadCompleteNotification(String filename, Uri fileUri) {
        try {
            Context context = getContext();
            if (context == null) return;

            NotificationManagerCompat notificationManager = NotificationManagerCompat.from(context);
            if (!notificationManager.areNotificationsEnabled()) return;

            NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_ID)
                .setSmallIcon(android.R.drawable.stat_sys_download_done)
                .setContentTitle("Download complete")
                .setContentText(filename)
                .setPriority(NotificationCompat.PRIORITY_LOW)
                .setOngoing(false)
                .setAutoCancel(true)
                .setProgress(0, 0, false);

            if (fileUri != null) {
                try {
                    Intent viewIntent = new Intent(Intent.ACTION_VIEW);
                    viewIntent.setDataAndType(fileUri, "application/pdf");
                    viewIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);

                    int pendingFlags = PendingIntent.FLAG_UPDATE_CURRENT;
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                        pendingFlags |= PendingIntent.FLAG_IMMUTABLE;
                    }

                    PendingIntent pendingIntent = PendingIntent.getActivity(
                        context,
                        NOTIFICATION_ID,
                        viewIntent,
                        pendingFlags
                    );
                    builder.setContentIntent(pendingIntent);
                } catch (Exception intentEx) {
                    Log.w(TAG, "Could not attach pending intent to completion notification", intentEx);
                }
            }

            notificationManager.notify(NOTIFICATION_ID, builder.build());
        } catch (Exception e) {
            Log.w(TAG, "Could not display download complete notification", e);
        }
    }

    private void showDownloadFailedNotification(String filename) {
        try {
            Context context = getContext();
            if (context == null) return;

            NotificationManagerCompat notificationManager = NotificationManagerCompat.from(context);
            if (!notificationManager.areNotificationsEnabled()) return;

            NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_ID)
                .setSmallIcon(android.R.drawable.stat_notify_error)
                .setContentTitle("Download failed")
                .setContentText(filename)
                .setPriority(NotificationCompat.PRIORITY_LOW)
                .setOngoing(false)
                .setAutoCancel(true)
                .setProgress(0, 0, false);

            notificationManager.notify(NOTIFICATION_ID, builder.build());
        } catch (Exception e) {
            Log.w(TAG, "Could not display download failed notification", e);
        }
    }

    @PluginMethod
    public void saveToDownloads(PluginCall call) {
        String base64Data = call.getString("base64");
        String filename = call.getString("filename", "NOMAN-Profit-Report.pdf");

        if (base64Data == null || base64Data.trim().isEmpty()) {
            call.reject("Base64 PDF data is required");
            return;
        }

        if (filename == null || filename.trim().isEmpty()) {
            filename = "NOMAN-Profit-Report.pdf";
        }

        if (!filename.toLowerCase().endsWith(".pdf")) {
            filename = filename + ".pdf";
        }

        createNotificationChannel();
        showDownloadingNotification(filename);

        try {
            // Strip any data URI prefix if present (e.g. data:application/pdf;base64,...)
            if (base64Data.contains(",")) {
                base64Data = base64Data.substring(base64Data.indexOf(",") + 1);
            }

            byte[] pdfBytes = Base64.decode(base64Data.trim(), Base64.DEFAULT);
            if (pdfBytes == null || pdfBytes.length == 0) {
                showDownloadFailedNotification(filename);
                call.reject("Decoded PDF bytes are empty");
                return;
            }

            boolean writeSuccess = false;
            String savedPathOrUri = "";
            Uri completedUri = null;

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                // Android 10+ (API 29+): MediaStore.Downloads (Scoped Storage compliant, user-visible)
                ContentResolver resolver = getContext().getContentResolver();
                ContentValues contentValues = new ContentValues();
                contentValues.put(MediaStore.Downloads.DISPLAY_NAME, filename);
                contentValues.put(MediaStore.Downloads.MIME_TYPE, "application/pdf");
                contentValues.put(MediaStore.Downloads.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS);
                contentValues.put(MediaStore.Downloads.IS_PENDING, 1);

                Uri collection = MediaStore.Downloads.getContentUri(MediaStore.VOLUME_EXTERNAL_PRIMARY);
                Uri fileUri = resolver.insert(collection, contentValues);

                if (fileUri == null) {
                    showDownloadFailedNotification(filename);
                    call.reject("Failed to create MediaStore entry in Downloads");
                    return;
                }

                try (OutputStream outputStream = resolver.openOutputStream(fileUri)) {
                    if (outputStream != null) {
                        outputStream.write(pdfBytes);
                        outputStream.flush();
                        writeSuccess = true;
                    }
                } catch (Exception writeEx) {
                    Log.e(TAG, "Error writing bytes to MediaStore uri: " + fileUri, writeEx);
                    // Clean up incomplete entry
                    resolver.delete(fileUri, null, null);
                    showDownloadFailedNotification(filename);
                    throw writeEx;
                }

                // Mark file as completed (IS_PENDING = 0) so other apps and user can access it
                contentValues.clear();
                contentValues.put(MediaStore.Downloads.IS_PENDING, 0);
                resolver.update(fileUri, contentValues, null, null);
                savedPathOrUri = fileUri.toString();
                completedUri = fileUri;

            } else {
                // Android 9 and lower (API <= 28): Public Downloads directory with MediaScannerConnection
                File downloadsDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
                if (!downloadsDir.exists()) {
                    downloadsDir.mkdirs();
                }

                File targetFile = new File(downloadsDir, filename);
                // If file with same name exists, generate a numbered unique name
                int counter = 1;
                String baseName = filename.substring(0, filename.length() - 4);
                while (targetFile.exists()) {
                    targetFile = new File(downloadsDir, baseName + "_" + counter + ".pdf");
                    counter++;
                }

                try (FileOutputStream fos = new FileOutputStream(targetFile)) {
                    fos.write(pdfBytes);
                    fos.flush();
                    writeSuccess = true;
                    savedPathOrUri = targetFile.getAbsolutePath();
                    completedUri = Uri.fromFile(targetFile);
                } catch (Exception writeEx) {
                    showDownloadFailedNotification(filename);
                    throw writeEx;
                }

                // Notify Android MediaScanner so file appears immediately in Downloads / Files app
                MediaScannerConnection.scanFile(
                    getContext(),
                    new String[]{ targetFile.getAbsolutePath() },
                    new String[]{ "application/pdf" },
                    null
                );
            }

            if (writeSuccess) {
                showDownloadCompleteNotification(filename, completedUri);
                JSObject ret = new JSObject();
                ret.put("success", true);
                ret.put("uri", savedPathOrUri);
                ret.put("filename", filename);
                call.resolve(ret);
            } else {
                showDownloadFailedNotification(filename);
                call.reject("Failed to write PDF to Android Downloads");
            }

        } catch (Exception e) {
            Log.e(TAG, "Error saving PDF to Downloads via MediaStore", e);
            showDownloadFailedNotification(filename);
            call.reject("Failed to save PDF: " + e.getMessage());
        }
    }
}
