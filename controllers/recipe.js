import db from '../models/index.js';

import jwt from 'jsonwebtoken';

const Recipe = db.recipes;
const User = db.users

const recipeControllers = {
    getAll: async (req, res) => {
        try {
            const recipes = await Recipe.findAll({
                include: [{
                    model: db.users,
                    as: 'user', 
                    attributes: ['email'],
                }],
            });
    
            const token = req.cookies.token;
            console.log('Recipes fetched:', recipes);
            res.render('layout', {
                title: 'All my recipes',
                body: 'includes/recipe/recipesList',
                recipes: recipes,
                token
            });
        } catch (err) {
            console.error('Error fetching recipes:', err);
            res.status(500).send('Server Error');
        }
    },
    

    getOne: async (req, res) => {
        try {
            const recipeId = req.params.id;
            const token = req.cookies.token;
            const recipe = await Recipe.findOne({
                where: {
                    id: recipeId
                }
            });

            if (!recipe) {
                return res.status(404).send('Recipe not found');
            }

            console.log('Recipe fetched:', recipe); 

            res.render('layout', {
                title: `Details for ${recipe.title}`,
                body: 'includes/recipe/recipeDetails',
                recipe: recipe,
                token
            });
        } catch (err) {
            console.error('Error fetching recipe:', err);
            res.status(500).send('Server Error');
        }
    },

    addRecipe: async (req, res) => {
        const { title, description, ingredients, img } = req.body;
        
        try {
           
            const token = req.cookies.token;
            if (!token) {
                return res.status(401).send('Access denied. No token provided.');
            }
    
            const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
            const user_id = decoded.id; // Take ID from token
    
            const recipe = {
                title,
                description,
                ingredients,
                img,
                user_id // Associacion to the logged user
            };
    
            const newRecipe = await Recipe.create(recipe);
            res.status(201).redirect('/recipes/recipes');
        } catch (err) {
            console.error('Error creating recipe:', err);
            res.status(500).send({
                message: 'Error creating the recipe'
            });
        }
    },
    

    updateRecipe: async (req, res) => {
        try {
            const recipeId = req.params.id;
            const { title, description, ingredients, img, user_id } = req.body;

            console.log('Updating recipe with ID:', recipeId);
            console.log('Data received for update:', req.body);

            const recipe = await Recipe.findByPk(recipeId);

            if (!recipe) {
                return res.status(404).send('Recipe not found');
            }

            await recipe.update({
                title,
                description,
                ingredients,
                img,
                user_id
            });

            console.log('Recipe updated successfully');

            res.redirect(`/recipes/recipes/${recipeId}`);
        } catch (error) {
            console.error('Error updating recipe:', error);
            res.status(500).send('Server error');
        }
    },

    removeRecipe: async (req, res) => {
        try {
            const recipeId = req.params.id;

            const recipe = await Recipe.findByPk(recipeId);
            if (!recipe) {
                return res.status(404).send('Recipe not found');
            }

            await recipe.destroy();

            console.log(`Recipe with ID ${recipeId} deleted successfully`);

            res.redirect('/recipes/recipes');
        } catch (error) {
            console.error('Error deleting recipe:', error);
            res.status(500).send('Server error');
        }
    },
    getRecipesByEmail: async (req, res) => {
        const { email } = req.params;
        const token = req.cookies.token;
    
        try {
            const recipes = await Recipe.findAll({
                include: [{
                    model: User,
                    as: 'user',
                    where: { email },  // Filter with mail
                    attributes: ['email'], // i can add other attributes here
                }]
            });
    
            if (recipes.length === 0) {
                return res.status(404).send('No recipes found for this user');
            }
    
            res.render('layout', {
                title: 'Recipes for ' + email,
                body: 'includes/recipe/recipesList',
                recipes: recipes,
                token
            });
        } catch (err) {
            console.error('Error fetching recipes by email:', err);
            res.status(500).send('Server Error');
        }
    },
    
    
    
    

    addRecipeForm: async (req, res) => {
        const token = req.cookies.token;
        res.status(200).render('layout', {
            title: 'Add a new Recipe',
            body: 'includes/recipe/addRecipeForm',
            token
        });
    },
    updateRecipeForm: async (req, res) => {

        try {
            const recipeId = req.params.id;
            const recipe = await Recipe.findByPk(recipeId);
            const token = req.cookies.token;
            if (!recipe) {
                return res.status(404).send('Recipe not found');
            }

            res.render('layout', {
                title: 'Update Recipe',
                body: 'includes/recipe/updateRecipeForm',
                recipe: recipe,
                token
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Server error');
        }
    }
};

export default recipeControllers;
