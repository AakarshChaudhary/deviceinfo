package com.aakarsh_7.device

import android.content.Context
import android.hardware.Sensor
import android.hardware.SensorManager
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.uimanager.ViewManager

class SensorInfoModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "SensorInfoModule"

  @ReactMethod
  fun getSensorDetails(promise: Promise) {
    try {
      val sensorManager =
        reactContext.getSystemService(Context.SENSOR_SERVICE) as? SensorManager

      val result = Arguments.createMap().apply {
        putString("proximitySensor", formatSensor(sensorManager, Sensor.TYPE_PROXIMITY))
        putString("ambientLightSensor", formatSensor(sensorManager, Sensor.TYPE_LIGHT))
        putString("stepCounterSensor", formatSensor(sensorManager, Sensor.TYPE_STEP_COUNTER))
        putString("rotationVectorSensor", formatSensor(sensorManager, Sensor.TYPE_ROTATION_VECTOR))
        putString("gravitySensor", formatSensor(sensorManager, Sensor.TYPE_GRAVITY))
        putString("linearAccelerationSensor", formatSensor(sensorManager, Sensor.TYPE_LINEAR_ACCELERATION))
        putString("relativeHumiditySensor", formatSensor(sensorManager, Sensor.TYPE_RELATIVE_HUMIDITY))
        putString("ambientTemperatureSensor", formatSensor(sensorManager, Sensor.TYPE_AMBIENT_TEMPERATURE))
      }

      promise.resolve(result)
    } catch (e: Exception) {
      promise.reject("SENSOR_INFO_ERROR", e)
    }
  }

  private fun formatSensor(sensorManager: SensorManager?, sensorType: Int): String {
    val sensor = sensorManager?.getDefaultSensor(sensorType) ?: return "Not available"

    val name = sensor.name?.trim().orEmpty()
    val vendor = sensor.vendor?.trim().orEmpty()

    val cleanedName = cleanSensorText(name)
    val cleanedVendor = cleanSensorText(vendor)

    if (cleanedName.isEmpty() && cleanedVendor.isEmpty()) {
      return "Available"
    }

    if (cleanedVendor.isEmpty()) {
      return cleanedName
    }

    if (cleanedName.isEmpty()) {
      return cleanedVendor
    }

    return "$cleanedName ($cleanedVendor)"
  }

  private fun cleanSensorText(value: String): String {
    return value
      .replace("Non-wakeup", "", ignoreCase = true)
      .replace("Non wakeup", "", ignoreCase = true)
      .replace("Non - wakeup", "", ignoreCase = true)
      .replace("NonWakeup", "", ignoreCase = true)
      .replace("Wakeup", "", ignoreCase = true)
      .trim()
  }
}

class SensorInfoPackage : ReactPackage {
  override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
    return listOf(SensorInfoModule(reactContext))
  }

  override fun createViewManagers(
    reactContext: ReactApplicationContext,
  ): List<ViewManager<*, *>> {
    return emptyList()
  }
}
