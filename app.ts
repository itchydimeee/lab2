import express from 'express';
import crypto from ' crypto';
import pool from './db';

const router = express.Router();

router.post('/apply-loan-success'), async (req, res) => {
    const {/* from fields */ } = req.body;

    const uniqueToken = crypto.RandomBytes(64).toString('base64url');

    try {
        const client = await pool.connect();
        await client.query('INSERT INTO loans(/* columns */) VALUES(/* values */)', [/* values */]);
        client.release()
        res.redirect(`/loan-status/${uniqueToken}`);

    }
    catch (error) {
        console.error('Error:', error);
        res.redirect('/error');
    }
});

export default router
