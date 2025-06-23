import React from 'react';
import { useAchievementStore, type Achievement } from '../stores/achievementStore';

interface AchievementItemProps {
  achievement: Achievement;
  isUnlocked: boolean;
}

const AchievementItem: React.FC<AchievementItemProps> = ({ achievement, isUnlocked }) => {
  return (
    <div
      data-testid={`achievement-${achievement.id}`}
      className={`achievement-item ${isUnlocked ? 'achievement-unlocked' : 'achievement-locked'}`}
      role="listitem"
      aria-label={`${achievement.title}: ${achievement.description}${isUnlocked ? ' (Unlocked)' : ' (Locked)'}`}
    >
      <div className="achievement-icon">
        <span className="text-2xl">{achievement.icon}</span>
      </div>
      <div className="achievement-content">
        <h3 className="achievement-name text-lg font-semibold">{achievement.title}</h3>
        <p className="achievement-description text-sm text-gray-600">{achievement.description}</p>
        <div className="achievement-points text-xs text-blue-600 font-medium">
          {achievement.points} points
        </div>
      </div>
      <div className="achievement-status">
        {isUnlocked ? (
          <span className="achievement-badge unlocked bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
            ✓ Unlocked
          </span>
        ) : (
          <span className="achievement-badge locked bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
            🔒 Locked
          </span>
        )}
      </div>
    </div>
  );
};

interface CategorySectionProps {
  categoryName: string;
  achievements: Achievement[];
  isAchievementUnlocked: (id: string) => boolean;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  categoryName,
  achievements,
  isAchievementUnlocked,
}) => {
  const capitalizedCategoryName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

  return (
    <div className="achievement-category mb-6">
      <h2 className="category-title text-xl font-bold mb-4 text-gray-800 border-b-2 border-blue-200 pb-2">
        {capitalizedCategoryName}
      </h2>
      <div className="category-achievements space-y-3">
        {achievements.map((achievement) => (
          <AchievementItem
            key={achievement.id}
            achievement={achievement}
            isUnlocked={isAchievementUnlocked(achievement.id)}
          />
        ))}
      </div>
    </div>
  );
};

const AchievementsList: React.FC = () => {
  const {
    achievements,
    isAchievementUnlocked,
  } = useAchievementStore();

  // Group achievements by category
  const achievementsByCategory = achievements.reduce((acc: Record<string, Achievement[]>, achievement) => {
    const category = achievement.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(achievement);
    return acc;
  }, {});

  if (achievements.length === 0) {
    return (
      <div data-testid="achievements-list" role="list" className="achievements-list p-4">
        <div className="empty-state text-center py-8">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-xl font-semibold text-gray-600 mb-2">No achievements available</h2>
          <p className="text-gray-500">Start studying to unlock your first achievements!</p>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="achievements-list" role="list" className="achievements-list p-4">
      <div className="achievements-header mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">🏆 Achievements</h1>
        <p className="text-gray-600">Track your learning milestones and accomplishments</p>
      </div>

      <div className="achievements-content">
        {Object.entries(achievementsByCategory)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([categoryName, categoryAchievements]) => (
            <CategorySection
              key={categoryName}
              categoryName={categoryName}
              achievements={categoryAchievements}
              isAchievementUnlocked={isAchievementUnlocked}
            />
          ))}
      </div>
    </div>
  );
};

export default AchievementsList;
