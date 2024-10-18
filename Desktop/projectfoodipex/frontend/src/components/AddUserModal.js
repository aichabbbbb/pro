import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { addUser, getGroups, getRestaurants } from '../services/UserService';
import { FaUserPlus } from 'react-icons/fa';

// Composant PopupAlert pour les notifications externes
const PopupAlert = ({ message, type, onClose }) => {
    if (!message) return null; // Ne rien afficher s'il n'y a pas de message

    return (
        <div className={`popup-alert ${type}`}>
            <span>{message}</span>
            <button onClick={onClose} className="close-btn">x</button>
        </div>
    );
};

const AddUserModal = (props) => {
    const { onHide, setUpdated } = props;
    const [groups, setGroups] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [selectedGroupNames, setSelectedGroupNames] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordErrors, setPasswordErrors] = useState({
        length: false,
        number: false,
        specialChar: false,
        letter: false,
    });
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    // État pour le popup alert
    const [alert, setAlert] = useState({ message: '', type: '' });

    // Affichage et fermeture du popup
    const [showPopup, setShowPopup] = useState(false);
     // État pour savoir si le champ restaurant est désactivé
    const [isRestaurantDisabled, setIsRestaurantDisabled] = useState(true);

    useEffect(() => {
        getGroups()
            .then((result) => {
                setGroups(result);
            })
            .catch((error) => {
                console.error("Failed to fetch groups:", error);
            });

        getRestaurants()
            .then((result) => {
                setRestaurants(result);
            })
            .catch((error) => {
                console.error("Failed to fetch restaurants:", error);
            });
    }, []);

    useEffect(() => {
        const lengthValid = password.length >= 8;
        const numberValid = /\d/.test(password);
        const specialCharValid = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const letterValid = /[a-zA-Z]/.test(password);

        setPasswordErrors({
            length: lengthValid,
            number: numberValid,
            specialChar: specialCharValid,
            letter: letterValid,
        });

        setPasswordMatch(password === confirmPassword);
    }, [password, confirmPassword]);

    const validateEmail = (email) => {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const email = e.target.email.value;

        if (!validateEmail(email)) {
            setEmailError('Adresse email invalide');
            return;
        } else {
            setEmailError('');
        }

        if (!passwordMatch) {
            setAlert({ message: "Les mots de passe ne correspondent pas", type: 'error' });
            setShowPopup(true);
            return;
        }

        const formData = new FormData(e.target);

        const data = {
            username: formData.get('username'),
            email,
            password,
            is_active: formData.get('is_active') === 'on',
            is_superuser: formData.get('is_superuser') === 'on',
            is_staff: formData.get('is_staff') === 'on',
            group_names: selectedGroupNames,
            restaurant_name: selectedRestaurant,
        };

        addUser(data)
            .then(() => {
                setAlert({ message: "Utilisateur ajouté avec succès", type: 'success' });
                setShowPopup(true);
                setUpdated(true);
                onHide();
            })
            .catch((error) => {
                console.error("Échec de l'ajout de l'utilisateur :", error.response?.data || error.message);
                setAlert({ message: "Échec de l'ajout de l'utilisateur", type: 'error' });
                setShowPopup(true);
            });
    };

     const handleGroupChange = (e) => {
        const value = Array.from(e.target.selectedOptions, option => option.value);
        setSelectedGroupNames(value);

        // Enable/disable the restaurant dropdown based on selected groups
        if (value.includes("Administrateurs")) {
            setIsRestaurantDisabled(true);
            setSelectedRestaurant(''); // Reset restaurant selection if "administrateur" is selected
        } else {
            setIsRestaurantDisabled(false);
        }
    };
    const handleRestaurantChange = (e) => {
        setSelectedRestaurant(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    // Fonction pour fermer le popup
    const closePopup = () => {
        setShowPopup(false);
    };

    return (
        <>
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        <FaUserPlus style={{ marginRight: '10px' }} />
                        Ajouter un nouvel utilisateur
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="username">
                            <Form.Label>Nom d'utilisateur</Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                required
                                placeholder="Entrez le nom d'utilisateur"
                            />
                        </Form.Group>
                        <Form.Group controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                required
                                placeholder="Entrez l'email"
                                value={email}
                                onChange={handleEmailChange}
                            />
                            {emailError && (
                                <Form.Text className="text-danger">
                                    {emailError}
                                </Form.Text>
                            )}
                        </Form.Group>
                        <Form.Group controlId="password">
                            <Form.Label>Mot de passe</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                required
                                value={password}
                                onChange={handlePasswordChange}
                                placeholder="Entrez le mot de passe"
                            />
                            <ul>
                                <li style={{ color: passwordErrors.length ? 'green' : 'red' }}>
                                    {passwordErrors.length ? '✔' : '✘'} Minimum 8 caractères
                                </li>
                                <li style={{ color: passwordErrors.number ? 'green' : 'red' }}>
                                    {passwordErrors.number ? '✔' : '✘'} Au moins un chiffre
                                </li>
                                <li style={{ color: passwordErrors.specialChar ? 'green' : 'red' }}>
                                    {passwordErrors.specialChar ? '✔' : '✘'} Au moins un caractère spécial
                                </li>
                                <li style={{ color: passwordErrors.letter ? 'green' : 'red' }}>
                                    {passwordErrors.letter ? '✔' : '✘'} Au moins une lettre
                                </li>
                            </ul>
                        </Form.Group>
                        <Form.Group controlId="confirm_password">
                            <Form.Label>Confirmer le mot de passe</Form.Label>
                            <Form.Control
                                type="password"
                                name="confirm_password"
                                required
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                placeholder="Confirmez le mot de passe"
                            />
                            {!passwordMatch && confirmPassword && (
                                <Form.Text className="text-danger">
                                    Les mots de passe ne correspondent pas
                                </Form.Text>
                            )}
                        </Form.Group>
                        <Form.Group controlId="group">
                            <Form.Label>Groupe</Form.Label>
                            <Form.Control
                                as="select"
                                name="group"
                                required
                                value={selectedGroupNames}
                                onChange={handleGroupChange}
                            >
                                {groups.map(group => (
                                    <option key={group.name} value={group.name}>
                                        {group.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="restaurant">
                            <Form.Label>Restaurant</Form.Label>
                            <Form.Control
                                as="select"
                                name="restaurant"
                                value={selectedRestaurant}
                                onChange={handleRestaurantChange}
                                 disabled={isRestaurantDisabled} // Désactiver ou activer selon le groupe
                            >
                                <option value="">Sélectionnez un restaurant</option>
                                {restaurants.map(restaurant => (
                                    <option key={restaurant.name} value={restaurant.name}>
                                        {restaurant.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="is_active">
                            <Form.Check
                                type="checkbox"
                                name="is_active"
                                label="Actif"
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Soumettre
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={onHide}>
                        Fermer
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Popup Notification */}
            {showPopup && (
                <PopupAlert
                    message={alert.message}
                    type={alert.type}
                    onClose={closePopup}
                />
            )}
        </>
    );
};

export default AddUserModal;
