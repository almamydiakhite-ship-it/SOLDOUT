import { VisitorStats, DailyVisit } from '../types';

const VISITORS_STORAGE_KEY = 'soldout.visitors.v2';
const SESSION_VISITED_KEY = 'soldout.session.visited';

// Generate default realistic baseline data for recent days if starting fresh
function generateInitialStats(): VisitorStats {
  const history: DailyVisit[] = [];
  const today = new Date();

  // Create past 10 days
  for (let i = 9; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });

    // Gradual progression
    const baseVisits = 45 + Math.floor(Math.sin(i) * 15) + (10 - i) * 6;
    history.push({
      date: dateStr,
      label: dayName,
      visits: baseVisits,
      uniqueCount: Math.round(baseVisits * 0.72),
    });
  }

  const totalVisits = history.reduce((acc, h) => acc + h.visits, 0) + 128;
  const uniqueVisitors = Math.round(totalVisits * 0.68);
  const todayVisits = history[history.length - 1]?.visits || 84;

  return {
    totalVisits,
    uniqueVisitors,
    todayVisits,
    lastVisitAt: new Date().toISOString(),
    history,
    mobileRatio: 74,
    desktopRatio: 26,
  };
}

export const analyticsService = {
  getStats(): VisitorStats {
    try {
      const raw = localStorage.getItem(VISITORS_STORAGE_KEY);
      if (!raw) {
        const initial = generateInitialStats();
        localStorage.setItem(VISITORS_STORAGE_KEY, JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(raw);
    } catch {
      return generateInitialStats();
    }
  },

  recordVisit(): VisitorStats {
    const stats = this.getStats();
    const isNewSession = !sessionStorage.getItem(SESSION_VISITED_KEY);
    const todayStr = new Date().toISOString().split('T')[0];
    const todayLabel = new Date().toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });

    stats.totalVisits += 1;
    if (isNewSession) {
      stats.uniqueVisitors += 1;
      sessionStorage.setItem(SESSION_VISITED_KEY, 'true');
    }

    stats.todayVisits += 1;
    stats.lastVisitAt = new Date().toISOString();

    // Update daily history
    const existingDay = stats.history.find((h) => h.date === todayStr);
    if (existingDay) {
      existingDay.visits += 1;
      if (isNewSession) existingDay.uniqueCount += 1;
    } else {
      stats.history.push({
        date: todayStr,
        label: todayLabel,
        visits: 1,
        uniqueCount: 1,
      });
      if (stats.history.length > 14) {
        stats.history.shift();
      }
    }

    // Save
    try {
      localStorage.setItem(VISITORS_STORAGE_KEY, JSON.stringify(stats));
    } catch (e) {
      console.error('Failed to store analytics', e);
    }

    return stats;
  },

  resetStats(): VisitorStats {
    const fresh = generateInitialStats();
    try {
      localStorage.setItem(VISITORS_STORAGE_KEY, JSON.stringify(fresh));
    } catch (e) {
      console.error('Failed to reset analytics', e);
    }
    return fresh;
  },
};
