import React from 'react';
import { Redirect } from 'expo-router';
import { useStudyStore } from '@/store/useStudyStore';

/** Entry router: onboarding → exam → level → home, resuming wherever the user stopped. */
export default function Index() {
  const onboarded = useStudyStore((s) => s.onboarded);
  const exam = useStudyStore((s) => s.exam);
  const level = useStudyStore((s) => s.level);

  if (!onboarded) return <Redirect href="/onboarding" />;
  if (!exam) return <Redirect href="/setup/exam" />;
  if (!level) return <Redirect href="/setup/level" />;
  return <Redirect href="/home" />;
}
