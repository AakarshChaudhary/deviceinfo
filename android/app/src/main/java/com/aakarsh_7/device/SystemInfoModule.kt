package com.aakarsh_7.device

import android.app.ActivityManager
import android.app.KeyguardManager
import android.content.Context
import android.content.pm.PackageManager
import android.content.res.Configuration
import android.os.Build
import android.os.Environment
import android.os.StatFs
import android.provider.Settings
import android.text.format.DateFormat
import android.view.Surface
import android.view.WindowManager
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.uimanager.ViewManager
import java.util.Locale
import java.util.TimeZone
import kotlin.math.pow
import kotlin.math.sqrt

class SystemInfoModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "SystemInfoModule"

  @ReactMethod
  fun getSystemDetails(promise: Promise) {
    try {
      val resources = reactContext.resources
      val metrics = resources.displayMetrics

      val activityManager =
        reactContext.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
      val memoryInfo = ActivityManager.MemoryInfo().also { activityManager.getMemoryInfo(it) }

      val totalInternalStorage = getTotalInternalStorageBytes()
      val freeInternalStorage = getFreeInternalStorageBytes()

      val result = Arguments.createMap().apply {
        putString("hardware", cleanText(Build.HARDWARE))
        putString("board", cleanText(Build.BOARD))

        putString("codename", cleanText(Build.VERSION.CODENAME))
        putString("incrementalVersion", cleanText(Build.VERSION.INCREMENTAL))
        putString("systemUiVersion", getSystemUiVersion())

        putString("resolution", getResolution(metrics.widthPixels, metrics.heightPixels))
        putString("densityDpi", getDensityDpi(metrics.densityDpi))
        putString(
          "physicalSizeDiagonal",
          getPhysicalSizeDiagonal(
            metrics.widthPixels,
            metrics.heightPixels,
            metrics.xdpi,
            metrics.ydpi,
          ),
        )
        putString("refreshRate", getRefreshRate())
        putString("rotationOrientation", getRotationOrientation(resources.configuration))
        putString("displayCutoutSafeArea", getDisplayCutoutSafeArea())

        putString("availableRam", formatBytes(memoryInfo.availMem))
        putString("memoryClass", "${activityManager.memoryClass} MB")
        putString("largeMemoryClass", "${activityManager.largeMemoryClass} MB")
        putString("numberOfCores", Runtime.getRuntime().availableProcessors().toString())

        putString("totalInternalStorage", formatBytes(totalInternalStorage))
        putString("freeSpace", formatBytes(freeInternalStorage))
        putString("usedPercent", getUsedPercent(totalInternalStorage, freeInternalStorage))
        putString("sdCardCapacity", getSdCardCapacity())

        putString("deviceSecureLockStatus", getDeviceSecureLockStatus())
        putString("fingerprintSensorPresence", getFingerprintSensorPresence())
        putString("emulatorDetection", if (isProbablyEmulator()) "Yes" else "No")
        putString("bootloaderStatus", cleanText(Build.BOOTLOADER))
        putString("secureSettingsAvailability", getSecureSettingsAvailability())

        putString("localeLanguage", getLocaleLanguage(resources.configuration))
        putString("region", getRegion(resources.configuration))
        putString("timezoneId", getTimezoneId())
        putString("clockFormat", getClockFormat())
      }

      promise.resolve(result)
    } catch (e: Exception) {
      promise.reject("SYSTEM_INFO_ERROR", e)
    }
  }

  private fun cleanText(value: String?): String {
    val text = value?.trim().orEmpty()
    return if (text.isEmpty()) "Unknown" else text
  }

  private fun getSystemProperty(key: String): String {
    return try {
      val systemPropertiesClass = Class.forName("android.os.SystemProperties")
      val getMethod = systemPropertiesClass.getMethod("get", String::class.java)
      (getMethod.invoke(null, key) as? String)?.trim().orEmpty()
    } catch (_: Exception) {
      ""
    }
  }

  private fun firstNonBlank(vararg values: String): String {
    for (value in values) {
      if (value.isNotBlank()) {
        return value
      }
    }
    return ""
  }

  private fun formatUiValue(label: String, raw: String, vararg prefixes: String): String {
    val trimmed = raw.trim()
    if (trimmed.isBlank()) return ""
    if (trimmed.contains(label, ignoreCase = true)) return trimmed

    var cleaned = trimmed
    for (prefix in prefixes) {
      if (cleaned.startsWith(prefix, ignoreCase = true)) {
        cleaned = cleaned.substring(prefix.length)
      }
    }

    cleaned = cleaned.trimStart(' ', '-', '_', ':')
    return if (cleaned.isBlank()) label else "$label $cleaned"
  }

  private fun getSystemUiVersion(): String {
    val oneUiRaw = getSystemProperty("ro.build.version.oneui")
    if (oneUiRaw.isNotBlank()) {
      val oneUiVersion =
        if (oneUiRaw.all { it.isDigit() } && oneUiRaw.length >= 3) {
          oneUiRaw.first().toString()
        } else {
          oneUiRaw
        }

      return "One UI $oneUiVersion"
    }

    val manufacturerAndBrand =
      "${Build.MANUFACTURER} ${Build.BRAND}".lowercase(Locale.US)

    if (manufacturerAndBrand.contains("oneplus")) {
      val oxygenRaw =
        firstNonBlank(
          getSystemProperty("ro.rom.version"),
          getSystemProperty("ro.oxygen.version"),
          getSystemProperty("ro.build.version.oplusrom.display"),
        )

      if (oxygenRaw.isNotBlank()) {
        if (oxygenRaw.contains("coloros", ignoreCase = true)) {
          return formatUiValue("ColorOS", oxygenRaw)
        }

        return formatUiValue("OxygenOS", oxygenRaw, "V", "v")
      }
    }

    if (
      manufacturerAndBrand.contains("xiaomi") ||
        manufacturerAndBrand.contains("redmi") ||
        manufacturerAndBrand.contains("poco")
    ) {
      val hyperRaw =
        firstNonBlank(
          getSystemProperty("ro.mi.os.version.name"),
          getSystemProperty("ro.mi.os.version.code"),
        )
      if (hyperRaw.isNotBlank()) {
        return formatUiValue("HyperOS", hyperRaw, "OS", "os")
      }

      val miuiRaw = getSystemProperty("ro.miui.ui.version.name")
      if (miuiRaw.isNotBlank()) {
        return formatUiValue("MIUI", miuiRaw, "V", "v")
      }
    }

    if (manufacturerAndBrand.contains("oppo")) {
      val colorRaw =
        firstNonBlank(
          getSystemProperty("ro.build.version.oplusrom.display"),
          getSystemProperty("ro.build.version.opporom"),
        )
      if (colorRaw.isNotBlank()) {
        return formatUiValue("ColorOS", colorRaw, "V", "v")
      }
    }

    if (manufacturerAndBrand.contains("realme")) {
      val realmeRaw =
        firstNonBlank(
          getSystemProperty("ro.build.version.realmeui"),
          getSystemProperty("ro.build.version.oplusrom.display"),
        )
      if (realmeRaw.isNotBlank()) {
        return formatUiValue("realme UI", realmeRaw, "V", "v")
      }
    }

    if (
      manufacturerAndBrand.contains("vivo") ||
        manufacturerAndBrand.contains("iqoo")
    ) {
      val vivoRaw =
        firstNonBlank(
          getSystemProperty("ro.vivo.os.build.display.id"),
          getSystemProperty("ro.vivo.os.version"),
        )
      if (vivoRaw.isNotBlank()) {
        if (vivoRaw.contains("origin", ignoreCase = true)) {
          return formatUiValue("OriginOS", vivoRaw)
        }

        return formatUiValue("Funtouch OS", vivoRaw, "OS", "os")
      }
    }

    if (manufacturerAndBrand.contains("huawei")) {
      val emuiRaw = getSystemProperty("ro.build.version.emui")
      if (emuiRaw.isNotBlank()) {
        return formatUiValue("EMUI", emuiRaw, "EmotionUI_", "EMUI_")
      }
    }

    if (manufacturerAndBrand.contains("honor")) {
      val magicRaw =
        firstNonBlank(
          getSystemProperty("ro.build.version.magic"),
          getSystemProperty("ro.build.version.honor"),
        )
      if (magicRaw.isNotBlank()) {
        return formatUiValue("MagicOS", magicRaw, "MagicUI_", "MagicOS_", "V", "v")
      }
    }

    if (manufacturerAndBrand.contains("nothing")) {
      val nothingRaw =
        firstNonBlank(
          getSystemProperty("ro.nothing.version.id"),
          getSystemProperty("ro.nothing.version"),
          getSystemProperty("ro.build.version.nothing"),
        )
      if (nothingRaw.isNotBlank()) {
        return formatUiValue("Nothing OS", nothingRaw, "V", "v")
      }
    }

    val androidRelease = Build.VERSION.RELEASE?.trim().orEmpty()
    if (androidRelease.isNotBlank()) {
      return "Android $androidRelease"
    }

    return "Unknown"
  }

  private fun getResolution(width: Int, height: Int): String {
    if (width <= 0 || height <= 0) return "Unknown"
    return "$width x $height"
  }

  private fun getDensityDpi(densityDpi: Int): String {
    if (densityDpi <= 0) return "Unknown"
    return "$densityDpi dpi"
  }

  private fun getPhysicalSizeDiagonal(width: Int, height: Int, xdpi: Float, ydpi: Float): String {
    if (width <= 0 || height <= 0 || xdpi <= 0f || ydpi <= 0f) return "Unknown"

    val widthInches = width / xdpi
    val heightInches = height / ydpi
    val diagonal = sqrt(widthInches.toDouble().pow(2.0) + heightInches.toDouble().pow(2.0))

    return String.format(Locale.US, "%.2f in", diagonal)
  }

  @Suppress("DEPRECATION")
  private fun getRefreshRate(): String {
    return try {
      val display = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
        reactContext.currentActivity?.display ?: reactContext.display
      } else {
        val windowManager = reactContext.getSystemService(Context.WINDOW_SERVICE) as WindowManager
        windowManager.defaultDisplay
      }

      val rate = display?.refreshRate ?: 0f
      if (rate <= 0f) "Unknown" else String.format(Locale.US, "%.0f Hz", rate)
    } catch (_: Exception) {
      "Unknown"
    }
  }

  @Suppress("DEPRECATION")
  private fun getRotationOrientation(configuration: Configuration): String {
    val orientation = when (configuration.orientation) {
      Configuration.ORIENTATION_PORTRAIT -> "Portrait"
      Configuration.ORIENTATION_LANDSCAPE -> "Landscape"
      else -> "Undefined"
    }

    val rotation = try {
      val rotationValue = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
        (reactContext.currentActivity?.display ?: reactContext.display)?.rotation ?: Surface.ROTATION_0
      } else {
        val windowManager = reactContext.getSystemService(Context.WINDOW_SERVICE) as WindowManager
        windowManager.defaultDisplay.rotation
      }

      when (rotationValue) {
        Surface.ROTATION_0 -> "0°"
        Surface.ROTATION_90 -> "90°"
        Surface.ROTATION_180 -> "180°"
        Surface.ROTATION_270 -> "270°"
        else -> "Unknown"
      }
    } catch (_: Exception) {
      "Unknown"
    }

    return "$orientation ($rotation)"
  }

  private fun getDisplayCutoutSafeArea(): String {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.P) {
      return "Not Supported"
    }

    return try {
      val insets = reactContext.currentActivity?.window?.decorView?.rootWindowInsets ?: return "Unavailable"
      val cutout = insets.displayCutout ?: return "None"
      "Top ${cutout.safeInsetTop}, Bottom ${cutout.safeInsetBottom}, Left ${cutout.safeInsetLeft}, Right ${cutout.safeInsetRight}"
    } catch (_: Exception) {
      "Unavailable"
    }
  }

  private fun formatBytes(bytes: Long): String {
    if (bytes <= 0L) return "Unknown"
    val gb = bytes.toDouble() / (1024.0 * 1024.0 * 1024.0)
    return String.format(Locale.US, "%.2f GB", gb)
  }

  private fun getTotalInternalStorageBytes(): Long {
    return try {
      val statFs = StatFs(Environment.getDataDirectory().absolutePath)
      statFs.totalBytes
    } catch (_: Exception) {
      0L
    }
  }

  private fun getFreeInternalStorageBytes(): Long {
    return try {
      val statFs = StatFs(Environment.getDataDirectory().absolutePath)
      statFs.availableBytes
    } catch (_: Exception) {
      0L
    }
  }

  private fun getUsedPercent(totalBytes: Long, freeBytes: Long): String {
    if (totalBytes <= 0L || freeBytes < 0L || freeBytes > totalBytes) return "Unknown"
    val usedBytes = totalBytes - freeBytes
    val usedPercent = (usedBytes.toDouble() / totalBytes.toDouble()) * 100.0
    return String.format(Locale.US, "%.1f%%", usedPercent)
  }

  private fun getSdCardCapacity(): String {
    return try {
      val externalDirs = reactContext.getExternalFilesDirs(null)
      val sdCardDir = externalDirs.firstOrNull {
        it != null && Environment.isExternalStorageRemovable(it)
      }

      if (sdCardDir == null) {
        "Not Available"
      } else {
        val statFs = StatFs(sdCardDir.absolutePath)
        formatBytes(statFs.totalBytes)
      }
    } catch (_: Exception) {
      "Unknown"
    }
  }

  private fun getDeviceSecureLockStatus(): String {
    val keyguardManager =
      reactContext.getSystemService(Context.KEYGUARD_SERVICE) as? KeyguardManager ?: return "Unknown"

    return try {
      val isSecure = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
        keyguardManager.isDeviceSecure
      } else {
        @Suppress("DEPRECATION")
        keyguardManager.isKeyguardSecure
      }

      if (isSecure) "Secure" else "Not Secure"
    } catch (_: Exception) {
      "Unknown"
    }
  }

  private fun getFingerprintSensorPresence(): String {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) return "No"

    return try {
      val hasFingerprint =
        reactContext.packageManager.hasSystemFeature(PackageManager.FEATURE_FINGERPRINT)
      if (hasFingerprint) "Yes" else "No"
    } catch (_: Exception) {
      "Unknown"
    }
  }

  private fun isProbablyEmulator(): Boolean {
    return Build.FINGERPRINT.startsWith("generic") ||
      Build.FINGERPRINT.contains("emulator", ignoreCase = true) ||
      Build.MODEL.contains("Emulator", ignoreCase = true) ||
      Build.MODEL.contains("Android SDK", ignoreCase = true) ||
      Build.BRAND.startsWith("generic") ||
      Build.DEVICE.startsWith("generic") ||
      Build.MANUFACTURER.contains("Genymotion", ignoreCase = true)
  }

  private fun getSecureSettingsAvailability(): String {
    return try {
      val androidId =
        Settings.Secure.getString(reactContext.contentResolver, Settings.Secure.ANDROID_ID)
      if (androidId.isNullOrBlank()) "Unavailable" else "Available"
    } catch (_: Exception) {
      "Unavailable"
    }
  }

  private fun getPrimaryLocale(configuration: Configuration): Locale {
    return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
      configuration.locales.get(0) ?: Locale.getDefault()
    } else {
      @Suppress("DEPRECATION")
      configuration.locale ?: Locale.getDefault()
    }
  }

  private fun getLocaleLanguage(configuration: Configuration): String {
    val locale = getPrimaryLocale(configuration)
    return cleanText(locale.displayLanguage)
  }

  private fun getRegion(configuration: Configuration): String {
    val locale = getPrimaryLocale(configuration)
    val regionCode = locale.country
    return if (regionCode.isBlank()) "Unknown" else regionCode
  }

  private fun getTimezoneId(): String {
    val id = TimeZone.getDefault().id
    return if (id.isBlank()) "Unknown" else id
  }

  private fun getClockFormat(): String {
    return if (DateFormat.is24HourFormat(reactContext)) "24-hour" else "12-hour"
  }
}

class SystemInfoPackage : ReactPackage {
  override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
    return listOf(SystemInfoModule(reactContext))
  }

  override fun createViewManagers(
    reactContext: ReactApplicationContext,
  ): List<ViewManager<*, *>> {
    return emptyList()
  }
}
