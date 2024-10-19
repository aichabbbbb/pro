import axios from 'axios';

// Connexion de l'utilisateur
export function loginUser(credentials) {
  return axios.post('http://127.0.0.1:8000/api/token/', credentials)
    .then(response => response.data)
    .catch(error => {
      console.error("Login failed:", error.response.data);
      throw error;
    });
}

// Vérification de l'authentification
export function checkAuth() {
  return axios.get('http://127.0.0.1:8000/api/check-auth/')
    .then(response => response.data);
}

// Récupération des utilisateurs
export const getUsers = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/users/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).access}`, // Fixed syntax
      },
    });

    if (response.ok) {
      const data = await response.json();
      // Inclure les permissions dans chaque utilisateur
      const usersWithPermissions = data.map(user => ({
        ...user,
        permissions: user.permissions || [], // Assurez-vous que chaque utilisateur a une clé 'permissions'
      }));

      return usersWithPermissions;
    }

    throw new Error('Failed to fetch users');
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

// Suppression d'un utilisateur
export function deleteUser(id) {
  return axios.delete(`http://127.0.0.1:8000/users/${id}/`, { // Fixed backticks
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).access}`, // Fixed syntax
    }
  })
  .then(response => response.data)
  .catch(error => {
    console.error('Error deleting user:', error.response ? error.response.data : error.message);
    throw error;
  });
}

// Ajout d'un utilisateur
export function addUser(user) {
  return axios.post('http://127.0.0.1:8000/users/', {
    username: user.username,
    email: user.email,
    password: user.password,
    is_active: user.is_active,
    is_superuser: user.is_superuser,
    is_staff: user.is_staff,
    groups: user.group_names, // Correction pour envoyer les noms des groupes
    restaurant_name: user.restaurant_name  // Ajout du nom du restaurant
  }, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).access}`, // Fixed syntax
    }
  })
  .then(response => response.data)
  .catch(error => {
    console.error('Error adding user:', error.response ? error.response.data : error.message);
    throw error;
  });
}

// Mise à jour d'un utilisateur
export function updateUser(uid, user) {
  return axios.put(`http://127.0.0.1:8000/users/${uid}/`, { // Fixed backticks
    username: user.username,
    email: user.email,
    password: user.password,  // Le mot de passe peut être laissé vide si non modifié
    is_active: user.is_active,
    is_superuser: user.is_superuser,
    is_staff: user.is_staff,
    groups: user.group_names, // Correction pour envoyer les noms des groupes
    restaurant_name: user.restaurant_name  // Ajout du nom du restaurant
  }, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).access}`, // Fixed syntax
    }
  })
  .then(response => response.data)
  .catch(error => {
    console.error('Error updating user:', error.response ? error.response.data : error.message);
    throw error;
  });
}

// Récupération des groupes
export const getGroups = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/groups/');
    return response.data; // Assurez-vous que le backend renvoie une liste de groupes
  } catch (error) {
    console.error("Failed to fetch groups:", error);
    throw error;
  }
};

// Récupération des restaurants
export const getRestaurants = () => {
  return axios.get('http://127.0.0.1:8000/restaurants/')
    .then(response => response.data)
    .catch(error => {
      console.error("Failed to fetch restaurants:", error.response ? error.response.data : error.message);
      throw error;
    });
};
