package com.noman.profitcalculatorpro;

import android.content.Context;
import android.os.Bundle;
import android.os.CancellationSignal;
import android.os.ParcelFileDescriptor;
import android.print.PageRange;
import android.print.PrintAttributes;
import android.print.PrintDocumentAdapter;
import android.print.PrintDocumentInfo;
import android.print.PrintManager;
import android.util.Base64;
import android.util.Log;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;

@CapacitorPlugin(name = "PrintManagerPlugin")
public class PrintManagerPlugin extends Plugin {
    private static final String TAG = "PrintManagerPlugin";

    @PluginMethod
    public void printPdf(PluginCall call) {
        String base64Data = call.getString("base64");
        String documentName = call.getString("name", "NOMAN-Profit-Report");

        if (base64Data == null || base64Data.isEmpty()) {
            call.reject("Base64 data is required for printing");
            return;
        }

        try {
            // Clean prefix if present
            if (base64Data.contains(",")) {
                base64Data = base64Data.substring(base64Data.indexOf(",") + 1);
            }

            byte[] pdfBytes = Base64.decode(base64Data, Base64.DEFAULT);

            // Write to cache
            File cacheDir = getContext().getCacheDir();
            File pdfFile = new File(cacheDir, "print_temp_" + System.currentTimeMillis() + ".pdf");
            FileOutputStream fos = new FileOutputStream(pdfFile);
            fos.write(pdfBytes);
            fos.flush();
            fos.close();

            getActivity().runOnUiThread(() -> {
                try {
                    PrintManager printManager = (PrintManager) getActivity().getSystemService(Context.PRINT_SERVICE);
                    if (printManager == null) {
                        call.reject("PrintManager service not available on this device");
                        return;
                    }

                    PrintAttributes attributes = new PrintAttributes.Builder()
                            .setMediaSize(PrintAttributes.MediaSize.ISO_A4)
                            .setColorMode(PrintAttributes.COLOR_MODE_COLOR)
                            .build();

                    PrintDocumentAdapter adapter = new PrintDocumentAdapter() {
                        @Override
                        public void onLayout(PrintAttributes oldAttributes, PrintAttributes newAttributes,
                                             CancellationSignal cancellationSignal,
                                             LayoutResultCallback callback, Bundle extras) {
                            if (cancellationSignal.isCanceled()) {
                                callback.onLayoutCancelled();
                                return;
                            }

                            PrintDocumentInfo info = new PrintDocumentInfo.Builder(documentName + ".pdf")
                                    .setContentType(PrintDocumentInfo.CONTENT_TYPE_DOCUMENT)
                                    .setPageCount(PrintDocumentInfo.PAGE_COUNT_UNKNOWN)
                                    .build();

                            callback.onLayoutFinished(info, !newAttributes.equals(oldAttributes));
                        }

                        @Override
                        public void onWrite(PageRange[] pages, ParcelFileDescriptor destination,
                                            CancellationSignal cancellationSignal,
                                            WriteResultCallback callback) {
                            InputStream input = null;
                            OutputStream output = null;

                            try {
                                input = new FileInputStream(pdfFile);
                                output = new FileOutputStream(destination.getFileDescriptor());

                                byte[] buf = new byte[8192];
                                int bytesRead;
                                while ((bytesRead = input.read(buf)) > 0) {
                                    if (cancellationSignal.isCanceled()) {
                                        callback.onWriteCancelled();
                                        return;
                                    }
                                    output.write(buf, 0, bytesRead);
                                }

                                callback.onWriteFinished(new PageRange[]{PageRange.ALL_PAGES});
                            } catch (Exception e) {
                                Log.e(TAG, "Error writing PDF to print spooler", e);
                                callback.onWriteFailed(e.getMessage());
                            } finally {
                                try {
                                    if (input != null) input.close();
                                    if (output != null) output.close();
                                } catch (Exception ignored) {}
                            }
                        }

                        @Override
                        public void onFinish() {
                            super.onFinish();
                            if (pdfFile.exists()) {
                                pdfFile.delete();
                            }
                        }
                    };

                    printManager.print(documentName, adapter, attributes);

                    JSObject result = new JSObject();
                    result.put("success", true);
                    call.resolve(result);

                } catch (Exception ex) {
                    Log.e(TAG, "Native Print dispatch failed", ex);
                    call.reject("Printing failed: " + ex.getMessage());
                }
            });

        } catch (Exception e) {
            Log.e(TAG, "Error preparing PDF for print", e);
            call.reject("Failed to decode PDF: " + e.getMessage());
        }
    }
}
