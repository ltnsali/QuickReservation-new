import React, { useState, useEffect } from 'react';
import { Avatar } from 'react-native-paper';
import { Platform } from 'react-native';

interface UserAvatarProps {
  user: {
    photo?: string;
    name: string;
    email?: string;
  };
  size?: number;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ user, size = 40 }) => {
  const [imageError, setImageError] = useState(false);

  // Get first letter for fallback
  const firstLetter = user.name.trim().charAt(0).toUpperCase();

  // Get color based on name
  const getColorFromName = (name: string) => {
    const colors = ['#6200ee', '#03DAC5', '#018786', '#CF6679', '#B00020', '#3700B3'];
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const avatarColor = getColorFromName(user.name);

  // Try to use the real photo first (on both web and native)
  if (user.photo && !imageError) {
    let photoUrl = user.photo;

    // For Google Photos URLs on web, try to improve loading without CORS issues
    if (Platform.OS === 'web' && photoUrl.includes('googleusercontent.com')) {
      // Try to use a larger size which might have fewer restrictions
      if (photoUrl.includes('=')) {
        photoUrl = photoUrl.split('=')[0] + '=s400-c';
      }
    }

    return (
      <Avatar.Image
        size={size}
        source={{ uri: photoUrl }}
        onError={() => {
          console.log('Avatar image failed to load, using text fallback');
          setImageError(true);
        }}
      />
    );
  }

  // Fallback to text avatar
  return <Avatar.Text size={size} label={firstLetter} style={{ backgroundColor: avatarColor }} />;
};
