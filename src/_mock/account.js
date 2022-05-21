
const account = {
  displayName: JSON.parse(localStorage.getItem('user'))?.name,
  email: JSON.parse(localStorage.getItem('user'))?.email,
  photoURL: '/static/mock-images/avatars/avatar_default.jpg',
};

export default account;
