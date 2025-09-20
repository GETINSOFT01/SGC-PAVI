#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads', 'documents');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Created uploads directory:', uploadsDir);
}

// Check if database exists, if not copy from template
const dbPath = path.join(__dirname, 'sgc.db');
if (!fs.existsSync(dbPath)) {
    console.log('Database not found, this is expected on first deployment');
}

// Start the main server
require('./server.js');
