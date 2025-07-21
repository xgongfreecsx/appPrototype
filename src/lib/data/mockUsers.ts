import { User } from '@/types';

export const mockUsers: User[] = [
  {
    id: 'user-001',
    username: 'neoncreator',
    email: 'neoncreator@example.com',
    avatar: '/assets/images/avatars/avatar1.jpg',
    role: 'artist',
    createdAt: new Date('2022-08-15')
  },
  {
    id: 'user-002',
    username: 'abstractflow',
    email: 'abstractflow@example.com',
    avatar: '/assets/images/avatars/avatar2.jpg',
    role: 'artist',
    createdAt: new Date('2022-09-22')
  },
  {
    id: 'user-003',
    username: 'crystal3d',
    email: 'crystal3d@example.com',
    avatar: '/assets/images/avatars/avatar3.jpg',
    role: 'artist',
    createdAt: new Date('2022-11-05')
  },
  {
    id: 'user-004',
    username: 'pixelmaster',
    email: 'pixelmaster@example.com',
    avatar: '/assets/images/avatars/avatar4.jpg',
    role: 'artist',
    createdAt: new Date('2023-01-18')
  },
  {
    id: 'user-005',
    username: 'generativecode',
    email: 'generativecode@example.com',
    avatar: '/assets/images/avatars/avatar5.jpg',
    role: 'artist',
    createdAt: new Date('2023-03-29')
  },
  {
    id: 'user-006',
    username: 'urbanphotographer',
    email: 'urbanphotographer@example.com',
    avatar: '/assets/images/avatars/avatar6.jpg',
    role: 'artist',
    createdAt: new Date('2023-02-14')
  },
  {
    id: 'user-admin',
    username: 'adminuser',
    email: 'admin@artglass.com',
    avatar: '/assets/images/avatars/admin-avatar.jpg',
    role: 'admin',
    createdAt: new Date('2022-01-01')
  },
  {
    id: 'user-regular',
    username: 'artcollector',
    email: 'collector@example.com',
    avatar: '/assets/images/avatars/user-avatar.jpg',
    role: 'user',
    createdAt: new Date('2023-04-12')
  }
];