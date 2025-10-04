import { useAuth } from '@/assets/components/context/context'
import { router, useLocalSearchParams } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function EditNote() {
  const { id } = useLocalSearchParams()
const {token} = useAuth()
if(!token){
    return router.replace('/login')
}
  return (
    <SafeAreaView>
         <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backButton}>← Back</Text>
                  </TouchableOpacity>
    <View>
      <Text>{`Edit Note Screen - Note ID: ${id}`}</Text>
    </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    backButton: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 20,
  },
})