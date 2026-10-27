import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../../components/Header';
import { StatsCard } from '../../components/StatsCard';
import { CategoryFilter } from '../../components/CategoryFilter';
import { TodoItem } from '../../components/TodoItem';
import { TodoModal } from '../../components/TodoModal';
import { useTodos } from '../../context/TodoContext';
import { Todo } from '../../types';

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const { filteredTodos, isLoading, refreshTodos, clearCompleted, stats } = useTodos();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshTodos();
    setRefreshing(false);
  };

  const handleOpenCreateModal = () => {
    setEditingTodo(null);
    setModalVisible(true);
  };

  const handleOpenEditModal = (todo: Todo) => {
    setEditingTodo(todo);
    setModalVisible(true);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top Header with Profile & Search */}
      <Header />

      {/* Main Todo List with Header Components */}
      <FlatList
        data={filteredTodos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TodoItem todo={item} onEdit={handleOpenEditModal} />
        )}
        ListHeaderComponent={
          <>
            <StatsCard />
            <CategoryFilter />
          </>
        }
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.centerBox}>
              <ActivityIndicator size="large" color="#4f46e5" />
              <Text style={styles.loadingText}>Loading tasks...</Text>
            </View>
          ) : (
            <View style={styles.centerBox}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="sparkles-outline" size={36} color="#818cf8" />
              </View>
              <Text style={styles.emptyTitle}>No tasks found</Text>
              <Text style={styles.emptySubtitle}>
                {stats.total === 0
                  ? 'Tap the + button below to create your first task!'
                  : 'Try changing your category or search filter.'}
              </Text>
            </View>
          )
        }
        ListFooterComponent={
          stats.completed > 0 ? (
            <View style={styles.footerContainer}>
              <TouchableOpacity
                onPress={clearCompleted}
                style={styles.clearCompletedBtn}
                accessibilityRole="button"
              >
                <Ionicons name="trash-bin-outline" size={15} color="#ef4444" style={{ marginRight: 6 }} />
                <Text style={styles.clearCompletedText}>
                  Clear {stats.completed} Completed {stats.completed === 1 ? 'Task' : 'Tasks'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ height: 90 }} />
          )
        }
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: Math.max(insets.bottom + 80, 100) },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4f46e5" />
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={handleOpenCreateModal}
        style={[
          styles.fab,
          { bottom: Math.max(insets.bottom + 20, 24) },
        ]}
        accessibilityLabel="Add new task"
        accessibilityRole="button"
      >
        <Ionicons name="add" size={32} color="#ffffff" />
      </TouchableOpacity>

      {/* Create / Edit Modal */}
      <TodoModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingTodo(null);
        }}
        initialTodo={editingTodo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  listContent: {
    flexGrow: 1,
  },
  centerBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    paddingHorizontal: 30,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748b',
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#ede9fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  footerContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 60,
  },
  clearCompletedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fee2e2',
  },
  clearCompletedText: {
    color: '#ef4444',
    fontSize: 13,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
});

