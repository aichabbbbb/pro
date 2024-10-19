import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const LoginPage = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUsernameError('');
    setPasswordError('');
    setError(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError('Nom d\'utilisateur ou mot de passe incorrect');
        setUsernameError(errorData.username || '');
        setPasswordError(errorData.password || '');
      } else {
        const data = await response.json();
        console.log('Login response data:', data);

        localStorage.setItem('token', data.access);
        localStorage.setItem('user', JSON.stringify({
          username: data.username,
          email: data.email,
          id: data.id,
          is_superuser: data.is_superuser,
          is_staff: data.is_staff,
          restaurant_name: data.restaurant,
          groups: data.groups,
          permissions: data.permissions
        }));

        setIsAuthenticated(true);
        navigate('/Dashboard');
      }
    } catch (error) {
      setError('Erreur de requête ou identifiants invalides');
      console.error("Login error:", error.message);
    }
  };
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };
  return (
    <div className="container-xxl">
      <div className="authentication-wrapper authentication-basic container-p-y">
        <div className="authentication-inner py-6">
          <div className="card">
            <div className="card-body">
              <div className="app-brand justify-content-center mb-6">
                <a href="/" className="app-brand-link">
                  <span className="app-brand-logo demo">

                  </span>
                  <span className="app-brand-text demo text-heading fw-bold">Connexion</span>
                </a>
              </div>
              <h4 className="mb-1">Bienvenue! 👋</h4>
              <p className="mb-6">Veuillez vous connecter à votre compte et commencer</p>

              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit} className="mb-4">
                <div className="mb-6">
                  <label htmlFor="username" className="form-label"> Nom Utilisateur</label>
                  <input
                    type="text"
                    className={`form-control ${usernameError ? 'is-invalid' : ''}`}
                    id="username"
                    placeholder="Entrer  Nom Utilisateur"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  {usernameError && <div className="form-text text-danger">{usernameError}</div>}
                </div>

                  <div className="mb-6 position-relative">
  <label htmlFor="password" className="form-label">Mot de Passe</label>

  <input
    type={showPassword ? "text" : "password"} // Toggle visibility based on state
    id="password"
    className={`form-control ${passwordError ? 'is-invalid' : ''}`}
    placeholder="••••••••••"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
  />

  <span
    className="cursor-pointer position-absolute"
    style={{ right: '10px', top: '38px' }} // Adjust top and right as needed
    onClick={togglePasswordVisibility}
  >
    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
  </span>

  {passwordError && <div className="form-text text-danger">{passwordError}</div>}
</div>


              <div className="mb-6">
  <button
    className="btn d-grid w-100"
    type="submit"
    style={{ backgroundColor: '#7367f0', borderColor: '#7367f0' }}
  >
    Connecter
  </button>
</div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
