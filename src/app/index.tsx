import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

export default function MainSiteLanding() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, continueAsGuest } = useAuth();

  const handlePrimaryAction = () => {
    if (user) {
      router.push('/(app)');
    } else {
      router.push('/(auth)/signup');
    }
  };

  const handleGuestDemo = async () => {
    await continueAsGuest();
    router.push('/(app)');
  };

  return (
    <View style={styles.screen}>
      {/* Top Navbar */}
      <View style={[styles.navbar, { paddingTop: Math.max(insets.top + 8, 16) }]}>
        <View style={styles.navContent}>
          <View style={styles.brandGroup}>
            <View style={styles.logoIcon}>
              <Ionicons name="checkbox" size={24} color="#4f46e5" />
            </View>
            <Text style={styles.brandName}>TaskFlow</Text>
          </View>

          <View style={styles.navActions}>
            {user ? (
              <TouchableOpacity
                onPress={() => router.push('/(app)')}
                style={styles.dashboardBtn}
              >
                <Text style={styles.dashboardBtnText}>Go to App</Text>
                <Ionicons name="arrow-forward" size={16} color="#ffffff" style={{ marginLeft: 4 }} />
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  onPress={() => router.push('/(auth)/login')}
                  style={styles.signInBtn}
                >
                  <Text style={styles.signInText}>Sign In</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => router.push('/(auth)/signup')}
                  style={styles.signUpBtn}
                >
                  <Text style={styles.signUpText}>Get Started</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>

      {/* Main Scroll Content */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          { paddingBottom: Math.max(insets.bottom + 40, 50) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.tagBadge}>
            <Ionicons name="sparkles" size={14} color="#4f46e5" style={{ marginRight: 6 }} />
            <Text style={styles.tagBadgeText}>Smart Task Management & Auth</Text>
          </View>

          <Text style={styles.heroTitle}>
            Organize your tasks with{' '}
            <Text style={styles.heroHighlight}>clarity & speed</Text>
          </Text>

          <Text style={styles.heroSubtitle}>
            A fast, cross-platform todo application built with authentication, category tagging,
            priority tracking, and instant progress insights.
          </Text>

          {/* CTA Buttons */}
          <View style={styles.ctaRow}>
            <TouchableOpacity onPress={handlePrimaryAction} style={styles.primaryCta}>
              <Text style={styles.primaryCtaText}>
                {user ? 'Open Dashboard' : 'Get Started Free'}
              </Text>
              <Ionicons name="arrow-forward" size={18} color="#ffffff" style={{ marginLeft: 6 }} />
            </TouchableOpacity>

            {!user && (
              <TouchableOpacity onPress={handleGuestDemo} style={styles.secondaryCta}>
                <Ionicons name="flash-outline" size={18} color="#4f46e5" style={{ marginRight: 6 }} />
                <Text style={styles.secondaryCtaText}>Try Instant Demo</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Live Mock App Showcase Card */}
          <View style={styles.previewContainer}>
            <View style={styles.mockCard}>
              {/* Card Header */}
              <View style={styles.mockHeader}>
                <View>
                  <Text style={styles.mockGreeting}>Today's Focus 🎯</Text>
                  <Text style={styles.mockDate}>3 of 4 tasks completed</Text>
                </View>
                <View style={styles.mockBadge}>
                  <Text style={styles.mockBadgeText}>75% Done</Text>
                </View>
              </View>

              {/* Progress Bar */}
              <View style={styles.mockTrack}>
                <View style={[styles.mockBar, { width: '75%' }]} />
              </View>

              {/* Sample Task 1 */}
              <View style={styles.mockTask}>
                <View style={[styles.mockCheck, styles.mockCheckDone]}>
                  <Ionicons name="checkmark" size={14} color="#ffffff" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.mockTaskTitle, styles.mockTaskDone]}>Design mobile-first wireframes</Text>
                  <View style={styles.mockPills}>
                    <View style={[styles.miniBadge, { backgroundColor: '#fef2f2' }]}>
                      <Text style={[styles.miniBadgeText, { color: '#ef4444' }]}>High</Text>
                    </View>
                    <View style={styles.miniBadgeGray}>
                      <Text style={styles.miniBadgeGrayText}>Work</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Sample Task 2 */}
              <View style={styles.mockTask}>
                <View style={[styles.mockCheck, styles.mockCheckDone]}>
                  <Ionicons name="checkmark" size={14} color="#ffffff" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.mockTaskTitle, styles.mockTaskDone]}>Implement user authentication</Text>
                  <View style={styles.mockPills}>
                    <View style={[styles.miniBadge, { backgroundColor: '#fffbeb' }]}>
                      <Text style={[styles.miniBadgeText, { color: '#d97706' }]}>Med</Text>
                    </View>
                    <View style={styles.miniBadgeGray}>
                      <Text style={styles.miniBadgeGrayText}>Personal</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Sample Task 3 */}
              <View style={styles.mockTask}>
                <View style={styles.mockCheck} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.mockTaskTitle}>Review team weekly goals</Text>
                  <View style={styles.mockPills}>
                    <View style={[styles.miniBadge, { backgroundColor: '#ecfdf5' }]}>
                      <Text style={[styles.miniBadgeText, { color: '#059669' }]}>Low</Text>
                    </View>
                    <View style={styles.miniBadgeGray}>
                      <Text style={styles.miniBadgeGrayText}>Work</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Feature Highlights Grid */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionHeading}>Built for everyday productivity</Text>
          <Text style={styles.sectionSubheading}>Everything you need to stay on top of your schedule</Text>

          <View style={styles.featuresGrid}>
            <View style={styles.featureCard}>
              <View style={[styles.featureIcon, { backgroundColor: '#ede9fe' }]}>
                <Ionicons name="shield-checkmark" size={24} color="#4f46e5" />
              </View>
              <Text style={styles.featureTitle}>User Authentication</Text>
              <Text style={styles.featureDesc}>
                Full account registration and sign-in with persistent sessions and guest access.
              </Text>
            </View>

            <View style={styles.featureCard}>
              <View style={[styles.featureIcon, { backgroundColor: '#fee2e2' }]}>
                <Ionicons name="flag" size={24} color="#ef4444" />
              </View>
              <Text style={styles.featureTitle}>Priority Management</Text>
              <Text style={styles.featureDesc}>
                Color-coded high, medium, and low indicators so critical items get done first.
              </Text>
            </View>

            <View style={styles.featureCard}>
              <View style={[styles.featureIcon, { backgroundColor: '#ecfdf5' }]}>
                <Ionicons name="pie-chart" size={24} color="#10b981" />
              </View>
              <Text style={styles.featureTitle}>Progress Tracking</Text>
              <Text style={styles.featureDesc}>
                Visual completion statistics and progress bar give you instant momentum.
              </Text>
            </View>

            <View style={styles.featureCard}>
              <View style={[styles.featureIcon, { backgroundColor: '#fef3c7' }]}>
                <Ionicons name="pricetags" size={24} color="#d97706" />
              </View>
              <Text style={styles.featureTitle}>Categories & Filters</Text>
              <Text style={styles.featureDesc}>
                Sort by Work, Personal, Shopping, or Health with active badge counts.
              </Text>
            </View>
          </View>
        </View>

        {/* How It Works */}
        <View style={styles.stepsSection}>
          <Text style={styles.sectionHeading}>Simple 3-step workflow</Text>
          <View style={styles.stepItem}>
            <View style={styles.stepNumberBadge}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Sign in or jump in as Guest</Text>
              <Text style={styles.stepDesc}>Create an account with email & password or try the instant guest demo.</Text>
            </View>
          </View>

          <View style={styles.stepItem}>
            <View style={styles.stepNumberBadge}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Add tasks with tags & priorities</Text>
              <Text style={styles.stepDesc}>Set categories, due dates, and priority levels to organize your day.</Text>
            </View>
          </View>

          <View style={styles.stepItem}>
            <View style={styles.stepNumberBadge}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Track and conquer goals</Text>
              <Text style={styles.stepDesc}>Check off completed items and watch your progress percentage soar.</Text>
            </View>
          </View>
        </View>

        {/* Bottom CTA Banner */}
        <View style={styles.ctaBanner}>
          <Text style={styles.ctaBannerTitle}>Ready to get organized?</Text>
          <Text style={styles.ctaBannerDesc}>Start organizing your tasks today. Free, fast, and cross-platform.</Text>
          <TouchableOpacity onPress={handlePrimaryAction} style={styles.ctaBannerBtn}>
            <Text style={styles.ctaBannerBtnText}>Get Started Now</Text>
            <Ionicons name="arrow-forward" size={16} color="#4f46e5" style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerBrand}>TaskFlow</Text>
          <Text style={styles.footerText}>Built with Expo SDK 58 & React Native</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  navbar: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 14,
    paddingHorizontal: 24,
  },
  navContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 1100,
    width: '100%',
    alignSelf: 'center',
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#ede9fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  brandName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  navActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  signInBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  signInText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  signUpBtn: {
    backgroundColor: '#4f46e5',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  signUpText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  dashboardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4f46e5',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  dashboardBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  scrollContainer: {
    paddingTop: 36,
    maxWidth: 1100,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 24,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ede9fe',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginBottom: 16,
  },
  tagBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4f46e5',
  },
  heroTitle: {
    fontSize: Platform.OS === 'web' ? 44 : 32,
    fontWeight: '900',
    color: '#0f172a',
    textAlign: 'center',
    lineHeight: Platform.OS === 'web' ? 52 : 38,
    marginBottom: 16,
    maxWidth: 700,
  },
  heroHighlight: {
    color: '#4f46e5',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 620,
    marginBottom: 28,
  },
  ctaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    marginBottom: 36,
  },
  primaryCta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4f46e5',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryCtaText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryCta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  secondaryCtaText: {
    color: '#4f46e5',
    fontSize: 15,
    fontWeight: '700',
  },
  previewContainer: {
    width: '100%',
    maxWidth: 580,
    marginTop: 8,
  },
  mockCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 4,
  },
  mockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mockGreeting: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  mockDate: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  mockBadge: {
    backgroundColor: '#ede9fe',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  mockBadgeText: {
    color: '#4f46e5',
    fontSize: 12,
    fontWeight: '700',
  },
  mockTrack: {
    height: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  mockBar: {
    height: '100%',
    backgroundColor: '#4f46e5',
    borderRadius: 4,
  },
  mockTask: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  mockCheck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    marginRight: 10,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mockCheckDone: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  mockTaskTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  mockTaskDone: {
    textDecorationLine: 'line-through',
    color: '#94a3b8',
  },
  mockPills: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  miniBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  miniBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  miniBadgeGray: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  miniBadgeGrayText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748b',
  },
  featuresSection: {
    marginBottom: 48,
  },
  sectionHeading: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
  },
  sectionSubheading: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 28,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  featureCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    width: Platform.OS === 'web' ? '48%' : '100%',
    minWidth: 260,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
  },
  featureDesc: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
  },
  stepsSection: {
    backgroundColor: '#f8fafc',
    borderRadius: 24,
    padding: 26,
    marginBottom: 48,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 18,
  },
  stepNumberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  stepNumberText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  stepDesc: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 3,
    lineHeight: 18,
  },
  ctaBanner: {
    backgroundColor: '#4f46e5',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 4,
  },
  ctaBannerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
  },
  ctaBannerDesc: {
    fontSize: 14,
    color: '#ede9fe',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
    maxWidth: 450,
  },
  ctaBannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 12,
  },
  ctaBannerBtnText: {
    color: '#4f46e5',
    fontSize: 15,
    fontWeight: '700',
  },
  footer: {
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 24,
  },
  footerBrand: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  footerText: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
});
