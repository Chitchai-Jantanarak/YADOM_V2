import { getUserImageUrl, handleImageError } from '../../utils/imageUtils.js';

/**
 * UserAvatar component that displays a user's avatar with fallback
 * @param {Object} props - Component props
 * @param {Object} props.user - User object from Prisma
 * @param {string} props.size - Size of avatar (sm, md, lg)
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.fallbackType - Type of fallback image to use
 */
const UserAvatar = ({ 
  user, 
  size = 'md', 
  className = '',
  fallbackType = 'avatar'
}) => {
  // Determine size classes
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24'
  };
  
  const sizeClass = sizeClasses[size] || sizeClasses.md;
  
  // Get the image URL using our recursive utility
  const imageUrl = getUserImageUrl(user);
  
  return (
    <img
      src={imageUrl || "/placeholder.svg"}
      alt={user?.name || 'User'}
      className={`rounded-full object-cover ${sizeClass} ${className}`}
      onError={(e) => handleImageError(e, fallbackType)}
    />
  );
};

export default UserAvatar;