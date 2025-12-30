package com.junlin.hours;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.os.Bundle;
import android.util.Base64;
import android.view.View;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ProgressBar;

import java.util.HashMap;
import java.util.Map;

public class MainActivity extends Activity {

    private WebView webView;
    private ProgressBar progressBar;

    // Obfuscated values - not plain text
    private static final String[] _k = {"anVu", "bGlu", "LnNo", "b3A="};
    private static final String[] _a = {"MTk3", "Njgx", "OWIx", "ZjBj", "MDEy"};
    private static final String[] _s = {"Mjhl", "ZTA1", "OTBk", "Y2Vh", "YmM5"};
    private static final String _p = "aHR0cHM6Ly91cmVuLg==";
    private static final String _x = "anVubGluLWhvdXJzLWFwcC0yMDI0LXNlY3JldA==";

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        webView = findViewById(R.id.webView);
        progressBar = findViewById(R.id.progressBar);

        // Configure WebView settings
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setAllowFileAccess(false);
        webSettings.setAllowContentAccess(false);
        webSettings.setCacheMode(WebSettings.LOAD_DEFAULT);
        webSettings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);

        // Set custom WebViewClient with headers
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                String url = request.getUrl().toString();
                if (url.startsWith(g(_p) + j(_k))) {
                    lU(url);
                    return true;
                }
                return true;
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                progressBar.setVisibility(View.GONE);
                iC();
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                if (newProgress < 100) {
                    progressBar.setVisibility(View.VISIBLE);
                    progressBar.setProgress(newProgress);
                } else {
                    progressBar.setVisibility(View.GONE);
                }
            }
        });

        lU(g(_p) + j(_k));
    }

    private void lU(String url) {
        Map<String, String> h = new HashMap<>();
        h.put("X-Junlin-App-Key", g(_x));
        h.put("X-Requested-With", getPackageName());
        webView.loadUrl(url, h);
    }

    // Inject credentials into page
    private void iC() {
        String e = "https://" + j(_k);
        String k = j(_a);
        String s = j(_s);
        String js = "javascript:(function(){" +
                "if(document.getElementById('erpUrl'))document.getElementById('erpUrl').value='" + e + "';" +
                "if(document.getElementById('apiKey'))document.getElementById('apiKey').value='" + k + "';" +
                "if(document.getElementById('apiSecret'))document.getElementById('apiSecret').value='" + s + "';" +
                "var cfg=document.querySelector('.card');if(cfg&&cfg.querySelector('h2').textContent.includes('API')){cfg.style.display='none';}" +
                "})()";
        webView.evaluateJavascript(js, null);
    }

    private String g(String e) {
        return new String(Base64.decode(e, Base64.DEFAULT));
    }

    private String j(String[] p) {
        StringBuilder r = new StringBuilder();
        for (String s : p) {
            r.append(g(s));
        }
        return r.toString();
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
