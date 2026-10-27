import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Todo, Priority } from '../types';
import { useTodos } from '../context/TodoContext';

interface TodoItemProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onEdit }) => {
  const { toggleTodo, deleteTodo } = useTodos();

  const handleDelete = () => {
    if (Platform.OS === 'web') {
      if (window.confirm(`Delete "${todo.title}"?`)) {
        deleteTodo(todo.id);
      }
    } else {
      Alert.alert(
        'Delete Task',
        `Are you sure you want to delete "${todo.title}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: () => deleteTodo(todo.id) },
        ]
      );
    }
  };

  const getPriorityStyle = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return { bg: '#fef2f2', text: '#ef4444', label: 'High' };
      case 'medium':
        return { bg: '#fffbeb', text: '#d97706', label: 'Med' };
      case 'low':
        return { bg: '#ecfdf5', text: '#059669', label: 'Low' };
    }
  };

  const priorityMeta = getPriorityStyle(todo.priority);

  return (
    <View style={[styles.card, todo.completed && styles.cardCompleted]}>
      {/* Checkbox */}
      <TouchableOpacity
        onPress={() => toggleTodo(todo.id)}
        style={[styles.checkbox, todo.completed && styles.checkboxActive]}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: todo.completed }}
      >
        {todo.completed && <Ionicons name="checkmark" size={16} color="#ffffff" />}
      </TouchableOpacity>

      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text
            style={[styles.title, todo.completed && styles.titleCompleted]}
            numberOfLines={2}
          >
            {todo.title}
          </Text>
        </View>

        {todo.description ? (
          <Text
            style={[styles.description, todo.completed && styles.descCompleted]}
            numberOfLines={2}
          >
            {todo.description}
          </Text>
        ) : null}

        {/* Tags Row */}
        <View style={styles.tagsRow}>
          <View style={[styles.priorityBadge, { backgroundColor: priorityMeta.bg }]}>
            <Text style={[styles.priorityText, { color: priorityMeta.text }]}>
              {priorityMeta.label}
            </Text>
          </View>

          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{todo.category}</Text>
          </View>

          {todo.dueDate ? (
            <View style={styles.dueDateBadge}>
              <Ionicons name="calendar-outline" size={12} color="#64748b" style={{ marginRight: 4 }} />
              <Text style={styles.dueDateText}>{todo.dueDate}</Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => onEdit(todo)}
          style={styles.actionBtn}
          accessibilityLabel="Edit task"
        >
          <Ionicons name="pencil" size={17} color="#64748b" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleDelete}
          style={styles.actionBtn}
          accessibilityLabel="Delete task"
        >
          <Ionicons name="trash-outline" size={17} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  cardCompleted: {
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
    opacity: 0.85,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
    backgroundColor: '#ffffff',
  },
  checkboxActive: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  content: {
    flex: 1,
    paddingRight: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
    lineHeight: 20,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: '#94a3b8',
  },
  description: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
    lineHeight: 18,
  },
  descCompleted: {
    color: '#cbd5e1',
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '700',
  },
  categoryBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  dueDateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  dueDateText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
    marginTop: 2,
  },
  actionBtn: {
    padding: 6,
  },
});

