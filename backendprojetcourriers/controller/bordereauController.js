

const express = require('express');

const Bordereau = require('../models/Bordereau');

const bordereauController = {
getAllBordereau: async (req, res) => {
    try {
        const bordereaux = await Bordereau.findAll();
        res.status(200).json({ bordereaux });
    } catch (error) {
        console.error('Error fetching bordereaux:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}};

module.exports =bordereauController ;
