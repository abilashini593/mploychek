const express = require('express');
const cors = require('cors');
const fs = require('fs');
const xml2js = require('xml2js');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, 'db.xml');
const parser = new xml2js.Parser({ explicitArray: false });
const builder = new xml2js.Builder();

// Helper to read DB
const readDB = () => {
    return new Promise((resolve, reject) => {
        fs.readFile(dbPath, 'utf8', (err, data) => {
            if (err) return reject(err);
            parser.parseString(data, (err, result) => {
                if (err) return reject(err);
                
                // Ensure users and records are arrays
                if (!result.database.users.user) {
                    result.database.users.user = [];
                } else if (!Array.isArray(result.database.users.user)) {
                    result.database.users.user = [result.database.users.user];
                }
                
                if (!result.database.records.record) {
                    result.database.records.record = [];
                } else if (!Array.isArray(result.database.records.record)) {
                    result.database.records.record = [result.database.records.record];
                }

                resolve(result.database);
            });
        });
    });
};

// Helper to write DB
const writeDB = (db) => {
    return new Promise((resolve, reject) => {
        const xml = builder.buildObject({ database: db });
        fs.writeFile(dbPath, xml, (err) => {
            if (err) return reject(err);
            resolve();
        });
    });
};

// Delay middleware
const delayMiddleware = (req, res, next) => {
    const delay = parseInt(req.query.delay) || 0;
    if (delay > 0) {
        setTimeout(next, delay);
    } else {
        next();
    }
};

// Login API
app.post('/api/login', delayMiddleware, async (req, res) => {
    try {
        const { userId, password, role } = req.body;
        const db = await readDB();
        const user = db.users.user.find(
  u =>
    u.userId === userId &&
    u.password === password &&
    u.role === role
);
        
        if (user) {
            // Don't send password back
            const { password, ...safeUser } = user;
            res.json({ success: true, user: safeUser });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get Records API (with delay for async processing showcase)
app.get('/api/records', delayMiddleware, async (req, res) => {
    try {
        const userId = req.query.userId; // which user's records to fetch
        const db = await readDB();
        let records = db.records.record;
        
        if (userId) {
            records = records.filter(r => r.userId === userId);
        }
        
        res.json({ success: true, records });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Admin API: Get all users
app.get('/api/users', delayMiddleware, async (req, res) => {
    try {
        const db = await readDB();
        // Exclude passwords
        const users = db.users.user.map(u => {
            const { password, ...safeUser } = u;
            return safeUser;
        });
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Admin API: Update user
app.put('/api/users/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const updatedData = req.body;

        const db = await readDB();

        const userIndex = db.users.user.findIndex(u => u.userId === userId);

        if (userIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        db.users.user[userIndex] = {
            ...db.users.user[userIndex],
            ...updatedData
        };

        await writeDB(db);

        const { password, ...safeUser } = db.users.user[userIndex];

        res.json({
            success: true,
            user: safeUser
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

app.listen(port, () => {
    console.log(`Backend server running on http://localhost:${port}`);
});
