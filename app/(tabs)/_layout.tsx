import React from 'react'
import { Tabs } from 'expo-router'
import { TabBar } from '@/components/TabBar'

const TabLayout = () => {
  return (
   <Tabs tabBar={props => <TabBar {...props} />}>
    <Tabs.Screen name="index" options={{ title: 'Home', headerShown: false }}  />
    <Tabs.Screen name="battery" options={{ title: 'Battery', headerShown: false }} />
    <Tabs.Screen name="sensors" options={{ title: 'Sensors', headerShown: false }} />
    <Tabs.Screen name="network" options={{ title: 'Network', headerShown: false }} />
    <Tabs.Screen name="system" options={{ title: 'System', headerShown: false }} />
   </Tabs>
  )
}

export default TabLayout