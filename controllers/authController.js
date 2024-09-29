const { dynamoClient } = require("../config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

// Register a new user
exports.registerUser = async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const params = {
    TableName: process.env.DYNAMODB_TABLE_USERS,
    Item: {
      userId: uuidv4(),
      username,
      password: hashedPassword,
    },
  };

  try {
    await dynamoClient.put(params).promise();
    res
      .status(201)
      .send({
        message: "User registered successfully",
        userId: params.Item.userId,
      });
  } catch (error) {
    res
      .status(500)
      .send({ error: "Failed to register user", details: error.message });
  }
};

// Login a user
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  const params = {
    TableName: process.env.DYNAMODB_TABLE_USERS,
    Key: { username },
  };

  try {
    const data = await dynamoClient.get(params).promise();
    if (!data.Item || !(await bcrypt.compare(password, data.Item.password))) {
      return res.status(401).send({ error: "Invalid credentials" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: data.Item.userId, username },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.send({ message: "Login successful", token });
  } catch (error) {
    res.status(500).send({ error: "Failed to login", details: error.message });
  }
};
