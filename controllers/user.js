import db from '../models/index.js';
import hashPassword from '../utils/hashPassword.js';

import validateEmail from '../utils/validateEmail.js';
import matchPassword from '../utils/matchPasswords.js';
import validatePassword from '../utils/validatePassword.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const User = db.users;

const userControllers = {
    getLoginForm: (req, res) => {
        const token = req.cookies.token;
        res.status(200).render('layout', {
            title: 'Enter email and password',
            body: 'includes/user/loginForm',
            token
           
        });
    },
   
    addUserRegistration: async (req, res) => {
        console.log('Registration attempt:', req.body);
        const { email, password, repassword } = req.body;
    
        console.log('Request body:', req.body); 
    
        try {
            const userExist = await User.findOne({ where: { email: email } });
            console.log('User exists:', userExist); 
    
            if (userExist) {
                return res.status(400).send({ message: 'User already exists' });
            }
    
            const isValidEmail = validateEmail(email);
            const isValidPassword = validatePassword(password);
            const samePassword = matchPassword(password, repassword);
    
            console.log('Validation results:', {
                isValidEmail,
                isValidPassword,
                samePassword,
            }); 
    
            if (!isValidEmail) {
                return res.status(400).send({ message: 'Invalid email format' });
            }
            if (!isValidPassword) {
                return res.status(400).send({ message: 'Invalid password format' });
            }
            if (!samePassword) {
                return res.status(400).send({ message: 'Passwords do not match' });
            }
    
            const hashedPassword = hashPassword(password);
            const newUser = {
                email: email,
                password: hashedPassword,
            };
    
            await User.create(newUser);
            res.status(201).redirect('/users/login');
        } catch (error) {
            console.error('Error during registration:', error);
            res.status(500).send({ message: 'Server error' });
        }
    },
    
    

    
    

    getRegistrationForm: (req, res) => {
        const token = req.cookies.token;
        res.status(200).render('layout', {
            title: 'User Registration',
            body: 'includes/user/userRegistrationForm',
            token
        });
    },
    loginUser: async (req, res) => {
        const { email, password } = req.body;
    
        try {
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(400).send('Invalid email or password');
            }
    
            const isPasswordValid = bcrypt.compareSync(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).send('Invalid email or password');
            }
    
            const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET, {
                expiresIn: '1h',
            });
    
            // set  token as a cookie
            res.cookie('token', token, { httpOnly: true });
    
            return res.status(200).redirect('/recipes/recipes');
        } catch (error) {
            console.error('Error during login:', error);
            res.status(500).send('Server error');
        }
    },
    
    
    logoutUser: (req, res) => {
        res.clearCookie('token');  
        res.status(200).redirect('/users/login');
    },
    
};

export default userControllers;
