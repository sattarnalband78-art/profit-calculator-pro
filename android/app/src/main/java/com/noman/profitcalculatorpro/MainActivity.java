package com.noman.profitcalculatorpro;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(PrintManagerPlugin.class);
        registerPlugin(MediaStoreDownloadPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
