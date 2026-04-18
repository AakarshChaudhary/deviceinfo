package com.aakarsh_7.device

import android.content.Context
import android.net.ConnectivityManager
import android.net.wifi.ScanResult
import android.net.wifi.WifiManager
import android.os.Build
import android.telephony.TelephonyManager
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.uimanager.ViewManager
import java.net.Inet4Address

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
      val telephonyManager =
        reactContext.applicationContext.getSystemService(Context.TELEPHONY_SERVICE) as? TelephonyManager

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

        putString("channel", getWifiChannel(frequency))
        putString("wifiStandard", getWifiStandardLabel(wifiInfo))

        val gatewayAddress = dhcpInfo?.gateway ?: 0
        if (gatewayAddress != 0) {
          putString("gateway", intToIp(gatewayAddress))
        } else {
          putString("gateway", "Unknown")
        }

        val leaseDuration = dhcpInfo?.leaseDuration
        if (leaseDuration != null && leaseDuration > 0) {
          putInt("leaseDuration", leaseDuration)
        } else {
          putNull("leaseDuration")
        }

        putString("subnetMask", getSubnetMask())

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

        putString("carrier", getCarrierName(telephonyManager))
        putString("cellularNetworkType", getCellularNetworkType(telephonyManager))
        putString("cellularSignalStrength", getCellularSignalStrength(telephonyManager))
        putString("cellularRoaming", getCellularRoaming(telephonyManager))
        putString("cellularDataState", getCellularDataState(telephonyManager))
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

  private fun getCarrierName(telephonyManager: TelephonyManager?): String {
    if (telephonyManager == null) return "Unknown"

    return try {
      val name = telephonyManager.networkOperatorName?.trim().orEmpty()
      if (name.isEmpty()) "Unknown" else name
    } catch (_: Exception) {
      "Unknown"
    }
  }

  private fun getCellularNetworkType(telephonyManager: TelephonyManager?): String {
    if (telephonyManager == null) return "Unknown"

    return try {
      val networkType =
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
          telephonyManager.dataNetworkType
        } else {
          @Suppress("DEPRECATION")
          telephonyManager.networkType
        }

      when (networkType) {
        TelephonyManager.NETWORK_TYPE_NR -> "5G"
        TelephonyManager.NETWORK_TYPE_LTE -> "LTE"
        19 -> "LTE+"
        TelephonyManager.NETWORK_TYPE_HSPAP -> "HSPA+"
        TelephonyManager.NETWORK_TYPE_HSPA -> "HSPA"
        TelephonyManager.NETWORK_TYPE_HSDPA -> "HSDPA"
        TelephonyManager.NETWORK_TYPE_HSUPA -> "HSUPA"
        TelephonyManager.NETWORK_TYPE_UMTS -> "UMTS"
        TelephonyManager.NETWORK_TYPE_EDGE -> "EDGE"
        TelephonyManager.NETWORK_TYPE_GPRS -> "GPRS"
        TelephonyManager.NETWORK_TYPE_CDMA -> "CDMA"
        TelephonyManager.NETWORK_TYPE_1xRTT -> "1xRTT"
        TelephonyManager.NETWORK_TYPE_EVDO_0 -> "EVDO rev.0"
        TelephonyManager.NETWORK_TYPE_EVDO_A -> "EVDO rev.A"
        TelephonyManager.NETWORK_TYPE_EVDO_B -> "EVDO rev.B"
        TelephonyManager.NETWORK_TYPE_EHRPD -> "eHRPD"
        TelephonyManager.NETWORK_TYPE_IDEN -> "iDEN"
        TelephonyManager.NETWORK_TYPE_IWLAN -> "IWLAN"
        TelephonyManager.NETWORK_TYPE_GSM -> "GSM"
        TelephonyManager.NETWORK_TYPE_TD_SCDMA -> "TD-SCDMA"
        else -> "Unknown"
      }
    } catch (_: Exception) {
      "Unknown"
    }
  }

  private fun getCellularSignalStrength(telephonyManager: TelephonyManager?): String {
    if (telephonyManager == null || Build.VERSION.SDK_INT < Build.VERSION_CODES.P) {
      return "Unknown"
    }

    return try {
      val signalStrength = telephonyManager.signalStrength ?: return "Unknown"

      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
        val dbm = signalStrength.cellSignalStrengths.firstOrNull()?.dbm
        if (dbm == null || dbm == Int.MAX_VALUE) "Unknown" else "$dbm dBm"
      } else {
        "${signalStrength.level}/4"
      }
    } catch (_: Exception) {
      "Unknown"
    }
  }

  private fun getCellularRoaming(telephonyManager: TelephonyManager?): String {
    if (telephonyManager == null) return "Unknown"

    return try {
      if (telephonyManager.isNetworkRoaming) "Yes" else "No"
    } catch (_: Exception) {
      "Unknown"
    }
  }

  private fun getCellularDataState(telephonyManager: TelephonyManager?): String {
    if (telephonyManager == null) return "Unknown"

    return try {
      when (telephonyManager.dataState) {
        TelephonyManager.DATA_CONNECTED -> "Connected"
        TelephonyManager.DATA_CONNECTING -> "Connecting"
        TelephonyManager.DATA_DISCONNECTED -> "Disconnected"
        TelephonyManager.DATA_SUSPENDED -> "Suspended"
        else -> "Unknown"
      }
    } catch (_: Exception) {
      "Unknown"
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

  private fun getSubnetMask(): String {
    return try {
      val connectivityManager =
        reactContext.applicationContext.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
      val network = connectivityManager.activeNetwork ?: return "Unknown"
      val linkProperties = connectivityManager.getLinkProperties(network) ?: return "Unknown"
      val ipv4PrefixLength =
        linkProperties.linkAddresses.firstOrNull { it.address is Inet4Address }?.prefixLength
          ?: return "Unknown"
      prefixLengthToSubnetMask(ipv4PrefixLength)
    } catch (_: Exception) {
      "Unknown"
    }
  }

  private fun getWifiStandardLabel(wifiInfo: android.net.wifi.WifiInfo?): String {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.R) return "Unknown"

    return when (wifiInfo?.wifiStandard) {
      ScanResult.WIFI_STANDARD_11N -> "WiFi 4"
      ScanResult.WIFI_STANDARD_11AC -> "WiFi 5"
      ScanResult.WIFI_STANDARD_11AX -> "WiFi 6"
      ScanResult.WIFI_STANDARD_11BE -> "WiFi 7"
      ScanResult.WIFI_STANDARD_LEGACY -> "Legacy"
      else -> "Unknown"
    }
  }

  private fun getWifiChannel(frequency: Int?): String {
    val value = frequency ?: return "Unknown"

    return when {
      value in 2412..2472 -> ((value - 2407) / 5).toString()
      value == 2484 -> "14"
      value in 5000..5895 -> ((value - 5000) / 5).toString()
      value in 5955..7115 -> ((value - 5950) / 5).toString()
      else -> "Unknown"
    }
  }

  private fun prefixLengthToSubnetMask(prefixLength: Int): String {
    if (prefixLength < 0 || prefixLength > 32) return "Unknown"

    var remaining = prefixLength
    val octets = IntArray(4)
    for (index in octets.indices) {
      val bits = minOf(8, remaining)
      octets[index] = if (bits == 0) 0 else ((0xFF shl (8 - bits)) and 0xFF)
      remaining -= bits
    }
    return "${octets[0]}.${octets[1]}.${octets[2]}.${octets[3]}"
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