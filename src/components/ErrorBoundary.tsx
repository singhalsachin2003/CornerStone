import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Eyebrow, PrimaryButton } from '@/components/primitives';
import { color, font, gutter, radius } from '@/theme/tokens';
import { type } from '@/theme/type';

/**
 * Root error boundary.
 *
 * Without this a JS exception leaves the candidate on a blank screen with no way out.
 * The recovery path matters more than the message: study progress is persisted to
 * device storage on every change, so remounting the tree almost always restores a
 * working app with nothing lost — and this says so, because the first thing anyone
 * assumes when an app breaks is that their progress is gone.
 */
interface Props {
  children: React.ReactNode;
  /** Injected by expo-router's error boundary contract. */
  error?: Error;
  retry?: () => void;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Wire a crash reporter here (e.g. Sentry.captureException) when one is added.
    console.error('[Cornerstone] unhandled error', error, info.componentStack);
  }

  reset = () => {
    this.setState({ error: null });
    this.props.retry?.();
  };

  render() {
    const error = this.props.error ?? this.state.error;
    if (!error) return this.props.children;

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: color.paper }} edges={['top', 'bottom']}>
        <View
          style={{ flex: 1, paddingHorizontal: gutter.setup, paddingTop: 26, paddingBottom: 24 }}
        >
          <Eyebrow size={10} tracking={0.16} style={{ color: color.rust }}>
            SOMETHING BROKE
          </Eyebrow>

          <View style={{ flex: 1, justifyContent: 'center', gap: 16, paddingBottom: 40 }}>
            <Text style={type.hero}>That wasn't supposed to happen.</Text>
            <Text style={[type.lede, { maxWidth: 320 }]}>
              Your progress is saved on this device and is not affected. Try again — it usually
              comes straight back.
            </Text>

            <ScrollView
              style={{
                maxHeight: 160,
                borderWidth: 1,
                borderColor: color.rule,
                backgroundColor: color.surface,
                borderRadius: radius.row,
              }}
              contentContainerStyle={{ padding: 14 }}
            >
              <Eyebrow size={8.5} tracking={0.14}>
                DETAILS
              </Eyebrow>
              <Text
                style={{
                  fontFamily: font.mono,
                  fontSize: 11.5,
                  lineHeight: 18,
                  color: color.inkBody,
                  marginTop: 8,
                }}
              >
                {error.message || String(error)}
              </Text>
            </ScrollView>
          </View>

          {/* Only one action, because only one thing actually works. A "Report" button
              would be a lie until a crash reporter is wired up. */}
          <PrimaryButton label="Try again" onPress={this.reset} />
        </View>
      </SafeAreaView>
    );
  }
}
