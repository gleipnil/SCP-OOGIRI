export type AchievementCategory =
    | 'HONOR' // Likes
    | 'COMBAT' // (Placeholder / Future)
    | 'SURVIVAL' // Apollyon Wins
    | 'SCIENCE' // (Placeholder / Future)
    | 'CONTAINMENT' // (Placeholder / Future)
    | 'SERVICE'; // Plays

export interface Achievement {
    id: string;
    category: AchievementCategory;
    tier: 1 | 2 | 3;
    label: string;
    description: string;
    className: string;
    threshold: number;
    stars: number; // 0-4
    statLabel?: string;
}

// Achievement Definitions
const ACHIEVEMENTS_DEF: Omit<Achievement, 'stars' | 'statLabel'>[] = [
    // SERVICE (Plays)
    { id: 'svc_3', category: 'SERVICE', tier: 3, label: '5年勤続章', description: '5年間の財団貢献への証.', className: 'r-svc-low', threshold: 15 },
    { id: 'svc_2', category: 'SERVICE', tier: 2, label: '10年勤続章', description: '10年間の財団貢献への証.', className: 'r-svc-mid', threshold: 150 },
    { id: 'svc_1', category: 'SERVICE', tier: 1, label: '20年勤続・機密保持章', description: '20年間の財団貢献への証.', className: 'r-svc-high', threshold: 2000 },

    // HONOR (Likes)
    { id: 'honor_3', category: 'HONOR', tier: 3, label: '財団功労章', description: '担当業務の成果が大きく評価された者の証', className: 'r-star-low', threshold: 15 },
    { id: 'honor_2', category: 'HONOR', tier: 2, label: '殊勲職員章', description: '担当業務の成果が部門で大きく評価された者の証', className: 'r-star-mid', threshold: 150 },
    { id: 'honor_1', category: 'HONOR', tier: 1, label: '財団星章', description: '財団において最大の成果と評価された者の証', className: 'r-star-high', threshold: 2000 },

    // SURVIVAL (Apollyon Wins)
    // Only Tier 1 for now as per request? Or maybe 1, 3, 5, 7, 10 wins.
    // Let's define a Tier 1 for 10 wins.
    { id: 'surv_1', category: 'SURVIVAL', tier: 1, label: 'K-Classシナリオ生還章', description: 'Kクラスシナリオを生還した者の証', className: 'r-surv-high', threshold: 10 },
];

export function calculateAchievements(stats: {
    total_plays: number;
    total_likes_received: number;
    apollyon_wins: number;
    joined_at: string;
}) {
    const earned: Achievement[] = [];

    // Helper to calculate stars
    // 5 stages (0-4 stars).
    // Logic: 
    // Tier 3 (Low): 1, 3, 5, 10, 15
    // Tier 2 (Mid): 50, 75, 100, 125, 150
    // Tier 1 (High): 250, 500, 750, 1000, 2000

    // Generic function to get stars based on progress to threshold
    // This is a bit complex because the steps aren't linear.
    // Let's hardcode the steps for now based on the prompt.

    // SERVICE
    const svcSteps = {
        3: [1, 3, 5, 10, 15],
        2: [50, 75, 100, 125, 150],
        1: [250, 500, 750, 1000, 2000]
    };
    const svc = getBestTier(stats.total_plays, 'SERVICE', svcSteps, ACHIEVEMENTS_DEF);
    if (svc) earned.push(svc);

    // HONOR
    const honorSteps = {
        3: [1, 3, 5, 10, 15],
        2: [50, 75, 100, 125, 150],
        1: [250, 500, 750, 1000, 2000]
    };
    const honor = getBestTier(stats.total_likes_received, 'HONOR', honorSteps, ACHIEVEMENTS_DEF);
    if (honor) earned.push(honor);

    // SURVIVAL (Apollyon)
    // 1, 3, 5, 7, 10
    const survSteps = {
        1: [1, 3, 5, 7, 10]
    };
    const surv = getBestTier(stats.apollyon_wins, 'SURVIVAL', survSteps, ACHIEVEMENTS_DEF);
    if (surv) earned.push(surv);

    return earned;
}

function getBestTier(
    value: number,
    category: AchievementCategory,
    stepsMap: { [tier: number]: number[] },
    defs: Omit<Achievement, 'stars'>[]
): Achievement | null {
    // Check from highest tier (1) down to lowest (3)
    // If value >= step[0] of a tier, user has that tier ribbon.
    // Stars depend on how many steps passed.

    for (const tier of [1, 2, 3]) {
        const steps = stepsMap[tier as 1 | 2 | 3];
        if (!steps) continue;

        // Check if qualified for this tier (at least 1 star equivalent, i.e. first step)
        if (value >= steps[0]) {
            // Found the highest tier user qualifies for.
            // Calculate stars.
            // 0 stars = passed step 0? No, usually 0 stars is base.
            // Prompt says: "5 progress stages (0-4 stars)".
            // Let's assume:
            // value >= steps[4] -> 4 stars (Max)
            // value >= steps[3] -> 3 stars
            // value >= steps[2] -> 2 stars
            // value >= steps[1] -> 1 star
            // value >= steps[0] -> 0 stars

            let stars = 0;
            if (value >= steps[4]) stars = 4;
            else if (value >= steps[3]) stars = 3;
            else if (value >= steps[2]) stars = 2;
            else if (value >= steps[1]) stars = 1;

            const def = defs.find(d => d.category === category && d.tier === tier);
            if (def) {
                return { ...def, stars };
            }
        }
    }
    return null;
}
