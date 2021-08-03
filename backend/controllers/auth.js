const { recoverPersonalSignature } = require("eth-sig-util");
const { bufferToHex } = require("ethereumjs-util");
const jwt = require("jsonwebtoken");
const { User } = require("../models/User");

const getNonce = async (req, res, next) => {
  const { publicAddress } = req.body;
  const nonce = Math.floor(Math.random() * 10000);

  try {
    let user = await User.findOne({ where: { publicAddress } });

    if (!user) {
      user = await User.create({
        publicAddress,
        nonce,
      });
    } else {
      user.nonce = nonce;
      await user.save();
    }
    return res.json({ nonce });
  } catch (err) {
    next(err);
  }
};

const getToken = async (req, res, next) => {
  const { signature, publicAddress } = req.body;

  if (!signature || !publicAddress) {
    return res
      .status(400)
      .send({ error: "Request should have signature and publicAddress" });
  }

  try {
    const user = await User.findOne({ where: { publicAddress } });

    if (!user) {
      return res.status(401).send({
        error: `User with publicAddress ${publicAddress} is not found in database`,
      });
    }
    const msg = `One-time Nonce: ${user.nonce}`;
    const msgBufferHex = bufferToHex(Buffer.from(msg, "utf8"));
    const address = recoverPersonalSignature({
      data: msgBufferHex,
      sig: signature,
    });

    if (address.toLowerCase() !== publicAddress.toLowerCase()) {
      return res.status(401).send({
        error: "Signature verification failed",
      });
    }
    user.nonce = Math.floor(Math.random() * 10000);
    await user.save();

    const accessToken = jwt.sign(
      {
        payload: {
          userId: user.id,
          publicAddress,
        },
      },
      process.env.JWT_SECRET,
      {
        algorithm: "HS256",
      }
    );
    return res.json({ accessToken });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

module.exports = {
  getNonce,
  getToken,
};
