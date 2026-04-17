package com.aakarsh_7.device

import android.content.Context
import android.net.ConnectivityManager
import android.net.wifi.ScanResult
import android.net.wifi.WifiManager
import android.os.Build
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.uimanager.ViewManager

class WifiInfoModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "WifiInfoModule"

  @Suppress("DEPRECATION")
  @ReactMethod
  fun getWifiDetails(promise: Promise) {
    try {
      val wifiManager =
        reactContext.applicationContext.getSystemService(Context.WIFI_SERVICE) as WifiManager
      val wifiInfo = wifiManager.connectionInfo
      val dhcpInfo = wifiManager.dhcpInfo

      val wifiSecurity = parseSecurityType(wifiInfo?.bssid, wifiManager.scanResults)
      val result = Arguments.createMap().apply {
        putString("ssid", cleanSsid(wifiInfo?.ssid))
        putString("bssid", cleanText(wifiInfo?.bssid))
        putString("security", wifiSecurity)

        val rssi = wifiInfo?.rssi
        if (rssi != null && rssi > -127) {
          putInt("rssi", rssi)
        } else {
          putNull("rssi")
        }

        val linkSpeed = wifiInfo?.linkSpeed
        if (linkSpeed != null && linkSpeed > 0) {
          putInt("linkSpeed", linkSpeed)
        } else {
          putNull("linkSpeed")
        }

        val frequency = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
          wifiInfo?.frequency
        } else {
          null
        }
        if (frequency != null && frequency > 0) {
          putInt("frequency", frequency)
        } else {
          putNull("frequency")
        }

        val gatewayAddress = dhcpInfo?.gateway ?: 0
        if (gatewayAddress != 0) {
          putString("gateway", intToIp(gatewayAddress))
        } else {
          putString("gateway", "Unknown")
        }

        val subnetMaskAddress = dhcpInfo?.netmask ?: 0
        if (subnetMaskAddress != 0) {
          putString("subnetMask", intToIp(subnetMaskAddress))
        } else {
          putString("subnetMask", "Unknown")
        }

        putString("interfaceName", getActiveInterfaceName())

        val dns1Address = dhcpInfo?.dns1 ?: 0
        if (dns1Address != 0) {
          putString("dns1", intToIp(dns1Address))
        } else {
          putString("dns1", "Unknown")
        }

        val dns2Address = dhcpInfo?.dns2 ?: 0
        if (dns2Address != 0) {
          putString("dns2", intToIp(dns2Address))
        } else {
          putString("dns2", "Unknown")
        }
      }

      promise.resolve(result)
    } catch (e: Exception) {
      promise.reject("WIFI_INFO_ERROR", e)
    }
  }

  private fun cleanSsid(value: String?): String {
    val text = value?.trim().orEmpty()
    if (text.isEmpty() || text == "<unknown ssid>") return "Unknown"
    return text.removePrefix("\"").removeSuffix("\"")
  }

  private fun cleanText(value: String?): String {
    val text = value?.trim().orEmpty()
    return if (text.isEmpty() || text == "02:00:00:00:00:00") "Unknown" else text
  }

  private fun parseSecurityType(currentBssid: String?, scanResults: List<ScanResult>?): String {
    val normalizedBssid = currentBssid?.trim()?.lowercase() ?: return "Unknown"
    val scanResult = scanResults?.firstOrNull { it.BSSID?.lowercase() == normalizedBssid } ?: return "Unknown"
    return parseCapabilities(scanResult.capabilities)
  }

  private fun parseCapabilities(capabilities: String?): String {
    val caps = capabilities?.uppercase() ?: return "Unknown"
    return when {
      "WPA3" in caps -> "WPA3"
      "SAE" in caps -> "WPA3"
      "WPA2" in caps -> "WPA2"
      "WPA" in caps -> "WPA"
      "WEP" in caps -> "WEP"
      "OWE" in caps -> "OWE"
      "EAP" in caps -> "WPA2-EAP"
      caps.contains("ESS") -> "Open"
      else -> "Unknown"
    }
  }

  private fun getActiveInterfaceName(): String {
    return try {
      val connectivityManager =
        reactContext.applicationContext.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
      val network = connectivityManager.activeNetwork ?: return "Unknown"
      val interfaceName = connectivityManager.getLinkProperties(network)?.interfaceName
      if (interfaceName.isNullOrBlank()) "Unknown" else interfaceName
    } catch (_: Exception) {
      "Unknown"
    }
  }

  private fun intToIp(value: Int): String {
    return "${value and 0xFF}.${value shr 8 and 0xFF}.${value shr 16 and 0xFF}.${value shr 24 and 0xFF}"
  }
}

class WifiInfoPackage : ReactPackage {
  override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
    return listOf(WifiInfoModule(reactContext))
  }

  override fun createViewManagers(
    reactContext: ReactApplicationContext,
  ): List<ViewManager<*, *>> {
    return emptyList()
  }
}