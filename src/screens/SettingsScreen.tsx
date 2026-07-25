import { useCallback, useEffect, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { API_BASE_URL } from '../services/api/config';
import { checkHealth } from '../services/api/health';
import { ApiError } from '../services/api/types';
import { ChevronDownIcon } from '../components/icons';
import HardShadowBox from '../components/HardShadowBox';

type ConnectionStatus = 'loading' | 'success' | 'error';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
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
    <View style={[styles.container, { paddingTop: insets.top + theme.spacing.lg }]}>
      <View style={styles.topRow}>
        <HardShadowBox offset={theme.shadow.sm} contentStyle={styles.closeButton} onPress={() => navigation.goBack()}>
          <ChevronDownIcon size={22} />
        </HardShadowBox>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 44 }} />
      </View>

      <HardShadowBox contentStyle={styles.cardContent}>
        <Text style={styles.cardLabel}>Backend connection</Text>
        <Text style={styles.cardUrl}>{API_BASE_URL}</Text>

        {status === 'loading' && (
          <View style={styles.statusRow}>
            <ActivityIndicator color={theme.colors.ink} />
            <Text style={styles.statusText}>Checking...</Text>
          </View>
        )}
        {status === 'success' && <Text style={styles.statusSuccess}>Connected</Text>}
        {status === 'error' && <Text style={styles.statusError}>{errorMessage}</Text>}

        <Pressable onPress={runHealthCheck} style={styles.retryButton}>
          <Text style={styles.retryLabel}>Retry</Text>
        </Pressable>
      </HardShadowBox>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.paper, paddingHorizontal: theme.spacing.page },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
  },
  closeButton: {
    width: 44,
    height: 44,
    backgroundColor: theme.colors.paperLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontFamily: theme.fonts.display.extrabold, fontSize: theme.typography.sizes.h2 },
  cardContent: { backgroundColor: theme.colors.paperLight, padding: theme.spacing.lg, gap: 6 },
  cardLabel: { fontFamily: theme.fonts.display.bold, fontSize: theme.typography.sizes.title },
  cardUrl: {
    fontFamily: theme.fonts.mono.regular,
    fontSize: theme.typography.sizes.meta,
    color: theme.colors.inkFaint,
    marginBottom: 6,
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  statusText: { fontFamily: theme.fonts.mono.regular, color: theme.colors.inkFaint },
  statusSuccess: { fontFamily: theme.fonts.mono.bold, color: '#2f7a3c' },
  statusError: { fontFamily: theme.fonts.mono.regular, color: theme.colors.danger },
  retryButton: {
    marginTop: theme.spacing.md,
    alignSelf: 'flex-start',
    borderBottomWidth: 1.5,
    borderBottomColor: theme.colors.ink,
  },
  retryLabel: {
    fontFamily: theme.fonts.mono.bold,
    fontSize: theme.typography.sizes.meta,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
});
