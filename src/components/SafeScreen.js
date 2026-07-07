import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

export default function SafeScreen({ children, style, edges = ['top', 'left', 'right'] }) {
  return (
    <SafeAreaView style={[styles.container, style]} edges={edges}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
