import React from "react";
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/assets/components/context/context";

// --- Utility Function: Initials Banane Ke Liye ---
const getInitials = (fullName: string | undefined): string => {
  if (!fullName) return "";
  const names = fullName.split(" ").filter((n) => n.length > 0);

  // Agar sirf ek naam hai, toh pehla letter de do
  if (names.length === 1) {
    return names[0][0].toUpperCase();
  }

  // Agar do ya zyada naam hain, toh pehle aur aakhri naam ka pehla letter
  if (names.length >= 2) {
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  }
  return "";
};

export default function Profile() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();

    router.replace("/(auth)/login");
  };

  

  // (though AuthProvider should handle loading)
  if (!user) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text>Loading Profile...</Text>
      </SafeAreaView>
    );
  }

  // User ki profile picture ke liye initials
  const initials = getInitials(user.fullName);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* 1. User Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.userName}>{user.fullName}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>

        {/* --- 2. Account Settings Section --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>

          {/* Password Change */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/settings/change-password")}
          >
            <Text style={styles.menuItemText}>Change Password</Text>
            <Text style={styles.arrow}>&gt;</Text>
          </TouchableOpacity>

          {/* Update Profile (Name/Email) */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/settings/update-profile")}
          >
            <Text style={styles.menuItemText}>Update Profile Info</Text>
            <Text style={styles.arrow}>&gt;</Text>
          </TouchableOpacity>
        </View>

        {/* --- 3. General Settings Section (Example) --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>

          {/* About App */}
          <TouchableOpacity
            style={styles.menuItem}
            // onPress={() => navigateToSettings("about")}
          >
            <Text style={styles.menuItemText}>About App</Text>
            <Text style={styles.arrow}>&gt;</Text>
          </TouchableOpacity>
        </View>

        {/* --- 4. Logout Button --- */}
        <Pressable onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  // --- 1. Header Styling ---
  profileHeader: {
    alignItems: "center",
    paddingVertical: 30,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#007AFF", // Blue primary color
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginTop: 5,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
  },
  // --- 2. Menu Section Styling ---
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 10,
    marginLeft: 5,
    textTransform: "uppercase",
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  menuItemText: {
    fontSize: 16,
    color: "#333",
  },
  arrow: {
    fontSize: 16,
    color: "#ccc",
  },
  // --- 3. Logout Button Styling ---
  logoutButton: {
    backgroundColor: "#ff4d4f", // Red for dangerous action
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
