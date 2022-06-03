const { response } = require("express");

const usersGet = (req, res = response) => {
  const {  } = req.query;
  res.json({
    msg: "get API",
  });
};

const usersPost = (req, res) => {
  const body = req.body;
  res.json({
    msg: "post API",
  });
};

const usersPut = (req, res) => {
  const id = req.params.id;
  res.json({
    msg: "put API",
  });
};

const usersPatch = (req, res) => {
  res.json({
    msg: "patch API",
  });
};

const usersDelete = (req, res) => {
  res.json({
    msg: "delete API",
  });
};

module.exports = {
  usersGet,
  usersPost,
  usersPut,
  usersPatch,
  usersDelete,
};
