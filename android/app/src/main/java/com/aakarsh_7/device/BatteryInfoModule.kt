package com.aakarsh_7.device

import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.BatteryManager
import android.os.Build
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.uimanager.ViewManager
import java.io.File
import kotlin.math.abs

class BatteryInfoModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "BatteryInfoModule"

  @ReactMethod
  fun getBatteryDetails(promise: Promise) {
    try {
      val batteryManager = reactContext.getSystemService(Context.BATTERY_SERVICE) as BatteryManager
      val batteryIntent =
        reactContext.registerReceiver(null, IntentFilter(Intent.ACTION_BATTERY_CHANGED))

      val temperatureRaw = batteryIntent?.getIntExtra(BatteryManager.EXTRA_TEMPERATURE, -1) ?: -1
      val voltageRaw = batteryIntent?.getIntExtra(BatteryManager.EXTRA_VOLTAGE, -1) ?: -1
      val statusRaw = batteryIntent?.getIntExtra(BatteryManager.EXTRA_STATUS, -1) ?: -1
      val healthRaw = batteryIntent?.getIntExtra(BatteryManager.EXTRA_HEALTH, -1) ?: -1
      val technology = batteryIntent?.getStringExtra(BatteryManager.EXTRA_TECHNOLOGY)
      val capacityPercent = batteryManager.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY)
      val chargeCounterMicroAh =
        batteryManager.getIntProperty(BatteryManager.BATTERY_PROPERTY_CHARGE_COUNTER)
      val currentNowMicroAmp = readLongFromFile("/sys/class/power_supply/battery/current_now")

      val capacityMah = if (chargeCounterMicroAh > 0 && capacityPercent in 1..100) {
        val remainingMah = chargeCounterMicroAh / 1000.0
        remainingMah / (capacityPercent / 100.0)
      } else {
        null
      }

      val isCharging = statusRaw == BatteryManager.BATTERY_STATUS_CHARGING ||
        statusRaw == BatteryManager.BATTERY_STATUS_FULL

      val chargingCurrentMa = if (isCharging && currentNowMicroAmp != null) {
        abs(currentNowMicroAmp) / 1000.0
      } else {
        null
      }

      val result = Arguments.createMap().apply {
        putString("manufacturer", cleanText(Build.MANUFACTURER))

        if (temperatureRaw >= 0) {
          putDouble("temperatureC", temperatureRaw / 10.0)
        } else {
          putNull("temperatureC")
        }

        if (voltageRaw >= 0) {
          putDouble("voltageMv", voltageRaw.toDouble())
        } else {
          putNull("voltageMv")
        }

        if (capacityMah != null) {
          putDouble("capacityMah", capacityMah)
        } else {
          putNull("capacityMah")
        }

        if (chargingCurrentMa != null) {
          putDouble("chargingCurrentMa", chargingCurrentMa)
        } else {
          putNull("chargingCurrentMa")
        }

        putString("batteryHealth", mapBatteryHealth(healthRaw))
        putString("batteryTechnology", cleanText(technology))
      }

      promise.resolve(result)
    } catch (e: Exception) {
      promise.reject("BATTERY_INFO_ERROR", e)
    }
  }

  private fun cleanText(value: String?): String {
    val text = value?.trim().orEmpty()
    return if (text.isEmpty()) "Unknown" else text
  }

  private fun mapBatteryHealth(health: Int): String {
    return when (health) {
      BatteryManager.BATTERY_HEALTH_GOOD -> "Good"
      BatteryManager.BATTERY_HEALTH_OVERHEAT -> "Overheat"
      BatteryManager.BATTERY_HEALTH_DEAD -> "Dead"
      BatteryManager.BATTERY_HEALTH_OVER_VOLTAGE -> "Over Voltage"
      BatteryManager.BATTERY_HEALTH_UNSPECIFIED_FAILURE -> "Failure"
      BatteryManager.BATTERY_HEALTH_COLD -> "Cold"
      BatteryManager.BATTERY_HEALTH_UNKNOWN -> "Unknown"
      else -> "Unknown"
    }
  }

  private fun readLongFromFile(path: String): Long? {
    return try {
      File(path).readText().trim().toLongOrNull()
    } catch (_: Exception) {
      null
    }
  }
}

class BatteryInfoPackage : ReactPackage {
  override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
    return listOf(BatteryInfoModule(reactContext))
  }

  override fun createViewManagers(
    reactContext: ReactApplicationContext,
  ): List<ViewManager<*, *>> {
    return emptyList()
  }
}
