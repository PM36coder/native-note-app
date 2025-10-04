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
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { token } = useAuth();
  // Data Fetching Function
  const fetchNotes = async () => {
    try {
      // API call: /all endpoint se notes lana
      const response = await API.get("/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Response ka data notes state mein set
      // Assuming backend sends data as { notes: [...] }
      setNotes(response.data.notes);
    } catch (error: any) {
      console.error(
        "Error fetching notes:",
        error.response?.data || error.message
      );
      // Agar 401 (Unauthorized) mile to login
      if (error.response?.status === 401) {
        Alert.alert("Session Expired", "Please log in again.");
        router.replace("/login");
      } else {
        Alert.alert("Error", "Failed to load notes.");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // --- 3. Component Focus Hook ---
  // Yeh hook har baar chalta hai jab screen focus mein aati hai (jaise tab change karne par)
  useFocusEffect(
    useCallback(() => {
      fetchNotes();
      // Jab screen blur  ho, tab kuch nhi kar
      return () => {};
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );

  // --- Pull-to-Refresh Handler ---
  const onRefresh = () => {
    setRefreshing(true);
    fetchNotes();
  };

  // --- Note Press Handler ---
  const handleEdit = (id: string) => {
    // User ko Edit/View Note Screen par
    console.log("Note ID:", id);
    console.log("Pushing to:", `/edit-note/${id}`);
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
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // --- Empty State UI ---
  if (notes.length === 0 && !loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No notes found. Create one!</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => router.push("/create")} // 'create' tab par bhejega
        >
          <Text style={styles.createButtonText}>+ Create Note</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- Main Notes List UI ---
  const renderNoteItem = ({ item }: { item: INote }) => (
    <TouchableOpacity style={styles.noteItem}>
      <Text style={styles.noteTitle} numberOfLines={1}>
        {item.title || "Untitled Note"}
      </Text>
      <Text style={styles.noteContent} numberOfLines={2}>
        {item.content || "Empty content"}
      </Text>
      <Text style={styles.noteDate}>
        {new Date(item.createdAt).toLocaleDateString()}
      </Text>
     
      <Pressable style={{ flex: 1, flexDirection: "row", gap: 10 }}>
        <Text
          style={styles.deleteButton}
          onPress={() => handleDelete(item._id)}
        >
        
          Delete
        </Text>
        <Text style={styles.editButton} onPress={() => handleEdit(item._id)}>
          Edit
        </Text>
      </Pressable>
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
          // Pull-to-refresh feature
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
  editButton: {
    color: "#007AFF",
    fontWeight: "bold",
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    // alignSelf: 'flex-end',
    fontSize: 16,
    overflow: "hidden",
  },
  deleteButton: {
    color: "red",
    fontWeight: "bold",
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    alignSelf: "flex-start",
    fontSize: 16,
    overflow: "hidden",
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
  noteDate: {
    fontSize: 12,
    color: "#999",
    textAlign: "right",
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
