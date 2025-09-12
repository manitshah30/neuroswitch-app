function GlassCard({ children, className }) {
  // We've added three new classes here:
  // 1. `transition-all`: Makes all changes (like transform and shadow) animate smoothly.
  // 2. `duration-300`: Sets the speed of the animation to 300 milliseconds.
  // 3. `hover:-translate-y-2`: On hover, "lift" the card up slightly.
  // 4. `hover:shadow-2xl hover:shadow-brand-accent/10`: On hover, add a larger, colored glow.
  const cardClasses = `glass-card rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-accent/10 ${className || ''}`;

  return (
    <div className={cardClasses}>
      {children}
    </div>
  );
}

export default GlassCard;