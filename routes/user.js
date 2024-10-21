import express from 'express';
import controllers from '../controllers/user.js';



const router = express.Router();


// routes

const {getLoginForm,getRegistrationForm, loginUser,logoutUser, addUserRegistration} =
    controllers;

// routes

router.post('/register', addUserRegistration);

router.get('/register', getRegistrationForm);
router.post('/login', loginUser);
router.get('/login', getLoginForm);
router.get('/logout', logoutUser);

export default router;
