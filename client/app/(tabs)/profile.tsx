import { Pressable,  Text, View } from "react-native";

import {  useRouter } from "expo-router";
import { useAuth } from "@/assets/components/context/context";
import { SafeAreaView } from "react-native-safe-area-context";
export default function Profile(){

    const {logout} = useAuth()

     const router = useRouter();
    const handleLogout=()=>{
        logout()
        router.push('/')
    }
    return (<>
    <SafeAreaView style={{flex:1}}>
    <View style={{flex:1, alignItems:'center' ,justifyContent:'center'}}>
        <Text>My Setting</Text>
        <Pressable onPress={handleLogout}>
            <Text style={{fontSize:20}}>Logout</Text>
        </Pressable>

    </View>
    </SafeAreaView>
    </>)
}