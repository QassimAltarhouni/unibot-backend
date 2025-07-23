import express from 'express';
import user from '@/Routes/user.routes';
import roles from '@/Routes/roles.routes';
import auth from '@/Routes/auth.routes';
import todoList from '@/Routes/todolist.routes';
import Category from '@/Routes/category.routes';
const router = express.Router();

router.get('/healthcheck', (_, res) => res.sendStatus(200));

router.use('/users', user);

router.use('/roles', roles);

router.use('/sessions', auth);

router.use('/todolist', todoList);

router.use('/Category', Category);

export default router;
