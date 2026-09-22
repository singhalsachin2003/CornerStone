import React from 'react';
import { TabList, TabSlot, TabTrigger, Tabs } from 'expo-router/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Layers, Repeat, User } from 'lucide-react-native';
import { TabButton, useTabBarStyle } from '@/components/TabBar';
import { useTheme } from '@/theme/useTheme';

/**
 * Tab bar appears on Home, Topics, Review and Profile only. Snapshot, quiz and
 * results are pushed above this layout, matching the handoff's "Shared" section.
 */
export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { c: color } = useTheme();
  const tabBarStyle = useTabBarStyle();

  return (
    <Tabs style={{ flex: 1, backgroundColor: color.paper }}>
      <TabSlot />
      <TabList style={[tabBarStyle, { paddingBottom: Math.max(insets.bottom, 4) }]}>
        <TabTrigger name="home" href="/home" asChild>
          <TabButton label="Home" icon={Home} />
        </TabTrigger>
        <TabTrigger name="topics" href="/topics" asChild>
          <TabButton label="Topics" icon={Layers} />
        </TabTrigger>
        <TabTrigger name="review" href="/review" asChild>
          <TabButton label="Review" icon={Repeat} />
        </TabTrigger>
        <TabTrigger name="profile" href="/profile" asChild>
          <TabButton label="Profile" icon={User} />
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}
