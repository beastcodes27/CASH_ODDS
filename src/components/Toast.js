import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { Animated, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ToastContext = createContext({});

const TOAST_DURATION = 3000;
const ANIMATION_DURATION = 300;

const TOAST_TYPES = {
  success: { icon: 'checkmark-circle', color: '#4CAF50' },
  error: { icon: 'close-circle', color: '#ff4444' },
  info: { icon: 'information-circle', color: '#2196F3' },
  warning: { icon: 'warning', color: '#FF9800' },
};

function ToastItem({ toast, onHide }) {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -100,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
      ]).start(() => onHide(toast.id));
    }, toast.duration || TOAST_DURATION);

    return () => clearTimeout(timer);
  }, []);

  const typeConfig = TOAST_TYPES[toast.type] || TOAST_TYPES.info;

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        { transform: [{ translateY }], opacity },
      ]}
    >
      <View style={[styles.toastContent, { borderLeftColor: typeConfig.color }]}>
        <Ionicons name={typeConfig.icon} size={22} color={typeConfig.color} />
        <View style={styles.toastTextContainer}>
          {toast.title && <Text style={styles.toastTitle}>{toast.title}</Text>}
          <Text style={styles.toastMessage}>{toast.message}</Text>
        </View>
        <TouchableOpacity onPress={() => onHide(toast.id)} style={styles.toastClose}>
          <Ionicons name="close" size={18} color="#666" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const showToast = useCallback((message, options = {}) => {
    const id = ++idRef.current;
    const toast = {
      id,
      message,
      type: options.type || 'info',
      title: options.title || null,
      duration: options.duration || TOAST_DURATION,
    };
    setToasts(prev => [...prev, toast]);
    return id;
  }, []);

  const hideToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const success = useCallback((message, options = {}) => {
    return showToast(message, { ...options, type: 'success' });
  }, [showToast]);

  const error = useCallback((message, options = {}) => {
    return showToast(message, { ...options, type: 'error' });
  }, [showToast]);

  const info = useCallback((message, options = {}) => {
    return showToast(message, { ...options, type: 'info' });
  }, [showToast]);

  const warning = useCallback((message, options = {}) => {
    return showToast(message, { ...options, type: 'warning' });
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, hideToast, success, error, info, warning }}>
      {children}
      <View style={styles.toastOverlay} pointerEvents="box-none">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onHide={hideToast} />
        ))}
      </View>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context.showToast) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

const styles = StyleSheet.create({
  toastOverlay: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingHorizontal: 16,
  },
  toastContainer: {
    marginBottom: 8,
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  toastTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  toastTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  toastMessage: {
    color: '#ccc',
    fontSize: 13,
    lineHeight: 18,
  },
  toastClose: {
    padding: 4,
    marginLeft: 8,
  },
});
