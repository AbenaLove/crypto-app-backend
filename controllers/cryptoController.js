const Crypto = require('../models/Crypto');

//to get all crypto currrencies
const getAllCrypto = async (req, res) => {
  try {
    const cryptos = await Crypto.find();
    res.status(200).json(cryptos);
  } catch (error){
    res.status(500).json({message: 'Server error', error: error.message});
  }
};

//to get the top crypto gainers, sorted by highest 24 change
const getGainers = async (req, res) => {
  try {
    const gainers = await Crypto.find().sort({ change24h: -1 });
    res.status(200).json(gainers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET new listings - sorted by newest first
const getNewListings = async (req, res) => {
  try {
    const newListings = await Crypto.find().sort({ createdAt: -1 });
    res.status(200).json(newListings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

//to add a new cryptocurrency 
const addCrypto = async (req, res) => {
  const {name, symbol, price, image, change24h} = req.body;

  try {
    const crypto = await Crypto.create({
      name,
      symbol,
      price,
      image,
      change24h
    })
    res.status(200).json({message: 'Cryptocurrency has been successfully created', crypto});
  } catch (error) {
    res.status(500).json({message: 'Server error', error: error.message});
  }
};

module.exports = {getAllCrypto, getGainers, getNewListings, addCrypto};