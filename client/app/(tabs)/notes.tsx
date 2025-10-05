import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import API from "@/assets/components/axios/axios";
import { useAuth } from "@/assets/components/context/context";

// --- 1. TypeScript Interfaces ---
interface INote {
  _id: string;
  title: string;
  content: string;
  user: string; // User ID
  createdAt: string;
}

// --- 2. Main Component ---
export default function NotesListScreen() {
  const router = useRouter();
  const [notes, setNotes] = useState<INote[]>([]);
  // loading: Notes data fetching state
  const [loading, setLoading] = useState(true); 
  const [refreshing, setRefreshing] = useState(false);
  
  // FIX: token aur authLoading dono nikaalo
  const { token, loading: authLoading } = useAuth(); 

  // Data Fetching Function (useCallback use kiya, taaki useFocusEffect mein sahi se kaam kare)
  const fetchNotes = useCallback(async () => {
    // Agar token nahi hai, toh fetch nahi karenge
    if (!token) { 
        setLoading(false);
        setRefreshing(false);
        return;
    }
    
    // Agar refreshing nahi ho raha, toh loading state set karo
    if(!refreshing) setLoading(true);

    try {
      const response = await API.get("/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotes(response.data.notes);
    } catch (error: any) {
      console.error(
        "Error fetching notes:",
        error.response?.data || error.message
      );
      
      // FIX 1: Agar 401 (Unauthorized) mile, toh login screen par bhej do
      if (error.response?.status === 401) {
        Alert.alert("Session Expired", "Please log in again.");
        // FIX 2: Correct path for login screen
        router.replace("/(auth)/login");
      } else {
        Alert.alert("Error", "Failed to load notes.");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token, router, refreshing]); // <-- Dependency Array mein token, router, aur refreshing

  // --- 3. Component Focus Hook (FIXED) ---
  // Yeh hook har baar chalta hai jab screen focus mein aati hai
  useFocusEffect(
    useCallback(() => {
      // FIX 3: Fetching sirf tab shuru karo jab AuthProvider ne data loading complete kar li ho
      if (!authLoading) {
        fetchNotes();
      }
      return () => {};
    }, [authLoading, fetchNotes]) // <-- authLoading aur fetchNotes par depend karega
  );

  // --- Pull-to-Refresh Handler ---
  const onRefresh = () => {
    setRefreshing(true);
    fetchNotes();
  };

  // --- Note Press Handler (View/Edit) ---
  const handleEdit = (id: string) => {
    router.push(`/edit-note/${id}`);
  };

  //! delete note
  const handleDelete = (id: string) => {
    Alert.alert("Delete Note", "Are you sure you want to delete this note?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: async () => {
          try {
            await API.delete(`/delete/${id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            //! Note delete hone
            setNotes((prevNotes) =>
              prevNotes.filter((note) => note._id !== id)
            );
          } catch (error: any) {
            console.error(
              "Error deleting note:",
              error.response?.data || error.message
            );
            Alert.alert("Error", "Failed to delete note.");
          }
        },
      },
    ]);
  };

  // --- Loading UI ---
  // FIX 4: Auth loading check zaroori hai taaki token load hone tak wait kare
  if (loading || authLoading) { 
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // --- Empty State UI ---
  if (notes.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No notes found. Create one!</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => router.push("/(tabs)/create")} // Correct path to create tab
        >
          <Text style={styles.createButtonText}>+ Create Note</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- Main Notes List UI ---
  const renderNoteItem = ({ item }: { item: INote }) => (
    // FIX 5: Outer TouchableOpacity par onPress handler add kiya, taki pura note editable ho
    <TouchableOpacity 
      style={styles.noteItem}
      onPress={() => handleEdit(item._id)}
      activeOpacity={0.8}
    >
      <Text style={styles.noteTitle} numberOfLines={1}>
        {item.title || "Untitled Note"}
      </Text>
      <Text style={styles.noteContent} numberOfLines={2}>
        {item.content || "Empty content"}
      </Text>
      
      {/* Action Buttons Container */}
      <View style={styles.actionContainer}>
        <Text style={styles.noteDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
        <View style={styles.buttonGroup}>
            {/* e.stopPropagation() zaroori hai taki delete/edit button dabane par outer TouchableOpacity ka onPress (handleEdit) call na ho */}
            <Text style={styles.deleteButton} onPress={(e) => { e.stopPropagation(); handleDelete(item._id); }}>
                Delete
            </Text>
            <Text style={styles.editButton} onPress={(e) => { e.stopPropagation(); handleEdit(item._id); }}>
                Edit
            </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Text style={styles.headerTitle}>Your Notes</Text>
      <FlatList
        data={notes}
        keyExtractor={(item) => item._id}
        renderItem={renderNoteItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  noteItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 5,
  },
  noteContent: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  // FIX: Action buttons ko better align karne ke liye naya style
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 8,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  noteDate: {
    fontSize: 12,
    color: "#999",
  },
  // Custom button styles for better visibility
  editButton: {
    color: "#007AFF",
    fontWeight: "bold",
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "#e0f0ff", // Light blue background
    borderRadius: 8,
    fontSize: 14,
    overflow: "hidden",
  },
  deleteButton: {
    color: "#ff4d4f",
    fontWeight: "bold",
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "#ffe0e0", // Light red background
    borderRadius: 8,
    fontSize: 14,
    overflow: "hidden",
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 8,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});