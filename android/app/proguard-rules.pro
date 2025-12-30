# Obfuscation settings
-optimizationpasses 5
-repackageclasses ''
-allowaccessmodification
-dontpreverify

# Keep main activity entry point
-keep public class com.junlin.hours.MainActivity {
    public void onCreate(android.os.Bundle);
}

# Obfuscate everything else
-keepattributes Signature
-keepattributes *Annotation*

# Remove logging
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
}

# WebView
-keepclassmembers class * extends android.webkit.WebViewClient {
    public void *(android.webkit.WebView, java.lang.String);
    public void *(android.webkit.WebView, java.lang.String, android.graphics.Bitmap);
    public boolean *(android.webkit.WebView, java.lang.String);
}
