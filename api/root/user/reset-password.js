
module.exports = async(req, res) => {
  console.log("inside reset-password.js, data:::", req.body.data);

  return res.json({message: "welll"});
}