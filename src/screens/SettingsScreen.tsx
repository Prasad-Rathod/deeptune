import { useCallback, useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { API_BASE_URL } from '../services/api/config';
import { checkHealth } from '../services/api/health';
import { ApiError } from '../services/api/types';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';

type ConnectionStatus = 'loading' | 'success' | 'error';

export default function SettingsScreen() {
  const [status, setStatus] = useState<ConnectionStatus>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  const runHealthCheck = useCallback(() => {
    setStatus('loading');
    checkHealth()
      .then(() => setStatus('success'))
      .catch((error) => {
        setErrorMessage(error instanceof ApiError ? error.message : 'Unknown error');
        setStatus('error');
      });
  }, []);

  useEffect(() => {
    runHealthCheck();
  }, [runHealthCheck]);

  return (
    <View style={styles.container}>
      <Header title="Settings" />

      <View style={styles.content}>
        <Card>
          <Text style={styles.cardLabel}>Backend connection</Text>
          <Text style={styles.cardUrl}>{API_BASE_URL}</Text>

          {status === 'loading' && (
            <View style={styles.statusRow}>
              <ActivityIndicator color={theme.colors.primary} />
              <Text style={styles.statusText}>Checking...</Text>
            </View>
          )}
          {status === 'success' && <Text style={styles.statusSuccess}>Connected</Text>}
          {status === 'error' && <Text style={styles.statusError}>{errorMessage}</Text>}

          <View style={styles.retryButton}>
            <Button label="Retry" variant="secondary" onPress={runHealthCheck} />
          </View>
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { paddingHorizontal: theme.spacing.md },
  cardLabel: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold,
  },
  cardUrl: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.sm,
    marginTop: 2,
    marginBottom: theme.spacing.sm,
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  statusText: { color: theme.colors.textSecondary },
  statusSuccess: { color: '#4ADE80', fontWeight: theme.typography.weights.medium },
  statusError: { color: theme.colors.danger },
  retryButton: { marginTop: theme.spacing.md, alignItems: 'flex-start' },
});
